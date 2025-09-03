using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
    {
        try
        {
            if (string.IsNullOrEmpty(registrationDto.Email) && string.IsNullOrEmpty(registrationDto.Phone))
            {
                return BadRequest("Either email or phone number is required");
            }

            var user = await _userService.CreateUserAsync(registrationDto);
            
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by ID: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("email/{email}")]
    public async Task<IActionResult> GetUserByEmail(string email)
    {
        try
        {
            var user = await _userService.GetUserByEmailAsync(email);
            
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email: {Email}", email);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserRegistrationDto updateDto)
    {
        try
        {
            var user = await _userService.UpdateUserAsync(id, updateDto);
            
            return Ok(user);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var deleted = await _userService.DeleteUserAsync(id);
            
            if (!deleted)
            {
                return NotFound("User not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // Youth Profile endpoints
    [HttpPost("{id}/youth-profile")]
    public async Task<IActionResult> CreateYouthProfile(Guid id, [FromBody] YouthProfileDto profileDto)
    {
        try
        {
            var profile = await _userService.CreateYouthProfileAsync(id, profileDto);
            
            return CreatedAtAction(nameof(GetYouthProfile), new { id }, profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating youth profile for user: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/youth-profile")]
    public async Task<IActionResult> GetYouthProfile(Guid id)
    {
        try
        {
            var profile = await _userService.GetYouthProfileAsync(id);
            
            if (profile == null)
            {
                return NotFound("Youth profile not found");
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting youth profile for user: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/youth-profile")]
    public async Task<IActionResult> UpdateYouthProfile(Guid id, [FromBody] YouthProfileDto profileDto)
    {
        try
        {
            var profile = await _userService.UpdateYouthProfileAsync(id, profileDto);
            
            return Ok(profile);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating youth profile for user: {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // Guardian endpoints
    [HttpPost("guardian")]
    public async Task<IActionResult> CreateGuardianRelation([FromBody] CreateGuardianRequest request)
    {
        try
        {
            var guardian = await _userService.CreateGuardianRelationAsync(request.GuardianId, request.YouthId);
            
            return Ok(guardian);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating guardian relation");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("guardian/{id}/consent")]
    public async Task<IActionResult> UpdateGuardianConsent(Guid id, [FromBody] UpdateConsentRequest request)
    {
        try
        {
            var updated = await _userService.UpdateGuardianConsentAsync(id, request.ConsentGiven);
            
            if (!updated)
            {
                return NotFound("Guardian relation not found");
            }

            return Ok(new { Success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating guardian consent: {GuardianId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("youth/{id}/guardians")]
    public async Task<IActionResult> GetGuardiansForYouth(Guid id)
    {
        try
        {
            var guardians = await _userService.GetGuardiansForYouthAsync(id);
            
            return Ok(guardians);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting guardians for youth: {YouthId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("guardian/{id}/youths")]
    public async Task<IActionResult> GetYouthsForGuardian(Guid id)
    {
        try
        {
            var youths = await _userService.GetYouthsForGuardianAsync(id);
            
            return Ok(youths);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting youths for guardian: {GuardianId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

public record CreateGuardianRequest
{
    public Guid GuardianId { get; init; }
    public Guid YouthId { get; init; }
}

public record UpdateConsentRequest
{
    public bool ConsentGiven { get; init; }
}
