import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  try {
    const body = await req.json();
    const {
      name, email, phone, company, jobTitle, businessType,
      country, city, category, sport, quantity, budget,
      deliveryDate, customLogo, customColors, hasExistingDesign,
      decorationMethod, description, hearAboutUs,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ ok: false, message: "Name and email are required." }, { status: 400 });
    }

    await db.insert(quoteRequests).values({
      name, email, phone, company, jobTitle, businessType,
      country, city, category, sport, quantity, budget,
      deliveryDate, customLogo, customColors, hasExistingDesign,
      decorationMethod, description, hearAboutUs,
      status: "new",
    });

    try {
      await resend.emails.send({
        from: "Black Shark <info@blacksharksports.com>",
        to: "bsuniforms7@gmail.com",
        subject: `🦈 New Quote Request from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
            <h1 style="color: #C9A84C; font-size: 24px; margin-bottom: 8px;">🦈 New Quote Request</h1>
            <p style="color: #aaaaaa; margin-bottom: 32px;">A new quote request has been submitted on Black Shark Sportswear.</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888; width: 40%;">Name</td>
                <td style="padding: 12px 0; color: #fff;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Company</td>
                <td style="padding: 12px 0; color: #fff;">${company || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Email</td>
                <td style="padding: 12px 0; color: #fff;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">WhatsApp</td>
                <td style="padding: 12px 0; color: #fff;">${phone || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Location</td>
                <td style="padding: 12px 0; color: #fff;">${city || ""} ${country || ""}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Category</td>
                <td style="padding: 12px 0; color: #fff;">${category || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Sport</td>
                <td style="padding: 12px 0; color: #fff;">${sport || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Quantity</td>
                <td style="padding: 12px 0; color: #fff;">${quantity || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Budget</td>
                <td style="padding: 12px 0; color: #fff;">${budget || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Delivery Date</td>
                <td style="padding: 12px 0; color: #fff;">${deliveryDate || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Custom Logo</td>
                <td style="padding: 12px 0; color: #fff;">${customLogo || "N/A"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 12px 0; color: #888;">Decoration</td>
                <td style="padding: 12px 0; color: #fff;">${decorationMethod || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888;">Details</td>
                <td style="padding: 12px 0; color: #fff;">${description || "N/A"}</td>
              </tr>
            </table>

            <div style="margin-top: 32px; padding: 16px; background: #111; border-radius: 8px; border: 1px solid #C9A84C33;">
              <p style="color: #C9A84C; font-weight: bold; margin: 0 0 8px;">Quick Actions</p>
              <a href="https://wa.me/${phone?.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none;">💬 Reply on WhatsApp</a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="mailto:${email}" style="color: #C9A84C; text-decoration: none;">📧 Reply by Email</a>
            </div>

            <p style="color: #444; font-size: 12px; margin-top: 24px;">Black Shark Sportswear — Sialkot, Pakistan</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[quotes POST] email notification failed", emailErr);
    }

    // WhatsApp message to owner
    const waMsg = encodeURIComponent(
      `🦈 *New Quote Request — Black Shark Sportswear*\n\n` +
      `👤 *Name:* ${name}\n` +
      `🏢 *Company:* ${company || "N/A"}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *Phone:* ${phone || "N/A"}\n` +
      `🌍 *Location:* ${city || ""} ${country || ""}\n\n` +
      `📦 *Category:* ${category || "N/A"}\n` +
      `⚽ *Sport:* ${sport || "N/A"}\n` +
      `🔢 *Quantity:* ${quantity || "N/A"}\n` +
      `💰 *Budget:* ${budget || "N/A"}\n` +
      `📅 *Delivery:* ${deliveryDate || "N/A"}\n\n` +
      `🎨 *Custom Logo:* ${customLogo || "N/A"}\n` +
      `🖨️ *Decoration:* ${decorationMethod || "N/A"}\n\n` +
      `📝 *Details:* ${description || "N/A"}`
    );

    return NextResponse.json({
      ok: true,
      waUrl: `https://wa.me/923370488235?text=${waMsg}`,
    });
  } catch (err) {
    console.error("[quotes POST]", err);
    return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}
