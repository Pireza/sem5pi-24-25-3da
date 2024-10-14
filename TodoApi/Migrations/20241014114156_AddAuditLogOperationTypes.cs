using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogOperationTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OperationTypeLog_Types_OperationTypeId",
                table: "OperationTypeLog");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Types_OperationTypeId",
                table: "Requests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Types",
                table: "Types");

            migrationBuilder.RenameTable(
                name: "Types",
                newName: "OperationType");

            migrationBuilder.RenameIndex(
                name: "IX_Types_Name",
                table: "OperationType",
                newName: "IX_OperationType_Name");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "OperationType",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_OperationType",
                table: "OperationType",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AuditLogOperationTypes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(type: "bigint", nullable: false),
                    EntityName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Action = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChangeDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogOperationTypes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_OperationTypeLog_OperationType_OperationTypeId",
                table: "OperationTypeLog",
                column: "OperationTypeId",
                principalTable: "OperationType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_OperationType_OperationTypeId",
                table: "Requests",
                column: "OperationTypeId",
                principalTable: "OperationType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OperationTypeLog_OperationType_OperationTypeId",
                table: "OperationTypeLog");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_OperationType_OperationTypeId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "AuditLogOperationTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OperationType",
                table: "OperationType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "OperationType");

            migrationBuilder.RenameTable(
                name: "OperationType",
                newName: "Types");

            migrationBuilder.RenameIndex(
                name: "IX_OperationType_Name",
                table: "Types",
                newName: "IX_Types_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Types",
                table: "Types",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OperationTypeLog_Types_OperationTypeId",
                table: "OperationTypeLog",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Types_OperationTypeId",
                table: "Requests",
                column: "OperationTypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
