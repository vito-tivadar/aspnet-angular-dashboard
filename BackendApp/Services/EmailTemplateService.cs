namespace BackendApp.Services;

public class EmailTemplateService : IEmailTemplateService
{
    public string GenerateEmailConfirmationEmail(string firstName, string confirmationLink)
    {
        return BuildTemplate(
            greeting: $"Hi {EscapeHtml(firstName)},",
            headline: "Confirm Your Email",
            body: "Thanks for creating an account! Please confirm your email address by clicking the button below.",
            buttonText: "Confirm Email",
            buttonUrl: confirmationLink,
            footer: "If you didn't create an account, you can safely ignore this email."
        );
    }

    public string GeneratePasswordResetEmail(string firstName, string resetLink)
    {
        return BuildTemplate(
            greeting: $"Hi {EscapeHtml(firstName)},",
            headline: "Reset Your Password",
            body: "We received a request to reset your password. Click the button below to choose a new password.",
            buttonText: "Reset Password",
            buttonUrl: resetLink,
            footer: "If you didn't request a password reset, you can safely ignore this email. This link will expire shortly."
        );
    }

    public string GenerateResendEmailConfirmationEmail(string firstName, string confirmationLink)
    {
        return BuildTemplate(
            greeting: $"Hi {EscapeHtml(firstName)},",
            headline: "Confirm Your Email",
            body: "You requested a new confirmation link. Please confirm your email address by clicking the button below.",
            buttonText: "Confirm Email",
            buttonUrl: confirmationLink,
            footer: "If you didn't request this, you can safely ignore this email."
        );
    }

    public string GenerateEmailChangeConfirmationEmail(string firstName, string newEmail, string confirmationLink)
    {
        return BuildTemplate(
            greeting: $"Hi {EscapeHtml(firstName)},",
            headline: "Confirm Email Change",
            body: $"You requested to change your email address to <strong>{EscapeHtml(newEmail)}</strong>. Please confirm this change by clicking the button below.",
            buttonText: "Confirm Email Change",
            buttonUrl: confirmationLink,
            footer: "If you didn't request this change, you can safely ignore this email."
        );
    }

    private static string EscapeHtml(string? input)
    {
        return System.Net.WebUtility.HtmlEncode(input ?? string.Empty);
    }

    private static string BuildTemplate(string greeting, string headline, string body, string buttonText, string buttonUrl, string footer)
    {
        return $@"<!DOCTYPE html>
<html lang=""en"">
<head>
<meta charset=""UTF-8"" />
<meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
<title>{EscapeHtml(headline)}</title>
</head>
<body style=""margin:0;padding:0;background-color:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"">
<table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#F4F4F5;padding:40px 0;"">
  <tr>
    <td align=""center"">
      <table role=""presentation"" width=""560"" cellpadding=""0"" cellspacing=""0"" style=""max-width:560px;width:100%;"">
        <!-- Logo -->
        <!--
            <tr>
              <td align=""center"" style=""padding-bottom:32px;"">
                <div style=""display:inline-block;width:48px;height:48px;line-height:48px;text-align:center;background-color:#F97316;border-radius:12px;font-size:22px;font-weight:700;color:#ffffff;"">P</div>
              </td>
            </tr>
        -->
        <!-- Card -->
        <tr>
          <td style=""background-color:#FFFFFF;border-radius:16px;padding:48px 40px;border:1px solid #E4E4E7;"">
            <h1 style=""margin:0 0 8px;font-size:24px;font-weight:700;color:#18181B;"">{EscapeHtml(headline)}</h1>
            <p style=""margin:0 0 24px;font-size:15px;color:#71717A;"">{greeting}</p>
            <p style=""margin:0 0 32px;font-size:15px;line-height:1.6;color:#3F3F46;"">{body}</p>
            <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""margin:0 auto 32px;"">
              <tr>
                <td align=""center"" style=""background-color:#F97316;border-radius:10px;"">
                  <a href=""{EscapeHtml(buttonUrl)}"" target=""_blank""
                     style=""display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;"">{EscapeHtml(buttonText)}</a>
                </td>
              </tr>
            </table>
            <p style=""margin:0 0 16px;font-size:13px;line-height:1.5;color:#A1A1AA;"">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style=""margin:0;font-size:13px;line-height:1.5;color:#EA580C;word-break:break-all;"">{EscapeHtml(buttonUrl)}</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style=""padding:32px 40px 0;text-align:center;"">
            <p style=""margin:0 0 8px;font-size:13px;color:#71717A;"">{EscapeHtml(footer)}</p>
            <p style=""margin:0;font-size:12px;color:#A1A1AA;"">&copy; {DateTime.UtcNow.Year} Portfolio. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>";
    }
}
