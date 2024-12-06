import { AllergyRepository } from '../repos/AllergyRepository';
import { IAllergy } from '../Models/Interfaces/AllergyInterface';

class AllergyService {
    private allergyRepository: AllergyRepository;

    constructor(allergyRepository: AllergyRepository) {
        this.allergyRepository = allergyRepository;
    }

    public async addAllergy(name: string, code: string, codeSystem: string, description: string): Promise<IAllergy> {
        
        const allergyData = { name, code, codeSystem, description };
        return await this.allergyRepository.createAllergy(allergyData); // Create the allergy without patientId
    }
    
    public async getAllAllergies(): Promise<{ name: string; code: string; codeSystem: string; description: string }[]> {
        return await this.allergyRepository.findAllAllergies();
    }
}

export { AllergyService };
