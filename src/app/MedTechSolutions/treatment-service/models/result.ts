export class Result {
  constructor(
    public id: number,
    public doctorId: number,
    public patientId: number,
    public typeOfExam: string,
    public resultDateTime: string,
    public result: boolean
  ) {}
}
