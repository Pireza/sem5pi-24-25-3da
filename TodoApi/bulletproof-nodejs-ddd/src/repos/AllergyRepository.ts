import Allergy, {IAllergy} from '../Models/Allergy';

interface AllergyData {
    name: string;
    description: string;
    patientId: number;
}

class AllergyRepository {
    public async createAllergy(allergyData: AllergyData): Promise<IAllergy> {
        const allergy = new Allergy(allergyData);
        return await allergy.save();
    }
}

export { AllergyRepository };
