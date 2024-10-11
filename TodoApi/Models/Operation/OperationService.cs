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
   
    

}