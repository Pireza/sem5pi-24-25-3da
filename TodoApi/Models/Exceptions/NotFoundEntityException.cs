public class NotFoundResource : Exception
    {
        public string Details { get; }

        public NotFoundResource(string message) : base(message)
        {
            
        }

        public NotFoundResource(string message, string details) : base(message)
        {
            this.Details = details;
        }
    }