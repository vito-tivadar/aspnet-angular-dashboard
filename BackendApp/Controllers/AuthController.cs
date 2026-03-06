using BackendApp.Data;
using BackendApp.Models.Auth;
using BackendApp.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackendApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly IEmailQueueService _emailQueueService;
    private readonly IEmailTemplateService _emailTemplateService;
    private readonly IAntiforgery _antiforgery;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        IEmailQueueService emailQueueService,
        IEmailTemplateService emailTemplateService,
        IAntiforgery antiforgery)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _environment = environment;
        _emailQueueService = emailQueueService;
        _emailTemplateService = emailTemplateService;
        _antiforgery = antiforgery;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:4200";
        var confirmationLink = $"{appUrl}/confirm-email?userId={Uri.EscapeDataString(user.Id)}&token={Uri.EscapeDataString(token)}";
        var emailBody = _emailTemplateService.GenerateEmailConfirmationEmail(user.FirstName ?? "there", confirmationLink);
        await _emailQueueService.QueueEmailAsync(user.Email!, "Confirm Your Email", emailBody);

        return Ok(new
        {
            Message = "User registered successfully. Please confirm your email."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized(new { Message = "Invalid email or password." });


        if (_userManager.Options.SignIn.RequireConfirmedAccount)
        {
            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized("Email not confirmed.");
        }

        var result = await _signInManager.PasswordSignInAsync(
            userName: user.UserName!,
            password: request.Password,
            isPersistent: request.RememberMe,
            lockoutOnFailure: true);

        if (result.RequiresTwoFactor)
            return Ok(new LoginResponse { RequiresTwoFactor = true });

        if (!result.Succeeded)
            return Unauthorized(new { Message = "Invalid email or password." });

        var jwt = GenerateJwtToken(user, request.RememberMe);

        SetAuthCookie(jwt.Token, jwt.Expiration);

        return Ok(new LoginResponse
        {
            Token = jwt.Token,
            Expiration = jwt.Expiration
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_token");
        return Ok();
    }

    [HttpGet("csrf-token")]
    public IActionResult GetCsrfToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        return Ok(new { token = tokens.RequestToken });
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
            return BadRequest(new { Message = "Invalid user." });

        var result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        return Ok(new { Message = "Email confirmed successfully." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Ok(new { Message = "If the email exists, a reset link has been sent." });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:4200";
        var resetLink = $"{appUrl}/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";
        var emailBody = _emailTemplateService.GeneratePasswordResetEmail(user.FirstName ?? "there", resetLink);
        await _emailQueueService.QueueEmailAsync(user.Email!, "Reset Your Password", emailBody);

        return Ok(new
        {
            Message = "If the email exists, a reset link has been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest(new { Message = "Invalid request." });

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        return Ok(new { Message = "Password has been reset successfully." });
    }

    [HttpPost("resend-email-confirmation")]
    public async Task<IActionResult> ResendEmailConfirmation([FromBody] ResendEmailConfirmationRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Ok(new { Message = "If the email exists, a confirmation link has been sent." });

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:4200";
        var confirmationLink = $"{appUrl}/confirm-email?userId={Uri.EscapeDataString(user.Id)}&token={Uri.EscapeDataString(token)}";
        var emailBody = _emailTemplateService.GenerateResendEmailConfirmationEmail(user.FirstName ?? "there", confirmationLink);
        await _emailQueueService.QueueEmailAsync(user.Email!, "Confirm Your Email", emailBody);

        return Ok(new
        {
            Message = "If the email exists, a confirmation link has been sent."
        });
    }

    [HttpPost("confirm-email-change")]
    public async Task<IActionResult> ConfirmEmailChange([FromBody] ConfirmEmailChangeRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
            return BadRequest(new { Message = "Invalid user." });

        var result = await _userManager.ChangeEmailAsync(user, request.NewEmail, request.Token);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        await _userManager.SetUserNameAsync(user, request.NewEmail);

        return Ok(new { Message = "Email changed successfully." });
    }

    [HttpPost("login-with-2fa")]
    public async Task<IActionResult> LoginWith2fa([FromBody] LoginWith2faRequest request)
    {
        var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
        if (user == null)
            return Unauthorized(new { Message = "Unable to load two-factor authentication user." });

        var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(
            request.TwoFactorCode.Replace(" ", string.Empty).Replace("-", string.Empty),
            false, request.RememberMachine);

        if (!result.Succeeded)
            return Unauthorized(new { Message = "Invalid authenticator code." });

        var jwtToken = GenerateJwtToken(user, request.RememberMachine);
        SetAuthCookie(jwtToken.Token, jwtToken.Expiration);
        return Ok(new LoginResponse { Token = jwtToken.Token, Expiration = jwtToken.Expiration });
    }

    [HttpPost("login-with-recovery-code")]
    public async Task<IActionResult> LoginWithRecoveryCode([FromBody] LoginWithRecoveryCodeRequest request)
    {
        var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
        if (user == null)
            return Unauthorized(new { Message = "Unable to load two-factor authentication user." });

        var result = await _signInManager.TwoFactorRecoveryCodeSignInAsync(
            request.RecoveryCode.Replace(" ", string.Empty));

        if (!result.Succeeded)
            return Unauthorized(new { Message = "Invalid recovery code." });

        var jwtToken = GenerateJwtToken(user, request.RememberMe);
        SetAuthCookie(jwtToken.Token, jwtToken.Expiration);
        return Ok(new LoginResponse { Token = jwtToken.Token, Expiration = jwtToken.Expiration });
    }


    private (string Token, DateTime Expiration) GenerateJwtToken(AppUser user, bool rememberMe = false)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiration = rememberMe
            ? DateTime.UtcNow.AddDays(30)
            : DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"]!));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, user.UserName!)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
    }

    private void SetAuthCookie(string token, DateTime expiration)
    {
        Response.Cookies.Append("auth_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !_environment.IsDevelopment() || Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = expiration
        });
    }
}
