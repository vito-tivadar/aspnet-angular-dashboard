using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Email;

public class EmailQueue
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string To { get; set; } = string.Empty;

    public string? Cc { get; set; }

    public string? Bcc { get; set; }

    [Required]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    public bool IsHtml { get; set; } = true;

    public bool IsSent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? SentAt { get; set; }

    public string? Error { get; set; }

    public int RetryCount { get; set; }
}
