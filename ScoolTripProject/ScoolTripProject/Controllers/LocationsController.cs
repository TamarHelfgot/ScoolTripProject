using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Models;
using ScoolTripProject.Services;
using System.Security.Claims;

namespace ScoolTripProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly LocationService _locationService;

        public LocationsController(LocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetLocations()
        {
            try
            {
                var teacherId = User.FindFirst("userId")?.Value;
                var locations = await _locationService.GetLocationsForTeacher(teacherId);
                return Ok(locations);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveLocation([FromBody] DeviceLocationInput input)
        {
            try
            {
                await _locationService.SaveLocation(input);
                return Ok("מיקום נשמר בהצלחה");
            }
            catch (Exception ex)
            {
                return BadRequest("שגיאה בשמירת המיקום");
            }
        }

        [HttpGet("student")]
        [Authorize]
        public async Task<IActionResult> GetStudentLocation()
        {
            try
            {
                var studentId = User.FindFirst("userId")?.Value;
                var location = await _locationService.GetStudentLocation(studentId);
                if (location == null)
                    return NotFound("לא נמצא מיקום לתלמידה זו");
                return Ok(location);
            }
            catch (Exception ex)
            {
                return BadRequest("שגיאה בטעינת המיקום");
            }
        }

        [HttpGet("mystatus")]
        [Authorize]
        public async Task<IActionResult> GetStudentStatus()
        {
            try
            {
                var studentId = User.FindFirst("userId")?.Value;
                var result = await _locationService.GetStudentStatus(studentId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest("שגיאה בטעינת הסטטוס");
            }
        }
    }
}