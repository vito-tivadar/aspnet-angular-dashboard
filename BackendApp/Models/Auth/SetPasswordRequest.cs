using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class SetPasswordRequest
{
    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}
