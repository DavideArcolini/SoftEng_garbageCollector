
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
| --> FR 2.3 | Create a new pending order |	
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


## Use case 1 (UC1): user management
| Actors Involved |  |
| ------------- |:-------------| 
|  | Admin |
|  | Users |
|  Precondition     | System is ON. Users Database is reachable and in a reliable state. Admin is authenticated (UC2). |
|  Post condition     | User is registered or removed and granted permission. User Database is modified and in a reliable state.  |
|  Scenarios     |  |
|  | **Nominal (UC1.1)**: creation of a new user |
|  | **Nominal (UC1.2)**: deletion of an existing user |
|  | **Nominal (UC1.3)**: update of user permissions |

| **UC1.1** | *Creation of a new user* |
| ------------- |:-------------:| 
|  Pre-condition     | Admin should be logged-in. User should not be present in the system yet |
|  Post-condition     | User should be now registered in the system and being able to log in |
| **Step #** | **Description**  |
| 1 | Admin gets access to the internet |
| 2 | Admin opens EZWH Software |  
| 3 | Admin authentication (Scenario 1.4) |
| 4 | Admin provides user information |
| 5 | Admin grants user permission |
| 6 | Admin sends an email to the new user requesting to complete the registration with user credentials (i.e. password) |
| 7 | System insert user record in the database |
| 8 | User is registered in the system |

| **UC1.2** | *Removal of an existing user* |
| ------------- |:-------------:| 
|  Pre-condition     | Admin should be logged-in. User should be already present in the system |
|  Post-condition     | User should not be present anymore in the system and not able to log in |
| **Step #** | **Description**  |
| 1 | Admin gets access to the internet |
| 2 | Admin opens EZWH Software |  
| 3 | Admin authentication (Scenario 1.4) |
| 4 | Admin provides user information |
| 5 | System retrieves user record from the database |
| 6 | Admin confirm user deletion |
| 7 | User is removed from the system |

| **UC1.3** | *Update user permissions* |
| ------------- |:-------------:| 
|  Pre-condition     | Admin should be logged-in. User should be already present in the system |
|  Post-condition     | User permission should have changed |
| **Step #** | **Description**  |
| 1 | Admin gets access to the internet |
| 2 | Admin opens EZWH Software |  
| 3 | Admin authentication (Scenario 1.4) |
| 4 | Admin provides user information |
| 5 | System retrieves user record from the database |
| 6 | Admin provides new set of user permissions |
| 7 | System updates user record in the database |

## Use case 2 (UC2): user login
| Actors Involved |  |
| ------------- |:-------------| 
|  | Users |
|  Precondition     | System is ON. Users Database is reachable and in a reliable state. |
|  Post condition     | User is authenticated and granted permission.  |
|  Scenarios     |  |
|  | **Nominal (UC2.1)**: user authentication |
|  | **Variant (UC2.2)**: user authentication with credentials expired |
|  | **Exception (UC2.3)**: user authentication failed with wrong credentials |
|  | **Exception (UC2.4)**: user authentication failed - not authorized |

| **UC2.1** | *Authentication succeeded* |
| ------------- |:-------------:| 
|  Pre-condition     | User should be already registered in the system |
|  Post-condition     | User should be authenticated and authorized to perform properly operations on the system |
| **Step #** | **Description**  |
| 1 | User gets access to the internet |
| 2 | User opens EZWH Software |  
| 3 | User enters the login page |
| 4 | User provides credentials |
| 5 | System confirms authentication and grants permissions to the user |

| **UC2.2** | *Authentication succeeded with credentials expired* |
| ------------- |:-------------:| 
| Pre-condition | User should be already registered in the system |
| Post-condition | User should be authenticated and authorized to perform properly operations on the system and credentials should be updated in the database |
| **Step #** | **Description**  |
| 1 | User gets access to the internet |
| 2 | User opens EZWH Software |  
| 3 | User enters the login page |
| 4 | User provides credentials |
| 5 | System confirms authentication but asks for new credentials |
| 6 | User provides new credentials |
| 7 | System updates credentials in the database |
| 8 | System grants permissions to the user |

