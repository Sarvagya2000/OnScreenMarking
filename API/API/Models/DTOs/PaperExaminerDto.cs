namespace API.Models.DTOs
{
    public class PaperExaminerAssignDto
    {
        public int PaperId { get; set; }
        public int ExaminerId { get; set; }
        public int? MaxScriptLimit { get; set; }
    }
}
