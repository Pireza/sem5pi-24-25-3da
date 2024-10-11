using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationTypeSpecializedStaff12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Types_SpecializedStaff_SpecializedStaffId",
                table: "Types");

            migrationBuilder.DropTable(
                name: "OperationType_Specializations");

            migrationBuilder.RenameColumn(
                name: "SpecializedStaffId",
                table: "Types",
                newName: "SpecializationSpecId");

            migrationBuilder.RenameIndex(
                name: "IX_Types_SpecializedStaffId",
                table: "Types",
                newName: "IX_Types_SpecializationSpecId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Types_Specializations_SpecializationSpecId",
                table: "Types",
                column: "SpecializationSpecId",
                principalTable: "Specializations",
                principalColumn: "SpecId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Types_Specializations_SpecializationSpecId",
                table: "Types");

            migrationBuilder.DropTable(
                name: "OperationType_NeededStaff");

            migrationBuilder.RenameColumn(
                name: "SpecializationSpecId",
                table: "Types",
                newName: "SpecializedStaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Types_SpecializationSpecId",
                table: "Types",
                newName: "IX_Types_SpecializedStaffId");

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
                        name: "FK_OperationType_Specializations_Specializations_Specialization~",
                        column: x => x.SpecializationsSpecId,
                        principalTable: "Specializations",
                        principalColumn: "SpecId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OperationType_Specializations_Types_OperationTypesId",
                        column: x => x.OperationTypesId,
                        principalTable: "Types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OperationType_Specializations_SpecializationsSpecId",
                table: "OperationType_Specializations",
                column: "SpecializationsSpecId");

            migrationBuilder.AddForeignKey(
                name: "FK_Types_SpecializedStaff_SpecializedStaffId",
                table: "Types",
                column: "SpecializedStaffId",
                principalTable: "SpecializedStaff",
                principalColumn: "Id");
        }
    }
}
