using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class DeletionService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public DeletionService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<UserContext>();
                
                var patientsToDelete = await context.Patients
                    .Where(p => p.PendingDeletionDate.HasValue 
                                 && p.PendingDeletionDate.Value.AddDays(30) <= DateTime.UtcNow)
                    .ToListAsync();

                context.Patients.RemoveRange(patientsToDelete);
                await context.SaveChangesAsync();
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken); // Check daily
        }
    }
}
