    namespace TodoApi.Models;

    public class Specialization {
        public long SpecId {get; set;}
        public required string SpecDescription{get; set; }
        public ICollection<OperationType>? OperationTypes {get; set;}
    }