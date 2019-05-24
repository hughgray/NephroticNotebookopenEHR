export class Reading {

    constructor(
        public dateTimeOfReading: Date,
        public readingLevel: number,
        public wasMedicationTaken: boolean,
        public userComment: string,
        public treatmentStateId: number,
    ) {}
}
