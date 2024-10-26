using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateOperationRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "SpecializationSpecId",
                table: "OperationType",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OperationType_SpecializationSpecId",
                table: "OperationType",
                column: "SpecializationSpecId");

            migrationBuilder.AddForeignKey(
                name: "FK_OperationType_Specializations_SpecializationSpecId",
                table: "OperationType",
                column: "SpecializationSpecId",
                principalTable: "Specializations",
                principalColumn: "SpecId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OperationType_Specializations_SpecializationSpecId",
                table: "OperationType");

            migrationBuilder.DropIndex(
                name: "IX_OperationType_SpecializationSpecId",
                table: "OperationType");

            migrationBuilder.DropColumn(
                name: "SpecializationSpecId",
                table: "OperationType");
        }
    }
}
