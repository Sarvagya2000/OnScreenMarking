using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("questiontypes")]
    public class QuestionType
    {
        [Key]
        [Column("QuestiontypeId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int QuestionTypeId { get; set; }

        [Required]
        [Column("Questiontype")]
        [StringLength(255)]
        public string QuestionTypeName { get; set; } = string.Empty;
    }
}
