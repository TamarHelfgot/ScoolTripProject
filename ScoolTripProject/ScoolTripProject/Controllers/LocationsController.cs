using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScoolTripProject.Models;
using ScoolTripProject.Services;

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
        public async Task<IActionResult> GetLocations([FromQuery] string teacherId)
        {
            try
            {
                var locations = await _locationService.GetLocationsForTeacher(teacherId);
                return Ok(locations);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
       
        [HttpPost]
        public async Task<IActionResult> SaveLocation(
    [FromBody] DeviceLocationInput input)
        {
            try
            {
                await _locationService.SaveLocation(input);
                return Ok("מיקום נשמר בהצלחה");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("student")]
        [Authorize]
        public async Task<IActionResult> GetStudentLocation([FromQuery] string studentId)
        {
            try
            {
                var location = await _locationService.GetStudentLocation(studentId);
                if (location == null)
                    return NotFound("לא נמצא מיקום לתלמידה זו");
                return Ok(location);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("mystatus")]
        [Authorize]
        public async Task<IActionResult> GetStudentStatus([FromQuery] string studentId)
        {
            try
            {
                var result = await _locationService.GetStudentStatus(studentId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
