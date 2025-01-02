import { IRoom } from '../Models/Interfaces/RoomInterface';
import Room from '../Models/Room';

interface RoomData {
    name: string;
    type: string;
    capacity: number;
    location: string;
}

class RoomRepository {
    // Create a new room
    public async createRoom(data: RoomData): Promise<IRoom> {
        const existingRoom = await Room.findOne({ name: data.name });
        if (existingRoom) {
            throw new Error('A room with this name already exists');
        }
        const room = new Room(data);
        return await room.save();
    }

    // Find all rooms with selected fields
    public async findAllRooms(): Promise<Pick<IRoom, 'name' | 'type' | 'capacity' | 'location'>[]> {
        return await Room.find({}, 'name type capacity location -_id').exec();
    }
}

export { RoomRepository };
