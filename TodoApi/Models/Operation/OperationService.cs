using System.Text.RegularExpressions;
using Azure;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class OperationService
{
    private readonly OperationRequestRepository _repo;
    private const string DurationPattern = @"^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    private const string ACTIVE_STATUS = "active";
    private const string INACTIVE_STATUS = "inactive";
    public OperationService(OperationRequestRepository repo)
    {
        _repo = repo;
    }

    // |==================================================|
    // |  Following methods regard Operation Priorities   |
    // |==================================================|

    public async Task<List<OperationPriority>> GetAllPrioAsync()
    {
        return await this._repo.GetAllPrioAsync();
    }

    public async Task<OperationPriority> GetPrioByIdAsync(long id)
    {
        var prod = await this._repo.GetPrioById(id);

        if (prod == null)
            return null;

        return prod;
    }

    public async Task<OperationPriority> AddPrioAsync(OperationPriority prio)
    {

        await this._repo.AddPrio(prio);
        return prio;
    }

    // |=============================================|
    // |  Following methods regard Operation Types   |
    // |=============================================|


    public async Task<List<OperationType>> GetAllTypeAsync()
    {
        return await this._repo.GetTypes();
    }


    public async Task<List<OperationTypeGetDTO>> GetAllTypeFilterAsync(OperationTypeSearch search)
    {
        return await _repo.FilterTypes(search);
    }

    public async Task<OperationType> GetTypeByIdAsync(long id)
    {
        var prod = await this._repo.GetTypeById(id);

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
            await _repo.checkStaffIdAsync(id);

        }


        var type = await this._repo.AddType(operationTypeDTO);
        return type;

    }



    // |================================================|
    // |   Following methods regard Operation Requests  |
    // |================================================|


    public async Task<List<OperationRequestDTO>> GetAllRequestFilterAsync(OperationRequestSearch search)
    {
        return await _repo.FilterRequests(search);
    }



}