using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]

public class OperationController : ControllerBase
{
    private readonly OperationService _service;
    private const string DatePattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\\d{4})$";


    public OperationController(OperationService service)
    {
        _service = service;
    }

    // GET: api/operation/priority
    [HttpGet("priority")]
    public async Task<ActionResult<IEnumerable<OperationPriority>>> GetPriorities()
    {
        return await _service.GetAllPrioAsync();
    }

    // GET: api/operation/priority/{id}
    [HttpGet("priority/{id}")]
    public async Task<ActionResult<OperationPriority>> GetPriority(long id)
    {
        var priority = await _service.GetPrioByIdAsync(id);

        if (priority == null)
        {
            return NotFound();
        }

        return priority;
    }


    //POST: api/operation/priority

    [HttpPost("priority")]
    public async Task<ActionResult<OperationPriority>> PostPriority(OperationPriority priority)
    {
        var prio = await _service.AddPrioAsync(priority);
        return CreatedAtAction("GetPriority", new { id = priority.Id }, priority);
    }

    // |=============================================|
    // | Following methods regarding Operation Types |
    // |=============================================|

    // GET: api/operation/type
    [HttpGet("type")]

    public async Task<ActionResult<IEnumerable<OperationType>>> GetTypes()
    {
        return await _service.GetAllTypeAsync();
    }


    // GET: api/operation/type/{id}
    [HttpGet("type/{id}")]
    public async Task<ActionResult<OperationType>> GetType(long id)
    {
        var type = await _service.GetTypeByIdAsync(id);

        if (type == null)
        {
            return NotFound();
        }

        return type;
    }
    // GET: api/operation/filter
    [HttpGet("type/filter")]

    public async Task<ActionResult<IEnumerable<OperationTypeGetDTO>>> GetTypeFilter(OperationTypeSearch search)
    {
        var type = await _service.GetAllTypeFilterAsync(search);

        if (type == null)
        {
            return NotFound();
        }

        return type;
    }

    //POST: api/operation/type

    [HttpPost("type")]
    public async Task<ActionResult<OperationTypeDTO>> PostType(OperationTypeDTO typeDTO)
    {

        // The following try/catch clause catches the cases where there is already a type with the same name
        try
        {
            var type = await _service.AddTypeAsync(typeDTO);
            return CreatedAtAction("GetType", new { id = type.Id }, type);
        }
        catch (FormatException)
        {
            return BadRequest("Input duration format must be HH:mm:ss");
        }
        catch (NotFoundResource)
        {
            return BadRequest("Specialized staff id doesn't exist");
        }
        catch (Exception)
        {
            return BadRequest("Operation type name already registered in the data base");
        }


    }

    // PUT: api/Operation/type/activate/{id}

    [HttpPut("type/activate/{id}")]

    public async Task<ActionResult<OperationType>> ActivateType(long id)
    {

        try
        {
            var prod = await _service.ActivateTypeAsync(id);

            if (prod == null)
            {
                return NotFound();
            }
            return Ok(prod);
        }
        catch (InvalidDataException ex)
        {
            return BadRequest("This type is already active");
        }
    }


    // PUT: api/Operation/type/inactivate/{id}

    [HttpPut("type/deactivate/{id}")]

    public async Task<ActionResult<OperationType>> InactivateType(long id)
    {

        try
        {
            var prod = await _service.InactivateTypeAsync(id);

            if (prod == null)
            {
                return NotFound();
            }
            return Ok(prod);
        }
        catch (InvalidDataException ex)
        {
            return BadRequest("This type is already inactive");
        }
    }

    // |=============================================|
    // | Following methods regard Operation Requests |
    // |=============================================|



    [HttpGet("request/filter")]

    public async Task<ActionResult<IEnumerable<OperationRequestDTO>>> GetRequestFilter(OperationRequestSearch search)
    {
        var requests = await _service.GetAllRequestFilterAsync(search);

        if (requests == null)
        {
            return NotFound();
        }

        return requests;
    }

}
