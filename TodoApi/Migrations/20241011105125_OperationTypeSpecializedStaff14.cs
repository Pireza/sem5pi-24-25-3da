using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Types_Specializations_SpecializationSpecId",
                table: "Types");

            migrationBuilder.DropIndex(
                name: "IX_Types_SpecializationSpecId",
                table: "Types");

            migrationBuilder.DropColumn(
                name: "SpecializationSpecId",
                table: "Types");

            migrationBuilder.AddColumn<long>(
                name: "SpecializationSpecId",
                table: "SpecializedStaff",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecializedStaff_Specializations_SpecializationSpecId",
                table: "SpecializedStaff");

            migrationBuilder.DropIndex(
                name: "IX_SpecializedStaff_SpecializationSpecId",
                table: "SpecializedStaff");

            migrationBuilder.DropColumn(
                name: "SpecializationSpecId",
                table: "SpecializedStaff");

            migrationBuilder.AddColumn<long>(
                name: "SpecializationSpecId",
                table: "Types",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Types_SpecializationSpecId",
                table: "Types",
                column: "SpecializationSpecId");

            migrationBuilder.AddForeignKey(
                name: "FK_Types_Specializations_SpecializationSpecId",
                table: "Types",
                column: "SpecializationSpecId",
                principalTable: "Specializations",
                principalColumn: "SpecId");
        }
    }
}
