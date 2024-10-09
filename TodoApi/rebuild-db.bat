@echo off

IF "%~1"=="" (
    echo Please provide a migration name.
    exit /b 1
)

SET MIGRATION_NAME=%~1

REM Creating the migration =====
dotnet ef migrations add %MIGRATION_NAME%

REM Updating the database  =====
dotnet ef database update

echo Migration and database update completed successfully.
