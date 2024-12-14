import request from 'supertest';
import express from 'express';
import { AllergyController } from '../src/controllers/allergyController';
import { AllergyService } from '../src/services/AllergyService';
import { AllergyRepository } from '../src/repos/AllergyRepository';

// Mock the AllergyService class
jest.mock('../src/services/AllergyService');

const mockGetAllAllergies = AllergyService.prototype.getAllAllergies as jest.Mock;

const app = express();
app.use(express.json());

// Create instance of AllergyController with the mocked AllergyService
const allergyRepository = new AllergyRepository();
const allergyService = new AllergyService(allergyRepository);
const allergyController = new AllergyController(allergyService);
app.get('/api/getAllAllergies', (req, res) => allergyController.listAllergies(req, res));

describe('GET /api/getAllAllergies', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should return all allergies', async () => {
    // Arrange: Define a list of allergies
    const allergies = [
      { name: 'Peanut', code: 'A123', codeSystem: 'SNOMED', description: 'Peanut allergy' },
      { name: 'Milk', code: 'A124', codeSystem: 'SNOMED', description: 'Milk allergy' },
    ];

    // Mock the getAllAllergies method to return the list of allergies
    mockGetAllAllergies.mockResolvedValue(allergies);

    // Act: Make the GET request to retrieve all allergies
    const response = await request(app).get('/api/getAllAllergies');

    // Assert: Check that the status code and response body are correct
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(allergies);
  });

  it('should return a 404 if no allergies are found', async () => {
    // Arrange: Mock the getAllAllergies method to return an empty list
    mockGetAllAllergies.mockResolvedValue([]);

    // Act: Make the GET request to retrieve all allergies
    const response = await request(app).get('/api/getAllAllergies');

    // Assert: Check that the status code and message are correct
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No allergies found.');
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Arrange: Mock the getAllAllergies method to throw an error
    mockGetAllAllergies.mockRejectedValue(new Error('Unexpected error'));

    // Act: Make the GET request to retrieve all allergies
    const response = await request(app).get('/api/getAllAllergies');

    // Assert: Check that the status code and error message are correct
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to list allergies.');
  });
});
