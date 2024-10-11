using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865333e3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Type_SpecializedStaff_SpecializedStaffId",
                table: "Staff_Type");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Type_Types_OperationTypeId",
                table: "Staff_Type");

            migrationBuilder.DropIndex(
                name: "IX_Staff_Type_SpecializedStaffId",
                table: "Staff_Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Staff_Type_SpecializedStaffId",
                table: "Staff_Type",
                column: "SpecializedStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Type_SpecializedStaff_SpecializedStaffId",
                table: "Staff_Type",
                column: "SpecializedStaffId",
                principalTable: "SpecializedStaff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Type_Types_OperationTypeId",
                table: "Staff_Type",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
