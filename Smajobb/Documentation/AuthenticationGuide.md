# Småjobb Authentication & Authorization Guide

## Overview

The Småjobb platform implements a comprehensive authentication and authorization system using JWT tokens with BankID integration for Swedish users.

## Authentication Flow

### 1. BankID Authentication
- **Initiate**: `POST /api/auth/bankid/initiate`
- **Complete**: `POST /api/auth/bankid/complete`
- **Validate**: `POST /api/auth/validate`

### 2. JWT Token Management
- **Refresh**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`
- **Current User**: `GET /api/auth/me`

## User Roles

### Customer
- Can create and manage jobs
- Can book youth workers
- Can manage their own bookings
- Can view their own payments

### Youth
- Can apply for jobs
- Can manage their own bookings
- Can track work sessions
- Can view their own payments
- Can manage their profile

### Moderator
- Can moderate jobs and bookings
- Can view reports
- Can manage disputes
- Can view analytics

### Admin
- Full system access
- Can manage users
- Can change user roles
- Can view all analytics
- Can manage system settings

## Authorization Policies

### Role-Based Policies
- `CustomerOnly`: Requires customer role
- `YouthOnly`: Requires youth role
- `AdminOnly`: Requires admin role
- `ModeratorOrAdmin`: Requires moderator or admin role

### Resource Ownership Policies
- `JobOwner`: User owns the job
- `BookingParticipant`: User is involved in the booking
- `UserOwner`: User owns the profile

### Combined Policies
- `JobOwnerOrAdmin`: User owns the job OR is admin
- `BookingParticipantOrAdmin`: User is involved in booking OR is admin

### Permission-Based Policies
- `CanCreateJobs`: Customer or admin can create jobs
- `CanModerate`: Moderator or admin can moderate
- `CanViewAnalytics`: Admin or moderator can view analytics

## API Endpoint Authorization

### Public Endpoints
- `POST /api/auth/bankid/initiate`
- `POST /api/auth/bankid/complete`
- `POST /api/auth/validate`

### Authenticated Endpoints
All other endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Role-Specific Endpoints

#### Customer Endpoints
- `POST /api/job` - Create job
- `GET /api/booking/customer/{customerId}` - Get customer bookings

#### Youth Endpoints
- `GET /api/booking/youth/{youthId}` - Get youth bookings
- `POST /api/worksession/start` - Start work session

#### Admin Endpoints
- `POST /api/auth/change-role` - Change user role
- `GET /api/user` - Get all users (when implemented)

## JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Display Name",
  "role": "customer|youth|moderator|admin",
  "iat": 1234567890,
  "exp": 1234567890,
  "iss": "smajobb",
  "aud": "smajobb-users"
}
```

## Security Features

### Token Security
- JWT tokens expire after 7 days
- Tokens are signed with HMAC SHA256
- Token validation includes issuer and audience verification
- Clock skew validation prevents replay attacks

### Session Management
- User sessions are tracked in the database
- Sessions can be revoked individually or all at once
- Device information and IP addresses are logged
- Expired sessions are automatically cleaned up

### Authorization Checks
- Resource ownership is verified for sensitive operations
- Role-based access control for different user types
- Permission-based policies for fine-grained control
- Admin and moderator override capabilities

## Implementation Examples

### Controller Authorization
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires authentication
public class JobController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "customer,admin")] // Role-based
    public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
    {
        // Implementation
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "JobOwnerOrAdmin")] // Policy-based
    public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobDto dto)
    {
        // Implementation
    }
}
```

### Custom Authorization Attributes
```csharp
[AuthorizeCustomer] // Custom attribute for customer role
[AuthorizeYouth]    // Custom attribute for youth role
[AuthorizeAdmin]    // Custom attribute for admin role
[RequireOwnership("id", "job")] // Custom ownership check
```

### Permission Checking in Services
```csharp
public async Task<bool> CanModifyJobAsync(Guid userId, Guid jobId)
{
    var user = await _context.Users.FindAsync(userId);
    if (user?.Role == "admin") return true;
    
    var job = await _context.Jobs.FindAsync(jobId);
    return job?.CreatorId == userId;
}
```

## Error Responses

### Authentication Errors
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Valid token but insufficient permissions
- `400 Bad Request`: Invalid authentication request

### Authorization Errors
- `403 Forbidden`: User doesn't have required role or permission
- `404 Not Found`: Resource not found or user doesn't have access

## Best Practices

1. **Always validate tokens** on protected endpoints
2. **Use specific policies** rather than broad role checks
3. **Implement resource ownership** checks for sensitive operations
4. **Log authentication events** for security monitoring
5. **Use HTTPS** in production for token transmission
6. **Implement token refresh** for better user experience
7. **Clean up expired sessions** regularly
8. **Monitor for suspicious activity** and implement rate limiting

## Configuration

### JWT Settings (appsettings.json)
```json
{
  "Jwt": {
    "Secret": "your-secret-key-here",
    "Issuer": "smajobb",
    "Audience": "smajobb-users",
    "ExpirationDays": 7
  }
}
```

### Database Connection
Ensure the database connection string is configured for session and user management:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string-here"
  }
}
```
