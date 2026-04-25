namespace ScoolTripProject.Models
{
    public class DeviceLocationInput
    {
        public string ID { get; set; }
        public CoordinatePart Longitude { get; set; }
        public CoordinatePart Latitude { get; set; }
        public DateTime Time { get; set; }

    }
}
