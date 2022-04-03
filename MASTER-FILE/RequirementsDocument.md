
# Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Internal/External | Role | Direct/Indirect | Description | 
| ----------------- |:-----------:|:-----------:|:-----------:|:-----------:|
| **Manager** of the warehouse | Internal | Primary | Direct | It is in charge of the management of the warehouse by supervising the availability of items inside the warehouse. |
| **Suppliers** | External | Secondary | Indirect | At the foundation of the supply chain, provides items to the warehouse when the manager requests it. |
| **Manager** of the company | External | Secondary | Indirect | CEO of the company the warehouse is a part of. |
| **Project team** | Internal | Primary | Direct | Develop and maintain the warehouse EZWH software application. |
| **Logistic transport unit** | External | Secondary | Indirect | Contributes to the supply chain by providing the necessary services to transport the items from the supplier to the warehouse. |
| **Quality assurance team** | Internal | Primary | Direct | Applies specific tests on random items in order to assure the quality standard established. |
| **Workers** | Internal | Primary | Direct | Work inside the warehouse, providing the management of items location and transport. |
| **Organizational units** of the company | Internal | Secondary | Indirect | May request items stored in the warehouse by means of internal orders. |
| **Financiers** | External | Secondary | Indirect | Bank or venture capital which finance the development and maintenance of the software. |
| **Competitors** | External | - | - | Other software applications which compete with EZWH. |
| **Customers** | External | Secondary | - | May request items stored in the warehouse by means of external orders. |
| **Web service provider / App Store** | External | - | - | Provides the infrastructure to sell the application to the managers of the warehouses. |
| **Analytics team** | Internal | Secondary | Direct | Provides useful data for better managing the project applications |
| **Cloud services** | External | - | Indirect | Provides servers to store useful data. |
| **Internal warehouse environment** | Internal | - | Direct |  |
| **Pick-up area** | - | - | - |  |
| **Government** | External | Secondary | Indirect | Law-related |
| **Security** | External | Secondary | Direct | Provides security services to the overall management |
| **Admin** | Internal | - | Direct | Provides IT management of the app |

# Context Diagram and interfaces

## Context Diagram
![context diagram](Context_Diagram.png)

## Interfaces
| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| :-----:|
| **Manager of the Warehouse** | Inventory, Supply Request | PC, Smartphone, Wifi connection |
| **Workers** | View Inventory, Insert items in inventory, Remove Items, Move Items in another position of the map | Scanner gun, Smartphone, Internet connection, Bar code, QR code |
| **Project Team** | Admin Permissions | PC, Smartphone, Internet Connection |
| **Customer** | Customer handler, inventory| PC, smartphone, internet connection |
| **Suppliers** | Supplier handler, inventory | PC, smartphone, internet connection |
| **Company Organizational Unit** | Inventory, Supply Request, Supply Management | PC, Smartphone, Internet Connection |
| **Quality Assurance Team** | Checklist for each item, List of items checked | Scanner Gun, QR Code, Bar Code, Smartphone, PC, internet connection |
| **Analytics Team** | Model data with charts | DBMS, PC, internet connection |
| **Admin** | Accounts management | DBMS, PC, smartphone, internet connection |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

| ID | Description |
| ------------- |:-------------:| 
| **FR 1** | User handling |
| --> FR 1.1 | Register a new user in the system |
| --> FR 1.2 | Delete an existing user from the system |
| --> FR 1.3 | Change user permissions |
| --> FR 1.4 | Authentication (Log-In) of users |
| **FR 2** | Orders handling |
| --> FR 2.1 | Manage internal orders |
| -- -- --> FR 2.1.1| Accept requests from workers to EZWH |
| -- -- --> FR 2.1.2 | Accept requests from Organizational Units to EZWH |
| -- -- -- -- --> FR 2.1.2.1 | Confirm the "deliver" item to pick up area |
| -- -- --> FR 2.1.3 | Accept requests from Manager to EZWH |
| -- -- --> FR 2.1.4 | Confirm or reject order delivered |
| --> FR 2.2 | Manage external orders |	
| -- -- --> FR 2.2.1| Accept requests from EZWH to Supplier |
| -- -- --> FR 2.2.2| Accept request from Customer to EZWH |
| -- -- --> FR 2.2.3| Confirm or reject order delivered |
| **FR 3** | Manage testing |
| --> FR 3.1 | Select test for specific item |	
| --> FR 3.2 | Execute quality test and do something |	
| -- -- --> FR 3.2.1| Test approved and item stored in the warehouse |
| -- -- --> FR 3.2.2| Test rejected and item stored in pickup area (?) |
| **FR 4** | Manage warehouse |
| --> FR 4.1 | Manage map environment |	
| -- -- --> FR 4.1.1| Create new environment |
| -- -- --> FR 4.1.2| Update an existing environment |
| -- -- --> FR 4.1.3| Delete an exiting environment |
| -- -- --> FR 4.1.4 | Show space availability in the map |
| --> FR 4.2 | Show items list |	
| --> FR 4.3 | Manage storage of the map |
| -- -- --> FR 4.3.1 | Store item in a certain area of the map | 
| -- -- --> FR 4.3.2 | Replace item in a certain area of the map |
| -- -- --> FR 4.3.3 | Remove item in a certain area of the map |
| **FR 5** | Pick-Up Area |
| --> FR 5.1 | Receive item from warehouse |	
| --> FR 5.2 | Check item as delivered at the pick up area |	



## Non Functional Requirements

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



# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        |  |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | \<Textual description of actions executed by the UC> |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2
..

### Use case x, UCx
..



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




