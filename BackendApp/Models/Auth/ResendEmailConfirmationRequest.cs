using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ResendEmailConfirmationRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