| **UC2.3** | *Authentication failed with wrong credentials* |
| ------------- |:-------------:| 
| Pre-condition | User should be already registered in the system |
| Post-condition | User should be authenticated and authorized to perform properly operations on the system |
| **Step #** | **Description**  |
| 1 | User gets access to the internet |
| 2 | User opens EZWH Software |  
| 3 | User enters the login page |
| 4 | User provides credentials |
| 5 | System recognizes user associated with that account but asks for correct credentials |
| 6 | User provides correct credentials |
| 8 | System grants permissions to the user |

| **UC2.4** | *Authentication failed, user not authenticated* |
| ------------- |:-------------:| 
| Pre-condition | User should not be registered in the system |
| Post-condition | User should not be authenticated and authorized to perform properly operations on the system |
| **Step #** | **Description**  |
| 1 | User gets access to the internet |
| 2 | User opens EZWH Software |  
| 3 | User enters the login page |
| 4 | User provides credentials |
| 5 | System recognizes that user is not associated with any accounts |
| 8 | System doesn't grant permissions to the user |



## Use case 3 (UC3): Warehouse management
| Actors Involved | Administrator, Manager |
| ------------- |:-------------|
|  Precondition     | System is ON. List of suppliers is available. Items database is reachable and in a reliable state. Items exists |
|  Post condition     | Items database is modified and in a reliable state. Orders list is updated. Order O exists |
| Nominal Scenario | Manager check items list. If a certain item is in short supply, he issues an order to a supplier. When the order arrives to the shop, Workers records order arrival |
|  Scenarios     |  |
|  | **Nominal (UC3.1)**: user creates order |
|  | **Nominal (UC3.2)**: user accept order request |
|  | **Nominal (UC3.3)**: user confirm order delivered |
|  | **Nominal (UC3.4)**: user create refund order |
|  | **Nominal (UC3.5)**: user sign an order as delivered |
|  | **Exception (UC3.6)**: items list is empty. Order cannot be performed |
|  | **Exception (UC3.7)**: supplier list is empty. Order cannot be performed |
| Variants 		 | Creation of order, Item I does not exist, issue warning |
|  | I has no location assigned when registering an order arrival, issue warning |

| **UC3.1** | *Create order to a supplier* |
| ------------- |:-------------:| 
|  Precondition     | Order O doesn't exists Manager M logged in |
|  Post condition     | Order O exists |
| **Steps #**        | **Description**  |
|  1     | M asks for items list to EZWH |  
|  2     | EZWH retrieves a list of items in short supply |
|  3     | M selects a specific I and its quantity |
|  4	 | EZWH retrieves a suppliers list for that specific I |
|  5	 | M selects a specific supplier for I |
|  6	 | M asks EZWH to create order |
|  7     | EZWH record a order in the order list marking it as ISSUED |

| **UC3.2** | *Accept Organisational Unit order* |
| ------------- |:-------------:| 
|  Precondition     | Order O in the internal orders list, Manager M authenticated, Order O marked as ISSUED in internal orders list |
|  Post condition     | O marked as ISSUED in orders list |
| **Steps #**        | **Description**  |
|  1     | M asks for internal orders to EZWH |  
|  2     | EZWH retrieves internal orders |
|  3     | User asks EZWH to confirm order in the internal orders list |
|  4     | EZWH marks internal order record as DELIVERED |

| **UC3.3** | *Confirm Order arrival* |
| ------------- |:-------------:| 
|  Precondition     | Order O exists in the orders list, O checked as DELIVERED, Manager M is authenticated |
|  Post condition     | O record signed as COMPLETED |
| **Steps #**        | **Description**  |
|  1     | M asks for orders list to EZWH |  
|  2     | EZWH retrieves orders list |
|  3     | M asks EZWH to confirm O in the orders list |
|  4     | EZWH asks M if shure to confirm |
|  5	 | M confirms |
|  6	 | EZWH signs O as COMPLETED |

| **UC3.4** | *Refund order* |
| ------------- |:-------------:| 
|  Precondition     | Item in refunds list, Manager M is authenticated |
|  Post condition     | Item moved from refund list to orders list |
| **Steps #**        | **Description**  |
|  1     | M asks for refund list to EZWH |  
|  2     | EZWH retrieves refund list |
|  3     | M select a refund record and asks EZWH to issue an order |
|  4	 | EZWH asks M if shure to confirm the order |
|  5 	 | M confirms | 
|  6 	 | EZWH create an order marked as REFUND |
|  7     | EZWH moves orders selected from refund list to order list |
|  8 	 | EZWH send a refund email to Supplier |

