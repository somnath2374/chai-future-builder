
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS Headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Razorpay API configuration
const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
const RAZORPAY_API_URL = "https://api.razorpay.com/v1";

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    logStep("Payment request received");
    
    // Check if Razorpay credentials are configured
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    // Create Supabase client using service role for admin rights
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { amount, description, userId } = await req.json();
    
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    logStep("Creating Razorpay order", { amount, userId });

    // Generate a transaction ID
    const transactionId = crypto.randomUUID();
    
    // Create order payload for Razorpay
    const orderPayload = {
      amount: amount * 100, // Convert to paisa (Razorpay requires amount in paisa)
      currency: "INR",
      receipt: transactionId,
      notes: {
        description: description || "Wallet deposit",
        user_id: userId
      }
    };

    // Create Basic Auth header for Razorpay
    const authHeader = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    logStep("Sending request to Razorpay", orderPayload);
    
    // Send request to Razorpay to create order
    const response = await fetch(`${RAZORPAY_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload)
    });

    const responseData = await response.json();
    logStep("Razorpay response", responseData);

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${responseData?.error?.description || response.statusText}`);
    }

    // Store transaction in database for tracking
    await supabase.from('payment_transactions').insert({
      id: transactionId,
      user_id: userId,
      amount: amount,
      description: description || "Wallet deposit",
      status: "CREATED",
      payment_method: "RAZORPAY",
      provider_transaction_id: responseData.id,
      created_at: new Date().toISOString()
    });

    // Return order details to client
    return new Response(JSON.stringify({
      success: true,
      orderId: responseData.id,
      amount: responseData.amount,
      currency: responseData.currency,
      keyId: RAZORPAY_KEY_ID,
      transactionId
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
