using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

public class SpecializationRepository
{
    private readonly UserContext _context;
    /// <summary>
    /// Initializes a new instance of the <see cref="SpecializationRepository"/> class.
    /// </summary>
    /// <param name="context">The user context to be used by the repository.</param>
    public SpecializationRepository(UserContext context)
    {
        this._context = context;
    }

    /// Asynchronously retrieves all specializations from the database.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Specialization"/> objects.</returns>
    public async Task<List<Specialization>> GetAllAsync()
    {
        return await _context.Specializations.ToListAsync();
    }
    /// Retrieves a collection of <see cref="Specialization"/> objects that match the specified search criteria.
    /// </summary>
    /// <param name="search">An instance of <see cref="SpecializationSearchDTO"/> containing the search criteria.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{Specialization}"/> that matches the search criteria.</returns>
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
    /// Asynchronously retrieves a specialization by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the specialization.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the specialization with the specified identifier, or null if no specialization is found.</returns>
    /// <exception cref="ArgumentNullException">Thrown if the provided id is null.</exception>
    public async Task<Specialization> GetByIdAsync(long id)
    {
#pragma warning disable CS8603 // Possible null reference return.
        return await _context.Specializations.FindAsync(id);
#pragma warning restore CS8603 // Possible null reference return.
    }

    /// Asynchronously adds a new specialization to the database.
    /// </summary>
    /// <param name="specialization">The specialization entity to add.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the added specialization entity.
    /// </returns>
    public async Task<Specialization> AddAsync(Specialization specialization)
    {
        var tmp = await _context.Specializations.AddAsync(specialization);
        await _context.SaveChangesAsync();
        tmp.Entity.SpecCode = "S" + tmp.Entity.SpecId;
        await _context.SaveChangesAsync();
        return tmp.Entity;
    }


    /// Asynchronously updates the specified specialization in the database.
    /// </summary>
    /// <param name="specialization">The specialization entity to be updated.</param>
    /// <returns>The updated specialization entity.</returns>
    /// <exception cref="DbUpdateConcurrencyException">
    /// Thrown if a concurrency violation is encountered while saving to the database.
    /// </exception>
    /// <exception cref="DbUpdateException">
    /// Thrown if an error is encountered while saving to the database.
    /// </exception>
    public async Task<Specialization> ChangeAsync(Specialization specialization)
    {
        _context.Entry(specialization).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return specialization;
    }


    /// Deletes the specified specialization from the database asynchronously.
    /// </summary>
    /// <param name="specialization">The specialization entity to be deleted.</param>
    /// <returns>A task that represents the asynchronous delete operation.</returns>
    public async Task DeleteSpecializationAsync(Specialization specialization)
    {
        _context.Specializations.Remove(specialization);
        await _context.SaveChangesAsync();
    }

}