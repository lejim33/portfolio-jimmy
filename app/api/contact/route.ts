import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, _honey, ...fields } = body;

    // Honeypot check
    if (_honey) return NextResponse.json({ ok: true });

    // Validate required fields
    const values = Object.values(fields).filter(Boolean);
    if (values.length === 0) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // If Resend API key is configured, send the email
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY && to) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_KEY);

      const html = Object.entries(fields)
        .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
        .join("");

      const senderName = (fields["Nom"] || fields["Name"] || "Visiteur") as string;
      const senderEmail = (fields["Email"] || fields["email"] || "no-reply@portfolio.dev") as string;

      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],
        replyTo: senderEmail,
        subject: `[Portfolio] Nouveau message de ${senderName}`,
        html: `<div style="font-family:sans-serif;max-width:600px">${html}</div>`,
      });
    }

    // Always return success (silently ignore if no API key)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
