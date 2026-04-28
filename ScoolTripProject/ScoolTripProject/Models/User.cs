namespace ScoolTripProject.Models
{
    public class User
    {
        public string Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? ClassId { get; set; }
        public UserRole UserRole { get; set; }

    }
}
