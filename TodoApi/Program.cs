using System.Security.Claims;
using Auth0.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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


var localDomain = AuthenticationConstants.DOMAIN;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var auth0Domain = $"https://{localDomain}/";
    options.Authority = auth0Domain;
    options.Audience = AuthenticationConstants.AUDIENCE;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = auth0Domain,
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
        policy.RequireClaim("http://dev-b2f7avjyddz6kpot.us.auth0.comroles", "Patient");
    });
    
    });

// Add other services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<OperationService>();
builder.Services.AddTransient<Auth0UserService>();
builder.Services.AddTransient<PasswordGeneratorService>();

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
