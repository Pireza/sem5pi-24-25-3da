import request from 'supertest';
import express from 'express';
import { MedicalConditionController } from '../src/controllers/MedicalConditionController';
import { MedicalConditionService } from '../src/services/MedicalConditionService';
import { MedicalConditionRepository } from '../src/repos/MedicalConditionRepository';

// Mock the MedicalConditionService class
jest.mock('../src/services/MedicalConditionService');

const mockAddMedicalCondition = MedicalConditionService.prototype.addMedicalCondition as jest.Mock;

const app = express();
app.use(express.json());

// Create instance of MedicalConditionController with the mocked MedicalConditionService
const medicalConditionRepository = new MedicalConditionRepository();
const medicalConditionController = new MedicalConditionController(new MedicalConditionService(medicalConditionRepository));
app.post('/api/createMedicalCondition', medicalConditionController.addMedicalCondition);

describe('POST /api/createMedicalCondition', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should successfully add a medical condition', async () => {
    // Arrange: Define the new medical condition object
    const newCondition = {
      code: 'C123',
      codeSystem: 'ICD-10',
      designation: 'Hypertension',
      description: 'A condition of high blood pressure',
      commonSymptoms: ['Headache', 'Dizziness'],
    };

    // Mock the addMedicalCondition method to resolve successfully
    mockAddMedicalCondition.mockResolvedValue(newCondition);

    // Act: Make the POST request to create the medical condition
    const response = await request(app)
      .post('/api/createMedicalCondition')
      .send(newCondition);

    // Assert: Check that the status code and response body are correct
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Medical condition added successfully');
    expect(response.body.data).toEqual(newCondition);
  });

  it('should return an error when medical condition code already exists', async () => {
    // Arrange: Define a medical condition object
    const existingCondition = {
      code: 'C123',
      codeSystem: 'ICD-10',
      designation: 'Hypertension',
      description: 'A condition of high blood pressure',
      commonSymptoms: ['Headache', 'Dizziness'],
    };

    // Mock the addMedicalCondition method to throw an error
    mockAddMedicalCondition.mockRejectedValue(new Error('A medical condition with this code already exists'));

    // Act: Make the POST request to create the medical condition
    const response = await request(app)
      .post('/api/createMedicalCondition')
      .send(existingCondition);

    // Assert: Check that the error message and status are correct
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('A medical condition with this code already exists');
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Arrange: Define a new medical condition object
    const newCondition = {
      code: 'C123',
      codeSystem: 'ICD-10',
      designation: 'Hypertension',
      description: 'A condition of high blood pressure',
      commonSymptoms: ['Headache', 'Dizziness'],
    };

    // Mock the addMedicalCondition method to throw an unexpected error
    mockAddMedicalCondition.mockRejectedValue(new Error('Unexpected error'));

    // Act: Make the POST request to create the medical condition
    const response = await request(app)
      .post('/api/createMedicalCondition')
      .send(newCondition);

    // Assert: Check that the status code is 500 and the error message is correct
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});


