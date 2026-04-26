using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

// JWT
var secretKey = builder.Configuration["Jwt:SecretKey"];
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(4);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();