| **UC3.5** | *Deliver order* |
| ------------- |:-------------:| 
|  Precondition     | Item in orders list, Manager M is authenticated |
|  Post condition     | Item is marked as DELIVERED |
| **Steps #**        | **Description**  |
|  1     | M asks for orders list to EZWH |  
|  2     | EZWH retrieves orders list |
|  3     | M asks EZWH to deliver O in the orders list |
|  4     | EZWH asks M if shure to confirm |
|  5	 | M confirms |
|  6	 | EZWH signs O as DELIVERED |

| **UC3.6** | *Reject order due to lack of items* |
| ------------- |:-------------:| 
|  Precondition     | Items list is empty. User is authenticated. |
|  Post condition     | Order is rejected  |
| **Steps #**        | **Description**  |
|  1     | User asks for items list to EZWH |  
|  2     | EZWH retrieves empty items list |
|  3     | EZWH rejects the order |
|  4     | EZWH suggests to perform the order again later |

| **UC3.7** | *Reject order due to lack of suppliers* |
| ------------- |:-------------:| 
|  Precondition     | Items list is empty. Manager is authenticated. |
|  Post condition     | Order is rejected  |
| **Steps #**        | **Description**  |
|  1     | Manager asks for suppliers list to EZWH  |  
|  2     | EZWH retrieves empty suppliers list |
|  3     | EZWH rejects the order |
|  4     | EZWH suggests to update the suppliers list |


## Use case 4 (UC4): manage testing

| Actors Involved|  |
| ------------- |:-------------| 
|| Quality assurance office |
| Precondition     | The items whose quality is to be checked are in the list of the received items, user is authenticated |  
|  Post condition     | The items are put in the list of the items to be stored or in the refund list according to the result of the tests  |
|  Scenarios     |  |
|  | **Nominal (UC4.1)**: select tests for specific item |
|  | **Nominal (UC4.2)**: execute quality test |
|  | **Nominal (UC4.3)**: tests approved and list of the items to be stored updated |
|  | **Nominal (UC4.4)**: test rejected and refund list updated |
|  | **Exception (UC4.5)**: the item's quality cannot be checked due to some type's peculiarities that the system doesn't know how to treat |
| | **Variant (UC4.6)**: user asks EZWH to download the report |
| | **Variant (UC4.7)**: user asks EZWH to print the report |

| **UC4.1** | *Select test for specific item* |
| ------------- |:-------------:| 
| Pre-condition |  The items to be checked are in the received item's list , user is authenticated |
| Post-condition |  The test to be performed on the items are selected |
| **Steps #**        | **Description**   |
|  1     | User asks for items list whose quality is to be checked | 
|  2    | EZWH shows the list of the items received |  
|  3    | User select some of the items from the list  |
|  4    | For each item EZWH selects the tests to be performed according to the type of the item and displays them|
|  6    | User selects randomly some of the tests to be performed |
| 7 | EZWH shows the overall tests to be run|
| 8 | EZWH suggests the user to run the tests indicating the time that it will take |
| Exceptions| Unknown type to which there are no test implemented |

| **UC4.2** | *Execute quality test*  |
| ------------- |:-------------:| 
| Pre-condition | The tests to be performed on the items are selected , user is authenticated|
| Post-condition | The report of the tests is ready  |
| **Steps #**        |  **Description**   |
|  1     | User asks to run the tests |  
|  2     | EZWH runs the tests and it generates the report |
|  3     | User asks EZWH to display the report  |
|  4     | EZWH shows the report with the overall time that it took to perform the tests | 


| **UC4.3** | *Confirm order for approved items*  |
| ------------- |:-------------:| 
| Pre-condition |  The test's result is positive |
| Post-condition |  The items are put in the list of the items to be stored  |
| **Steps #**        |  **Description**   |
|  1     | User asks EZWH to the list of the items that passed the tests |  
|  2     | EZWH retrieves the list of the items that passed the quality tests |
|  3     | User asks EZWH to move the items whose quality is good in the list of the items to be stored |
|  3     | EZWH moves the items that passed the tests to the list of the items to be stored |


