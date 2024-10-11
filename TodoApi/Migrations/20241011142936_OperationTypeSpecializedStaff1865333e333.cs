using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865333e333 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId",
                table: "Type_Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId",
                table: "Type_Staff");

            migrationBuilder.DropIndex(
                name: "IX_Type_Staff_SpecializedStaffId",
                table: "Type_Staff");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Type_Staff_SpecializedStaffId",
                table: "Type_Staff",
                column: "SpecializedStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId",
                table: "Type_Staff",
                column: "SpecializedStaffId",
                principalTable: "SpecializedStaff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId",
                table: "Type_Staff",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
