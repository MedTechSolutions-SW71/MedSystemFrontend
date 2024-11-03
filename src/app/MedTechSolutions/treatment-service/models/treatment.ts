export class Treatment {
  constructor(
    public id: number,
    public treatmentName: string,
    public description: string,
    public period: string,
    public patientId: number
  ) {}
}
