using TodoApi.Models;

public class SpecializationService
{
    private readonly SpecializationRepository _repo;
    public SpecializationService(SpecializationRepository repo)
    {
        _repo = repo;
    }
    public async Task<List<Specialization>> GetAllSpecializationAsync()
    {
        return await _repo.GetAllAsync();
    }
    public async Task<Specialization?> GetByIdAsync(long id)
    {
        var spec = await _repo.GetByIdAsync(id);
        if (spec == null)
            return null;

        return spec;

    }
    public async Task<Specialization> AddSpecializationAsync(Specialization specialization)
    {
        return await _repo.AddAsync(specialization);
    }
    public async Task<Specialization?> ChangeSpecializationAsync(Specialization specialization)
    {
        var existingSpec = await _repo.GetByIdAsync(specialization.SpecId);
        if (existingSpec == null)
            return null;

        existingSpec.SpecDescription = specialization.SpecDescription;
        existingSpec.SpecLongDescription = specialization.SpecLongDescription;

        await _repo.ChangeAsync(existingSpec); // Use the existing tracked entity
        return existingSpec;
    }

    public async Task<Specialization?> DeleteSpecializationAsync(long id)
    {
        var spec = await _repo.GetByIdAsync(id);
        if (spec == null)
            return null;

        await _repo.DeleteSpecializationAsync(spec);
        return spec;
    }
}