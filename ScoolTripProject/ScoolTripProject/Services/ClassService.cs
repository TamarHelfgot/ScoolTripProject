using ScoolTripProject.DAL;
using ScoolTripProject.Models;

namespace ScoolTripProject.Services
{
    public class ClassService
    {
        private readonly ClassDAL _classDAL;

        public ClassService(ClassDAL classDAL)
        {
            _classDAL = classDAL;
        }

        public async Task<List<Class>> GetAllClasses()
        {
            var classes = await _classDAL.GetAllClasses();
            return classes.Where(c => c.ClassName != "מנהל מערכת").ToList();
        }

    }
}
