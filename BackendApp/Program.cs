using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Npgsql;
using DotNetEnv;
using Serilog;
using BackendApp.Services;
using BackendApp.Data;
using BackendApp.Models.Email;

namespace BackendApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Load .env if present — does NOT override real env vars (safe for production)
            Env.Load();

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console()
                .WriteTo.Debug()
                .CreateLogger();

            try
            {
                Log.Information("Starting up the application...");
                var builder = WebApplication.CreateBuilder(args);

                // Build connection string from individual DB environment variables
                var db = builder.Configuration.GetSection("DB");
                var connectionString = new NpgsqlConnectionStringBuilder
                {
                    Host               = db["Host"]     ?? throw new InvalidOperationException("DB__Host is not set."),
                    Port               = int.Parse(db["Port"] ?? "5432"),
                    Database           = db["Name"]     ?? throw new InvalidOperationException("DB__Name is not set."),
                    Username           = db["Username"] ?? throw new InvalidOperationException("DB__Username is not set."),
                    Password           = db["Password"] ?? throw new InvalidOperationException("DB__Password is not set."),
                    IncludeErrorDetail = builder.Environment.IsDevelopment(),
                }.ConnectionString;

                builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

                builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
                {
                    options.SignIn.RequireConfirmedAccount = true;
                })
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();


                var jwtSettings = builder.Configuration.GetSection("Jwt");
                builder.Services.AddAuthentication();
                builder.Services.AddAuthorization();

                builder.Services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.Name = "app_auth";
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                    // If Angular is on a different origin (e.g. https://localhost:4200):
                    //options.Cookie.SameSite = SameSiteMode.None;

                    // If Angular + API are same-site, you can use Lax (better CSRF baseline):
                    options.Cookie.SameSite = SameSiteMode.Lax;

                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(7);

                    options.Events.OnRedirectToLogin = ctx =>
                    {
                        // APIs should return 401, not redirect to /Account/Login
                        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.CompletedTask;
                    };

                    options.Events.OnRedirectToAccessDenied = ctx =>
                    {
                        ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return Task.CompletedTask;
                    };
                });

                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("Angular", policy =>
                    {
                        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
                });

                builder.Services.AddAntiforgery(options => {
                    options.HeaderName = "X-CSRF-TOKEN"; // Angular will send it in this header
                });

                builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
                builder.Services.AddScoped<IEmailQueueService, EmailQueueService>();
                builder.Services.AddScoped<IEmailTemplateService, EmailTemplateService>();
                builder.Services.AddHostedService<EmailSenderBackgroundService>();

                builder.Services.AddControllers();

                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen(options =>
                {
                    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "Bearer",
                        BearerFormat = "JWT"
                    });

                    options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecuritySchemeReference("Bearer"),
                            new List<string>()
                        }
                    });
                });

                var app = builder.Build();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }
                else
                {
                    app.UseHsts();
                }

                app.UseRouting();
                app.UseCors("Angular");

                app.UseHttpsRedirection();

                app.UseAuthentication();
                app.UseAuthorization();

                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
                throw;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}
