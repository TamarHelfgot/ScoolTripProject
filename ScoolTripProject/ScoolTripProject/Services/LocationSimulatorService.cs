using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using ScoolTripProject.DAL;
using ScoolTripProject.Models;

namespace ScoolTripProject.Services
{
    public class LocationSimulatorService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private int _minuteCount = 0;

        public LocationSimulatorService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var locationService = scope.ServiceProvider.GetRequiredService<LocationService>();
                var userDAL = scope.ServiceProvider.GetRequiredService<UserDAL>();

                var allUsers = await userDAL.GetAllUsers();
                var teachers = allUsers.Where(u => u.UserRole == UserRole.Teacher).ToList();

                foreach (var teacher in teachers)
                {
                    bool moveTeacher = _minuteCount % 30 == 0;
                    await locationService.SimulateLocations(teacher.Id, moveTeacher);
                }

                _minuteCount++;
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}