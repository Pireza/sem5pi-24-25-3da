using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TodoApi.Models; 
using TodoApi.Controllers;
using TodoApi.Data;
using Microsoft.CodeAnalysis.Elfie.Model.Tree;

namespace TodoApi.Presentation
{
    public class PatientUI
    {
        private static DateTime lastActivityTime;
        private const int sessionTimeoutMinutes = 1; // Set session timeout duration

        public static async Task loginPatient(UserContext dbContext)
        {
            Console.WriteLine("Authenticating via Auth0...");
            var email = await PatientController.LoginPatient();

            if (email != null)
            {
                // Reset last activity time on successful login
                ResetLastActivity();

                // Check if the patient already exists in the database
                var patient = await PatientRepository.CheckPatientExists(dbContext, email);
                if (patient != null)
                {
                    Console.WriteLine($"Welcome back, {patient.FirstName} {patient.LastName}!");
                    await HandlePatientOptions(dbContext, patient);
                }
                else
                {
                    // New patient - request additional details
                    Console.WriteLine("New patient detected. Please provide the following details:");
                    var newPatient = await GetNewPatientDetails(email);
                    await PatientRepository.AddPatient(dbContext, newPatient);
                    Console.WriteLine($"Welcome, {newPatient.FirstName} {newPatient.LastName}! Your account has been successfully created.");
                    await HandlePatientOptions(dbContext, newPatient);
                }
            }
            else
            {
                Console.WriteLine("Authentication failed.");
            }
        }

        private static void ResetLastActivity()
        {
                        lastActivityTime = DateTime.Now;

           
        }

        private static bool IsSessionExpired()
        {
                       

            return (DateTime.Now - lastActivityTime).TotalMinutes > sessionTimeoutMinutes;
        }

private static async Task HandlePatientOptions(UserContext dbContext, Patient patient)
{
    var cts = new CancellationTokenSource();  // Create a cancellation token source
    var token = cts.Token;  // Get the token to pass to tasks

    // Task to monitor session expiration
    var sessionMonitorTask = Task.Run(async () =>
    {
        while (!token.IsCancellationRequested)
        {
            if (IsSessionExpired())
            {
                Console.WriteLine("Session expired due to inactivity. Press any key to go back to the menu.");
                cts.Cancel();  // Cancel both tasks
                break;  // Exit the task
            }
            await Task.Delay(1000);  // Check every second
        }
    }, token);

    // Task to handle user input
    var inputTask = Task.Run(async () =>
    {
        while (!token.IsCancellationRequested)
        {
            Console.WriteLine("What do you wish to do?");
            Console.WriteLine("0 - Logout");

            // Get user input
            string input = Console.ReadLine(); 

            // Check if the token has been cancelled before processing the input
            if (token.IsCancellationRequested)
            {
                break;  // Exit the input task if cancellation is requested
            }

            int patientOptions;

            // Validate if input is an integer
            if (int.TryParse(input, out patientOptions))
            {
                if (patientOptions == 0)
                {
                    Console.WriteLine("Logging out...");
                    cts.Cancel();  // Signal to cancel the session monitor task
                    break;  // Exit the input task
                }
               
                //OTHER OPTIONS

                // Process other options here if needed
                Console.WriteLine($"You chose option {patientOptions}.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a number.");
            }
        }
    }, token);

    // Wait for either the input task or the session monitor task to complete
    await Task.WhenAny(inputTask, sessionMonitorTask);

    // Cleanup: Ensure both tasks have completed
    cts.Cancel();  
    await Task.WhenAll(inputTask, sessionMonitorTask);  // Await both tasks

    await ReturnToMainMenu(dbContext);
}


private static async Task ReturnToMainMenu(UserContext dbContext)
{
    Console.WriteLine("Returning to main menu...");
}



        private static async Task<Patient> GetNewPatientDetails(string email)
        {
            Console.Write("Username: ");
            string username = Console.ReadLine();
            Console.Write("First Name: ");
            string firstName = Console.ReadLine();
            Console.Write("Last Name: ");
            string lastName = Console.ReadLine();
            Console.Write("Birthday (yyyy-mm-dd): ");
            DateTime birthday = DateTime.Parse(Console.ReadLine()!);
            Console.Write("Gender: ");
            string gender = Console.ReadLine();
            Console.Write("Medical Number: ");
            string medicalNumber = Console.ReadLine();
            Console.Write("Phone: ");
            string phone = Console.ReadLine();
            Console.Write("Emergency Contact: ");
            string emergencyContact = Console.ReadLine();

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

            return new Patient
            {
                FirstName = firstName,
                LastName = lastName,
                Birthday = birthday,
                Gender = gender,
                MedicalNumber = medicalNumber,
                Phone = phone,
                MedicalConditions = medicalConditions,
                EmergencyContact = emergencyContact,
                UserName = username,
                Email = email
            };
        }
    }
}
