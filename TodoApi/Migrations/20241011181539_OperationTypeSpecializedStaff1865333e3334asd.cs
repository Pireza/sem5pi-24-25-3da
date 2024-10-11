using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865333e3334asd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecializedStaff_Specializations_SpecializationSpecId",
                table: "SpecializedStaff");

            migrationBuilder.DropIndex(
                name: "IX_SpecializedStaff_SpecializationSpecId",
                table: "SpecializedStaff");

            migrationBuilder.RenameColumn(
                name: "SpecializationSpecId",
                table: "SpecializedStaff",
                newName: "SpecializationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SpecializationId",
                table: "SpecializedStaff",
                newName: "SpecializationSpecId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecializedStaff_SpecializationSpecId",
                table: "SpecializedStaff",
                column: "SpecializationSpecId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecializedStaff_Specializations_SpecializationSpecId",
                table: "SpecializedStaff",
                column: "SpecializationSpecId",
                principalTable: "Specializations",
                principalColumn: "SpecId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