| **UC4.4** | *Discard order for rejected items* |
| ------------- |:-------------:| 
| Pre-condition |  Test's failure , user is authenticated |
| Post-condition |  The items are put in the refund list |
| **Steps #**        |  **Description**   |
|  1     | User asks EZWH to the list of the items that failed the tests |  
|  2     | EZWH retrieves the list of the items that failed tha quality tests |
|  3     | User asks EZWH to move the items to the refund list |
|  3     | EZWH moves the items that failed the tests to the list of the items to be sent back |

| **UC4.5** | *Unknown items type: quality check failed* |
| ------------- |:-------------:| 
| Pre-condition | Item is in the received orders list. Type of item is unknown. |
| Post-condition | Quality test is not performed |
| **Steps #**        |  **Description**   |
|  1     | User asks to run the tests |  
|  2     | EZWH fails to recognize items type |
|  3     | Quality test is not performed |
|  4     | EZWH suggests to update tests database |

| **UC4.6** | *User requests report of quality tests* |
| ------------- |:-------------:| 
| Pre-condition | Item is in the received orders list. Test has been performed correctly and result is available. |
| Post-condition | User is provided with the report. |
| **Steps #**        |  **Description**   |
|  1     | User asks EZWH  |  
|  2     |  |
|  3     |  |
|  4     |  |

## Use case 5 (UC5): map management
| Use case 5     |  |
| ------------- |:-------------|
| Actor ||
|| Administrator |
|| Manager warehouse |
|| Worker |
|  Precondition     | Warehouse exists |
|  Post condition     | Operation in warehouse is performed correctly |
|  Scenarios     |  |
|  | **Nominal (UC5.1)**: load map in the system |
|  | **Nominal (UC5.2)**: remove map from the system |
|  | **Nominal (UC5.3)**: manage storage in the map |
|  | **Nominal (UC5.4)**: show space availability |
|  | **Exception (UC5.5)**: map constraints not satisfied, reload map | 
|  | **Exception (UC5.6)**): map deletion failed |

| **UC5.1** | *Load map* |
| ------------- |:-------------:| 
|  Precondition     | Map is not in the system, Administrator is authenticated |
|  Post-condition   | Map is in the system |
|  **Steps #**     | **Description** |
|  1     | Administrator loads map file |
|  2     | EZWH controls type and file size |
|  3     | EZWH asks confirm about the changes |
|  4     | Administrator confirms or rejects the changes |
|  5     | EZWH saves the map file |

| **UC5.2** | *Remove map* |
| ------------- |:-------------:| 
|  Precondition     | Map is in the system, Administrator is authenticated |
|  Post-condition   | Map is not in the system anymore |
|  **Steps #**     | **Description** |
|  1     | Administrator asks to remove map file |
|  2     | EZWH retrieves map file |
|  3     | EZWH asks confirm about the removal |
|  4     | Administrator confirms or rejects the removal |
|  5     | EZWH removes map file if administrator confirms |

| **UC5.3** | *Update maps* |
| ------------- |:-------------:| 
|  Pre-condition     | Map is in the system, Administrator is authenticated |
|  Post-condition   | Map is updated |
|  **Steps #**     | **Description** |
|  1     | EZWH loads map file|
|  2     | Administrator modifies the map file |
|  3     | EZWH check constrains (type,size) |
|  4     | EZWH asks confirm about the changes |
|  5     | Administrator confirms or rejects the changes |
|  6     | EZWH saves the map file |


| **UC5.4** | *Show maps* |
| ------------- |:-------------:| 
|  Pre-condition     | Map file exist, Worker is authenticated |
|  Post-condition   | Space is showed|
|  **Steps #**     | **Description** |
|  1     | Worker asks for maps |
|  2     | EZWH loads the maps |
|  3     | EZWH shows the maps with the types of spaces|

| **UC5.5** | *Map constraints not satisfied, reload map* |
| ------------- |:-------------:| 
|  Pre-condition     | Administrator is authenticated. Map is not in the system |
|  Post-condition   | No changes to the map environment are performed |
|  **Steps #**     | **Description** |
|  1     | Admin loads a new map |
|  2     | EZWH checks map constraints |
|  3     | Map constraints are not satisfied |
|  4     | EZWH asks to reload the map |

| **UC5.6** | *Map deletion failed* |
| ------------- |:-------------:| 
|  Pre-condition     | Map file exist, Administrator is authenticated |
|  Post-condition   | No changes to the map environment are performed |
|  **Steps #**     | **Description** |
|  1     | Admin asks to remove the map|
|  2     | EZWH fails to remove the map |
|  3     | EZWH informs the administrator |


