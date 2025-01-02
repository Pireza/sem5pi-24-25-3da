import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path if needed
import { Room } from '../../Models/Room';  // Assuming you have a Room model
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-all-rooms',
  templateUrl: './get-all-rooms.component.html',
  styleUrls: ['./get-all-rooms.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class GetAllRoomsComponent implements OnInit {
  rooms: Room[] = []; // To store the list of rooms

  constructor(private roomService: AuthService) {}

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe(
      (response) => {
        console.log('Rooms data:', response); // Log the full response
        if (response && Array.isArray(response.data)) {
          this.rooms = response.data; // Extract the rooms array from the data property
        } else {
          console.error('Rooms data is not in the expected format:', response);
        }
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }
}
