using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865333e : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId",
                table: "Type_Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId1",
                table: "Type_Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId",
                table: "Type_Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId1",
                table: "Type_Staff");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Type_Staff",
                table: "Type_Staff");

            migrationBuilder.DropIndex(
                name: "IX_Type_Staff_OperationTypeId",
                table: "Type_Staff");

            migrationBuilder.DropIndex(
                name: "IX_Type_Staff_OperationTypeId1",
                table: "Type_Staff");

            migrationBuilder.DropIndex(
                name: "IX_Type_Staff_SpecializedStaffId1",
                table: "Type_Staff");

            migrationBuilder.DropColumn(
                name: "OperationTypeId1",
                table: "Type_Staff");

            migrationBuilder.DropColumn(
                name: "SpecializedStaffId1",
                table: "Type_Staff");

            migrationBuilder.RenameTable(
                name: "Type_Staff",
                newName: "Staff_Type");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staff_Type",
                table: "Staff_Type",
                columns: new[] { "OperationTypeId", "SpecializedStaffId" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Type_SpecializedStaff_SpecializedStaffId",
                table: "Staff_Type");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Type_Types_OperationTypeId",
                table: "Staff_Type");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Staff_Type",
                table: "Staff_Type");

            migrationBuilder.DropIndex(
                name: "IX_Staff_Type_SpecializedStaffId",
                table: "Staff_Type");

            migrationBuilder.RenameTable(
                name: "Staff_Type",
                newName: "Type_Staff");

            migrationBuilder.AddColumn<long>(
                name: "OperationTypeId1",
                table: "Type_Staff",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "SpecializedStaffId1",
                table: "Type_Staff",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Type_Staff",
                table: "Type_Staff",
                columns: new[] { "SpecializedStaffId", "OperationTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_Type_Staff_OperationTypeId",
                table: "Type_Staff",
                column: "OperationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Type_Staff_OperationTypeId1",
                table: "Type_Staff",
                column: "OperationTypeId1");

            migrationBuilder.CreateIndex(
                name: "IX_Type_Staff_SpecializedStaffId1",
                table: "Type_Staff",
                column: "SpecializedStaffId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId",
                table: "Type_Staff",
                column: "SpecializedStaffId",
                principalTable: "SpecializedStaff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_SpecializedStaff_SpecializedStaffId1",
                table: "Type_Staff",
                column: "SpecializedStaffId1",
                principalTable: "SpecializedStaff",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId",
                table: "Type_Staff",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Type_Staff_Types_OperationTypeId1",
                table: "Type_Staff",
                column: "OperationTypeId1",
                principalTable: "Types",
                principalColumn: "Id");
        }
    }
}
