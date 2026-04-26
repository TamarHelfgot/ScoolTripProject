using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Models;
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddClass([FromBody] Class newClass)
        {
            try
            {
                await _classService.AddClass(newClass);
                return Ok("הכיתה נוספה בהצלחה");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
