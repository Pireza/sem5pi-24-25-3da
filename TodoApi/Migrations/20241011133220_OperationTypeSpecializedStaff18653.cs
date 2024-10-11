using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff18653 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecializedStaff_Types_OperationTypeId",
                table: "SpecializedStaff");

            migrationBuilder.DropIndex(
                name: "IX_SpecializedStaff_OperationTypeId",
                table: "SpecializedStaff");

            migrationBuilder.DropColumn(
                name: "OperationTypeId",
                table: "SpecializedStaff");

            migrationBuilder.CreateTable(
                name: "Staff_Type",
                columns: table => new
                {
                    SpecializedStaffId = table.Column<long>(type: "bigint", nullable: false),
                    OperationTypeId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staff_Type", x => new { x.OperationTypeId, x.SpecializedStaffId });
                    table.ForeignKey(
                        name: "FK_Staff_Type_SpecializedStaff_SpecializedStaffId",
                        column: x => x.SpecializedStaffId,
                        principalTable: "SpecializedStaff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Staff_Type_Types_OperationTypeId",
                        column: x => x.OperationTypeId,
                        principalTable: "Types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_Type_SpecializedStaffId",
                table: "Staff_Type",
                column: "SpecializedStaffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Staff_Type");

            migrationBuilder.AddColumn<long>(
                name: "OperationTypeId",
                table: "SpecializedStaff",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecializedStaff_OperationTypeId",
                table: "SpecializedStaff",
                column: "OperationTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecializedStaff_Types_OperationTypeId",
                table: "SpecializedStaff",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id");
        }
    }
}
