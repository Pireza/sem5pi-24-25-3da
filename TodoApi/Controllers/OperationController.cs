using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
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
    /// <summary>
    /// This method returns a list containing all priorities in the system
    /// </summary>
    /// <returns>A list of all priorities in the system</returns>
    public async Task<ActionResult<IEnumerable<OperationPriority>>> GetPriorities()
    {
        return await _service.GetAllPrioAsync();
    }

    // GET: api/operation/priority/{id}
    [HttpGet("priority/{id}")]
    /// <summary>
    /// Returns the priority with the Id passed as argument
    /// </summary>
    /// <param name="id">Id of the pretended priority</param>
    /// <returns>
    /// If it exists -> OperationPriority
    /// Else -> Not Found
    /// </returns>
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
    /// <summary>
    /// This method allows for adding a new priority to the system
    /// </summary>
    /// <param name="priority">
    /// This argument is a structure with the following fields:
    ///     - Priority : int
    ///     - Description : string
    /// </param>
    /// <returns>CreatedAtAction</returns>
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

    [HttpGet("type-names")]

    public async Task<ActionResult<IEnumerable<string>>> GetTypesNames()
    {
        return await _service.GetAllTypesNamesAsync();
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
    [Authorize(Policy = "AdminOnly")]
    [HttpGet("type/filter")]

    /// <summary>
    /// This method takes a filtering structure as argument and
    /// then returns a list containing only Operation Types matching 
    /// those filtering options
    /// </summary>
    /// <param name="search">
    /// OperationTypeSearch is a structure with the following fields:
    ///     - Name : string
    ///     - Specialization : string
    ///     - Status : int
    /// </param>
    /// <returns>
    /// If the search structure is null -> Not Found
    /// Else -> List of Types
    /// </returns>
    public async Task<ActionResult<IEnumerable<OperationTypeGetDTO>>> GetTypeFilter([FromQuery] OperationTypeSearch search)
    {
        var type = await _service.GetAllTypeFilterAsync(search);

        if (type == null)
        {
            return NotFound();
        }

        return type;
    }

    //POST: api/operation/type
    [Authorize(Policy = "AdminOnly")]
    [HttpPost("type")]
    /// <summary>
    /// This method registers a new operation type in the system
    /// </summary>
    /// <param name="typeDTO">
    /// typeDto is a structure with the following fields:
    ///     - Name : string
    ///     - Duration : string
    ///     - Staff : long[]
    /// </param>
    /// <returns>
    /// In case the the values are not appropriate : Bad Request
    /// Otherwise -> CreatedAtAction
    /// </returns>
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

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("UpdateOperationTypeAsAdmin/{id}")]
    public async Task<IActionResult> UpdateOperationTypeAsAdmin(long id, OperationTypeDTO typeDTO)
    {
        try
        {
            // Chamada ao serviço para atualizar o tipo de operação
            await _service.UpdateTypeAsync(id, typeDTO);

            return NoContent(); // Atualização bem-sucedida, sem conteúdo retornado
        }
        catch (FormatException)
        {
            return BadRequest("O formato da duração deve ser HH:mm:ss.");
        }
        catch (NotFoundResource)
        {
            return NotFound("O tipo de operação não foi encontrado.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ocorreu um erro: {ex.Message}");
        }
    }


    // |=============================================|
    // | Following methods regard Operation Requests |
    // |=============================================|


    [Authorize(Policy = "DoctorOnly")]
    [HttpGet("request/filter")]

    /// <summary>
    /// This method takes a filtering structure as argument and
    /// then returns a list containing only Operation Requests matching 
    /// those filtering options
    /// </summary>
    /// <param name="search">
    /// OperationRequestSearch is a structure with the following fields:
    ///     - PatientName : string
    ///     - OperationType : string
    ///     - Priority : string 
    ///     - Status : int
    ///  </param>
    /// <returns>
    /// If the search structure is null : Bad Request
    /// Else : Ok
    /// </returns>
    public async Task<ActionResult<IEnumerable<OperationRequestDTO>>> GetRequestFilter([FromQuery] OperationRequestSearch search)
    {
        var requests = await _service.GetAllRequestFilterAsync(search);

        if (requests == null)
        {
            return NotFound();
        }

        return requests;
    }



}
