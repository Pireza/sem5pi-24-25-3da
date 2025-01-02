import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-type-room',
  templateUrl: './create-type-room.component.html',
  styleUrls: ['./create-type-room.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class CreateRoomComponent {
  // Declare the properties for room creation
  name: string = '';
  type: string = '';
  capacity: number | null = null;
  location: string = '';

  // Initialize the rooms array
  rooms: any[] = [];

  // Method to create a new room
  createNewRoom() {
    // Only create a room if all required fields are provided
    if (this.name && this.type && this.capacity && this.location) {
      const newRoom = {
        name: this.name,
        type: this.type,
        capacity: this.capacity,
        location: this.location,
      };

      // Add the new room to the rooms array
      this.rooms.push(newRoom);

      // Reset the form fields after adding the room
      this.name = '';
      this.type = '';
      this.capacity = null;
      this.location = '';
    } else {
      alert('Please fill in all fields to create a new room.');
    }
  }
}
