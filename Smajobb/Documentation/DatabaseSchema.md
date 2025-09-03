# Småjobb Database Schema Documentation

## Overview

The Småjobb platform uses a comprehensive PostgreSQL database schema designed to support a full-featured job marketplace for youth workers. The schema includes user management, job postings, bookings, payments, messaging, reviews, and more.

## Core Entities

### User Management

#### User
The central user entity supporting multiple roles (customer, youth, moderator, admin).

**Key Fields:**
- `Id` (Guid, Primary Key)
- `Email` (string, Unique)
- `Phone` (string)
- `DisplayName` (string)
- `Role` (string: customer, youth, moderator, admin)
- `BankIdSubject` (string, Unique) - Swedish BankID integration
- `ProfileImageUrl` (string)
- `Bio` (string)
- `City` (string)
- `IsActive` (bool)
- `IsVerified` (bool)
- `EmailVerified` (bool)
- `PhoneVerified` (bool)

**Relationships:**
- One-to-One: `YouthProfile`
- One-to-Many: `CreatedJobs`, `YouthBookings`, `CustomerBookings`, `WorkSessions`
- Many-to-Many: `Skills`, `PreferredCategories`

#### YouthProfile
Extended profile information for youth users.

**Key Fields:**
- `UserId` (Guid, Primary Key, Foreign Key to User)
- `DateOfBirth` (DateOnly)
- `City` (string)
- `Bio` (string)
- `HourlyRate` (int)
- `AllowedCategories` (string[])

#### Guardian
Manages guardian-youth relationships for users under 18.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User - Guardian)
- `YouthUserId` (Guid, Foreign Key to User - Youth)
- `ConsentGiven` (bool)
- `ConsentAt` (DateTime?)

### Job Management

#### Job
Job postings created by customers.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `Title` (string, Required)
- `Description` (string)
- `Category` (string, Required)
- `Location` (Point) - PostGIS geometry
- `Address` (string)
- `CreatorId` (Guid, Foreign Key to User)
- `PriceType` (string: hourly, fixed)
- `Price` (int)
- `Status` (string: open, in_progress, completed, cancelled)
- `Urgency` (string: low, medium, high)
- `EstimatedHours` (int?)
- `RequiredSkills` (string)
- `ViewCount` (int)
- `ApplicationCount` (int)

**Relationships:**
- Many-to-One: `Creator` (User)
- One-to-Many: `Bookings`, `Applications`, `Images`, `Tags`, `Reviews`

#### JobCategory
Categorization system for jobs.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `Name` (string, Required)
- `Description` (string)
- `Icon` (string)
- `Color` (string) - Hex color code
- `IsActive` (bool)
- `SortOrder` (int)

#### JobApplication
Applications submitted by youth for jobs.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `JobId` (Guid, Foreign Key to Job)
- `YouthId` (Guid, Foreign Key to User)
- `CoverLetter` (string)
- `Status` (string: pending, accepted, rejected, withdrawn)
- `ProposedPrice` (int?)
- `ProposedStartDate` (DateTime?)
- `ProposedEndDate` (DateTime?)

#### JobImage
Images associated with job postings.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `JobId` (Guid, Foreign Key to Job)
- `ImageUrl` (string, Required)
- `AltText` (string)
- `ImageType` (string: main, gallery, before, after)
- `SortOrder` (int)

#### JobTag
Tags for job categorization and search.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `JobId` (Guid, Foreign Key to Job)
- `Tag` (string, Required)

### Booking and Work Management

#### Booking
Bookings connecting customers and youth for specific jobs.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `JobId` (Guid, Foreign Key to Job)
- `YouthId` (Guid, Foreign Key to User)
- `CustomerId` (Guid, Foreign Key to User)
- `ScheduledStart` (DateTime?)
- `ScheduledEnd` (DateTime?)
- `ActualHours` (decimal?)
- `TotalAmount` (decimal?)
- `PlatformFee` (decimal?)
- `YouthEarnings` (decimal?)
- `Status` (string: booked, confirmed, in_progress, completed, cancelled)
- `Notes` (string)
- `SpecialInstructions` (string)
- `IsRecurring` (bool)
- `RecurringBookingId` (Guid?, Foreign Key to Booking)

