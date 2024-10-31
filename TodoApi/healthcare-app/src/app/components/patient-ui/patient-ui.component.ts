import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-ui',
  template: `
    <div class="patient-ui">
      <h1>Login Successful!</h1>
      <p>Welcome to the Patient Dashboard.</p>
    </div>
  `,
  styles: [`
    .patient-ui {
      text-align: center;
      margin-top: 50px;
    }
  `],
})
export class PatientUIComponent {}
