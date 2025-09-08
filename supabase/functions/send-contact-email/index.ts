import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to you (the portfolio owner)
    const emailToOwner = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["mayankgoyal3005@gmail.com"], // Your email
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              This message was sent from your portfolio contact form at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the person who contacted you
    const confirmationEmail = await resend.emails.send({
      from: "Mayank Developer <onboarding@resend.dev>",
      to: [email],
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank you for your message!
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Hi ${name},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Thank you for reaching out through my portfolio. I've received your message about "<strong>${subject}</strong>" and will get back to you as soon as possible.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Your Message</h3>
            <p style="font-style: italic; color: #666; line-height: 1.6;">"${message}"</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            I typically respond within 24-48 hours. In the meantime, feel free to check out my latest projects on my portfolio or connect with me on social media.
          </p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #007bff; border-radius: 8px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 16px;">
              <strong>Mayank Developer</strong><br>
              Full Stack Developer<br>
              <a href="mailto:mayankgoyal3005@gmail.com" style="color: #ffc107;">mayankgoyal3005@gmail.com</a>
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #6c757d;">
              Sent on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { emailToOwner, confirmationEmail });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully! I'll get back to you soon." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again later." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);