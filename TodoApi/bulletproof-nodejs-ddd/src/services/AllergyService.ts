import { AllergyRepository } from '../repos/AllergyRepository';
import { IAllergy } from '../Models/Allergy'; // Import the type, not the model.

class AllergyService {
    private allergyRepository: AllergyRepository;

    constructor(allergyRepository: AllergyRepository) {
        this.allergyRepository = allergyRepository;
    }

    public async addAllergy(name: string, description: string, patientId: number): Promise<IAllergy> {
        const allergyData = { name, description, patientId };
        return await this.allergyRepository.createAllergy(allergyData);
    }
}

export { AllergyService };
