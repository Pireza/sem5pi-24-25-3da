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
using Amazon.Util;
using TodoApi.Data;
using System;
 using System.Runtime.InteropServices;


namespace TodoApi.Presentation{

    public class  PatientUI{
        public static async Task loginPatient(UserContext dbContext)
        {
Console.WriteLine("Authenticating via Auth0...");
var email = await PatientController.LoginPatient();

        if (email != null)
        {
            // Check if the patient already exists in the database
            var patient = await PatientRepository.CheckPatientExists(dbContext, email);
            if (patient != null)
            {
                Console.WriteLine($"Welcome back, {patient.FirstName} {patient.LastName}!");
                Console.WriteLine("What do you wish to do?");

                Console.WriteLine("0-Logout");
                        int patientOptions = int.Parse(Console.ReadLine());
                        while(patientOptions!=0){
                            Console.WriteLine("What do you wish to do?");

                         Console.WriteLine("0-Logout");
                         patientOptions = int.Parse(Console.ReadLine());

                        }
                        Console.WriteLine("Logging out!!!");
            }
            else
            {
                // New patient - request additional details
                Console.WriteLine("New patient detected. Please provide the following details:");

                Console.Write("Username: ");
                string username = Console.ReadLine();
                Console.Write("First Name: ");
                string firstName = Console.ReadLine();
                Console.Write("Last Name: ");
                string lastName = Console.ReadLine();
                Console.Write("Birthday (yyyy-mm-dd): ");
                DateTime birthday = DateTime.Parse(Console.ReadLine()!);
                Console.Write("Gender: ");
                string gender = Console.ReadLine()!;
                Console.Write("Medical Number: ");
                string medicalNumber = Console.ReadLine()!;
                Console.Write("Phone: ");
                string phone = Console.ReadLine()!;
                Console.Write("Emergency Contact: ");
                string emergencyContact = Console.ReadLine()!;
                 var medicalConditions = new List<string>();
    string? condition;
    Console.WriteLine("Enter medical conditions (type 'done' when finished):");
    while (true)
    {
        Console.Write("Condition: ");
        condition = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(condition) || condition!.ToLower() == "done")
        {
            break; // Exit the loop if the input is empty or 'done'
        }
        medicalConditions.Add(condition); // Add the condition to the list
    }
              
                var newPatient = new Patient
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Birthday = birthday,
                    Gender = gender,
                    MedicalNumber = medicalNumber,
                    Phone = phone,
                    MedicalConditions = medicalConditions,
                    EmergencyContact =emergencyContact ,
                    UserName = username,
                    Email = email
                };

              await PatientRepository.AddPatient(dbContext, newPatient);

                Console.WriteLine($"Welcome, {newPatient.FirstName} {newPatient.LastName}! Your account has been successfully created.");
                Console.WriteLine("What do you wish to do?");

                Console.WriteLine("0-Logout");
                        int patientOptions = int.Parse(Console.ReadLine());
                        while(patientOptions!=0){
                            Console.WriteLine("What do you wish to do?");

                         Console.WriteLine("0-Logout");
                         patientOptions = int.Parse(Console.ReadLine());

                        }
                        Console.WriteLine("Logging out!!!");

            }
        }
        else
        {
            Console.WriteLine("Authentication failed.");
        }

        }
        
    }
}