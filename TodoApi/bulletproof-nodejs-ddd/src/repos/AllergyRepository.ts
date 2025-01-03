import {IAllergy} from '../Models/Interfaces/AllergyInterface';
import Allergy from '../Models/Allergy';
interface AllergyData {
    name: string;
    description: string;
    code:string;
    codeSystem:string;
}

class AllergyRepository {

    public async createAllergy(allergyData: AllergyData): Promise<IAllergy> {
        const existingAllergy = await Allergy.findOne({ code: allergyData.code });
        if (existingAllergy) {
            throw new Error('An allergy with this code already exists');
        }    
        const allergy = new Allergy(allergyData); // Create the allergy
        return await allergy.save(); // Save allergy document without patientId if it's not passed
    }
    
    public async findAllAllergies(): Promise<Pick<IAllergy, 'name' | 'code' | 'codeSystem' | 'description' >[]> {
        return await Allergy.find({}, 'name description code codeSystem  -_id').exec();
    }    
    
    public async  findAllIdAllergies(): Promise<Pick<IAllergy, 'name' | 'code' | 'codeSystem' | 'description' >[]> {
        return await Allergy.find({}, 'name description code codeSystem').exec();
    }    
}

export { AllergyRepository };
