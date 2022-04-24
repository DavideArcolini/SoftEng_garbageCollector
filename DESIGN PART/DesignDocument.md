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
package it.polito.ezwh as EzWh
package it.polito.ezwh.data as EzWhData
package it.polito.ezwh.exceptions as EzWhExceptions
package it.polito.ezwh.model as EzWhModel
package it.polito.ezwh.gui as GUI

EzWh <-left- GUI
EzWh <-- EzWhModel
EzWhData <-- EzWhModel
EzWhExceptions <-left- EzWhModel
EzWhData <-- GUI
```

<discuss architectural styles used, if any>
<report package diagram, if needed>
Description package here.
We use a MVC pattern because the user of EZWH application can modify data and, consequently, views has to change. Besides EZWH complies with the 3-tier pattern, since it manages data saved on the file system ("data" tier) via application functions ("application" tier) and a GUI ("presentation" tier).

# Low level design

<for each package in high level design, report class diagram. Each class should detail attributes and operations>

## it.polito.ezwh.data and it.polito.ezwh.model

```plantuml
package it.polito.ezwh.data {
  top to bottom direction

  interface "DataImpl" as API{
    reset() : void
    
    -- SKU Management --
    getSKUs() : Array
    getSKUByID(ID : String) : Object
    createSKU(description: String, weight : Integer , volume: Integer, notes : String, price : Float, availableQuantity : Integer) : Void
    updateSKUDimensions(ID : String, weight : Integer, volume : Integer) : void
    
    -- SKUItem Management --
    getSKUItems() : Array
    getBySkuID(ID: String) : Object
    getByRFID(RFID: String) : Object
    createSkuItem(RFID: String, SKUID: Integer, DateOfStock: Date) : void
    modifySkuItem(newRFID: String, newAvailable: Boolean, newDateOfStock: Date) : void
    deleteSkuItem(RFID: String) : void

    -- TestResult Management --
    getTests() : Array
    getTestByID(id : Integer) : Object
    createTestResult(idTestDescriptor : Integer, Date : String, Result : boolean) : void
    modifyTestResult(newTestDescriptor : Integer, newDate : String, newResult : boolean) : void
    deleteTestResult(id : Integer) : void
    
    -- Position Management --
    getPositions() : Array
    createPosition(positionID : String, aisleID : String, row : String, col : String, maxWeight : Integer, maxVolume : Integer, occupiedWeight=0,occupiedVolume=0) : void
    modifyPosition(newAisleID : String, newRow : String, newCol : String, newMaxWeight : Integer, newMaxVolume : Integer, newOccupiedWeight : Integer, newOccupiedVolume : Integer) : void
    updatePID(newPositionId : String) : void
    deletePosition(positionID : String) : void
    
    -- Test Descriptor Management --
    getTestDescriptors() : Array
    getTestDescriptorByID(id : Integer) : Object
    createTestDescriptor(name : String, procedureDescription : String, idSKU : Integer) : void
    modifyTestDescriptor(newName : String, newProcedureDescription : String, newIdSKU : Integer) : void
    deleteTestDescriptor(id : Integer) : void

    -- User Management --
    getUserByID(ID : String) : Object
    getSuppliers() : Array
    getUsers() : Array
    createUser(ID : String, username : String, name : String, surname : String, type : String) : void
    login(username : String, password : String) : Object
    modifyUser(newType : String) : void
    deleteUser(username : String, type : String) : void
    
    -- Restock Order Management --
    getRestockOrders(void) : Array
    getRestockOrdersIssued(void) : Array
    getRestockOrderByID(ID: String) : Object
    getReturnItems(ID: String) : Array
    createRestockOrder(issueDate : Date, products : List, supplierID : Integer) : void
    modifyState( newState : Integer) : void
    addItems(items : List) : void
    addTransportNote( transportNote : String ) : void
    deleteRestockOrder(ID : String) : void

    -- Return Order Management --
    getReturnOrders() : Array
    getReturnOrder(id : Integer) : Object
    createReturnOrder(returnDate : String, products : Array, restockOrderId : Integer) : void
    deleteReturnOrder(id : Integer) : void
    
    -- Internal Order Management --
    getInternalOrders(void) : Array
    getInternalOrderIssued(void) : Array
    getInternalOrderAccepted(void) : Array
    getInternalOrderByID(ID: Integer) : Object
    createInternalOrder(issueDate : Date, products : Array, customerID : Integer) : void
    modifyInternalOrder(newState : Integer, products : Array) : Array
    deleteInternalOrder(ID : Integer) : void
    
    -- Item Management --
    getItems() : Array
    getItemByID(ID: String) : Object
    createItem(description : string, price : Integer, SKUId: String, supplierId : String) : void
    modifyItem(description : string, price : Integer) : void
    deleteItem(ID : String) : void

  }

}

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

  class Warehouse {}

  enum userType {
    SUPPLIER
    CUSTOMER
    CLERK
    MANAGER
    DELIVERY_EMPLOYEE
    QUALITY_EMPLOYEE
  }

  class User {
    + ID: Integer
    + name: String
    + surname: String
    + username: String
    + type: userType
    
    -- Getters --
    + getID(): Integer
    + getName(): String
    + getSurname(): String
    + getUsername(): String
    + getUserType(): userType
    
    -- Setters --
    + setID(id: Integer): Void
    + setName(name: String): Void
    + setSurname(surname: String): Void
    + setUsername(username: String): Void
    + setUserType(usertype: userType): Void
  }

  class Item {
    + ID : String
    + description : String
    + price : Float
    -- Getters --
    + getID(): String
    + getDescription(): String
    + getPrice(): Float
    -- Setters --
    + setID(id: String): Void
    + setDescription(description: String): Void
    + setPrice(price: Float): Void
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
    -- Getters --
    + getID(): String
    + getIssueDate(): Date
    + getState(): enumState
    + getProducts() : Array
    -- Setters --
    + setID(id: String): Void
    + setIssueDate(issueDate: Date): Void
    + setState(state: enumState): Void
    + setProducts(products : Array) : Void
  }

  class ReturnOrder {
    + ID : String
    + returnDate: Date
    + products : Array
    -- Getters --
    + getID(): String
    + getReturnDate(): Date
    + getProducts() : Array
    -- Setters --
    + setID(id: String): Void
    + setReturnDate(returnDate: Date): Void
    + setProducts(products : Array) : Void
  }

  class SKU {
    + ID : String
    + description : String
    + weight: Integer
    + volume : Integer
    + price : Float
    + notes : String
    + availableQuantity : Integer
    --
    + getID() : Object
    + getDescription(): String
    + getWeight() : Integer
    + getVolume() : Integer
    + getPrice() : Float
    + getNotes() : String
    + isAvailable() : boolean
    --
    + setWeight(weight : Integer) : void
    + setVolume(volume : Integer) : void
  }

  class SKUItem {
    + RFID : String
    + Available : boolean
    + DateOfStock : String
    + SKUID: Integer
    --
    + getRFID() : Object
    + isAvailable() : boolean
    + getSKUId(): Integer
    --
    + setRFID(newRFID: String) : void
    + setAvailability(available : boolean) : void
    + setDate(dateOfStock : string) : void
    + setSKUID(SKUID: Integer): void
  }

  class TestDescriptor {
    + ID : String
    + name : String
    + procedureDescription : String
    + idSKU : Integer
    --
    + getID() : String
    + getName() : String
    + getProcedureDescription() : String
    + getSKUId() : Integer
    --
    + setName(name : String) : void
    + setProcedureDescription(procedureDescription : String) : void
    + setSKUId(idSKU : Integer) : void
  }

  class TestResult {
    + RFID : String
    + idTestDescriptor: Integer
    + date : Date
    + result: boolean
    --
    getRFID(): String
    getIDTestDescriptor(): Integer
    getDate(): String
    getResult(): boolean
    --
    + setDate(date : String) : void
    + setResult(result: boolean): void
  }

  class Position {
    positionID : String
    aisle : String
    row : String
    col : String
    + max_weight : Integer
    + max_volume : Integer
    + occupied_weight : Integer
    + occupied_volume : Integer 
    -- Getters --
    + getPositionID(): String
    + getAisle(): String
    + getRow(): String
    + getCol(): String
    + getMax_Weight : Integer
    + getMax_Volume : Integer
    + getOcuupied_Weight : Integer
    + getOccupied_Volume : Integer
    -- Setters --
    + setPositionID(poistionID : String): void
    + setAisle(aisleID : String): void
    + setRow(row: Integer): void 
    + setCol(col: Integer): void
    + setMax_Weight(maxWeight: Integer) : void
    + setMax_Volume(maxVolume : Integer) : void
    + setOcuupied_Weight(occupiedWeight : Integer) : void
    + setOccupied_Volume(occupiedVolume : Integer) : void
      
  }

  enum internalOrderState {
    ISSUED
    ACCEPTED
    REFUSED
    CANCELED
    COMPLETED
  }

  class InternalOrder {
    ID : Integer
    issueDate : Date
    state: internalOrderState
    customedID : Integer
    products : Array
     -- Getters --
    + getID(): String
    + getIssueDate(): Date
    + getState(): enumState
    + getCustomer() : Integer
    + getProducts() : Array
    -- Setters --
    + setID(id: String): Void
    + setIssueDate(issueDate: Date): Void
    + setState(state: enumState): Void
    + setCustomer(customerID: Integer): Void
    + setProducts(products : Array) : Void
  }
}

