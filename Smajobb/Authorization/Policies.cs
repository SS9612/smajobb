using Microsoft.AspNetCore.Authorization;

namespace Smajobb.Authorization;

public static class Policies
{
    public const string CustomerOnly = "CustomerOnly";
    public const string YouthOnly = "YouthOnly";
    public const string AdminOnly = "AdminOnly";
    public const string ModeratorOrAdmin = "ModeratorOrAdmin";
    public const string JobOwner = "JobOwner";
    public const string BookingParticipant = "BookingParticipant";
    public const string UserOwner = "UserOwner";
}

public static class PolicyBuilder
{
    public static void ConfigurePolicies(AuthorizationOptions options)
    {
        // Role-based policies
        options.AddPolicy(Policies.CustomerOnly, policy =>
            policy.RequireRole("customer"));

        options.AddPolicy(Policies.YouthOnly, policy =>
            policy.RequireRole("youth"));

        options.AddPolicy(Policies.AdminOnly, policy =>
            policy.RequireRole("admin"));

        options.AddPolicy(Policies.ModeratorOrAdmin, policy =>
            policy.RequireRole("moderator", "admin"));

        // Resource ownership policies
        options.AddPolicy(Policies.JobOwner, policy =>
            policy.AddRequirements(new ResourceOwnershipRequirement("job", "id")));

        options.AddPolicy(Policies.BookingParticipant, policy =>
            policy.AddRequirements(new ResourceOwnershipRequirement("booking", "id")));

        options.AddPolicy(Policies.UserOwner, policy =>
            policy.AddRequirements(new ResourceOwnershipRequirement("user", "id")));

        // Combined policies
        options.AddPolicy("JobOwnerOrAdmin", policy =>
        {
            policy.RequireRole("admin");
            policy.AddRequirements(new ResourceOwnershipRequirement("job", "id"));
        });

        options.AddPolicy("BookingParticipantOrAdmin", policy =>
        {
            policy.RequireRole("admin");
            policy.AddRequirements(new ResourceOwnershipRequirement("booking", "id"));
        });
    }
}
