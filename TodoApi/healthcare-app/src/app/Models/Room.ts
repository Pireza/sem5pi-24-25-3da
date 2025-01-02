export interface Room {
    _id: string;        // Assuming each room has a unique identifier (ID)
    name: string;       // The name of the room (e.g., "Room 101")
    type: string;       // The type of the room (e.g., "Consultation", "Surgery")
    capacity: number;   // The maximum capacity of the room (e.g., 10)
    location: string;   // The location of the room (e.g., "Building A, 2nd Floor")
  }
  