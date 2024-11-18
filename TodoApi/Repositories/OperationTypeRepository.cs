using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class OperationTypeRepository
{
    private readonly UserContext _context;

    public OperationTypeRepository(UserContext context)
    {
        _context = context;
    }

    public async Task<bool> DeactivateOperationTypeAsync(long id)
    {
        // Check if the operation type exists
        var operationType = await _context.Types.FirstOrDefaultAsync(ot => ot.Id == id);

        if (operationType == null)
        {
            return false; // Operation type not found
        }

        if (!operationType.IsActive)
        {
            throw new InvalidOperationException("Operation type is already inactive."); // Already inactive
        }

        // Mark the operation type as inactive
        operationType.IsActive = false;

        // Track the operation type's state for modification
        _context.Entry(operationType).State = EntityState.Modified;

        try
        {
            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Log the deactivation for audit purposes
            var logEntry = new AuditLogOperationType
            {
                EntityId = operationType.Id,
                EntityName = nameof(OperationType),
                Action = "Deactivated",
                ChangeDate = DateTime.UtcNow,
                Description = $"Operation type '{operationType.Name}' deactivated by admin."
            };

            _context.AuditLogOperationTypes.Add(logEntry);
            await _context.SaveChangesAsync();

            return true; // Successfully deactivated
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await OperationTypeExistsAsync(id))
            {
                return false; // The operation type does not exist anymore
            }
            else
            {
                throw; // Rethrow the exception for other handling
            }
        }
        catch (DbUpdateException dbEx)
        {
            // Handle specific database-related issues (e.g., foreign key violations)
            // Log dbEx details here
            throw new InvalidOperationException("A database error occurred.", dbEx);
        }
        catch (Exception ex)
        {
            // Handle other general exceptions
            // Log the exception for debugging
            throw new InvalidOperationException("An unexpected error occurred.", ex);
        }
    }

    private async Task<bool> OperationTypeExistsAsync(long id)
    {
        return await _context.Types.AnyAsync(e => e.Id == id);
    }

}
