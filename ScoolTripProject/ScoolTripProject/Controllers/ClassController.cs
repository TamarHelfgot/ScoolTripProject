using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Services;


namespace ScoolTripProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ClassController : ControllerBase
    {
        private readonly ClassService _classService;

        public ClassController(ClassService classService)
        {
            _classService = classService;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllClasses()
        {
            var classes = await _classService.GetAllClasses();
            return Ok(classes);
        }
    

}
}
