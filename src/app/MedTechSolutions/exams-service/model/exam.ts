export class Exam {
  id: number;
  doctorId: number;
  patientId: number;
  examType: string;
  examDate: string;
  examResultDate: string;
  examResult: boolean;

  constructor() {
    this.id = 0;
    this.doctorId = 0;
    this.patientId = 0;
    this.examType = "";
    this.examDate = "";
    this.examResultDate = "";
    this.examResult = false;
  }
}
