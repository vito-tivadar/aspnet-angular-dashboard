using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ConfirmEmailChangeRequest
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string NewEmail { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;
}
