using System.Text.RegularExpressions;
using Azure;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class OperationService
{
    private readonly UserContext _context;
    private const string DurationPattern = @"^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    private const string ACTIVE_STATUS = "active";
    private const string INACTIVE_STATUS = "inactive";
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

    public async Task<OperationType> GetTypeByIdAsync(long id)
    {
        var prod = await this._context.Types.FindAsync(id);

        if (prod == null)
            return null;

        return prod;
    }


    public async Task<OperationType> AddTypeAsync(OperationTypeDTO operationTypeDTO)
    {


        Regex regex = new Regex(DurationPattern);
        if (!regex.IsMatch(operationTypeDTO.Duration))
        {
            throw new FormatException();
        }

        // Verification of SpecializedStaff existence
        foreach (long id in operationTypeDTO.Staff)
        {
            await checkStaffIdAsync(id);

        }

        var type = new OperationType
        {
            Name = operationTypeDTO.Name,
            Duration = operationTypeDTO.Duration,
            Status = ACTIVE_STATUS,
        };

        this._context.Types.Add(type);
        await this._context.SaveChangesAsync();

        // Bellow we create the association between tables

        foreach (long l in operationTypeDTO.Staff)
        {
            var asso = new OperationType_Staff
            {
                SpecializedStaffId = l,
                OperationTypeId = type.Id
            };
            this._context.Type_Staff.Add(asso);

        }

        await this._context.SaveChangesAsync();
        return type;
    }

    private async Task checkStaffIdAsync(long id)
    {
        var specStaffId = await _context.SpecializedStaff.FindAsync(id);
        if (specStaffId == null)
            throw new NotFoundResource("Invalid specialized staff id");

    }

    public async Task<OperationType> ActivateTypeAsync(long id)
    {
        var op = await this._context.Types.FindAsync(id);

        if (op == null)
            return null;

        // change all fields
        if (op.Status.Equals(ACTIVE_STATUS))
        {
            throw new InvalidDataException();
        }

        op.Status = ACTIVE_STATUS;
        await this._context.SaveChangesAsync();

        return op;
    }
    public async Task<OperationType> InactivateTypeAsync(long id)
    {
        var op = await this._context.Types.FindAsync(id);

        if (op == null)
            return null;

        // change all fields
        if (op.Status.Equals(INACTIVE_STATUS))
        {
            throw new InvalidDataException();
        }

        op.Status = INACTIVE_STATUS;
        await this._context.SaveChangesAsync();

        return op;
    }



}