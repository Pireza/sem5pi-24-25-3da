using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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

// Add other services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable authentication
app.UseAuthentication(); 
app.UseAuthorization(); 

app.MapControllers();

app.Run();
