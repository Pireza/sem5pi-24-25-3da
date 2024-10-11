using Azure;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class OperationService
{
    private readonly UserContext _context;
    public OperationService(UserContext userContext)
    {
        _context = userContext;
    }

    // |==================================================|
    // |  Following methods regard Operation Priorities   |
    // |==================================================|

    public async Task<List<OperationPriority>> GetAllPrioAsync()
    {
        return await this._context.Priorities.ToListAsync();
    }

    public async Task<OperationPriority> GetPrioByIdAsync(long id)
    {
        var prod = await this._context.Priorities.FindAsync(id);

        if (prod == null)
            return null;

        return prod;
    }

    public async Task<OperationPriority> AddPrioAsync(OperationPriority prio)
    {

        this._context.Priorities.Add(prio);

        await this._context.SaveChangesAsync();

        return prio;
    }

    // |=============================================|
    // |  Following methods regard Operation Types   |
    // |=============================================|


    public async Task<List<OperationType>> GetAllTypeAsync()
    {
        return await this._context.Types.ToListAsync();
    }

}