using ScoolTripProject.DAL;
using ScoolTripProject.Models;

namespace ScoolTripProject.Services
{
    public class UserService
    {
        private readonly UserDAL _userDAL;
        public UserService(UserDAL userDAL)
        {
            _userDAL = userDAL;
        }

        //שליפת כל המשתמשים -הרשאה למורות בלבד
        public async Task<List<User>> GetAllUsers(string requesterId)
        {
            var requester = await _userDAL.GetUserById(requesterId);

            if (requester == null || requester.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("הגישה מותרת למורות בלבד");

            return await _userDAL.GetAllUsers();
        }

// בדיקת תקינות ת"ז ישראלית
    private bool IsValidIsraeliId(string id)
    {
        // חייב להיות בדיוק 9 ספרות
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

        // הוספת משתמש — Admin בלבד מורשה
        public async Task AddUser(User newUser, string requesterId)
        {
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

        //שליפת כל התלמידות של המורה
        public async Task<List<User>> GetMyStudents(string teacherId)
        {
            var teacher = await _userDAL.GetUserById(teacherId);
            if (teacher == null || teacher.UserRole != UserRole.Teacher)
                throw new UnauthorizedAccessException("הגישה מותרת למורות בלבד");
            return await _userDAL.GetStudentsByTeacher(teacherId);

        }

        public async Task<User> Login(string id)
        {
            var user = await _userDAL.GetUserById(id);
            if (user == null)
                throw new UnauthorizedAccessException("ת\"ז לא נמצאה במערכת");

            return user;
        }



    }
}
