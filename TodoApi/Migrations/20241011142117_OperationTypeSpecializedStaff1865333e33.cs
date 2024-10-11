using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865333e33 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Staff_Type",
                table: "Staff_Type");

            migrationBuilder.RenameTable(
                name: "Staff_Type",
                newName: "Type_Staff");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Type_Staff",
                table: "Type_Staff",
                columns: new[] { "OperationTypeId", "SpecializedStaffId" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId",
                table: "Type_Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId",
                table: "Type_Staff");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Type_Staff",
                table: "Type_Staff");

            migrationBuilder.DropIndex(
                name: "IX_Type_Staff_SpecializedStaffId",
                table: "Type_Staff");

            migrationBuilder.RenameTable(
                name: "Type_Staff",
                newName: "Staff_Type");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staff_Type",
                table: "Staff_Type",
                columns: new[] { "OperationTypeId", "SpecializedStaffId" });
        }
    }
}
