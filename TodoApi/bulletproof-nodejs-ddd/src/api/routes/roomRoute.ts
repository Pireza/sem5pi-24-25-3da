import express from 'express';
import { RoomController } from '../../controllers/RoomController';
import { RoomService } from '../../services/RoomService';
import { RoomRepository } from '../../repos/RoomRepository';

const router = express.Router();

// Instantiate the repository, service, and controller for rooms
const roomRepository = new RoomRepository();
const roomService = new RoomService(roomRepository);
const roomController = new RoomController(roomService);

// Define the routes for room management
router.post('/api/createRoom', roomController.addRoom);
router.get('/api/getAllRooms', (req, res) => roomController.listRooms(req, res));

console.log('Room routes loaded');


export default router;
