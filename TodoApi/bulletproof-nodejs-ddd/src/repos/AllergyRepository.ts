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
    public async findAllAllergies(): Promise<Pick<IAllergy, 'name' | 'description' | 'patientId'>[]> {
        return await Allergy.find({}, 'name description patientId -_id').exec();
    }
}

export { AllergyRepository };
