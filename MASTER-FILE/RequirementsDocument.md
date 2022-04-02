
 #Requirements Document 

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
\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Actor x..     |  |  |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

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
| --> FR 3.2 | Manage result test |	
| -- -- --> FR 3.2.1| Confirm order |
| -- -- --> FR 3.2.2| Reject order |
| **FR 4** | Manage warehouse |
| --> FR 4.1 | Manage map environment |	
| -- -- --> FR 4.1.1| Create new environment |
| -- -- --> FR 4.1.2| Update an existing environment |
| -- -- --> FR 4.1.3| Delete an exiting environment |
| --> FR 4.2 | Define areas |	
| --> FR 4.3 | Replace items in the area |	
| --> FR 4.4 | Show items list |	
| --> FR 4.4 | Show space availability |	
| **FR 5** | Pick-Up Area |
| --> FR 5.1 | Receive item from warehouse |	
| --> FR 5.2 | Check item as delivered at the pick up area |	




## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     |   |  | |
|  NFR2     | |  | |
|  NFR3     | | | |
| NFRx .. | | | | 


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