Warehouse -left- "*" Position
Warehouse - "*" Supplier
Warehouse -down- "*" Customer
Warehouse -down- "*" Item
Warehouse -down- "*" RestockOrder
Warehouse -down- "*" InternalOrder
Warehouse -down- "*" ReturnOrder
Warehouse -down- "*" TestDescriptor
Warehouse -down--- "*" SKU
Supplier -left- "*" Item : sells
Supplier -right- "*" RestockOrder
RestockOrder - "*" Item
RestockOrder - "0..1" ReturnOrder : refers
RestockOrder - "*" SKUItem
SKUItem "*" - "0..1" ReturnOrder
SKU - "*" SKUItem
SKU -right- "*" Item : corresponds to 
SKU "*" -up- "*" TestDescriptor
TestDescriptor - "*" TestResult
SKU "1" - "1" Position: must be placed in
InternalOrder -- "*" SKU
InternalOrder "0..1" - "*" SKUItem
SKUItem - "*" TestResult
SKUItem "*" - "0..1" Position
Customer - "*" InternalOrder : places
enumState "1"-up- "1" RestockOrder
internalOrderState "1"-up-"1" InternalOrder

API <|-- Warehouse : <<implements>>
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
actor Manager 
participant EzWarehouse
participant DataImpl
participant RestockOrder
participant DatabaseHelper
note over EzWarehouse: EzWarehouse contains Interface and GUI
Manager->EzWarehouse: Insert product
activate EzWarehouse
Manager->EzWarehouse: Insert quantity
EzWarehouse->DataImpl: getSuppliers()
activate DataImpl
DataImpl->EzWarehouse: array of objects 
deactivate DataImpl
Manager->EzWarehouse: Select supplier
Manager->EzWarehouse: Confirm data
EzWarehouse->DataImpl: createRestockOrder(issueDate, products, supplierID)
note over EzWarehouse: issueDate is autofilled by software
activate DataImpl
DataImpl->RestockOrder: RestockOrder(issueDate, products, supplierID)
RestockOrder->DataImpl: object RestockOrder
DataImpl->DatabaseHelper: storeRestockOrder(object RestockOrder)
activate DatabaseHelper
DatabaseHelper->DataImpl: void
deactivate DatabaseHelper
DataImpl->EzWarehouse: void
deactivate DataImpl
EzWarehouse->Manager: Confirmation of the insertion
deactivate EzWarehouse
```
## **SC4.1**: *Create user and define rights*
```plantuml
actor Admin 
participant EzWarehouse
participant DataImpl
participant User
participant DatabaseHelper
note over EzWarehouse: EzWarehouse contains Interface and GUI
Admin->EzWarehouse: Insert ID
activate EzWarehouse
Admin->EzWarehouse: Insert name
Admin->EzWarehouse: Insert surname
Admin->EzWarehouse: Insert username
Admin->EzWarehouse: Insert type
Admin->EzWarehouse: Insert permission
Admin->EzWarehouse: Confirm data
EzWarehouse->DataImpl: createUser(ID,username,name,surname,type)
activate DataImpl
DataImpl->User: User(ID,username,name,surname,type)
activate User
User->DataImpl: object User
deactivate User
DataImpl->DatabaseHelper: storeUser(object User)
activate DatabaseHelper
DatabaseHelper->DataImpl: void
deactivate DatabaseHelper
DataImpl->EzWarehouse: void
deactivate DataImpl
EzWarehouse->Admin: confirmation of the insertion
deactivate EzWarehouse
```
## **SC5.1.1**: *Record restock order arrival*
```plantuml
actor Clerk 
participant EzWarehouse
participant DataImpl
participant SKUItem
participant DatabaseHelper
note over EzWarehouse: EzWarehouse contains Interface and GUI
Clerk->EzWarehouse: Insert Item
activate EzWarehouse
EzWarehouse->DataImpl:   createSkuItem(RFID, SKUID, DateOfStock)
note over EzWarehouse: DateOfStock is autofilled by software
activate DataImpl
DataImpl->SKUItem: SkuItem(RFID, SKUID, DateOfStock)
activate SKUItem
SKUItem->DataImpl: object SkuItem
deactivate SKUItem
DataImpl->DatabaseHelper: storeSKUItem(object SKUItem)
activate DatabaseHelper
DatabaseHelper->DataImpl: void
deactivate DatabaseHelper
DataImpl->EzWarehouse: void
deactivate DataImpl
note over EzWarehouse: Repeat for all items
EzWarehouse->Clerk: Confirmation of the insertion
deactivate EzWarehouse
```
## **SC5.2.1**: *Record positive test results of all SKU items of a RestockOrder*
```plantuml
actor QualityEmployee 
participant EzWarehouse
participant DataImpl
participant TestResult
participant DatabaseHelper
note over EzWarehouse: EzWarehouse contains Interface and GUI
QualityEmployee ->EzWarehouse: Choose to test
activate EzWarehouse
EzWarehouse->DataImpl: getTests()
activate DataImpl
DataImpl->EzWarehouse: array of objects Test
deactivate DataImpl
QualityEmployee ->EzWarehouse: Select test and give result
EzWarehouse->DataImpl: createTestResult(idTestDescriptor, Date, Result) : void
activate DataImpl
DataImpl->TestResult: TestResult(idTestDescriptor, Date, Result)
activate TestResult
TestResult->DataImpl: Object TestResult
deactivate TestResult
DataImpl->DatabaseHelper: storeTestResult(object TestResult)
activate DatabaseHelper
DatabaseHelper->DataImpl: void
deactivate DatabaseHelper
note over EzWarehouse: Repeat for all test
DataImpl->DatabaseHelper: storeRestockOrder(object RestockOrder)
activate DatabaseHelper
DatabaseHelper->DataImpl: void
deactivate DatabaseHelper
DataImpl->EzWarehouse: void
deactivate DataImpl
EzWarehouse->QualityEmployee : Confirmation of the operations
deactivate EzWarehouse
```
SIMRAN
## **SC5.3.1**: *Stock all SKU items of a RO*

## SC6.1

## SC7.1

## SC9.1

PEPPE
## **SC9.3 : *Internal Order IO cancelled***

```plantuml

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

Manager -> EzWarehouse : insert name
Manager -> EzWarehouse : insert SKU id
Manager -> EzWarehouse : insert procedure description
Manager -> EzWarehouse : confirm inserted data
note over EzWarehouse : includes GUI and DataInterface
EzWarehouse -> DataImpl : createTestDescriptor(name, procedureDescription, idSKU)
activate EzWarehouse
activate DataImpl
DataImpl -> TestDescriptor : TestDescriptor(name, procedureDescription, idSKU) 
activate TestDescriptor
DataImpl <- TestDescriptor : test
deactivate TestDescriptor
DataImpl -> DatabaseHelper : storeTestDescriptor(test)
activate DatabaseHelper
DataImpl <- DatabaseHelper : void
deactivate DatabaseHelper
EzWarehouse <- DataImpl : void
deactivate DataImpl
deactivate EzWarehouse
```
