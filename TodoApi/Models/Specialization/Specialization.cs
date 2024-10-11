
namespace TodoApi.Models;

public class Specialization
{
    public long SpecId { get; set; }
    public required string SpecDescription { get; set; }

    public static implicit operator Specialization(ValueTask<Specialization?> v)
    {
        throw new NotImplementedException();
    }
}