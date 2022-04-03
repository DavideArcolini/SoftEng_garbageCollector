# Non Functional Requirements

\<Describe constraints on functional requirements>

| ID | Type (efficiency, reliability, ..) | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
| **NFR1.1** | Efficiency | User creation performance < 0.25 seconds | User handling |
| **NFR1.2** | Efficiency | User deletion performance < 0.25 seconds | User handling |
| **NFR1.3** | Efficiency | User permission changes performance < 0.1 seconds | User handling |
| **NFR1.4** | Efficiency | User authentication performance < 0.25 seconds | User handling |
| **NFR2.1** | Efficiency | Manage internal orders performance < 0.25 seconds | Request handling |
| **NFR2.2** | Efficiency | Manage external orders performance < 0.25 seconds | Request handling |
| **NFR3.1** | Efficiency | Select test for specific items performance < 0.25 seconds | Manage testing |
| **NFR3.2** | Efficiency | Manage result test performance < 0.25 seconds | Manage testing |
| **NFR4.1** | Efficiency | Manage map environment performance < 0.5 seconds | Manage map environment |
| **NFR4.1.4** | Efficiency | Show map environment performance < 1 second | Manage map environment |
| **NFR4.2** | Efficiency | Show items list performance < 0.25 seconds | Manage warehouse |
| **NFR4.3** | Efficiency | Manage storage performance < 0.25 seconds | Manage warehouse |
| **NFR5** | Efficiency | Manage pick-up area performance < 0.25 seconds | Pick-Up Area |
| **NFR1** | Privacy | Confidential data should not be disclosed to non-authorized users | User handling |
| **NFR1** | Security | User data should be handled only by authorized users | User handling |
| **NFR1** | Security | Authentication (Log in) of users should respect the industry standards | User activity |
| **NFR** | Usability | Users should be able to perform operations inside the system without encountering any issues | User activity |
| **NFR** | Usability | Users' interfaces should be user-friendly and easy to use | User activity |
| **NFR** | Reliability | Mean Time Between Failures (MTBF) < 2 defect per user per year | Software | 
| **NFR** | Availability | Services provided by the software should work at least for 2 *nines* (i.e. $99\%$ of the time) | Software | 
| **NFR** | Robustness | Errors and failures of the system should not be perceived by users | Software |
| **NFR** | Data integrity | System should be able to recover data in case of failures of the system | Software |
| **NFR** | Maintainability | Software updates should be performed with a MTTR < 6 hours. | Software |
| **NFR** | Durability | Software should be able to work properly for at least 10 years. | Software |
| **NFR** | Portability | Software must be able to work properly on **all** working stations inside the warehouse. Software should be able to work properly on **$99\%$** user devices. | Software |
| **NFR** | Easy of use | Training time for workers ~ 1 day | Workers |
