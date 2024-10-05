using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TodoApi.Models; 
using TodoApi.Controllers;
using TodoApi.Presentation;
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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<AuthServicePatient>(); // Register AuthServicePatient

var app = builder.Build();
var authServicePatient = app.Services.GetRequiredService<AuthServicePatient>();
        PatientController.Initialize(authServicePatient);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Start the authentication logic for patients
await StartProgram(app);



static async Task StartProgram(WebApplication app)
{
    var configuration = app.Services.GetService<IConfiguration>();
    var optionsBuilder = new DbContextOptionsBuilder<UserContext>();
    var connectionString = configuration.GetConnectionString("UserContext");
    optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 39))); // Ensure to match your DB version

    using (var dbContext = new UserContext(optionsBuilder.Options))
    {
            PatientUI patientUI = new PatientUI(dbContext);

    dbContext.Database.Migrate();

        Console.WriteLine("What do you wish to do?");
        Console.WriteLine("1- Login to the healthcare system as a patient");
        Console.WriteLine("0- Exit");
        int start = int.Parse(Console.ReadLine());
        while(start!=0){
            if(start==1){
               await PatientUI.loginPatient(dbContext);
            }

  Console.WriteLine("What do you wish to do?");
        Console.WriteLine("1- Login to the healthcare system as a patient");
        Console.WriteLine("0- Exit");
         start = int.Parse(Console.ReadLine());
        }
        
    }
}


