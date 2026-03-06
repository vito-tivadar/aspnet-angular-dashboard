using Microsoft.AspNetCore.Identity;

namespace BackendApp.Data;

public class AppUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}