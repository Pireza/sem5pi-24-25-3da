public class UserAlreadyExistsException : Exception
    {
        public string Details { get; }

        public UserAlreadyExistsException(string message) : base(message)
        {
            
        }

        public UserAlreadyExistsException(string message, string details) : base(message)
        {
            this.Details = details;
        }
    }