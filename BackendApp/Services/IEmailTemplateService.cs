namespace BackendApp.Services;

public interface IEmailTemplateService
{
    string GenerateEmailConfirmationEmail(string firstName, string confirmationLink);
    string GeneratePasswordResetEmail(string firstName, string resetLink);
    string GenerateResendEmailConfirmationEmail(string firstName, string confirmationLink);
    string GenerateEmailChangeConfirmationEmail(string firstName, string newEmail, string confirmationLink);
}
