using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApi.Controllers;
using TodoApi.Models;
using Xunit;

public class StaffUserControllerTest
{
    private readonly Mock<UserRepository> _repositoryMock;
    private readonly StaffUserController _controller;

    public StaffUserControllerTest()
    {
        _repositoryMock = new Mock<UserRepository>(MockBehavior.Strict);
        _controller = new StaffUserController(null, null, null, _repositoryMock.Object);
    }

    // Method to create a sample staff context for testing
    private DbContextOptions<UserContext> CreateNewContextOptions()
    {
        var options = new DbContextOptionsBuilder<UserContext>()
            .UseInMemoryDatabase(databaseName: "TestDb") // Unique name for each test
            .Options;

        return options;
    }

    private async Task SeedDataAsync(UserContext context)
    {
        var staffList = new List<Staff>
            {
                new Staff
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    Role = "Admin", // Ensure Role is set
                    UserName = "john.doe", // Ensure UserName is set
                    Specialization = new Specialization { SpecDescription = "Cardiology" }
                },
                new Staff
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    Role = "Nurse", // Ensure Role is set
                    UserName = "jane.smith", // Ensure UserName is set
                    Specialization = new Specialization { SpecDescription = "HR" }
                },
                new Staff
                {
                    Id = 3,
                    FirstName = "Alice",
                    LastName = "Johnson",
                    Email = "alice.johnson@example.com",
                    Role = "Engineer", // Ensure Role is set
                    UserName = "alice.johnson", // Ensure UserName is set
                    Specialization = new Specialization { SpecDescription = "Nothing" }
                }
            };

        await context.Staff.AddRangeAsync(staffList);
        await context.SaveChangesAsync();
    }

    /*
            [Fact]
            public async Task SearchStaff_ReturnsOk_WhenStaffExists()
            {
                var options = CreateNewContextOptions();

                // Create a new context instance directly instead of using 'using'
                var context = new UserContext(options);
                await SeedDataAsync(context); // Seed data into the in-memory database

                _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

                var result = await _controller.SearchStaff();

                var okResult = Assert.IsType<OkObjectResult>(result);
                var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
                Assert.Equal(3, returnedStaff.Count);
            }
    */
    /*
    [Fact]
    public async Task SearchStaff_ReturnsFilteredStaff_WhenNameProvided()
    {
        var options = CreateNewContextOptions();
        var context = new UserContext(options);
        await SeedDataAsync(context);
        _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

        var result = await _controller.SearchStaff(name: "John");

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
        Assert.Single(returnedStaff);
        Assert.Equal("John", returnedStaff.First().FirstName);
    }
*/
    /*
        [Fact]
        public async Task SearchStaff_ReturnsFilteredStaff_WhenEmailProvided()
        {
            var options = CreateNewContextOptions();
            var context = new UserContext(options);
            await SeedDataAsync(context);
            _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

            var result = await _controller.SearchStaff(email: "jane.smith@example.com");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
            Assert.Single(returnedStaff);
            Assert.Equal("Jane", returnedStaff.First().FirstName);
        }
        */
    /*
            [Fact]
            public async Task SearchStaff_ReturnsFilteredStaff_WhenSpecializationProvided()
            {
                var options = CreateNewContextOptions();
                var context = new UserContext(options);
                await SeedDataAsync(context);
                _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

                var result = await _controller.SearchStaff(specialization: "Engineering");

                var okResult = Assert.IsType<OkObjectResult>(result);
                var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
                Assert.Equal(2, returnedStaff.Count);
            }
    */
    /*
        [Fact]
        public async Task SearchStaff_ReturnsPaginatedResults()
        {
            var options = CreateNewContextOptions();
            var context = new UserContext(options);
            await SeedDataAsync(context);
            _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

            var result = await _controller.SearchStaff(pageNumber: 1, pageSize: 2); // First page with 2 items

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
            Assert.Equal(2, returnedStaff.Count); // Expecting 2 items on the first page
        }
    *//*
        [Fact]
        public async Task SearchStaff_ReturnsPaginatedResults_SecondPage()
        {
            var options = CreateNewContextOptions();
            var context = new UserContext(options);
            await SeedDataAsync(context);
            _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

            var result = await _controller.SearchStaff(pageNumber: 2, pageSize: 2); // Second page with 2 items

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
            Assert.Equal(2, returnedStaff.Count); // Expecting 2 items on the second page
        }
    *//*
        [Fact]
        public async Task SearchStaff_ReturnsFilteredResults_WhenMultipleFiltersProvided()
        {
            var options = CreateNewContextOptions();
            var context = new UserContext(options);
            await SeedDataAsync(context);
            _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

            var result = await _controller.SearchStaff(name: "John", specialization: "Cardiology");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
            Assert.Single(returnedStaff);
            Assert.Equal("John", returnedStaff.First().FirstName);
        }
    *//*
        [Fact]
        public async Task SearchStaff_UsesDefaultPagination_WhenNotSpecified()
        {
            var options = CreateNewContextOptions();
            var context = new UserContext(options);
            await SeedDataAsync(context);
            _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

            var result = await _controller.SearchStaff();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
            Assert.Equal(10, returnedStaff.Count); // Expecting default page size of 10
        }
    */
    // Existing tests...
    /*
    [Fact]
    public async Task SearchStaff_ReturnsEmptyList_WhenNoStaffMatchesFilters()
    {
        var options = CreateNewContextOptions();
        var context = new UserContext(options);
        await SeedDataAsync(context);
        _repositoryMock.Setup(repo => repo.GetStaffQueryable()).Returns(context.Staff.AsQueryable());

        var result = await _controller.SearchStaff(name: "NonExistent");

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedStaff = Assert.IsAssignableFrom<List<Staff>>(okResult.Value);
        Assert.Empty(returnedStaff); // Expecting an empty list
    }
*/
}
