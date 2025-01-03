import { AllergyRepository } from '../repos/AllergyRepository';
import { IAllergy } from '../Models/Interfaces/AllergyInterface';
import Allergy from '../Models/Allergy';

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
    public async getAllIdAllergies() : Promise<{ name: string; code: string; codeSystem: string; description: string }[]> {
        return await this.allergyRepository.findAllIdAllergies();
    } 

    public async getAllergyById(allergyId: string): Promise<{ name: string; code: string; codeSystem: string; description: string } | null> {
        try {
            // Buscando a alergia pelo ID
            const allergy = await this.allergyRepository.getAllergyById(allergyId);
            if (!allergy) return null;
            return allergy;
        } catch (error) {
            console.error('Error fetching allergy in service:', error);
            throw error;  // Lançando erro para ser tratado no controlador
        }
    }

    
}

export { AllergyService };
