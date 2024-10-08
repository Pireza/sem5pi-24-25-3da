using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureAvailabilitySlotsAsOwnedType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "AvailabilitySlot",
                newName: "AvailabilitySlotStartTime");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "AvailabilitySlot",
                newName: "AvailabilitySlotEndTime");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "AvailabilitySlot",
                newName: "AvailabilitySlotDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvailabilitySlotStartTime",
                table: "AvailabilitySlot",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "AvailabilitySlotEndTime",
                table: "AvailabilitySlot",
                newName: "EndTime");

            migrationBuilder.RenameColumn(
                name: "AvailabilitySlotDate",
                table: "AvailabilitySlot",
                newName: "Date");
        }
    }
}
