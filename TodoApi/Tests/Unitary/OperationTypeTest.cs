using TodoApi.Models;

public class OperationTypeTest
{
    [Theory]
    [InlineData("First", "01:00:00", "Status")]
    [InlineData("Second", "02:30:00", "Status")]
    [InlineData("Third", "03:45:15", "Status")]
    public void WhenCorrectDataIsPassed_OperationTypeIsCreated(string Name, string Duration, string Status)
    {
        _ = new OperationType(Name, Duration, Status);
    }

    [Theory]
    [InlineData("First", "1:00:00", "Status")]
    [InlineData("Second", "02:3:00", "Status")]
    [InlineData("Third", "03:45:5", "Status")]
    [InlineData("Fourth", "04:45", "Status")]
    public void WhenInvalidDataIsPassed_ExceptionIsThrown(string name, string duration, string status)
    {
        Assert.Throws<ArgumentException>(() =>
                   _ = new OperationType(name, duration, status)
               );
    }

    [Fact]
    public void CheckIfTypeIsCreatedWithActiveStatus()
    {
        Mock<OperationType> mock = new Mock<OperationType>();
        bool res = mock.Object.IsActive;
        Assert.True(res);
    }
}