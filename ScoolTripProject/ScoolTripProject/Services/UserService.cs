using ScoolTripProject.DAL;
using ScoolTripProject.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ScoolTripProject.Services
{
    public class UserService
    {
        private readonly UserDAL _userDAL;
        private readonly IConfiguration _configuration;

        public UserService(UserDAL userDAL, IConfiguration configuration)
        {
            _userDAL = userDAL;
            _configuration = configuration;
        }

        public async Task<List<User>> GetAllUsers(string requesterId)
        {
            var requester = await _userDAL.GetUserById(requesterId);
            if (requester == null || requester.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("הגישה מותרת למורות בלבד");
            return await _userDAL.GetAllUsers();
        }

        private bool IsValidIsraeliId(string id)
        {
            if (id.Length != 9 || !id.All(char.IsDigit))
                return false;
            int sum = 0;
            for (int i = 0; i < 9; i++)
            {
                int digit = (id[i] - '0') * ((i % 2) + 1);
                if (digit > 9) digit -= 9;
                sum += digit;
            }
            return sum % 10 == 0;
        }

        public async Task AddUser(User newUser, string requesterId)
        {
            if (!IsValidIsraeliId(newUser.Id))
                throw new InvalidOperationException("ת\"ז לא תקינה");

            var requester = await _userDAL.GetUserById(requesterId);
            if (requester == null)
                throw new UnauthorizedAccessException("משתמש לא נמצא");

            if (requester.UserRole == UserRole.Admin && newUser.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("מנהל יכול להוסיף מורות בלבד");
            if (requester.UserRole == UserRole.Teacher && newUser.UserRole != UserRole.Student)
                throw new UnauthorizedAccessException("מורה יכולה להוסיף תלמידות בלבד");
            if (requester.UserRole == UserRole.Student)
                throw new UnauthorizedAccessException("תלמידה לא מורשית להוסיף משתמשים");

            var existing = await _userDAL.GetUserById(newUser.Id);
            if (existing != null)
                throw new InvalidOperationException("משתמש עם ת\"ז זה כבר קיים");

            await _userDAL.AddUser(newUser);
        }

        public async Task<List<User>> GetMyStudents(string teacherId)
        {
            var teacher = await _userDAL.GetUserById(teacherId);
            if (teacher == null || teacher.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("הגישה מותרת למורות בלבד");
            return await _userDAL.GetStudentsByTeacher(teacherId);
        }

        public async Task<object> Login(string id)
        {
            if (!IsValidIsraeliId(id))
                throw new UnauthorizedAccessException("ת\"ז לא תקינה");

            var user = await _userDAL.GetUserById(id);
            if (user == null)
                throw new UnauthorizedAccessException("ת\"ז לא נמצאה במערכת");

            var secretKey = _configuration["Jwt:SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new[]
            {
                new Claim("userId", user.Id),
                new Claim("userRole", ((int)user.UserRole).ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            return new { user, token = tokenString };
        }
    }
}