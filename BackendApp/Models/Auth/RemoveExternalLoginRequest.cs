using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class RemoveExternalLoginRequest
{
    [Required]
    public string LoginProvider { get; set; } = string.Empty;

    [Required]
    public string ProviderKey { get; set; } = string.Empty;
}
