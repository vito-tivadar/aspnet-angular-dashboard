using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
