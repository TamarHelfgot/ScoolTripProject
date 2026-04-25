using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Models;
using ScoolTripProject.Services;

namespace ScoolTripProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllUsers ([FromQuery] string requesterId)
        {
            try
            {
                var users = await _userService.GetAllUsers(requesterId);
                return Ok(users);

            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }

        }
        
        [HttpPost]
        public async Task<IActionResult> AddUser(
            [FromBody] User newUser,
            [FromQuery] string requesterId)
        {
            try
            {
                await _userService.AddUser(newUser, requesterId);
                return Ok("הפעולה בוצעה בהצלחה");

            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("mystudents")]
        public async Task<IActionResult> GetMyStudents([FromQuery] string teacherId)
        {
            try
            {
                var students = await _userService.GetMyStudents(teacherId);
                return Ok(students);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromQuery] string id)
        {
            try
            {
                var user = await _userService.Login(id);
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }



    }
}
