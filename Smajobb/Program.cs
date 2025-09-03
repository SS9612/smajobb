using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Hangfire;
using Hangfire.PostgreSql;
using Hangfire.Dashboard;
using Serilog;
using Smajobb.Data;
using Smajobb.Services;
using Smajobb.Services.Interfaces;
using Smajobb.Authorization;
using Smajobb.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/smajobb-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure Entity Framework with PostgreSQL
builder.Services.AddDbContext<SmajobbDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"] ?? "default-secret-key-change-in-production")),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "smajobb",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "smajobb-users",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configure Hangfire for background jobs - TEMPORARILY DISABLED FOR TESTING
// builder.Services.AddHangfire(config =>
// {
//     config.UsePostgreSqlStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

// builder.Services.AddHangfireServer();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Add HTTP context accessor for authorization
builder.Services.AddHttpContextAccessor();

// Add SignalR
builder.Services.AddSignalR();

// Add other services as they are implemented
// builder.Services.AddScoped<IJobService, JobService>();
// builder.Services.AddScoped<IBookingService, BookingService>();
// builder.Services.AddScoped<IWorkSessionService, WorkSessionService>();
// builder.Services.AddScoped<IPaymentService, PaymentService>();
// builder.Services.AddScoped<ITaxService, TaxService>();
// builder.Services.AddScoped<IModerationService, ModerationService>();
// builder.Services.AddScoped<INotificationService, NotificationService>();

// Configure Authorization Policies
builder.Services.AddAuthorization(options =>
{
    PolicyBuilder.ConfigurePolicies(options);
});

// Register authorization handlers
builder.Services.AddScoped<ResourceOwnershipHandler>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Add JWT middleware
app.UseMiddleware<JwtMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Configure Hangfire dashboard - TEMPORARILY DISABLED FOR TESTING
// app.MapHangfireDashboard("/hangfire");

app.MapControllers();
app.MapHub<Smajobb.Services.MessageHub>("/hubs/message");
app.MapHub<Smajobb.Hubs.NotificationHub>("/hubs/notification");

// Ensure database is created - TEMPORARILY DISABLED FOR TESTING
// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<SmajobbDbContext>();
//     await context.Database.EnsureCreatedAsync();
// }

app.Run();

// Simple authorization filter for Hangfire dashboard - REMOVED FOR NOW
// public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
// {
//     public bool Authorize(DashboardContext context) => true; // In production, implement proper authorization
// }
