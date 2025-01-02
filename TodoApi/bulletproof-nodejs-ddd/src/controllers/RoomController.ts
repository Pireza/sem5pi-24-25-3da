import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';

class RoomController {
    private roomService: RoomService;

    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }

    // Add a new room
    public addRoom = async (req: Request, res: Response): Promise<void | Response> => {
        try {
            const { name, type, capacity, location } = req.body;
            const room = await this.roomService.addRoom(name, type, capacity, location);

            return res.status(201).json({ message: 'Room added successfully', data: room });
        } catch (error) {
            if (error.message === 'A room with this name already exists') {
                return res.status(400).json({ error: error.message });
            } else {
                console.error('Error adding room:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };

    // List all rooms
    public listRooms = async (req: Request, res: Response): Promise<Response> => {
        try {
            const rooms = await this.roomService.getAllRooms();
            if (rooms.length === 0) {
                return res.status(404).json({ message: 'No rooms found.' });
            }
            return res.status(200).json({ data: rooms });
        } catch (error) {
            console.error('Error listing rooms:', error);
            return res.status(500).json({ message: 'Failed to list rooms.', error });
        }
    };
}

export { RoomController };