**Relationships:**
- Many-to-One: `Job`, `Youth` (User), `Customer` (User)
- One-to-Many: `WorkSessions`, `Payments`, `Reviews`, `Messages`

#### WorkSession
Individual work sessions within a booking.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `BookingId` (Guid, Foreign Key to Booking)
- `YouthId` (Guid, Foreign Key to User)
- `StartTime` (DateTime?)
- `EndTime` (DateTime?)
- `Hours` (decimal?)
- `Status` (string: scheduled, in_progress, paused, completed, cancelled)
- `Notes` (string)
- `Location` (string)
- `ProofMediaUrl` (string)
- `IsVerified` (bool)
- `VerifiedBy` (Guid?, Foreign Key to User)
- `AttestedByCustomer` (bool)

### Payment System

#### Payment
Payment transactions between users.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `BookingId` (Guid, Foreign Key to Booking)
- `FromUserId` (Guid, Foreign Key to User)
- `ToUserId` (Guid, Foreign Key to User)
- `Amount` (decimal, Required)
- `Type` (string: payment, refund, commission)
- `Status` (string: pending, processing, completed, failed, cancelled, refunded)
- `PaymentMethod` (string)
- `TransactionId` (string)
- `Description` (string)
- `CommissionAmount` (decimal?)
- `NetAmount` (decimal?)
- `Currency` (string, Default: SEK)

#### TaxSummary
Tax reporting summaries for users.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `Year` (int, Required)
- `CustomerId` (Guid, Foreign Key to User)
- `YouthId` (Guid, Foreign Key to User)

### Communication System

#### Message
Direct messages between users.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `SenderId` (Guid, Foreign Key to User)
- `ReceiverId` (Guid, Foreign Key to User)
- `BookingId` (Guid?, Foreign Key to Booking)
- `Content` (string, Required)
- `Type` (string: text, image, file, system)
- `IsRead` (bool)
- `IsDeleted` (bool)
- `AttachmentUrl` (string)
- `AttachmentName` (string)
- `AttachmentType` (string)

#### Notification
System notifications for users.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `Type` (string, Required) - Notification type
- `Title` (string, Required)
- `Message` (string, Required)
- `IsRead` (bool)
- `Priority` (string: low, normal, high, urgent)
- `ActionUrl` (string)
- `ExpiresAt` (DateTime?)
- `Data` (string) - JSON data for additional context

### Review and Rating System

#### Review
Reviews and ratings between users.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `BookingId` (Guid, Foreign Key to Booking)
- `ReviewerId` (Guid, Foreign Key to User)
- `RevieweeId` (Guid, Foreign Key to User)
- `Rating` (int, Range: 1-5)
- `Comment` (string)
- `IsPublic` (bool)
- `IsVerified` (bool)

### Skills and Preferences

#### Skill
Skills that users can have and jobs can require.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `Name` (string, Required)
- `Description` (string)
- `CategoryId` (Guid?, Foreign Key to JobCategory)
- `IsActive` (bool)
- `SortOrder` (int)

#### UserSkill
Many-to-many relationship between users and skills.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `SkillId` (Guid, Foreign Key to Skill)
- `ProficiencyLevel` (int, Range: 1-5)
- `IsVerified` (bool)
- `VerifiedBy` (Guid?, Foreign Key to User)

#### UserCategoryPreference
User preferences for job categories.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `CategoryId` (Guid, Foreign Key to JobCategory)
- `IsPreferred` (bool)
- `Priority` (int)

#### Availability
User availability schedules.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `DayOfWeek` (DayOfWeek, Required)
- `StartTime` (TimeOnly, Required)
- `EndTime` (TimeOnly, Required)
- `IsAvailable` (bool)

### Session Management

#### UserSession
Active user sessions for authentication tracking.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `TokenHash` (string, Required)
- `CreatedAt` (DateTime, Required)
- `ExpiresAt` (DateTime?)
- `LastAccessedAt` (DateTime?)
- `Status` (string: active, expired, revoked)
- `DeviceInfo` (string)
- `IpAddress` (string)
- `UserAgent` (string)

