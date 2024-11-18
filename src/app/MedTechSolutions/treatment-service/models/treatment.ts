export class Treatment {
  constructor(
    public id: number,
    public treatmentName: string,
    public description: string,
    public patientId: number,
    public doctorId: number,
    public startDate?: string,
    public endDate?: string,
    public period?: string,
    public patientName?: string
  ) {}
}
