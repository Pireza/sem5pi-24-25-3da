using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class OperationMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OperationRequest_OperationType_OperationTypeId",
                table: "OperationRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_OperationRequest_Patients_PatientId",
                table: "OperationRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_OperationRequest_Priorities_PriorityId",
                table: "OperationRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_OperationRequest_Staff_DoctorId",
                table: "OperationRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_OperationType_Specializations_OperationType_OperationTypesId",
                table: "OperationType_Specializations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OperationType",
                table: "OperationType");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OperationRequest",
                table: "OperationRequest");

            migrationBuilder.RenameTable(
                name: "OperationType",
                newName: "Types");

            migrationBuilder.RenameTable(
                name: "OperationRequest",
                newName: "Requests");

            migrationBuilder.RenameIndex(
                name: "IX_OperationRequest_PriorityId",
                table: "Requests",
                newName: "IX_Requests_PriorityId");

            migrationBuilder.RenameIndex(
                name: "IX_OperationRequest_PatientId",
                table: "Requests",
                newName: "IX_Requests_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_OperationRequest_OperationTypeId",
                table: "Requests",
                newName: "IX_Requests_OperationTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_OperationRequest_DoctorId",
                table: "Requests",
                newName: "IX_Requests_DoctorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Types",
                table: "Types",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Requests",
                table: "Requests",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OperationType_Specializations_Types_OperationTypesId",
                table: "OperationType_Specializations",
                column: "OperationTypesId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Patients_PatientId",
                table: "Requests",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Priorities_PriorityId",
                table: "Requests",
                column: "PriorityId",
                principalTable: "Priorities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Staff_DoctorId",
                table: "Requests",
                column: "DoctorId",
                principalTable: "Staff",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OperationType_Specializations_Types_OperationTypesId",
                table: "OperationType_Specializations");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Patients_PatientId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Priorities_PriorityId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Staff_DoctorId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Types_OperationTypeId",
                table: "Requests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Types",
                table: "Types");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Requests",
                table: "Requests");

            migrationBuilder.RenameTable(
                name: "Types",
                newName: "OperationType");

            migrationBuilder.RenameTable(
                name: "Requests",
                newName: "OperationRequest");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_PriorityId",
                table: "OperationRequest",
                newName: "IX_OperationRequest_PriorityId");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_PatientId",
                table: "OperationRequest",
                newName: "IX_OperationRequest_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_OperationTypeId",
                table: "OperationRequest",
                newName: "IX_OperationRequest_OperationTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_DoctorId",
                table: "OperationRequest",
                newName: "IX_OperationRequest_DoctorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OperationType",
                table: "OperationType",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OperationRequest",
                table: "OperationRequest",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OperationRequest_OperationType_OperationTypeId",
                table: "OperationRequest",
                column: "OperationTypeId",
                principalTable: "OperationType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OperationRequest_Patients_PatientId",
                table: "OperationRequest",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OperationRequest_Priorities_PriorityId",
                table: "OperationRequest",
                column: "PriorityId",
                principalTable: "Priorities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OperationRequest_Staff_DoctorId",
                table: "OperationRequest",
                column: "DoctorId",
                principalTable: "Staff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OperationType_Specializations_OperationType_OperationTypesId",
                table: "OperationType_Specializations",
                column: "OperationTypesId",
                principalTable: "OperationType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
