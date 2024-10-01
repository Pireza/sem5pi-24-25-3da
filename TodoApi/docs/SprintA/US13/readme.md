US 1005 - List all applications for a job opening.
Context
This is the documentation for this US.

Requirements
US 1005 As Customer Manager, I want to list all applications for a job opening.

Acceptance Criteria:

AC01 - The Customer Manager should be able to select the specific job opening for which they want to list
applications.

AC02 -The list of applications should include relevant details such as applicant name, contact information,
application date.

Analysis
To do the analysis we opted to use plant UML.![Domain Model](svg/domainModel.svg)

Design
4.1. Sequence Diagram
![Sequence Diagram](svg/us1005-sequence-diagram.svg)


Observations
In the class diagram option 4 for the agregates we decided for the job offer, to increase concurrence, to separate the
requirements and the
interview specifications into separate agregates sacrificing some of the transaction context.