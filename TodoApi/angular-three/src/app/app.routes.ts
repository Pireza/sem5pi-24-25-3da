// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CubeComponent } from './Cube/cube.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cube', pathMatch: 'full' },
  { path: 'cube', component: CubeComponent },
];
