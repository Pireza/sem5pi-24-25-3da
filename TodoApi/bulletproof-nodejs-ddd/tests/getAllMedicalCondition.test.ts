import request from 'supertest';
import express from 'express';
import { MedicalConditionController } from '../src/controllers/MedicalConditionController';
import { MedicalConditionService } from '../src/services/MedicalConditionService';
import { MedicalConditionRepository } from '../src/repos/MedicalConditionRepository';

// Mock the MedicalConditionService class
jest.mock('../src/services/MedicalConditionService');

const mockGetAllMedicalConditions = MedicalConditionService.prototype.getAllMedicalConditions as jest.Mock;

const app = express();
app.use(express.json());

// Create instance of MedicalConditionController with the mocked MedicalConditionService
const medicalConditionRepository = new MedicalConditionRepository();
const medicalConditionService = new MedicalConditionService(medicalConditionRepository);
const medicalConditionController = new MedicalConditionController(medicalConditionService);
app.get('/api/getAllMedicalConditions', (req, res) => medicalConditionController.listMedicalConditions(req, res));

describe('GET /api/getAllMedicalConditions', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should return all medical conditions', async () => {
    // Arrange: Define a list of medical conditions
    const conditions = [
      { code: 'C001', codeSystem: 'ICD-10', designation: 'Condition A', description: 'Description A', commonSymptoms: ['Symptom 1'] },
      { code: 'C002', codeSystem: 'ICD-10', designation: 'Condition B', description: 'Description B', commonSymptoms: ['Symptom 2'] },
    ];

    // Mock the getAllMedicalConditions method to return the list of conditions
    mockGetAllMedicalConditions.mockResolvedValue(conditions);

    // Act: Make the GET request to retrieve all medical conditions
    const response = await request(app).get('/api/getAllMedicalConditions');

    // Assert: Check that the status code and response body are correct
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(conditions);
  });

  it('should return a 404 if no medical conditions are found', async () => {
    // Arrange: Mock the getAllMedicalConditions method to return an empty list
    mockGetAllMedicalConditions.mockResolvedValue([]);

    // Act: Make the GET request to retrieve all medical conditions
    const response = await request(app).get('/api/getAllMedicalConditions');

    // Assert: Check that the status code and message are correct
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No medical conditions found.');
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Arrange: Mock the getAllMedicalConditions method to throw an error
    mockGetAllMedicalConditions.mockRejectedValue(new Error('Unexpected error'));

    // Act: Make the GET request to retrieve all medical conditions
    const response = await request(app).get('/api/getAllMedicalConditions');

    // Assert: Check that the status code and error message are correct
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to list medical conditions.');
  });
});
