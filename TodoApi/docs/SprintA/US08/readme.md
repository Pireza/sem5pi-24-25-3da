US 08 - List all applications for a job opening.
Context
This is the documentation for this US.

Requirements
US 08 As an Admin, I want to create a new patient profile, so that I can register their
personal details and medical history.
Acceptance Criteria:

- Admins can input patient details such as first name, last name, date of birth, contact
information, and medical history.
- A unique patient ID (Medical Record Number) is generated upon profile creation.
- The system validates that the patient’s email and phone number are unique.
- The profile is stored securely in the system, and access is governed by role-based permissions

Design
Sequence Diagram
![Sequence Diagram](svg/us08-sequence-diagram.svg)

