
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
        throw new Error(`Transaction not found for order: ${orderId}`);
      }

      // Update transaction status
      await supabase
        .from('payment_transactions')
        .update({
          status: 'SUCCESS',
          provider_response: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      // Update wallet if payment is successful
      if (status === 'captured') {
        logStep("Payment successful, updating wallet");
        
        // Get wallet
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', transaction.user_id)
          .single();
        
        if (walletError || !wallet) {
          throw new Error(`Wallet not found for user: ${transaction.user_id}`);
        }
        
        // Calculate new balance
        const newBalance = (wallet.balance || 0) + amount;
        
        // Update wallet balance
        await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            last_transaction_date: new Date().toISOString()
          })
          .eq('id', wallet.id);
        
        // Add transaction record
        await supabase
          .from('transactions')
          .insert({
            wallet_id: wallet.id,
            type: 'deposit',
            amount: amount,
            description: transaction.description || "Razorpay deposit",
            created_at: new Date().toISOString()
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
