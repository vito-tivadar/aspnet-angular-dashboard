using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ConfirmEmailRequest
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;
}
