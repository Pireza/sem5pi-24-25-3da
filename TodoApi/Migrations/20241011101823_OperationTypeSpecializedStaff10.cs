using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "SpecializedStaffId",
                table: "Types",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SpecializedStaff",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecializedStaff", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Types_SpecializedStaffId",
                table: "Types",
                column: "SpecializedStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Types_SpecializedStaff_SpecializedStaffId",
                table: "Types",
                column: "SpecializedStaffId",
                principalTable: "SpecializedStaff",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Types_SpecializedStaff_SpecializedStaffId",
                table: "Types");

            migrationBuilder.DropTable(
                name: "SpecializedStaff");

            migrationBuilder.DropIndex(
                name: "IX_Types_SpecializedStaffId",
                table: "Types");

            migrationBuilder.DropColumn(
                name: "SpecializedStaffId",
                table: "Types");
        }
    }
}
