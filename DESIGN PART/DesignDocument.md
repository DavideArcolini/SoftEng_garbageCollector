# Design Document

Authors:

Date:

Version:

# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
  - [Package Diagram](#package-diagram)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design

## Package Diagram

```plantuml
database it.polito.ezwh.data as EzWhData
package it.polito.ezwh.exceptions as EzWhExceptions
package it.polito.ezwh.model as EzWhModel
package it.polito.ezwh.gui as EZWhView
package it.polito.ezwh.controller as EZWhController

EzWhData -- EzWhModel
EzWhExceptions -left- EzWhModel
EZWhView -- EZWhController
EzWhModel -- EZWhController
```

We have implemented a MVC architecture:
- **EzWhModel**: manage the data of the application;
- **EZWhView**: manage the DOM and the interface of the application. We consider this package for granted;
- **EZWhController**: manage the interactions between model and view exploiting event listener and callbacks from the view.

<discuss architectural styles used, if any>
<report package diagram, if needed>
Description package here.
We use a MVC pattern because the user of EZWH application can modify data and, consequently, views has to change. Besides EZWH complies with the 3-tier pattern, since it manages data saved on the file system ("data" tier) via application functions ("application" tier) and a GUI ("presentation" tier).

# Low level design

<for each package in high level design, report class diagram. Each class should detail attributes and operations>

## it.polito.ezwh.controller

```plantuml
package it.polito.ezwh.controller{
  interface "DataImpl" as API{
    reset() : void
    
    -- SKU Management --
    getSKUs() : Array
    getSKUByID(ID : String) : Object
    createSKU(description: String, weight : number , volume: number, notes : String, price : number, availableQuantity : number) : Void
    modifySKU(ID: String, newDescription: String, newWeight: number, newVolume: number, newNotes: String, newPrice: number, newAvailableQuantity: number)
    updateSKUPosition(ID: number, positionID: String)
    
    -- SKUItem Management --
    getSKUItems() : Array
    getBySkuID(ID: String) : Object
    getByRFID(RFID: String) : Object
    createSkuItem(RFID: String, SKUID: number, DateOfStock: Date) : void
    modifySkuItem(newRFID: String, newAvailable: Boolean, newDateOfStock: Date) : void
    deleteSkuItem(RFID: String) : void

    -- TestResult Management --
    getTests() : Array
    getTestByRFID(RFID : number) : Object
    createTestResult(idTestDescriptor : number, Date : String, Result : boolean) : void
    modifyTestResult(newTestDescriptor : number, newDate : String, newResult : boolean) : void
    deleteTestResult(id : number) : void
    
    -- Position Management --
    getPositions() : Array
    createPosition(positionID : String, aisleID : String, row : String, col : String, maxWeight : number, maxVolume : number, occupiedWeight=0,occupiedVolume=0) : void
    modifyPosition(positionID: String, newAisleID : String, newRow : String, newCol : String, newMaxWeight : number, newMaxVolume : number, newOccupiedWeight : number, newOccupiedVolume : number) : void
    updatePID(positionID: String, newPositionId : String) : void
    deletePosition(positionID : String) : void
    
    -- Test Descriptor Management --
    getTestDescriptors() : Array
    getTestDescriptorByID(id : number) : Object
    createTestDescriptor(name : String, procedureDescription : String, idSKU : number) : void
    modifyTestDescriptor(id: number, newName : String, newProcedureDescription : String, newIdSKU : number) : void
    deleteTestDescriptor(id : number) : void

    -- User Management --
    getUserByID(ID : String) : Object
    getSuppliers() : Array
    getUsers() : Array
    createUser(ID : String, username : String, name : String, surname : String, type : String) : void
    login(username : String, password : String) : Object
    modifyUserPermissions(username: String, newType : String) : void
    deleteUser(username : String, type : String) : void
    
    -- Restock Order Management --
    getRestockOrders(void) : Array
    getRestockOrdersIssued(void) : Array
    getRestockOrderByID(ID: number) : Object
    getReturnItems(ID: number) : Array
    getSKUitems(ID: number) : Array
    createRestockOrder(issueDate : Date, products : Array, supplierID : number) : void
    modifyState( ID: number, newState : number) : void
    addItems(ID: number, items : List) : void
    addTransportNote( ID: number, transportNote : String ) : void
    setSkuItems(ID: number, skuItems: Array): Void
    deleteRestockOrder(ID : String) : void

    -- Return Order Management --
    getReturnOrders() : Array
    getReturnOrder(id : number) : Object
    createReturnOrder(returnDate : String, products : Array, restockOrderId : number) : void
    deleteReturnOrder(id : number) : void
    
    -- Internal Order Management --
    getInternalOrders(void) : Array
    getInternalOrdersIssued(void) : Array
    getInternalOrdersAccepted(void) : Array
    getInternalOrderByID(ID: number) : Object
    createInternalOrder(issueDate : Date, products : Array, customerID : number) : void
    modifyInternalOrder(newState : number, products : Array) : Array
    deleteInternalOrder(ID : number) : void
    
    -- Item Management --
    getItems() : Array
    getItemByID(ID: String) : Object
    createItem(ID: String, description : string, price : number, SKUId: String, supplierId : String) : void
    modifyItem(ID: String, description : string, price : number) : void
    deleteItem(ID : String) : void

  }
}
```

## it.polito.ezwh.model
N.B. All the classes are linked to the class `DataImpl`of `it.polito.ezwh.controller`

```plantuml
package it.polito.ezwh.model {
  top to bottom direction

  class DatabaseHelper {
    - databaseName: String
    - createConnection(): Connection
    - closeConnection(): Void
    - resetConnection(): Connection
    - createTable(): Void

    -- Load from DB --
    + loadItems(): Array
    + loadUsers(): Array
    + loadInternalOrders(): Array
    + loadRestockOrders(): Array
    + loadSKUs(): Array
    + loadSKUItems(): Array
    + loadTestDescriptors(): Array 
    + loadTestResults(): Array
    + loadPositions(): Array

    -- Store to DB --
    + storeItem(item: Item): Void
    + storeUser(user: User): Void
    + storeInternalOrder(order: InternalOrder): Void
    + storeRestockOrder(order: RestockOrder): Void
    + storeSKU(sku: SKU): Void
    + storeSKUItem(skuitem: SKUItem): Void
    + storeTestDescriptor(test: TestDescriptor): Void
    + StoreTestResult(test: TestResult): Void
    + StorePosition(position: Position): Void

    -- Update DB --
    + updateItem(item: Item): Void
    + updateUser(user: User): Void
    + updateInternalOrder(order: InternalOrder): Void
    + updateRestockOrder(order: RestockOrder): Void 
    + updateSKU(sku: SKU): Void
    + updateSKUItem(skuitem: SKUItem): Void
    + updateTestDescriptor(test: TestDescriptor): Void
    + updateTestResult(test: TestResult): Void
    + updatePosition(position: Position): Void
  }

  enum userType {
    SUPPLIER
    CUSTOMER
    CLERK
    MANAGER
    DELIVERY_EMPLOYEE
    QUALITY_EMPLOYEE
  }

  class User {
    + ID: number
    + name: String
    + surname: String
    + username: String
    + type: userType
  }

  class Item {
    + ID : String
    + description : String
    + price : number
    + SKUId: number
    + supplierID: number
  }

  enum enumState {
    ISSUED
    DELIVERY
    DELIVERED
    TESTED
    COMPLETED
    RETURN
    COMPLETED
  }

  class RestockOrder {
    + ID : String
    + issueDate: Date
    + state: enumState
    + products : Array
    + supplierID: number
    + transportNote: Array
    + skuItems: Array
    + returnItems: Array
  }

  class ReturnOrder {
    + ID : String
    + returnDate: Date
    + products : Array
    + restockOrderID: number
  }

  class Qty_per_Item {
    + qty: number
  }

  class SKU {
    + ID : number
    + description : String
    + weight: number
    + volume : number
    + price : number
    + notes : String
    + availableQuantity : number
    + position: String 
    + testDescriptors : Array<number>
  }

  class SKUItem {
    + RFID : String
    + Available : boolean
    + DateOfStock : String
    + SKUID: number
  }

  class TestDescriptor {
    + ID : String
    + name : String
    + procedureDescription : String
    + idSKU : number
  }

  class TestResult {
    + ID: number
    + RFID : String
    + idTestDescriptor: number
    + date : Date
    + result: boolean
  }

  class Position {
    + positionID : String
    + aisle : String
    + row : String
    + col : String
    + max_weight : number
    + max_volume : number
    + occupied_weight : number
    + occupied_volume : number
  }

  enum internalOrderState {
    ISSUED
    ACCEPTED
    REFUSED
    CANCELED
    COMPLETED
  }

  class InternalOrder {
    ID : number
    issueDate : Date
    state: internalOrderState
    customerID : number
    products : Array
  }
}

enumState "1"-- "1" RestockOrder
internalOrderState "1"--"1" InternalOrder
Qty_per_Item -- "*" Item
Qty_per_Item -- "*" RestockOrder
Qty_per_Item -- "*" InternalOrder
userType -- User

```

## it.polito.ezwh.exceptions

```plantuml
package it.polito.ezshop.exceptions {
    class "Exceptions" as E

    notLoggedInException -down-|> E
    unauthorizedAccessException -down-|> E
    internalServerErrorException -down--|> E
    serviceUnavailableException -down--|> E
    userConflictException -down---|> E

    nonExistingObjectException -up--|> E
    
    volumeConstraintException -up-|> E
    WeightConstraintException -up-|> E
    userConstraintException -up--|> E

    invalidRequestBodyException -down--|> E
    invalidOrderIDException -down-|> E
    invalidObjectIDException -down-|> E
    invalidOrderDateException -down--|> E 
}
```

# Verification traceability matrix

\<for each functional requirement from the requirement document, list which classes concur to implement it>

|| Warehouse | Supplier | Customer | Item | RestockOrder | ReturnOrder | InternalOrder | SKU | SKUitem | TestDescriptor | TestResult | Position |
|:--|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **FR1**: *manage users and rights* | X | X | X |||||||
| **FR2**: *manage SKU* | X ||||||| X | X ||X|
| **FR3**: *manage Warehouse* | X | X | ||||||| X | X | X |
| **FR4**: *manage internal customers* | X || X |||||
| **FR5**: *manage a restock order* | X | X | X | X | X | X || X | X | X | X |
| **FR6**: *manage internal orders* | X || X | X ||| X | X | X ||||
| **FR7**: *manage Items* | X | X || X |||| X | X |

# Verification sequence diagrams

\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>

DAVIDE
## **SC1.1**: *Create SKU*
```plantuml
actor Manager as Manager
participant EZWarehouse as EZWarehouse
participant DataImpl as DataImpl
participant SKU as SKU
participant DatabaseHelper as DatabaseHelper

Manager -> EZWarehouse: insert: SKU description
activate EZWarehouse
note right : EZWarehouse includes\n GUI and DataImpl
Manager -> EZWarehouse: insert: SKU weight
Manager -> EZWarehouse: insert: SKU volume
Manager -> EZWarehouse: insert: SKU notes
Manager -> EZWarehouse: confirm data

EZWarehouse -> DataImpl: createSKU()
activate DataImpl

DataImpl -> SKU: new SKU()
activate SKU

SKU --> DataImpl: return SKU: S
deactivate SKU

DataImpl -> DatabaseHelper: storeSKU(S)
activate DatabaseHelper

DatabaseHelper --> DataImpl: void 
deactivate DatabaseHelper

DataImpl --> EZWarehouse: return SKU: S 
deactivate DataImpl

EZWarehouse --> Manager: confirm
deactivate EZWarehouse
```

## **SC1.2**: *Modify SKU Location*
```plantuml


```

## **SC2.1**: *Create Position*
```plantuml


```

## **SC2.3**: *Modify weight and volume of Position*
```plantuml


```


RICCARDO
## **SC3.1**: *Restock Order of SKU S issued by quantity*
```plantuml

```
## **SC4.1**: *Create user and define rights*
```plantuml

```
## **SC5.1.1**: *Record restock order arrival*
```plantuml

```
## **SC5.2.1**: *Record positive test results of all SKU items of a RestockOrder*
```plantuml

```
SIMRAN
## **SC5.3.1**: *Stock all SKU items of a RO*

## SC6.1

## SC7.1

## SC9.1

PEPPE
## **SC9.3 : *Internal Order IO cancelled***

```plantuml
actor Customer

Customer -> GUI : add SKUs with qty (product)
activate GUI
GUI -> DataImpl: update positions
activate DataImpl
GUI <- DataImpl: positions
GUI -> DataImpl : createInternalOrder(issueDate, products, customerID)
GUI -> DataImpl : modifyPosition(params)
GUI <- DataImpl : void
deactivate GUI
DataImpl -> DatabaseHelper : 
DataImpl -> InternalOrder : InternalOrder(issueDate, products, customerID)
```

## **SC10.1: *Internal Order IO Completed***

```plantuml

```

## **SC11.1: *Create Item I***

```plantuml

```

## **SC12.1: *Create test description***

```plantuml
actor Manager
Manager -> GUI : insert name
Manager -> GUI : insert SKU id
Manager -> GUI : insert procedure description
Manager -> GUI : confirm inserted data
GUI -> DataImpl : createTestDescriptor(name, procedureDescription, idSKU)
activate DataImpl
DataImpl -> TestDescriptor : TestDescriptor(name, procedureDescription, idSKU) 
activate TestDescriptor
DataImpl <- TestDescriptor : test
deactivate TestDescriptor
DataImpl -> DatabaseHelper : storeTestDescriptor(test)
activate DatabaseHelper
DataImpl <- DatabaseHelper : void
deactivate DatabaseHelper
GUI <- DataImpl : void
deactivate DataImpl
```
