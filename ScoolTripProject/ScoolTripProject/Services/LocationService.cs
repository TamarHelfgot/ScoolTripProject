using System;
using ScoolTripProject.DAL;
using ScoolTripProject.Models;

namespace ScoolTripProject.Services
{
    public class LocationService
    {
        private readonly LocationDAL _locationDAL;
        private readonly UserDAL _userDAL;
        private readonly Random _random = new Random();

        public LocationService(LocationDAL locationDAL, UserDAL userDAL)
        {
            _locationDAL = locationDAL;
            _userDAL = userDAL;
        }

        private decimal ConvertToDecimal(CoordinatePart coord)
        {
            decimal degrees = decimal.Parse(coord.Degrees);
            decimal minutes = decimal.Parse(coord.Minutes);
            decimal seconds = decimal.Parse(coord.Seconds);
            return degrees + (minutes / 60) + (seconds / 3600);
        }

        public async Task<List<LocationResult>> GetLocationsForTeacher(string teacherId)
        {
            var teacher = await _userDAL.GetUserById(teacherId);
            if (teacher == null || teacher.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("הגישה מותרת למורות בלבד");

            var teacherLocation = await _locationDAL.GetLatestLocations();
            var tLoc = teacherLocation.FirstOrDefault(l => l.UserId == teacherId);
            if (tLoc == null) return new List<LocationResult>();

            var students = await _userDAL.GetStudentsByTeacher(teacherId);
            var locations = await _locationDAL.GetLatestLocations();

            var result = students.Select(s =>
            {
                var loc = locations.FirstOrDefault(l => l.UserId == s.Id);
                var distance = loc != null
                    ? CalculateDistance(tLoc.Latitude, tLoc.Longitude, loc.Latitude, loc.Longitude)
                    : double.MaxValue;

                return new LocationResult
                {
                    User = s,
                    Location = loc,
                    Distance = distance,
                    IsFar = distance > 3.0
                };
            }).ToList();

            var teacherResult = new LocationResult
            {
                User = teacher,
                Location = tLoc,
                Distance = 0,
                IsFar = false
            };

            result.Insert(0, teacherResult);
            return result;
        }

        public async Task SaveLocation(DeviceLocationInput input)
        {
            var location = new Location
            {
                UserId = input.ID,
                Latitude = ConvertToDecimal(input.Latitude),
                Longitude = ConvertToDecimal(input.Longitude),
                Time = input.Time
            };
            await _locationDAL.AddLocation(location);
        }

        private double ToRad(double deg) => deg * Math.PI / 180;

        private double CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
        {
            const double R = 6371;
            var dLat = ToRad((double)(lat2 - lat1));
            var dLon = ToRad((double)(lon2 - lon1));
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRad((double)lat1)) *
                    Math.Cos(ToRad((double)lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        public async Task SimulateLocations(string teacherId, bool moveTeacher)
        {
            var locations = await _locationDAL.GetLatestLocations();
            var teacherLoc = locations.FirstOrDefault(l => l.UserId == teacherId);

            if (teacherLoc == null || moveTeacher)
            {
                var teacherInput = teacherLoc == null
                    ? GenerateRandomDMS(teacherId)
                    : GenerateRandomDMSNearby(teacherId, (double)teacherLoc.Latitude,
                                              (double)teacherLoc.Longitude, maxKm: 1);

                await SaveLocation(teacherInput);
                locations = await _locationDAL.GetLatestLocations();
                teacherLoc = locations.FirstOrDefault(l => l.UserId == teacherId);
            }

            if (teacherLoc == null) return;

            var students = await _userDAL.GetStudentsByTeacher(teacherId);

            foreach (var student in students)
            {
                var prevLoc = locations.FirstOrDefault(l => l.UserId == student.Id);

                double baseLat = prevLoc != null ? (double)prevLoc.Latitude : (double)teacherLoc.Latitude;
                double baseLon = prevLoc != null ? (double)prevLoc.Longitude : (double)teacherLoc.Longitude;

                var studentInput = GenerateRandomDMSNearby(student.Id, baseLat, baseLon, maxKm: 2);
                await SaveLocation(studentInput);
            }
        }

        private CoordinatePart ToCoordinatePart(double decimal_)
        {
            int degrees = (int)decimal_;
            int minutes = (int)((decimal_ - degrees) * 60);
            int seconds = (int)(((decimal_ - degrees) * 60 - minutes) * 60);
            return new CoordinatePart
            {
                Degrees = degrees.ToString(),
                Minutes = minutes.ToString(),
                Seconds = seconds.ToString()
            };
        }

        private DeviceLocationInput GenerateRandomDMS(string userId)
        {
            double lat = 29.5 + _random.NextDouble() * (33.3 - 29.5);
            double lon = 34.3 + _random.NextDouble() * (35.9 - 34.3);
            return new DeviceLocationInput
            {
                ID = userId,
                Latitude = ToCoordinatePart(lat),
                Longitude = ToCoordinatePart(lon),
                Time = DateTime.UtcNow
            };
        }

        private DeviceLocationInput GenerateRandomDMSNearby(string userId, double baseLat, double baseLon, double maxKm)
        {
            double range = maxKm * 0.009;
            double lat = baseLat + (_random.NextDouble() * 2 - 1) * range;
            double lon = baseLon + (_random.NextDouble() * 2 - 1) * range;
            return new DeviceLocationInput
            {
                ID = userId,
                Latitude = ToCoordinatePart(lat),
                Longitude = ToCoordinatePart(lon),
                Time = DateTime.UtcNow
            };
        }

        public async Task<Location> GetStudentLocation(string studentId)
        {
            var locations = await _locationDAL.GetLatestLocations();
            return locations.FirstOrDefault(l => l.UserId == studentId);
        }

        public async Task<object> GetStudentStatus(string studentId)
        {
            var student = await _userDAL.GetUserById(studentId);
            if (student == null || student.UserRole != UserRole.Student)
                throw new UnauthorizedAccessException("משתמש לא תקין");

            var allUsers = await _userDAL.GetAllUsers();
            var teacher = allUsers.FirstOrDefault(u => u.UserRole == UserRole.Teacher && u.ClassId == student.ClassId);
            if (teacher == null) throw new Exception("לא נמצאה מורה לכיתה זו");

            var locations = await _locationDAL.GetLatestLocations();
            var studentLoc = locations.FirstOrDefault(l => l.UserId == studentId);
            var teacherLoc = locations.FirstOrDefault(l => l.UserId == teacher.Id);

            var distance = studentLoc != null && teacherLoc != null
                ? CalculateDistance(studentLoc.Latitude, studentLoc.Longitude,
                                    teacherLoc.Latitude, teacherLoc.Longitude)
                : double.MaxValue;

            return new
            {
                Student = new LocationResult
                {
                    User = student,
                    Location = studentLoc,
                    Distance = distance,
                    IsFar = distance > 3.0
                },
                Teacher = new LocationResult
                {
                    User = teacher,
                    Location = teacherLoc,
                    Distance = 0,
                    IsFar = false
                }
            };
        }
    }
}