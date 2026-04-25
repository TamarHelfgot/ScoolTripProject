using Microsoft.EntityFrameworkCore;
using ScoolTripProject.DAL;
using ScoolTripProject.Services;

var builder = WebApplication.CreateBuilder(args);

// DAL
builder.Services.AddScoped<UserDAL>();
builder.Services.AddScoped<LocationDAL>();
builder.Services.AddScoped<ClassDAL>();

// Services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<LocationService>();
builder.Services.AddScoped<ClassService>();
builder.Services.AddHostedService<LocationSimulatorService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();
app.Run();