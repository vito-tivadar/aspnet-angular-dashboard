using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ChangeEmailRequest
{
    [Required]
    [EmailAddress]
    public string NewEmail { get; set; } = string.Empty;
}
