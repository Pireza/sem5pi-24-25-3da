import request from 'supertest';
import express from 'express';
import { AllergyController } from '../src/controllers/allergyController';
import { AllergyService } from '../src/services/AllergyService';
import { AllergyRepository } from '../src/repos/AllergyRepository';

// Mock the AllergyService class
jest.mock('../src/services/AllergyService');

const mockAddAllergy = AllergyService.prototype.addAllergy as jest.Mock;

const app = express();
app.use(express.json());

// Create instance of AllergyController with the mocked AllergyService
const allergyRepository = new AllergyRepository();
const allergyController = new AllergyController(new AllergyService(allergyRepository));
app.post('/api/createAllergy', allergyController.addAllergy);

describe('POST /api/createAllergy', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should successfully add an allergy', async () => {
    // Arrange: Define the new allergy object
    const newAllergy = {
      name: 'Peanut',
      code: 'A123',
      codeSystem: 'ICD-10',
      description: 'Peanut allergy',
    };

    // Mock the addAllergy method to resolve successfully
    mockAddAllergy.mockResolvedValue(newAllergy);

    // Act: Make the POST request to create the allergy
    const response = await request(app)
      .post('/api/createAllergy')
      .send(newAllergy);

    // Assert: Check that the status code and response body are correct
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Allergy added successfully');
    expect(response.body.data).toEqual(newAllergy);
  });

  it('should return an error when allergy code already exists', async () => {
    // Arrange: Define an allergy object
    const existingAllergy = {
      name: 'Peanut',
      code: 'A123',
      codeSystem: 'ICD-10',
      description: 'Peanut allergy',
    };

    // Mock the addAllergy method to throw an error
    mockAddAllergy.mockRejectedValue(new Error('An allergy with this code already exists'));

    // Act: Make the POST request to create the allergy
    const response = await request(app)
      .post('/api/createAllergy')
      .send(existingAllergy);

    // Assert: Check that the error message and status are correct
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('An allergy with this code already exists');
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Arrange: Define a new allergy object
    const newAllergy = {
      name: 'Peanut',
      code: 'A123',
      codeSystem: 'ICD-10',
      description: 'Peanut allergy',
    };

    // Mock the addAllergy method to throw an unexpected error
    mockAddAllergy.mockRejectedValue(new Error('Unexpected error'));

    // Act: Make the POST request to create the allergy
    const response = await request(app)
      .post('/api/createAllergy')
      .send(newAllergy);

    // Assert: Check that the status code is 500 and the error message is correct
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});
