using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Pdf_Record
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Pdf_Id { get; set; }
        public string pdf_name { get; set; }
        public string pdf_location {  get; set; }
        public string generated_barcode { get; set; }
        public string inbuilt_barcode { get; set; }
        public int ProjectId { get; set; }
    }
}