#### RefreshToken
Refresh tokens for JWT authentication.

**Key Fields:**
- `Id` (Guid, Primary Key)
- `UserId` (Guid, Foreign Key to User)
- `TokenHash` (string, Required)
- `CreatedAt` (DateTime, Required)
- `ExpiresAt` (DateTime, Required)
- `RevokedAt` (DateTime?)
- `RevokedByIp` (string)
- `ReplacedByToken` (string)
- `IsExpired` (bool, Computed)
- `IsRevoked` (bool, Computed)
- `IsActive` (bool, Computed)

## Database Relationships

### One-to-One Relationships
- `User` ↔ `YouthProfile`
- `User` ↔ `UserSession` (multiple sessions per user)

### One-to-Many Relationships
- `User` → `Job` (Creator)
- `User` → `Booking` (Youth/Customer)
- `User` → `WorkSession` (Youth)
- `User` → `Payment` (FromUser/ToUser)
- `User` → `Message` (Sender/Receiver)
- `User` → `Notification`
- `User` → `Review` (Reviewer/Reviewee)
- `Job` → `Booking`
- `Job` → `JobApplication`
- `Job` → `JobImage`
- `Job` → `JobTag`
- `Job` → `Review`
- `Booking` → `WorkSession`
- `Booking` → `Payment`
- `Booking` → `Review`
- `Booking` → `Message`

### Many-to-Many Relationships
- `User` ↔ `Skill` (via `UserSkill`)
- `User` ↔ `JobCategory` (via `UserCategoryPreference`)
- `Skill` ↔ `JobCategory`

## Indexes

### Performance Indexes
- `User.Email` (Unique)
- `User.BankIdSubject` (Unique)
- `Job.Status`
- `Job.Category`
- `Job.CreatedAt`
- `Booking.Status`
- `Booking.CreatedAt`
- `Message.SenderId, ReceiverId` (Composite)
- `Message.CreatedAt`
- `Notification.UserId, IsRead` (Composite)
- `Notification.CreatedAt`
- `Review.RevieweeId`
- `Review.CreatedAt`

## Data Types

### PostgreSQL Specific Types
- `Point` - PostGIS geometry for location data
- `text[]` - Array of strings for `YouthProfile.AllowedCategories`
- `TimeOnly` - Time without date for availability
- `DateOnly` - Date without time for birth dates

### Custom Enums
- User Roles: `customer`, `youth`, `moderator`, `admin`
- Job Status: `open`, `in_progress`, `completed`, `cancelled`
- Booking Status: `booked`, `confirmed`, `in_progress`, `completed`, `cancelled`
- Payment Status: `pending`, `processing`, `completed`, `failed`, `cancelled`, `refunded`
- Message Types: `text`, `image`, `file`, `system`
- Notification Priority: `low`, `normal`, `high`, `urgent`

## Security Considerations

### Data Protection
- All user data is properly indexed for performance
- Foreign key constraints ensure referential integrity
- Soft deletes where appropriate (e.g., `Message.IsDeleted`)
- Audit trails with `CreatedAt`, `UpdatedAt` timestamps

### Authentication
- Session tracking with device and IP information
- Refresh token rotation for security
- BankID integration for Swedish users
- Role-based access control

### Privacy
- Guardian consent tracking for youth users
- Configurable profile visibility
- Message deletion capabilities
- Notification expiration

## Migration Strategy

### Initial Setup
1. Create database with PostGIS extension
2. Run Entity Framework migrations
3. Seed initial data (categories, skills)
4. Create admin user account

### Data Seeding
- Job categories (cleaning, gardening, tutoring, etc.)
- Skills (communication, reliability, specific tools, etc.)
- Default notification templates
- System configuration values

## Performance Optimization

### Query Optimization
- Proper indexing on frequently queried fields
- Composite indexes for multi-column queries
- Foreign key indexes for join performance

### Caching Strategy
- User session caching
- Job category and skill caching
- Frequently accessed user profiles

### Archival Strategy
- Old notifications cleanup
- Expired session cleanup
- Completed booking archival
- Payment history retention policies
