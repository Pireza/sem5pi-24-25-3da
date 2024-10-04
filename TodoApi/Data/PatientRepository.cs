using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data{

    public class PatientRepository{

        public static async Task AddPatient(Models.UserContext dbContext, Models.Patient newPatient)
        {
             dbContext.Patients.Add(newPatient);
                await dbContext.SaveChangesAsync();
        }
        public static async Task<Patient> CheckPatientExists(Models.UserContext dbContext, String email)
        {
             return await dbContext.Patients.FirstOrDefaultAsync(p => p.Email == email);
        }
    }
}