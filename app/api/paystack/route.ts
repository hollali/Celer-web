export async function POST(req: Request) {
  try {
    const { action, ...payload } = await req.json();
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    if (action === "initialize") {
      const { amount, email, rideData } = payload;

      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: String(Math.round(amount * 100)),
            email,
            metadata: { rideData },
            callback_url: `${req.headers.get("origin") || "http://localhost:3000"}/payment/callback`,
          }),
        }
      );

      const data = await response.json();

      if (!data.status) {
        return Response.json({ error: data.message }, { status: 400 });
      }

      return Response.json({
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
        access_code: data.data.access_code,
      });
    }

    if (action === "verify") {
      const { reference } = payload;

      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      const data = await response.json();

      if (!data.status) {
        return Response.json({ error: data.message }, { status: 400 });
      }

      return Response.json({
        verified: data.data.status === "success",
        amount: data.data.amount / 100,
        reference: data.data.reference,
        paid_at: data.data.paid_at,
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Paystack error:", error);
    return Response.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
