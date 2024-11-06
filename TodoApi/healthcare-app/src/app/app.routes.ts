import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { PatientUIComponent } from './components/patient-ui/patient-ui.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component'; // Adjust the path as necessary
import { AdminUiComponent } from './components/admin-ui/admin-ui.component'; // Adjust the path as necessary
import { GetPatientProfilesComponent } from './components/get-patient-profiles/get-patient-profiles.component'; // Adjust the path as necessary
import { CreatePatientAdminComponent } from './components/create-patient-admin/create-patient-admin.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ListOperationTypesComponent } from './components/list-operation-types/list-operation-types.component';
import { AddOperationTypeComponent } from './components/add-operation-type/add-operation-type.component';
import { ListOperationRequestsComponent } from './components/list-operation-requests/list-operation-requests.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'patient-ui', component: PatientUIComponent },
  { path: 'registerClient', component: RegisterClientComponent },
  { path: 'update-profile', component: UpdateProfileComponent },
  { path: 'admin-ui', component: AdminUiComponent },
  { path: 'get-patient-profiles', component: GetPatientProfilesComponent },
  { path: 'create-patient-admin', component: CreatePatientAdminComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'list-operation-types', component: ListOperationTypesComponent },
  { path: 'add-operation-type', component: AddOperationTypeComponent },
  { path: 'list-operation-requests', component: ListOperationRequestsComponent },


  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Redirect to auth on app load
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
