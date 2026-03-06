using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class LoginWith2faRequest
{
    [Required]
    public string TwoFactorCode { get; set; } = string.Empty;

    public bool RememberMachine { get; set; }
}
