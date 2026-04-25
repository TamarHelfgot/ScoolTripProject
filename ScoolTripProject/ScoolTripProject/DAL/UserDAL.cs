using Microsoft.EntityFrameworkCore;
using ScoolTripProject.Models;

namespace ScoolTripProject.DAL
{
    public class UserDAL
    {
        private readonly AppDbContext _context;

        public UserDAL(AppDbContext context)
        {
            _context = context;
        }

     
        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

       
        public async Task<User?> GetUserById(string id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        
        public async Task<List<User>> GetStudentsByTeacher(string teacherId)
        {
            var teacher = await GetUserById(teacherId);
            if (teacher == null) return new List<User>();

            return await _context.Users
                 .Where(u => u.ClassId == teacher.ClassId
                        && u.UserRole == UserRole.Student)
                  .ToListAsync();
        }
        
        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

        }


    }
}
