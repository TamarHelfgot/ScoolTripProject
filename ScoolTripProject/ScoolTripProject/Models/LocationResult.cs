namespace ScoolTripProject.Models
{
    public class LocationResult
    {
        public User User { get; set; }
        public Location Location { get; set; }
        public double Distance { get; set; }
        public bool IsFar { get; set; }

    }
}
