namespace BackendApp.Services;

public interface IEmailQueueService
{
    Task QueueEmailAsync(string to, string subject, string body, bool isHtml = true, string? cc = null, string? bcc = null);
}
