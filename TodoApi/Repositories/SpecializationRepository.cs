using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class SpecializationRepository
{
    private readonly UserContext _context;
    public SpecializationRepository(UserContext context)
    {
        this._context = context;
    }

    public async Task<List<Specialization>> GetAllAsync()
    {
        return await _context.Specializations.ToListAsync();
    }
    public async Task<IEnumerable<Specialization>> GetAsync(SpecializationSearchDTO search)
    {
        var allSpecializations = await _context.Specializations.ToListAsync();

        var filteredSpecs = allSpecializations.Where(spec =>
            (string.IsNullOrEmpty(search.SpecCode) || spec.SpecCode == search.SpecCode) &&
            (string.IsNullOrEmpty(search.SpecDescription) || spec.SpecDescription.Contains(search.SpecDescription, StringComparison.OrdinalIgnoreCase)) &&
            (string.IsNullOrEmpty(search.SpecLongDescription) || (spec.SpecLongDescription?.Contains(search.SpecLongDescription, StringComparison.OrdinalIgnoreCase) ?? false))
        );

        return filteredSpecs;
    }
    public async Task<Specialization> GetByIdAsync(long id)
    {
#pragma warning disable CS8603 // Possible null reference return.
        return await _context.Specializations.FindAsync(id);
#pragma warning restore CS8603 // Possible null reference return.
    }
    public async Task<Specialization> AddAsync(Specialization specialization)
    {
        var tmp = await _context.Specializations.AddAsync(specialization);
        await _context.SaveChangesAsync();
        tmp.Entity.SpecCode = "S" + tmp.Entity.SpecId;
        await _context.SaveChangesAsync();
        return tmp.Entity;
    }

    public async Task<Specialization> ChangeAsync(Specialization specialization)
    {
        _context.Entry(specialization).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return specialization;
    }


    public async Task DeleteSpecializationAsync(Specialization specialization)
    {
        _context.Specializations.Remove(specialization);
        await _context.SaveChangesAsync();
    }

}