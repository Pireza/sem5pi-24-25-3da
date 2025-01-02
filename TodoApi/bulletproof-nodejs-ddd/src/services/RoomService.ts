import { RoomRepository } from '../repos/RoomRepository';
import { IRoom } from '../Models/Interfaces/RoomInterface';

class RoomService {
    private roomRepository: RoomRepository;

    constructor(roomRepository: RoomRepository) {
        this.roomRepository = roomRepository;
    }

    // Add a new room
    public async addRoom(name: string, type: string, capacity: number, location: string): Promise<IRoom> {
        const data = { name, type, capacity, location };
        return await this.roomRepository.createRoom(data);
    }

    // Retrieve all rooms with selected fields
    public async getAllRooms(): Promise<{ name: string; type: string; capacity: number; location: string }[]> {
        return await this.roomRepository.findAllRooms();
    }
}

export { RoomService };
