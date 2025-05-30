
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.170.0/node/crypto.ts";

// CORS Headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

// Razorpay webhook secret
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") || "";

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-WEBHOOK] ${step}${detailsStr}`);
};

// Verify Razorpay webhook signature
function verifySignature(body: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    logStep("Warning: No webhook secret configured, skipping verification");
    return true; // Skip verification if no secret is set
  }
  
  const expectedSignature = createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  return signature === expectedSignature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");
    
    // Create Supabase client using service role for admin rights
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get webhook data
    const bodyText = await req.text();
    const webhookData = JSON.parse(bodyText);
    
    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature');
    if (signature && !verifySignature(bodyText, signature)) {
      throw new Error("Invalid webhook signature");
    }
    
    logStep("Webhook data", webhookData);
    
    const { event, payload } = webhookData;
    
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paisa to rupees
      const status = payment.status;
      
      logStep("Payment captured", { orderId, paymentId, amount, status });
      
      // Find transaction by order ID
      const { data: transaction, error: txError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('provider_transaction_id', orderId)
        .single();
      
      if (txError || !transaction) {
        logStep("Transaction not found", { orderId, paymentId });
        return new Response(JSON.stringify({
          success: false,
          message: `Transaction not found for order: ${orderId}`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404
        });
      }

      // Update transaction status
      const { error: updateTxError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'SUCCESS',
          provider_response: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateTxError) {
        logStep("Error updating transaction", updateTxError);
        throw updateTxError;
      }

      // Update wallet if payment is successful
      if (status === 'captured') {
        logStep("Payment successful, updating wallet for user", transaction.user_id);
        
        // Get or create wallet
        let { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', transaction.user_id)
          .maybeSingle();
        
        if (walletError) {
          logStep("Error fetching wallet", walletError);
          throw walletError;
        }

        if (!wallet) {
          // Wallet doesn't exist, create one
          logStep("Creating new wallet for user", transaction.user_id);
          const { data: newWallet, error: createError } = await supabase
            .from('wallets')
            .insert({
              user_id: transaction.user_id,
              balance: 0,
              roundup_total: 0,
              rewards_earned: 0,
              last_transaction_date: new Date().toISOString()
            })
            .select()
            .single();
          
          if (createError) {
            logStep("Error creating wallet", createError);
            throw createError;
          }
          
          wallet = newWallet;
        }
        
        // Determine transaction type and calculate amounts
        const isRoundUp = transaction.description?.includes('Round-up') || transaction.description?.includes('round-up');
        let finalAmount = amount;
        let roundupAmount = 0;
        
        if (isRoundUp) {
          // For round-ups, add 5-10 rupees to the paid amount
          roundupAmount = Math.floor((Math.random() * 5 + 5) * 100) / 100;
          finalAmount = amount + roundupAmount;
          logStep("Round-up transaction detected", { originalAmount: amount, roundupAmount, finalAmount });
        }
        
        // Calculate new balances
        const newBalance = (wallet.balance || 0) + finalAmount;
        const newRoundupTotal = (wallet.roundup_total || 0) + (isRoundUp ? roundupAmount : 0);
        
        // Update wallet balance
        const { error: updateWalletError } = await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            roundup_total: newRoundupTotal,
            last_transaction_date: new Date().toISOString()
          })
          .eq('id', wallet.id);
        
        if (updateWalletError) {
          logStep("Error updating wallet", updateWalletError);
          throw updateWalletError;
        }
        
        // Add transaction record with proper wallet_id and user_id foreign keys
        const { error: addTransactionError } = await supabase
          .from('transactions')
          .insert({
            wallet_id: wallet.id,
            user_id: transaction.user_id,
            type: isRoundUp ? 'round-up' : 'deposit',
            amount: finalAmount,
            status: 'success',
            description: transaction.description || "Razorpay payment",
            created_at: new Date().toISOString()
          });
        
        if (addTransactionError) {
          logStep("Error adding transaction", addTransactionError);
          throw addTransactionError;
        }
        
        logStep("Wallet and transaction updated successfully", { 
          newBalance, 
          transactionAmount: finalAmount,
          roundupAmount: isRoundUp ? roundupAmount : 0,
          isRoundUp,
          walletId: wallet.id
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Webhook processed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    logStep("Error", error.message);
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
