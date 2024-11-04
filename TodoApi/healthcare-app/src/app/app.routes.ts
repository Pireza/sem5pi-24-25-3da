import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { PatientUIComponent } from './components/patient-ui/patient-ui.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'patient-ui', component: PatientUIComponent },
  { path: 'registerClient', component: RegisterClientComponent},
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Redirect to auth on app load
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
