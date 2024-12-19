using TodoApi.Models;

/// <summary>
/// Service class for managing specializations.
/// </summary>
public class SpecializationService
{
    private readonly SpecializationRepository _repo;
    /// <summary>
    /// Initializes a new instance of the <see cref="SpecializationService"/> class.
    /// </summary>
    /// <param name="repo">The specialization repository.</param>
    public SpecializationService(SpecializationRepository repo)
    {
        _repo = repo;
    }

    /// <summary>
    /// Gets all specializations asynchronously.
    /// </summary>
    /// <returns>A list of all specializations.</returns>
    public async Task<List<Specialization>> GetAllSpecializationAsync()
    {
        return await _repo.GetAllAsync();
    }

    /// <summary>
    /// Gets filtered specializations based on search criteria asynchronously.
    /// </summary>
    /// <param name="search">The search criteria.</param>
    /// <returns>An enumerable of filtered specializations.</returns>
    public async Task<IEnumerable<Specialization>> GetFilteredSpecializationAsync(SpecializationSearchDTO search)
    {
        return await _repo.GetAsync(search);
    }

    /// <summary>
    /// Gets a specialization by its ID asynchronously.
    /// </summary>
    /// <param name="id">The specialization ID.</param>
    /// <returns>The specialization if found; otherwise, null.</returns>
    public async Task<Specialization?> GetByIdAsync(long id)
    {
        var spec = await _repo.GetByIdAsync(id);
        if (spec == null)
            return null;

        return spec;
    }

    /// <summary>
    /// Adds a new specialization asynchronously.
    /// </summary>
    /// <param name="specialization">The specialization to add.</param>
    /// <returns>The added specialization.</returns>
    public async Task<Specialization> AddSpecializationAsync(Specialization specialization)
    {
        return await _repo.AddAsync(specialization);
    }

    /// <summary>
    /// Changes an existing specialization asynchronously.
    /// </summary>
    /// <param name="specialization">The specialization with updated information.</param>
    /// <returns>The updated specialization if found; otherwise, null.</returns>
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

    /// <summary>
    /// Deletes a specialization by its ID asynchronously.
    /// </summary>
    /// <param name="id">The specialization ID.</param>
    /// <returns>The deleted specialization if found; otherwise, null.</returns>
    public async Task<Specialization?> DeleteSpecializationAsync(long id)
    {
        var spec = await _repo.GetByIdAsync(id);
        if (spec == null)
            return null;

        await _repo.DeleteSpecializationAsync(spec);
        return spec;
    }
}