using Microsoft.EntityFrameworkCore;
using ScoolTripProject.Models;

namespace ScoolTripProject.DAL
{
    public class LocationDAL
    {
        private readonly AppDbContext _context;

        public LocationDAL(AppDbContext context)
        {
            _context = context;
        }

        
        public async Task<List<Location>> GetLatestLocations()
        {
            return await _context.Locations
                .GroupBy(l => l.UserId)
                .Select(g => g.OrderByDescending(l => l.Time).First())
                 .ToListAsync();

        }

        
        public async Task AddLocation(Location location)
        {
            var existing = await _context.Locations
                .FirstOrDefaultAsync(l => l.UserId == location.UserId);

            if (existing != null)
            {
              
                existing.Latitude = location.Latitude;
                existing.Longitude = location.Longitude;
                existing.Time = location.Time;
            }
            else
            {
               
                _context.Locations.Add(location);
            }

            await _context.SaveChangesAsync();
        }

    }
}
