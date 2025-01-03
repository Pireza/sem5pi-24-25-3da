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

    public async getAllergyById(allergyId: string): Promise<{ name: string; code: string; codeSystem: string; description: string } | null> {
        try {
            // Consulta no banco de dados usando o allergyId
            const allergy = await Allergy.findOne({ _id: allergyId }, 'name description code codeSystem').exec();
            
            // Se a alergia não for encontrada, retorna null
            if (!allergy) {
                return null;
            }

            return allergy;
        } catch (error) {
            console.error('Error fetching allergy in repository:', error);
            throw error; // Lançando o erro para ser tratado em camadas superiores (como no serviço)
        }
    }}

export { AllergyRepository };
