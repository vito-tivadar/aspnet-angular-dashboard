using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class ChangePasswordRequest
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}
