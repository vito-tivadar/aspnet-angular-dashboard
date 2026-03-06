using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class LoginWithRecoveryCodeRequest
{
    [Required]
    public string RecoveryCode { get; set; } = string.Empty;

    public bool RememberMe { get; set; }
}
