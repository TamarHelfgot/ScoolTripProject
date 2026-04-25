namespace ScoolTripProject.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string UserId { get; set; } 
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public DateTime Time { get; set; }

    }
}
