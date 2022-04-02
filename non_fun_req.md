# Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
| NFR1 | Privacy | Confidential data should not be disclosed to non-authorized users. | User handling |
| NFR2 | Security | User data should be handled only by authorized users. | User handling |
| NFR3 | Efficiency | User creation performance <  | User handling |
| NFR4 | Efficiency | User deletion performance < | User handling |
| NFR5 | Efficiency | Permission management performance | User handling |
| NFR6 | Security | Authentication (Log in) of users | User activity |
| NFR7 | Efficiency | Perform items request <  | User activity |
| NFR7 | Usability | Users should be able to perform operations inside the system without encountering any issues. | User activity |
| NFR | Reliability | Mean Time Between Failures (MTBF) < 2 defect per user per year | Software | 
| NFR | Availability | Services provided by the software should work at least for 2 *nines* (i.e. $99\%$ of the time) | Software | 
| NFR | Robustness | Errors and failures of the system should not be perceived by users. | Software |
| NFR | Maintainability | Software updates should be performed with a MTTR < 6 hours. | Software |
| NFR | Durability | Software should be able to work properly for at least 10 years. | Software |
| NFR | Portability | Software must be able to work properly on **ALL** working stations inside the warehouse. Software should be able to work properly on **almost all** user devices. | Software |
| NFR | Easy of use | Training time ~ 1 day | Workers |
