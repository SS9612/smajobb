# Smajobb - Youth Job Platform

A comprehensive platform connecting youths with job opportunities, featuring BankID authentication, secure payments, and comprehensive job management.

## 🚀 Sprint 0 - Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- GitHub account

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd smajobb
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your values
# For local development, you can use env.local as a starting point
```

### 3. Start Development Environment
```bash
docker-compose up -d
```

### 4. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:7000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🏗️ Architecture

### Frontend (React) <---> Backend API (ASP.NET Core) <---> Database (PostgreSQL)
                                             |-- Payments (PSP, Swish)
                                             |-- BankID provider
                                             |-- File Storage (S3/Blob)
                                             |-- Background workers (Hangfire)

## Features

### Core Services
- **AuthService**: BankID authentication + JWT token management
- **UserService**: User management, youth profiles, guardian relationships
- **JobService**: Job posting, categories, search and filtering
- **BookingService**: Booking management, availability checking
- **WorkSessionService**: Time tracking, evidence management
- **PaymentService**: Payment processing, fee calculations
- **TaxService**: Yearly summaries, KU export functionality
- **ModerationService**: Content moderation, forbidden categories
- **NotificationService**: Email, push notifications, SMS

### User Types
- **Customers**: Post jobs and hire youths
- **Youths**: Apply for jobs and track work sessions
- **Guardians**: Provide consent for youth participation
- **Admins**: Platform moderation and management

## Database Schema

The platform uses PostgreSQL with the following main entities:

- **Users**: Core user information and roles
- **YouthProfiles**: Extended youth-specific information
- **Guardians**: Guardian-youth relationships with consent tracking
- **Jobs**: Job postings with categories and location data
- **Bookings**: Job assignments and scheduling
- **WorkSessions**: Time tracking and evidence
- **Payments**: Payment processing and fee management
- **TaxSummaries**: Yearly tax reporting data

## Setup Instructions

### Prerequisites
- .NET 9.0 SDK
- PostgreSQL 12+
- Node.js 18+ (for React frontend)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smajobb
   ```

2. **Configure database connection**
   Update `appsettings.json` with your PostgreSQL connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=smajobb;Username=your_username;Password=your_password"
   }
   ```

3. **Configure external services**
   Update the following sections in `appsettings.json`:
   - JWT secret key
   - BankID API credentials
   - Payment provider keys (Stripe)
   - File storage configuration (S3)
   - Email service (SendGrid)
   - SMS service (Twilio)

4. **Install dependencies and run**
   ```bash
   dotnet restore
   dotnet run
   ```

5. **Access Hangfire dashboard**
   Navigate to `/hangfire` for background job monitoring

### Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update API base URL in configuration

4. **Run development server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/bankid/initiate` - Start BankID authentication
- `POST /api/auth/bankid/complete` - Complete BankID authentication
- `POST /api/auth/validate` - Validate JWT token

### Users
- `POST /api/user/register` - User registration
- `GET /api/user/{id}` - Get user by ID
- `GET /api/user/email/{email}` - Get user by email
- `PUT /api/user/{id}` - Update user
- `DELETE /api/user/{id}` - Delete user

### Youth Profiles
- `POST /api/user/{id}/youth-profile` - Create youth profile
- `GET /api/user/{id}/youth-profile` - Get youth profile
- `PUT /api/user/{id}/youth-profile` - Update youth profile

### Guardian Management
- `POST /api/user/guardian` - Create guardian relationship
- `PUT /api/user/guardian/{id}/consent` - Update guardian consent
- `GET /api/user/youth/{id}/guardians` - Get guardians for youth
- `GET /api/user/guardian/{id}/youths` - Get youths for guardian

## Security Features

- **BankID Integration**: Secure Swedish national ID authentication
- **JWT Tokens**: Stateless authentication with configurable expiry
- **Role-based Access Control**: Different permissions for different user types
- **Data Validation**: Input validation and sanitization
- **Audit Logging**: Comprehensive logging for security monitoring

## Payment Integration

- **Multiple Payment Methods**: Support for various payment providers
- **Platform Fees**: Configurable fee structure
- **Secure Processing**: PCI-compliant payment handling
- **Refund Support**: Full refund and partial refund capabilities

## File Storage

- **S3 Integration**: Scalable cloud storage for media files
- **Blob Storage**: Alternative Azure storage option
- **Media Management**: Support for images, videos, and documents
- **Access Control**: Secure file access with authentication

## Background Processing

- **Hangfire Integration**: Reliable background job processing
- **Job Queues**: Asynchronous task processing
- **Scheduled Jobs**: Time-based automation
- **Monitoring**: Real-time job status monitoring

## Development

### Adding New Services

1. Create the service interface in `Services/Interfaces/`
2. Implement the service in `Services/`
3. Register the service in `Program.cs`
4. Create corresponding controller if needed
5. Add to dependency injection container

### Database Migrations

```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove migration
dotnet ef migrations remove
```

### Testing

```bash
# Run tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Deployment

### Production Considerations

- **Environment Variables**: Use secure environment variables for sensitive data
- **HTTPS**: Enable HTTPS with valid SSL certificates
- **Database Security**: Use connection pooling and secure database access
- **Monitoring**: Implement application monitoring and alerting
- **Backup**: Regular database backups and disaster recovery planning

### Docker Support

```bash
# Build image
docker build -t smajobb .

# Run container
docker run -p 8080:80 smajobb
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## Roadmap

- [ ] React frontend implementation
- [ ] Advanced search and filtering
- [ ] Mobile app development
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Advanced payment features
- [ ] Integration with external job platforms