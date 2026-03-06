using System.Net;
using System.Net.Mail;
using BackendApp.Data;
using BackendApp.Models.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BackendApp.Services;

public class EmailSenderBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly SmtpSettings _smtpSettings;
    private readonly ILogger<EmailSenderBackgroundService> _logger;
    private static readonly TimeSpan PollingInterval = TimeSpan.FromSeconds(10);
    private const int MaxRetries = 3;

    public EmailSenderBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<SmtpSettings> smtpSettings,
        ILogger<EmailSenderBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _smtpSettings = smtpSettings.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email sender background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessEmailQueueAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing email queue.");
            }

            await Task.Delay(PollingInterval, stoppingToken);
        }
    }

    private async Task ProcessEmailQueueAsync(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var pendingEmails = await dbContext.EmailQueue
            .Where(e => !e.IsSent && e.RetryCount < MaxRetries)
            .OrderBy(e => e.CreatedAt)
            .Take(20)
            .ToListAsync(stoppingToken);

        if (pendingEmails.Count == 0)
            return;

        using var smtpClient = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
        {
            Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
            EnableSsl = _smtpSettings.EnableSsl
        };

        foreach (var email in pendingEmails)
        {
            if (stoppingToken.IsCancellationRequested)
                break;

            try
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.FromEmail, _smtpSettings.FromName),
                    Subject = email.Subject,
                    Body = email.Body,
                    IsBodyHtml = email.IsHtml
                };

                mailMessage.To.Add(email.To);

                if (!string.IsNullOrWhiteSpace(email.Cc))
                    mailMessage.CC.Add(email.Cc);

                if (!string.IsNullOrWhiteSpace(email.Bcc))
                    mailMessage.Bcc.Add(email.Bcc);

                await smtpClient.SendMailAsync(mailMessage, stoppingToken);

                email.IsSent = true;
                email.SentAt = DateTime.UtcNow;
                email.Error = null;

                _logger.LogInformation("Email sent successfully to {To}.", email.To);
            }
            catch (Exception ex)
            {
                email.RetryCount++;
                email.Error = ex.Message;
                _logger.LogWarning(ex, "Failed to send email to {To}. Retry {Retry}/{MaxRetries}.", email.To, email.RetryCount, MaxRetries);
            }
        }

        await dbContext.SaveChangesAsync(stoppingToken);
    }
}
