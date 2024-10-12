public class PasswordGeneratorService
{
    private const string alphabet = "abcdefghijklmnopqrstuvwxyz";
    private const string Calphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private const string symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
    private const string numbers = "0123456789";
    private Random rand = new Random();

    public string GeneratePassword()
    {
        char symbol = symbols[rand.Next(symbols.Length)];
        char capitalLetter = Calphabet[rand.Next(Calphabet.Length)];
        char digit = numbers[rand.Next(numbers.Length)];

        string allChars = alphabet + Calphabet + symbols + numbers;

        string remainingChars = new string(Enumerable.Range(0, 7) // Generate 7 more characters
            .Select(_ => allChars[rand.Next(allChars.Length)]).ToArray());

        string password = symbol + capitalLetter + digit + remainingChars;

        return new string(password.OrderBy(c => rand.Next()).ToArray());
    }
}