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
import { DoctorUiComponent } from './components/doctor-ui/doctor-ui.component';
import { FilterRequestsComponent } from './components/filter-requests/filter-requests.component';
import { RegisterStaffComponent } from './components/register-staff/register-staff.component';
import { UpdateOperationRequestComponent } from './components/update-operation-request/update-operation-request.component';
import { EditPatientProfileAdminComponent } from './components/edit-patient-profile-admin/edit-patient-profile-admin.component';
import { CreateStaffAdminComponent } from './components/create-staff-admin/create-staff-admin.component';
import { EditStaffAdminComponent } from './components/edit-staff-admin/edit-staff-admin.component';
import { PlanningComponent } from './components/planning/planning.component';
import { DeleteOperationRequestComponent } from './components/remove-operation-doctor/remove-operation-doctor.component';
import { RemoveOperationTypeAdminComponent } from './components/remove-operation-type-admin/remove-operation-type-admin.component';


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
  { path: 'doctor-ui', component: DoctorUiComponent },
  { path: 'filter-requests', component: FilterRequestsComponent },
  { path: 'register-staff', component: RegisterStaffComponent },
  { path: 'update-operation-request', component: UpdateOperationRequestComponent },
  { path: 'edit-patient-profile-admin', component: EditPatientProfileAdminComponent },
  { path: 'create-staff-admin', component: CreateStaffAdminComponent },
  { path: 'edit-staff-admin', component: EditStaffAdminComponent },
  { path: 'planning', component: PlanningComponent },
  {path: 'create-staff-admin', component: CreateStaffAdminComponent},
  {path: 'edit-staff-admin', component : EditStaffAdminComponent},
  {path: 'remove-operation-doctor', component :DeleteOperationRequestComponent },
  {path: 'remove-operation-type-admin', component: RemoveOperationTypeAdminComponent},




  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Redirect to auth on app load
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
