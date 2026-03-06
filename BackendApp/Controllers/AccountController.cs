using System.Text;
using System.Text.Encodings.Web;
using BackendApp.Data;
using BackendApp.Models.Auth;
using BackendApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BackendApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UrlEncoder _urlEncoder;
    private readonly IEmailQueueService _emailQueueService;
    private readonly IEmailTemplateService _emailTemplateService;
    private readonly IConfiguration _configuration;

    private const string AuthenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        UrlEncoder urlEncoder,
        IEmailQueueService emailQueueService,
        IEmailTemplateService emailTemplateService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _urlEncoder = urlEncoder;
        _emailQueueService = emailQueueService;
        _emailTemplateService = emailTemplateService;
        _configuration = configuration;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        return Ok(new
        {
            user.Email,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            IsEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user),
            HasPassword = await _userManager.HasPasswordAsync(user)
        });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        if (request.PhoneNumber != user.PhoneNumber)
            await _userManager.SetPhoneNumberAsync(user, request.PhoneNumber);

        await _userManager.UpdateAsync(user);

        return Ok(new { Message = "Profile updated successfully." });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        await _signInManager.RefreshSignInAsync(user);
        return Ok(new { Message = "Password changed successfully." });
    }

    [HttpPost("set-password")]
    public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var result = await _userManager.AddPasswordAsync(user, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        await _signInManager.RefreshSignInAsync(user);
        return Ok(new { Message = "Password set successfully." });
    }

    [HttpGet("email")]
    public async Task<IActionResult> GetEmail()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        return Ok(new
        {
            user.Email,
            IsEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user)
        });
    }

    [HttpPost("change-email")]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var token = await _userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:4200";
        var confirmationLink = $"{appUrl}/confirm-email-change?userId={Uri.EscapeDataString(user.Id)}&newEmail={Uri.EscapeDataString(request.NewEmail)}&token={Uri.EscapeDataString(token)}";
        var emailBody = _emailTemplateService.GenerateEmailChangeConfirmationEmail(user.FirstName ?? "there", request.NewEmail, confirmationLink);
        await _emailQueueService.QueueEmailAsync(request.NewEmail, "Confirm Email Change", emailBody);

        return Ok(new
        {
            Message = "A confirmation link has been sent to the new email address."
        });
    }

    [HttpPost("delete-personal-data")]
    public async Task<IActionResult> DeletePersonalData([FromBody] DeletePersonalDataRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        if (await _userManager.HasPasswordAsync(user))
        {
            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return BadRequest(new { Message = "Incorrect password." });
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        return Ok(new { Message = "Your account has been deleted." });
    }

    [HttpGet("download-personal-data")]
    public async Task<IActionResult> DownloadPersonalData()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var personalData = new Dictionary<string, string>();
        var personalDataProps = typeof(AppUser).GetProperties()
            .Where(p => Attribute.IsDefined(p, typeof(PersonalDataAttribute)));

        foreach (var p in personalDataProps)
            personalData.Add(p.Name, p.GetValue(user)?.ToString() ?? "null");

        var logins = await _userManager.GetLoginsAsync(user);
        foreach (var l in logins)
            personalData.Add($"{l.LoginProvider} external login provider key", l.ProviderKey);

        personalData.Add("Authenticator Key", (await _userManager.GetAuthenticatorKeyAsync(user))!);

        return Ok(personalData);
    }

    [HttpGet("two-factor")]
    public async Task<IActionResult> GetTwoFactorStatus()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        return Ok(new
        {
            HasAuthenticator = await _userManager.GetAuthenticatorKeyAsync(user) != null,
            Is2faEnabled = await _userManager.GetTwoFactorEnabledAsync(user),
            IsMachineRemembered = await _signInManager.IsTwoFactorClientRememberedAsync(user),
            RecoveryCodesLeft = await _userManager.CountRecoveryCodesAsync(user)
        });
    }

    [HttpGet("enable-authenticator")]
    public async Task<IActionResult> GetAuthenticatorSetup()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
        if (string.IsNullOrEmpty(unformattedKey))
        {
            await _userManager.ResetAuthenticatorKeyAsync(user);
            unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
        }

        var email = await _userManager.GetEmailAsync(user);
        var authenticatorUri = string.Format(
            AuthenticatorUriFormat,
            _urlEncoder.Encode("portfolio_v2"),
            _urlEncoder.Encode(email!),
            unformattedKey);

        return Ok(new
        {
            SharedKey = FormatKey(unformattedKey!),
            AuthenticatorUri = authenticatorUri
        });
    }

    [HttpPost("enable-authenticator")]
    public async Task<IActionResult> EnableAuthenticator([FromBody] Enable2faRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var verificationCode = request.Code.Replace(" ", string.Empty).Replace("-", string.Empty);
        var is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
            user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);

        if (!is2faTokenValid)
            return BadRequest(new { Message = "Verification code is invalid." });

        await _userManager.SetTwoFactorEnabledAsync(user, true);

        var recoveryCodes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10);

        return Ok(new
        {
            Message = "Authenticator app has been verified.",
            RecoveryCodes = recoveryCodes
        });
    }

    [HttpPost("disable-2fa")]
    public async Task<IActionResult> Disable2fa()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var result = await _userManager.SetTwoFactorEnabledAsync(user, false);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        return Ok(new { Message = "2FA has been disabled." });
    }

    [HttpPost("reset-authenticator")]
    public async Task<IActionResult> ResetAuthenticator()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        await _userManager.SetTwoFactorEnabledAsync(user, false);
        await _userManager.ResetAuthenticatorKeyAsync(user);
        await _signInManager.RefreshSignInAsync(user);

        return Ok(new { Message = "Authenticator app key has been reset." });
    }

    [HttpPost("generate-recovery-codes")]
    public async Task<IActionResult> GenerateRecoveryCodes()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        if (!await _userManager.GetTwoFactorEnabledAsync(user))
            return BadRequest(new { Message = "Cannot generate recovery codes as 2FA is not enabled." });

        var recoveryCodes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10);

        return Ok(new { RecoveryCodes = recoveryCodes });
    }

    [HttpGet("external-logins")]
    public async Task<IActionResult> GetExternalLogins()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var currentLogins = await _userManager.GetLoginsAsync(user);
        var otherLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync())
            .Where(auth => currentLogins.All(ul => auth.Name != ul.LoginProvider))
            .ToList();

        return Ok(new
        {
            CurrentLogins = currentLogins.Select(l => new { l.LoginProvider, l.ProviderDisplayName, l.ProviderKey }),
            OtherLogins = otherLogins.Select(l => new { l.Name, l.DisplayName }),
            ShowRemoveButton = await _userManager.HasPasswordAsync(user) || currentLogins.Count > 1
        });
    }

    [HttpPost("remove-external-login")]
    public async Task<IActionResult> RemoveExternalLogin([FromBody] RemoveExternalLoginRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var result = await _userManager.RemoveLoginAsync(user, request.LoginProvider, request.ProviderKey);
        if (!result.Succeeded)
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

        await _signInManager.RefreshSignInAsync(user);
        return Ok(new { Message = "External login removed successfully." });
    }

    [HttpPost("forget-2fa-client")]
    public async Task<IActionResult> Forget2faClient()
    {
        await _signInManager.ForgetTwoFactorClientAsync();
        return Ok(new { Message = "The current browser has been forgotten." });
    }

    private static string FormatKey(string unformattedKey)
    {
        var result = new StringBuilder();
        int currentPosition = 0;
        while (currentPosition + 4 < unformattedKey.Length)
        {
            result.Append(unformattedKey.AsSpan(currentPosition, 4)).Append(' ');
            currentPosition += 4;
        }
        if (currentPosition < unformattedKey.Length)
            result.Append(unformattedKey.AsSpan(currentPosition));
        return result.ToString().ToLowerInvariant();
    }
}
