using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;
using TodoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure MySQL as the database provider
builder.Services.AddDbContext<UserContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("UserContext"),
        new MySqlServerVersion(new Version(8, 0, 39))
    )
);



// Register AuthServicePatient with HttpClient
builder.Services.AddHttpClient<AuthServicePatient>();

// Configure cookie authentication
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Use Always in production
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(1); // Set the cookie expiration time
});

string domain = builder.Configuration["Auth0:Domain"];
string audience = builder.Configuration["Auth0:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = $"https://{domain}";
    options.Audience = audience;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = $"https://{domain}",

        ValidateAudience = true,
        ValidAudience = audience,

        ValidateLifetime = true,

        // Automatically retrieve the signing keys from Auth0
        IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) =>
        {
            var client = new HttpClient();
            var jwks = client.GetStringAsync($"https://{domain}/.well-known/jwks.json").Result;
            return new JsonWebKeySet(jwks).GetSigningKeys();
        }
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddHostedService<DeletionService>();
// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PatientOnly", policy =>
        {
            policy.RequireClaim(AuthenticationConstants.ROLES_URL, "Patient");
        });
    options.AddPolicy("AdminOnly", policy =>
    {
        policy.RequireClaim(AuthenticationConstants.ROLES_URL, "Admin");
    });
    options.AddPolicy("DoctorOnly", policy =>
    {
        policy.RequireClaim(AuthenticationConstants.ROLES_URL, "Doctor");
    });
});



// Add other services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<OperationService>();
builder.Services.AddTransient<Auth0UserService>();
builder.Services.AddTransient<PasswordGeneratorService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<OperationRequestRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication(); // Enable authentication
app.UseAuthorization(); // Enable authorization




app.MapControllers();

app.Run();

