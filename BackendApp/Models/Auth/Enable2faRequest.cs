using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Auth;

public class Enable2faRequest
{
    [Required]
    public string Code { get; set; } = string.Empty;
}
