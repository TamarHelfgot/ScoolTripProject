using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Models;
using ScoolTripProject.Services;
using Microsoft.AspNetCore.Authorization;

namespace ScoolTripProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _configuration;

        public UsersController(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllUsers([FromQuery] string requesterId)
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
        [Authorize]
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
        [Authorize]
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
                var result = await _userService.Login(id);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}