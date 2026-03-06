using BackendApp.Data;
using BackendApp.Models.Email;

namespace BackendApp.Services;

public class EmailQueueService : IEmailQueueService
{
    private readonly AppDbContext _dbContext;

    public EmailQueueService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task QueueEmailAsync(string to, string subject, string body, bool isHtml = true, string? cc = null, string? bcc = null)
    {
        var email = new EmailQueue
        {
            To = to,
            Subject = subject,
            Body = body,
            IsHtml = isHtml,
            Cc = cc,
            Bcc = bcc,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.EmailQueue.Add(email);
        await _dbContext.SaveChangesAsync();
    }
}
