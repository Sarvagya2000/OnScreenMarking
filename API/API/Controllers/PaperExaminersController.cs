using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Models.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaperExaminersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaperExaminersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("paper/{paperId}")]
        public async Task<ActionResult<IEnumerable<PaperExaminer>>> GetPaperExaminers(int paperId)
        {
            try
            {
                var assignments = await _context.PaperExaminers
                    .Include(pe => pe.Examiner)
                    .Where(pe => pe.PaperId == paperId)
                    .ToListAsync();

                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("assign")]
        [Authorize(Roles = "admin,coordinator")]
        public async Task<IActionResult> AssignExaminer([FromBody] PaperExaminerAssignDto assignDto)
        {
            try
            {
                // Validate that paper and examiner exist
                var paper = await _context.Papers.FindAsync(assignDto.PaperId);
                if (paper == null)
                {
                    return NotFound(new { success = false, message = "Paper not found" });
                }

                var examiner = await _context.Users.FindAsync(assignDto.ExaminerId);
                if (examiner == null)
                {
                    return NotFound(new { success = false, message = "Examiner not found" });
                }

                // Check if already assigned
                if (await _context.PaperExaminers.AnyAsync(pe => pe.PaperId == assignDto.PaperId && pe.ExaminerId == assignDto.ExaminerId))
                {
                    return BadRequest(new { success = false, message = "Examiner already assigned to this paper" });
                }

                var assignment = new PaperExaminer
                {
                    PaperId = assignDto.PaperId,
                    ExaminerId = assignDto.ExaminerId,
                    MaxScriptLimit = assignDto.MaxScriptLimit,
                    AssignedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.PaperExaminers.Add(assignment);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Examiner assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("remove/{id}")]
        [Authorize(Roles = "admin,coordinator")]
        public async Task<IActionResult> RemoveAssignment(int id)
        {
            try
            {
                var assignment = await _context.PaperExaminers.FindAsync(id);
                if (assignment == null)
                    return NotFound(new { success = false, message = "Assignment not found" });

                _context.PaperExaminers.Remove(assignment);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Examiner removed from paper" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
