public class AvailabilitySlot
{
    public long Id { get; set; }
    public string Slot { get; set; } = string.Empty;
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
    public required string Date { get; set; }
}
