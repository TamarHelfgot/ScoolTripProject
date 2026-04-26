using Microsoft.EntityFrameworkCore;
using ScoolTripProject.Models;

namespace ScoolTripProject.DAL
{
    public class ClassDAL
    {
        private readonly AppDbContext _context;

        public ClassDAL(AppDbContext context)
        {
            _context = context;
        }

       
        public async Task<List<Class>> GetAllClasses()
        {
            return await _context.Classes.ToListAsync();
        }

        public async Task AddClass(Class newClass)
        {
            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();
        }

    }
}
