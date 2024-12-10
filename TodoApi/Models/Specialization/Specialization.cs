
namespace TodoApi.Models;

public class Specialization
{
    public long SpecId { get; set; }
    public string? SpecCode { get; set; }
    public required string SpecDescription { get; set; }
    public string? SpecLongDescription { get; set; }

    public static implicit operator Specialization(ValueTask<Specialization?> v)
    {
        throw new NotImplementedException();
    }
}