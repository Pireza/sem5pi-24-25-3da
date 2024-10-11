using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff1865 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OperationType_NeededStaff");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "OperationType_NeededStaff",
                columns: table => new
                {
                    StaffId = table.Column<long>(type: "bigint", nullable: false),
                    TypesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationType_NeededStaff", x => new { x.StaffId, x.TypesId });
                    table.ForeignKey(
                        name: "FK_OperationType_NeededStaff_SpecializedStaff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "SpecializedStaff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OperationType_NeededStaff_Types_TypesId",
                        column: x => x.TypesId,
                        principalTable: "Types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OperationType_NeededStaff_TypesId",
                table: "OperationType_NeededStaff",
                column: "TypesId");
        }
    }
}
