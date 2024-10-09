using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class AssociationOperationTypeSpecialization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Specializations_OperationType_OperationTypeId",
                table: "Specializations");

            migrationBuilder.DropIndex(
                name: "IX_Specializations_OperationTypeId",
                table: "Specializations");

            migrationBuilder.DropColumn(
                name: "OperationTypeId",
                table: "Specializations");

            migrationBuilder.CreateTable(
                name: "OperationType_Specializations",
                columns: table => new
                {
                    OperationTypesId = table.Column<long>(type: "bigint", nullable: false),
                    SpecializationsSpecId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationType_Specializations", x => new { x.OperationTypesId, x.SpecializationsSpecId });
                    table.ForeignKey(
                        name: "FK_OperationType_Specializations_OperationType_OperationTypesId",
                        column: x => x.OperationTypesId,
                        principalTable: "OperationType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OperationType_Specializations_Specializations_Specialization~",
                        column: x => x.SpecializationsSpecId,
                        principalTable: "Specializations",
                        principalColumn: "SpecId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OperationType_Specializations_SpecializationsSpecId",
                table: "OperationType_Specializations",
                column: "SpecializationsSpecId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OperationType_Specializations");

            migrationBuilder.AddColumn<long>(
                name: "OperationTypeId",
                table: "Specializations",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Specializations_OperationTypeId",
                table: "Specializations",
                column: "OperationTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Specializations_OperationType_OperationTypeId",
                table: "Specializations",
                column: "OperationTypeId",
                principalTable: "OperationType",
                principalColumn: "Id");
        }
    }
}