## Use case 6 (UC6): items management
| Use case 6     |  |
| ------------- |:-------------|
| Actor ||
|| Administrator |
|| Manager warehouse |
|| Worker |
|  Precondition     | Warehouse exists |
|  Post condition     | Operation in warehouse is performed correctly |
|  Scenarios     |  |
|  | **Nominal (UC6.1)**: show items list |
|  | **Nominal (UC6.2)**: store new item |
|  | **Nominal (UC6.3)**: remove existing item |
|  | **Exception (UC6.4)**: update item status | 


| **UC6.1** | *Shows item list*  |
| ------------- |:-------------:| 
|  Pre-condition     | Item list exists, User is authenticathed |
|  Post-condition   | list is showed |
|  **Steps #**     | **Description** |
|  1     | User asks for the list |
|  2     | EZWH loads and shows the list |

| **UC6.2** | *Store new item* |
| ------------- |:-------------:| 
|  Pre-condition     | Item is in the list, Worker is authenticated |
|  Post-condition   | Item position is saved in the list |
|  **Steps #**     | **Description** |
|  1     | Worker checks map file (UC5.4)|
|  2     | Worker chooses a position |
|  3     | Worker selects the item from the items list to add in that position|
|  4     | EZWH asks for confirm |
|  4     | Worker confirms the action to EZWH|
|  5     | EZWH adds the position on the items list |

| **UC6.3** | *Delete existing item* |
| ------------- |:-------------:| 
|  Pre-condition     | Item is in item list, Item has a position, Worker is authenticated |
|  Post-condition   | Item is deleted |
|  **Steps #**     | **Description** |
|  1     | Worker selects an item |
|  2     | Worker asks to delete the item|
|  3     | EZWH asks for confirm|
|  4     | Worker confirm the deletion|
|  5     | EZWH checks the position and frees the space in the map|
|  6     | EZWH deletes the item from the items list|

| **UC6.4** | *Update item status* |
| ------------- |:-------------:| 
|  Pre-condition     | Item is in item list. Worker is authenticated |
|  Post-condition   | Item status is changed |
|  **Steps #**     | **Description** |
|  1     | Worker selects an item |
|  2     | Worker checks the map |
|  3     | Worker defines a new status for the item |
|  4     | EZWH asks for confirm the new status|
|  5     | Worker confirms or rejects  |
|  6     | EZWH updates item status |

## Use case 7 (UC7): Manage Organisational Unit order
| Actors Involved | Administrator, Organisational Unit |
| ------------- |:-------------|
|  Precondition     | System is ON.Items database is reachable and in a reliable state. Items exists. Organisational Unit OU in the system |
|  Post condition     | Orders database is modified and in a reliable state. Orders list is updated. Order O exists |
| Nominal Scenario | Manager check items list. If a certain item is in short supply, he issues an order to a supplier. When the order arrives to the shop, Workers records order arrival |
|  Scenarios     |  |
|  | I has no location assigned when registering an order arrival, issue warning |

| **UC7.1** | *Create OU order* |
| ------------- |:-------------:| 
|  Pre-condition     | Item is in item list. OU is authenticated. |
|  Post-condition   | Order O in the internal orders list |
|  **Steps #**     | **Description** |
|  1     | OU asks for items list to EZWH |  
|  2     | EZWH retrieves a list of items |
|  3     | OU selects a specific I and its quantity |
|  6	 | OU asks EZWH to create order |
|  7     | EZWH record a order in the internal orders list marking it as ISSUED |

| **UC7.2** | *Confirm OU order arrival* |
| ------------- |:-------------:| 
|  Pre-condition     | Order O in the internal orders list. OU is authenticated. |
|  Post-condition   | Order O marked as COMPLETED |
|  **Steps #**     | **Description** |
|  1     | OU asks for delivered internal orders |
|  1     | EZWH retrieves internal orders marked as DELIVERED | 
|  3 	 | OU selects O
|  4	 | OU tells EZWH that order is arrived |
|  5 	 | EZWH marked internal order as COMPLETED |

# Glossary
![class diagram](Class_Diagram.png)

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 
![deployment diagram](Deployment_Diagram.png)




