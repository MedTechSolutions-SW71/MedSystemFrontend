export class Report {
  constructor(
    public id: number,
    public reason: string,
    public date: string,
    public patientId: number
  ) {}
}
