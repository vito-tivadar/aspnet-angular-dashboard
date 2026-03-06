using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class DeletePersonalDataRequest
{
    [Required]
    public string Password { get; set; } = string.Empty;
}
