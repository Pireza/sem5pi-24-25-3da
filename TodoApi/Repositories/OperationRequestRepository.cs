using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

public class OperationRequestRepository
{
    private readonly UserContext _context;

    public OperationRequestRepository(UserContext context)
    {
        _context = context;
    }

  
 public async Task<OperationRequest> GetOperationRequestByIdAsync(long id)
    {
        return await _context.Requests.Include(r => r.Priority).Include(d => d.Doctor).FirstOrDefaultAsync(r => r.Id == id);
    }
public async Task UpdateOperationRequestAsync(OperationRequest operationRequest)
    {
        _context.Entry(operationRequest).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
      public async Task LogRequestChangeAsync(long requestId, List<string> changes)
    {
        var requestLog = new RequestsLog
        {
            RequestId = requestId,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };
       if(!changes.IsNullOrEmpty()){

          await _context.RequestsLogs.AddAsync(requestLog);
        await _context.SaveChangesAsync();
       }
      
        

    }

     public async Task<OperationPriority> GetOperationPriorityByIdAsync(long operationPriorityId)
    {
        return await _context.Priorities.FindAsync(operationPriorityId);
    }

}
