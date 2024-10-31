using System.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
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
        new MySqlServerVersion(new Version(8, 0, 39)), // Use your MySQL version
            mysqlOptions => mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5, // The maximum number of retry attempts
                maxRetryDelay: TimeSpan.FromSeconds(30), // The delay between retries
                errorNumbersToAdd: null // Specify any error numbers you want to retry on
            )));
    




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



/*

app.UseRouting();

app.Use(async (context, next) =>
{

    // Get all the network interfaces
    var hostName = Dns.GetHostName(); // Retrieve the Host Name

    // Get the IP addresses from the host
    var ipHostInfo = Dns.GetHostEntry(hostName);
    var ipAddresses = ipHostInfo.AddressList;

    // Log all IP addresses
    Console.WriteLine("Available IP Addresses:");
    foreach (var ipAddress in ipAddresses)
    {
        Console.WriteLine(ipAddress);
    }

    // Find the VPN or DEI-related IP
    string myIp = FindValidIpAddress(ipAddresses);
    Console.WriteLine("User's IP Address is: " + myIp);

    // Check if myIp is null or empty
    if (string.IsNullOrEmpty(myIp))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden; // Access denied
        await context.Response.WriteAsync("Access restricted to DEI internal network.");
        return;
    }

    // Parse the IP address to compare against DEI network
    if (!IPAddress.TryParse(myIp, out var parsedIp))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden; // Access denied
        await context.Response.WriteAsync("Access restricted to DEI internal network.");
        return;
    }

    // Check if the IP is in the allowed DEI network
    bool isInDEINetwork = IsInDEINetwork(parsedIp);
    Console.WriteLine($"Is in DEI Network: {isInDEINetwork}"); // Log the network check result

    if (isInDEINetwork)
    {
        await next.Invoke(); // Proceed to the next middleware
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden; // Access denied
        await context.Response.WriteAsync("Access restricted to DEI internal network.");
    }
});

string FindValidIpAddress(IPAddress[] ipAddresses)
{
    // Loop through the list of IP addresses
    foreach (var ip in ipAddresses)
    {
        // Check if the IP is in the DEI network
        if (ip.ToString().StartsWith("10.8.") || ip.ToString().StartsWith("10.4.") || // Example for IPv4
            ip.ToString().StartsWith("fd1e:2bae:c6fd:1008:") || ip.ToString().StartsWith("fd1e:2bae:c6fd:1004:")) // Example for IPv6
        {
            return ip.ToString(); // Return the first matching IP address
        }
    }
    return null; // Return null if no valid IP found
}

bool IsInDEINetwork(IPAddress ip)
{
    // Check if the IP is in the Laboratories or Staff networks for IPv4
    if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
    {
        return ip.ToString().StartsWith("10.8.") || ip.ToString().StartsWith("10.4."); // IPv4 check
    }

    // Check if the IP is in the Laboratories or Staff networks for IPv6
    if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
    {
        return ip.ToString().StartsWith("fd1e:2bae:c6fd:1008:") || ip.ToString().StartsWith("fd1e:2bae:c6fd:1004:"); // IPv6 check
    }

    // Return false if the IP is neither IPv4 nor IPv6
    return false;
}

*/



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

