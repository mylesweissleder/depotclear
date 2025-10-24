import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send claim approval email to business owner
 */
export async function sendClaimApprovalEmail({
  to,
  ownerName,
  businessName,
}: {
  to: string;
  ownerName: string;
  businessName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Woof Spots <noreply@woofspots.com>',
      to: [to],
      subject: `Your claim for ${businessName} has been approved!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Claim Approved!</h1>
            </div>

            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${ownerName},</p>

              <p style="font-size: 16px;">
                Great news! Your claim for <strong>${businessName}</strong> has been approved by our team.
              </p>

              <p style="font-size: 16px;">
                You now have full access to manage your business listing, including:
              </p>

              <ul style="font-size: 16px; line-height: 1.8;">
                <li>Update business information</li>
                <li>Add and manage photos</li>
                <li>Create special offers and promotions</li>
                <li>View analytics and insights</li>
                <li>Manage business hours</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://woofspots.com/login"
                   style="background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Access Your Dashboard
                </a>
              </div>

              <p style="font-size: 16px;">
                To maximize your listing's visibility, consider upgrading to our Premium plan for enhanced features and priority placement.
              </p>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The Woof Spots Team</strong>
              </p>
            </div>

            <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
              <p>© 2024 Woof Spots. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending approval email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { success: false, error };
  }
}

/**
 * Send claim rejection email to business owner
 */
export async function sendClaimRejectionEmail({
  to,
  ownerName,
  businessName,
}: {
  to: string;
  ownerName: string;
  businessName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Woof Spots <noreply@woofspots.com>',
      to: [to],
      subject: `Update on your claim for ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Claim Update</h1>
            </div>

            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${ownerName},</p>

              <p style="font-size: 16px;">
                Thank you for your interest in claiming <strong>${businessName}</strong> on Woof Spots.
              </p>

              <p style="font-size: 16px;">
                After reviewing your claim, we were unable to verify your ownership of this business at this time. This may be because:
              </p>

              <ul style="font-size: 16px; line-height: 1.8;">
                <li>The information provided didn't match our records</li>
                <li>Additional verification is needed</li>
                <li>The business may have already been claimed</li>
              </ul>

              <p style="font-size: 16px;">
                If you believe this is an error or would like to provide additional verification, please contact our support team:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:support@woofspots.com"
                   style="background: #6b7280; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Contact Support
                </a>
              </div>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The Woof Spots Team</strong>
              </p>
            </div>

            <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
              <p>© 2024 Woof Spots. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending rejection email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { success: false, error };
  }
}
