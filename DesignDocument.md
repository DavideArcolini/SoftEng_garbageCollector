# Design Document

**Authors**:
 * Riccardo Medina
 * Simran Singh
 * Davide Arcolini
 * Giuseppe Atanasio

**Date**: 25 May 2022

**Version**: `1.1`
| Version number | Change |
| ----------------- |:-----------|
| `1.0` | Added first version of Design document. | 
| `1.1` | Re-designed in according to the code `v1.0`. | 

# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
  - [Package Diagram](#package-diagram)
- [Low level design](#low-level-design)
  - [it.polito.ezwh.controller](#itpolitoezwhcontroller)
  - [it.polito.ezwh.model](#itpolitoezwhmodel)
  - [it.polito.ezwh.exceptions](#itpolitoezwhexceptions)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)
  - [**SC1.1**: *Create SKU*](#sc11-create-sku)
  - [**SC1.2**: *Modify SKU Location*](#sc12-modify-sku-location)
  - [**SC2.1**: *Create Position*](#sc21-create-position)
  - [**SC2.3**: *Modify weight and volume of Position*](#sc23-modify-weight-and-volume-of-position)
  - [**SC3.1**: *Restock Order of SKU S issued by quantity*](#sc31-restock-order-of-sku-s-issued-by-quantity)
  - [**SC4.1**: *Create user and define rights*](#sc41-create-user-and-define-rights)
  - [**SC5.1.1**: *Record restock order arrival*](#sc511-record-restock-order-arrival)
  - [**SC5.2.1**: *Record positive test results of all SKU items of a RestockOrder*](#sc521-record-positive-test-results-of-all-sku-items-of-a-restockorder)
  - [**SC5.3.1**: *Stock all SKU items of a RO*](#sc531-stock-all-sku-items-of-a-ro)
  - [**SC6.1** *Return order of SKU items that failed quality test*](#sc61-return-order-of-sku-items-that-failed-quality-test)
  - [**SC6.1** *Login*](#sc61-login)
  - [**SC9.1** *Internal Order IO accepted*](#sc91-internal-order-io-accepted)
  - [**SC9.3 : *Internal Order IO cancelled***](#sc93--internal-order-io-cancelled)
  - [**SC10.1: *Internal Order IO Completed***](#sc101-internal-order-io-completed)
  - [**SC11.1: *Create Item I***](#sc111-create-item-i)
  - [**SC12.1: *Create test description***](#sc121-create-test-description)

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

Here there are routers that calling models, called by the server.

## it.polito.ezwh.model
N.B. All the classes are linked to the class `DataImpl` of `it.polito.ezwh.controller`

```plantuml
package it.polito.ezwh.model {
  top to bottom direction

  class DAO {
    - db: Object sqlite.Database()

    -- Table creations --
    + newTableUsers(): void
    + newTablePositions(): void
    + newTableSKUS(): void
    + newTableSKUItems(): void
    + newTableTD(): void
    + newTableTR(): void
    + newTableI(): void
    + newTableRO(): void
    + newTableIO(): void
    + newTableRTO(): void

    -- Table deletions --
    + dropTableUsers(): void
    + dropTableRO(): void
    + dropTableIO(): void
    + dropTableRTO(): void
    + dropTableSKUS(): void
    + dropTablePositions(): void
    + dropTableSKUItems(): void
    + dropTableTD(): void
    + dropTableTR(): void
    + dropTableI(): void
  }

  enum userType {
    SUPPLIER
    CUSTOMER
    CLERK
    MANAGER
    DELIVERY_EMPLOYEE
    QUALITY_EMPLOYEE
  }

  class UserController {
    - types: Array
    - regex: Regex

    -- Methods --
    + newUser(): Number
    + getStoredUsers(): Array
    + getSuppliers(): Array
    + getUser(): Object
    + editUser(): Number
    + deleteUser(): Number
  }

  class ItemController {

    -- Methods --
    + getItems(): Array
    + getItemById(): Object
    + createItem(): Number
    + modifyItem(): Number
    + deleteItem(): Number
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

  class RestockOrderController {

    -- Methods --
    + createRestockOrder(): Number
    + getRestockOrders(): Array
    + getRestockOrdersIssued(): Array
    + getRestockOrderById(): Array
    + deleteRestockOrder(): Number
    + modifyRestockOrderState(): Number
    + setSkuItems(): Number 
  }

  class ReturnOrderController {

    -- Methods --
    + createReturnOrder(): Number
    + getReturnOrderById(): Object
    + getReturnOrders(): Array
    + deleteReturnOrder(): Number
  }



  class SKUController {

    -- Methods --
    + getStoredSKUs(): Array     
    + getStoredSKUById(): Object 
    + newSKU(): Object           
    + editSKU(): Object             
    + addOrEditPositionSKU(): Object
    + deleteSKU(): Object            
  }

  class SKUItemController {
    - getSKUitems(): Array
    - getSKUitemsBySKUId(): Object
    - getSKUitemsByRFID(): Array
    - newSKUitem(): Object
    - editSKUitem(): Object
    - deleteSKUitem(): Object
    
  }

  class TestDescriptorController {
    + getTestDescriptors() : Array
    + getTestDescriptorById() : Object
    + createTestDescriptor() : Number
    + modifyTestDescriptor() : Number
    + deleteTestDescriptor() : Number
  }

  class TestResultController {
    + getTestResults() : Array
    + getTestResultById() : Object
    + createTestResult() : Number
    + modifyTestResult() : Number
    + deleteTestResult() : Number
  }

  class PositionController {
    + getPositions() : Array
    + newPositions() : Object
    + editPosition() : Object
    + editPositionID() : Object
    + deletePosition() : Object
  }

  enum internalOrderState {
    ISSUED
    ACCEPTED
    REFUSED
    CANCELED
    COMPLETED
  }

  class InternalOrderController {

    -- Methods --
    + createInternalOrder(): Number
    + getInternalOrderById(): Object
    + getInternalOrders(): Array
    + getInternalOrdersIssued(): Array
    + getInternalOrdersAccepted(): Array
    + modifyInternalOrderState(): Number
    + deleteInternalOrder(): Number
  }
}

enumState "1"-- "1" RestockOrderController
internalOrderState "1"--"1" InternalOrderController
userType -- UserController
DAO -- InternalOrderController
DAO -- RestockOrderController
DAO -up- ItemController
DAO -- TestDescriptorController
DAO -- ReturnOrderController
DAO - SKUController
DAO -right- SKUItemController
DAO -left- TestResultController
DAO -up- PositionController
DAO -- UserController

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

|| EzWarehouse | UserController: Supplier | UserController: Customer | ItemController | RestockOrderController | ReturnOrderController | InternalOrderController | SKUController | SKUitemController | TestDescriptorController | TestResultController | PositionController |
|:--|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **FR1**: *manage users and rights* | X | X | X |||||||
| **FR2**: *manage SKU* | X ||||||| X | X ||X|
| **FR3**: *manage Warehouse* | X | X | ||||||| X | X | X |
| **FR4**: *manage internal customers* | X || X |||||
| **FR5**: *manage a restock order* | X | X | X | X | X | X || X | X | X | X |
| **FR6**: *manage internal orders* | X || X | X ||| X | X | X ||||
| **FR7**: *manage Items* | X | X || X |||| X | X |

# Verification sequence diagrams

## **SC1.1**: *Create SKU*

```plantuml
actor Manager as Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant SKU as SKU
participant DAO as DAO

group create SKU
group HTTP POST Request
Manager -> HTTPCalls: insert SKU description
activate HTTPCalls
Manager -> HTTPCalls: insert SKU weight
Manager -> HTTPCalls: insert SKU volume
Manager -> HTTPCalls: insert SKU notes
Manager -> HTTPCalls: confirm data
end

HTTPCalls -> EzWarehouse: createSKU(.json)
activate EzWarehouse
group creating SKU object
EzWarehouse -> SKU: new SKU(description, weight, volume, notes, price, availableQuantity)
activate SKU
SKU --> EzWarehouse: return SKU S
deactivate SKU
end

group Store SKU in database
EzWarehouse -> DAO: StoreSKU(S)
activate DAO
DAO --> EzWarehouse: Void
deactivate DAO
end

EzWarehouse --> HTTPCalls: return response.json
deactivate EzWarehouse
HTTPCalls --> Manager: 201 Created (success)
deactivate HTTPCalls
end
```

## **SC1.2**: *Modify SKU Location*

```plantuml
actor Manager as Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse

group Modify SKU Location
group HTTP GET Request
Manager -> HTTPCalls: insert SKU ID
activate HTTPCalls
end

group retrieve SKU by ID
HTTPCalls -> EzWarehouse: getSKUbyID(.json)
activate EzWarehouse
EzWarehouse --> HTTPCalls: return SKU S
EzWarehouse --> HTTPCalls: return Array of Position
deactivate EzWarehouse
end
HTTPCalls --> Manager: return response.json
deactivate HTTPCalls

Manager -> HTTPCalls: select new position
activate HTTPCalls
group update SKU position
HTTPCalls -> EzWarehouse: updateSKUPosition(.json)
activate EzWarehouse
EzWarehouse -> SKU: S.setPosition()
activate SKU
SKU --> EzWarehouse: return modified SKU
deactivate SKU
EzWarehouse -> Position: P.updateWeight()
activate Position
EzWarehouse -> Position: P.updateVolume()
Position --> EzWarehouse: return modified Position
deactivate Position

group update database
EzWarehouse -> DAO: updatePosition()
activate DAO
DAO --> EzWarehouse: void
EzWarehouse -> DAO: updateSKU()
DAO --> EzWarehouse: void
deactivate DAO
end
end
EzWarehouse --> HTTPCalls: response.json
deactivate EzWarehouse
HTTPCalls --> Manager: 200 OK (success)
deactivate HTTPCalls
end
```

## **SC2.1**: *Create Position*

```plantuml
actor Manager as Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant Position as Position
participant DAO as DAO

group create Position
group HTTP POST Request
Manager -> HTTPCalls: insert: PositionID
activate HTTPCalls
Manager -> HTTPCalls: insert: AisleID
Manager -> HTTPCalls: insert: Row number
Manager -> HTTPCalls: insert: Column number
Manager -> HTTPCalls: insert: Maximum weight value
Manager -> HTTPCalls: insert: Maximum volume value
Manager -> HTTPCalls: confirm data
end

HTTPCalls -> EzWarehouse: createPosition(.json)
activate EzWarehouse
group creating Position object
EzWarehouse -> Position: new Position(PositionID, AisleID, Row, Column, MaxWeight, MaxVolume)
activate Position
Position --> EzWarehouse: return Position P
deactivate Position
end

group Store position in database
EzWarehouse -> DAO: StorePosition(P)
activate DAO
DAO --> EzWarehouse: Void
deactivate DAO
end

EzWarehouse --> HTTPCalls: return response.json
deactivate EzWarehouse
HTTPCalls --> Manager: 201 Created (success)
deactivate HTTPCalls
end
```

## **SC2.3**: *Modify weight and volume of Position*

```plantuml
actor Manager as Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant Position as Position
participant DAO as DAO

group modify Position
group HTTP PUT Request
Manager -> HTTPCalls: HEADER: PositionID
activate HTTPCalls
Manager -> HTTPCalls: insert: new aisleID
Manager -> HTTPCalls: insert: new row number
Manager -> HTTPCalls: insert: new column number
Manager -> HTTPCalls: insert: new maximum weight value
Manager -> HTTPCalls: insert: new maximum volume value
Manager -> HTTPCalls: insert: new weight value
Manager -> HTTPCalls: insert: new volume value
Manager -> HTTPCalls: confirm data
end

HTTPCalls -> EzWarehouse: modifyPosition(.json)
activate EzWarehouse
note over EzWarehouse: retrieve Position P given PositionID

group modifying Position object
EzWarehouse -> Position: P.setPosition()
activate Position
Position --> EzWarehouse: return modified Position P
deactivate Position
end

group Store position in database
EzWarehouse -> DAO: StorePosition(P)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end

EzWarehouse --> HTTPCalls: return response.json
deactivate EzWarehouse
HTTPCalls --> Manager: '200 OK (success)'
deactivate HTTPCalls
end
```

## **SC3.1**: *Restock Order of SKU S issued by quantity*

```plantuml
actor Manager 
participant HTTPCalls
participant EzWarehouse
participant RestockOrder
participant DAO

group Create RestockOrder
group HTTP PUT request
Manager->HTTPCalls: Insert product
activate HTTPCalls
Manager->HTTPCalls: Insert quantity
end

HTTPCalls->EzWarehouse: getSuppliers(.json)
activate EzWarehouse
EzWarehouse->HTTPCalls: .json 
deactivate EzWarehouse

group HTTP PUT request
Manager->HTTPCalls: Select supplier
Manager->HTTPCalls: Confirm data
end

HTTPCalls->EzWarehouse: createRestockOrder(.json)
activate EzWarehouse

group Creating RestockOrder
EzWarehouse->RestockOrder: RestockOrder.new(.json)
RestockOrder-->EzWarehouse: return new RestockOrder RO
end

group Store RestockOrder in database
EzWarehouse->DAO: storeRestockOrder(object RO)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end

EzWarehouse-->HTTPCalls: return response .json
deactivate EzWarehouse
HTTPCalls-->Manager: 201 success
deactivate HTTPCalls
end
```

## **SC4.1**: *Create user and define rights*

```plantuml
actor Admin 
participant HTTPCalls
participant EzWarehouse
participant User
participant DAO

group create User
group HTPP put request
Admin->HTTPCalls: Insert ID
activate HTTPCalls
Admin->HTTPCalls: Insert name
Admin->HTTPCalls: Insert surname
Admin->HTTPCalls: Insert username
Admin->HTTPCalls: Insert type
Admin->HTTPCalls: Insert permission
Admin->HTTPCalls: Confirm data
end

HTTPCalls->EzWarehouse: createUser(.json)

group Creating user
activate EzWarehouse
EzWarehouse->User: User.newUser()
activate User
User-->EzWarehouse: Return new User U
deactivate User
end

group Store in database
EzWarehouse->DAO: storeUser(U)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end

EzWarehouse-->HTTPCalls: retunr response json
deactivate EzWarehouse
HTTPCalls-->Admin: 201 success
deactivate HTTPCalls
end
```
## **SC5.1.1**: *Record restock order arrival*
```plantuml
@startuml
actor Clerk 
participant HTTPCalls
participant EzWarehouse
participant SKUItem
participant DAO

group Record Restock Order Arrival
group HTTP PUT Request
Clerk->HTTPCalls: choose Restock order RO
activate HTTPCalls
end

group Taking Restock Orders
HTTPCalls->EzWarehouse:   getRestockorders(.json)
activate EzWarehouse
EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse
end

group HTTP PUT Request
Clerk->HTTPCalls: choose Restock order RO
end
group Loop Every Item
Clerk->HTTPCalls: choose item
HTTPCalls->EzWarehouse:   createSkuItem(.json)

group Cataloging SKUItem
EzWarehouse->SKUItem: SKUItem.New()
activate SKUItem
SKUItem-->EzWarehouse: return new SKUItem SK
deactivate SKUItem
end

group Store in database
EzWarehouse->DAO: storeSKUItem(SK)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end

EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse
end

EzWarehouse-->HTTPCalls: return json response
HTTPCalls->EzWarehouse: modifyRestockorder(.json)

group Changing Status
EzWarehouse->RestockOrder: RestockOrder.modifyState(DELIVERED)
activate RestockOrder
RestockOrder-->EzWarehouse: return Restock Order RO
deactivate RestockOrder
end

group Store in database
EzWarehouse->DAO: storeRestockOrder(RO)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end

EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse

HTTPCalls-->Clerk: 201 success
deactivate HTTPCalls
end
@enduml
```

## **SC5.2.1**: *Record positive test results of all SKU items of a RestockOrder*

```plantuml
actor QualityEmployee 
participant HTTPCalls
participant EzWarehouse
participant TestResult
participant RestockOrder
participant DAO

group Test Item in Restock Order
group HTTP PUT Request
QualityEmployee->HTTPCalls: choose to test restock order
activate HTTPCalls
end

group Taking Restock Orders
HTTPCalls->EzWarehouse:   getRestockorders()
activate EzWarehouse
EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse
end

group Taking tests
HTTPCalls->EzWarehouse: getTests()
EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse
end

group HTTP PUT Request
QualityEmployee->HTTPCalls: choose RestockOrder Ro
end

group Loop for every item
QualityEmployee ->HTTPCalls: Select item and test and give result
HTTPCalls->EzWarehouse: createTestResult(.json)
activate EzWarehouse

group Creating test result
EzWarehouse->TestResult: TestResult.New()
activate TestResult
TestResult-->EzWarehouse: return new TestResult TR
deactivate TestResult
end

group Store in database
EzWarehouse->DAO: storeTestResult(object TestResult)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end
end

EzWarehouse-->HTTPCalls: return json response
HTTPCalls->EzWarehouse: modifyRestockorder(.json)

group Changing Status
EzWarehouse->RestockOrder: RestockOrder.modifyState(TESTED)
RestockOrder-->EzWarehouse: return Restock Order RO
end

group Store in database
EzWarehouse->DAO: storeRestockOrder(RO)
activate DAO
DAO-->EzWarehouse: void
deactivate DAO
end

EzWarehouse-->HTTPCalls: return json response
deactivate EzWarehouse
HTTPCalls->QualityEmployee : 201 Success
deactivate HTTPCalls
end
```

## **SC5.3.1**: *Stock all SKU items of a RO*

```plantuml
group Stock all SKU items of a RO
actor Clerk
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant Position as Position
participant SKU as SKU
participant RestockOrder
participant DAO as DAO
group HTTPRequest PUT
Clerk -> HTTPCalls : select RFID
Clerk -> HTTPCalls : select RFID
Clerk -> HTTPCalls : select RFID
activate HTTPCalls
end


group for each RFID selected
group retrieve SKU
HTTPCalls -> EzWarehouse : getSKUItemByRFID(RFID)
activate EzWarehouse
HTTPCalls <- EzWarehouse : return SKUItem as SI
deactivate EzWarehouse
HTTPCalls->EzWarehouse: getSKUByID(SI.SKUId)
activate EzWarehouse
HTTPCalls <- EzWarehouse: return SKU as S
deactivate EzWarehouse
end

group update Position
HTTPCalls->EzWarehouse: getPositionById(S.position)
activate EzWarehouse
HTTPCalls<-EzWarehouse: Position as P
deactivate EzWarehouse
HTTPCalls->EzWarehouse: modifyPosition(.json)
activate EzWarehouse 
group modify Position object
EzWarehouse->Position:P.setPosition()
activate Position
EzWarehouse<-Position: return P modified
deactivate Position
end
group Store Position in database
EzWarehouse -> DAO: StorePosition(P)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end
EzWarehouse->HTTPCalls: return response.json
deactivate EzWarehouse
end

group update SKU's available quantity
HTTPCalls->EzWarehouse : modifySKU(.json)
activate EzWarehouse
group modify SKU object
EzWarehouse->SKU:S.setSKUQuantity()
activate SKU
EzWarehouse<-SKU: return S modified
deactivate SKU
end
group Store SKU in database
EzWarehouse -> DAO: StoreSKU(S)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end
activate EzWarehouse
EzWarehouse->HTTPCalls: return response.json
deactivate EzWarehouse
end


group update RO's state
HTTPCalls->EzWarehouse : modifyState( RO.id, enumState.COMPLETED) 
activate EzWarehouse
group modify RO object
EzWarehouse->RestockOrder:RO.setState()
activate RestockOrder
EzWarehouse<-RestockOrder: return RO modified
deactivate RestockOrder
end
group Store RO in database
EzWarehouse -> DAO: StoreRestockOrder(RO)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end
EzWarehouse->HTTPCalls: return response.json
deactivate EzWarehouse
end
end
HTTPCalls->Clerk: '201 Success'
deactivate HTTPCalls
end
```

## **SC6.1** *Return order of SKU items that failed quality test*

```plantuml
group Manage return order of SKU items
actor Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant SKUItem 
participant ReturnOrder
participant DAO as DAO

group HTTP Request GET
Manager -> HTTPCalls : insert RO.ID
activate HTTPCalls
end
HTTPCalls->EzWarehouse: getReturnItems(RO.ID)
activate EzWarehouse
HTTPCalls<-EzWarehouse: RI.RFID
deactivate EzWarehouse
deactivate HTTPCalls

group HTTP Request PUT
Manager -> HTTPCalls : select RFID  
Manager -> HTTPCalls : select RFID
Manager -> HTTPCalls : confirm 
activate HTTPCalls
end


group for each RFID selected
group update SKUItem availability
HTTPCalls -> EzWarehouse : getSKUItemByRFID(RFID)
activate EzWarehouse
HTTPCalls <- EzWarehouse : return SKUItem as SI
deactivate EzWarehouse
HTTPCalls->EzWarehouse: modifySkuItem(SI.RFID, False, undefined)
group modifying SKUItem object
EzWarehouse -> SKUItem: SI.setSKUItem()
activate SKUItem
SKUItem --> EzWarehouse: return modified SKUItem
deactivate SKUItem
end

group Store SKUItem in database
EzWarehouse -> DAO: StoreSKUItem(SI)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end

activate EzWarehouse
HTTPCalls <- EzWarehouse: return response.json
deactivate EzWarehouse
end
end
group create REO
HTTPCalls->EzWarehouse: createReturnOrder(today, products : Array, RO.ID) 
activate EzWarehouse
group create a new ReturnOrder
EzWarehouse->ReturnOrder: new ReturnOrder
activate ReturnOrder
EzWarehouse<-ReturnOrder: return ReturnOrder as REO
deactivate ReturnOrder
end 
group store REO 
EzWarehouse->DAO: storeReturnOrder(REO)
activate DAO
EzWarehouse<-DAO: void
deactivate DAO
end
HTTPCalls<-EzWarehouse: return response.json
deactivate EzWarehouse
end

HTTPCalls->Manager: '201 Success'
deactivate HTTPCalls

end
``` 

## **SC6.1** *Login*

```plantuml
group Login
actor User

group HTTP Request PUT
User -> HTTPCalls : insert username
User -> HTTPCalls : insert password
end 

activate HTTPCalls
HTTPCalls-> EzWarehouse : login(username, password)
activate EzWarehouse
HTTPCalls <- EzWarehouse : UserSession
deactivate EzWarehouse


deactivate HTTPCalls

HTTPCalls->User: return response.json
end
```


## **SC9.1** *Internal Order IO accepted*

```plantuml
group Internal Order IO accepted
actor Customer
actor Manager
participant HTTPCalls as HTTPCalls
participant EzWarehouse as EzWarehouse
participant SKUItem 
participant InternalOrder
participant Position
participant SKU
participant DAO as DAO


group Customer creates an InternalOrder
group HTTP Request PUT
Customer -> HTTPCalls : insert add SKU
Customer -> HTTPCalls : insert add quantity
Customer -> HTTPCalls : insert add SKU
Customer -> HTTPCalls : insert add quantity
end

group create IO

HTTPCalls->EzWarehouse: createInternalOrder(today, products , customer.ID) 
activate HTTPCalls
activate EzWarehouse
group create new InternalOrder
EzWarehouse->InternalOrder: new InternalOrder
activate InternalOrder
EzWarehouse<-InternalOrder: InternalOrder as IO
deactivate InternalOrder
end
group store IO
EzWarehouse->DAO: storeInternalOrder(IO)
activate DAO
EzWarehouse<-DAO: void
deactivate DAO
end

EzWarehouse->HTTPCalls: return response.json
deactivate EzWarehouse
group HTTPRequest PUT
Customer ->HTTPCalls : Confirm
end
HTTPCalls->EzWarehouse: modifyInternalOrder(ISSUED, IO.products)

group modifying InternalOrder object
EzWarehouse -> InternalOrder: IO.setInternalOrder()
activate InternalOrder
InternalOrder --> EzWarehouse: return modified IO
deactivate InternalOrder
end

group Store IO in database
EzWarehouse -> DAO: StoreInternalOrder(IO)
activate DAO
DAO --> EzWarehouse: return response.json
deactivate DAO
end

activate EzWarehouse
HTTPCalls<- EzWarehouse: '201 Success'
deactivate EzWarehouse
deactivate HTTPCalls
end
end

group for each SKU S ordered

group update Position
HTTPCalls->EzWarehouse: getPositionById(S.position)
activate EzWarehouse
HTTPCalls<-EzWarehouse: Position as P
deactivate EzWarehouse
HTTPCalls->EzWarehouse: modifyPosition(.json) 
activate EzWarehouse
group modifying Position object
EzWarehouse -> Position: P.setPosition()
activate Position
Position --> EzWarehouse: return modified Position P
deactivate Position
end

group Store position in database
EzWarehouse -> DAO: StorePosition(P)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end
EzWarehouse --> HTTPCalls: '201 Success'
deactivate EzWarehouse

group update SKU's available quantity
HTTPCalls->EzWarehouse : modifySKU(.json)
activate EzWarehouse
group modify SKU object
EzWarehouse->SKU:S.setSKUQuantity()
activate SKU
EzWarehouse<-SKU: return S modified
deactivate SKU
end
group Store SKU in database
EzWarehouse -> DAO: StoreSKU(S)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end
activate EzWarehouse
EzWarehouse->HTTPCalls: '201 Success'
deactivate EzWarehouse
deactivate EzWarehouse
end
end
end 

group manager confirms the order
group HTTPRequest PUT
Manager->HTTPCalls: confirm IO
activate HTTPCalls
end

HTTPCalls->EzWarehouse: modifyInternalOrder(ACCEPTED, IO.products)
group modifying InternalOrder object
EzWarehouse -> InternalOrder: IO.setInternalOrder
activate InternalOrder
InternalOrder --> EzWarehouse: return modified IO
deactivate InternalOrder
end

group Store IO in database
EzWarehouse -> DAO: StoreInternalOrder(IO)
activate DAO
DAO --> EzWarehouse: void
deactivate DAO
end



activate EzWarehouse
HTTPCalls<- EzWarehouse: 201 Success
deactivate EzWarehouse
deactivate HTTPCalls

end
end
```

## **SC9.3 : *Internal Order IO cancelled***

```plantuml
actor Customer as C
actor Manager as M

participant HTTPCalls as H
participant EzWarehouse as ezwh
participant InternalOrder as I
participant SKU as S
participant Position as P
participant DAO as DAO

C -> H : starts internal order
activate H
H -> ezwh : getSKUItems()
activate ezwh
ezwh -> H : 200 ok, items
deactivate ezwh
deactivate H

C -> H : create order
activate H
H -> ezwh : createInternalOrder(json)
activate ezwh
ezwh -> I : InternalOrder(json)
activate I
ezwh <- I : order
deactivate I
ezwh -> DAO : storeInternalOrder(order)
activate DAO
ezwh <- DAO : void
deactivate DAO

loop for each sku and relative position
ezwh -> S : sku.setAvailability()
activate S
S -> ezwh : void
deactivate S
ezwh -> P : position.setOccupation()
activate P
P -> ezwh : void
deactivate P
ezwh -> DAO : updateSKU(sku)
activate DAO
DAO -> ezwh : void
deactivate DAO
ezwh -> DAO : updatePosition(position)
activate DAO
DAO -> ezwh : void
deactivate DAO
end
ezwh -> H : 201 created
deactivate ezwh
deactivate H

M -> H : refuse order
activate H
H -> ezwh : modifyInternalOrder(params)
activate ezwh
ezwh -> DAO : updateInternalOrder(params)
activate DAO
ezwh <- DAO: void
deactivate DAO

loop for each sku and relative position, same operations as before
ezwh -> ezwh
end
deactivate ezwh
ezwh -> H : 200 OK
deactivate H
```

## **SC10.1: *Internal Order IO Completed***

```plantuml
actor DeliveryEmployee as D
participant HTTPCalls
participant EzWarehouse as ezwh
participant InternalOrder as I
participant SKUItem as S
participant DAO as DAO

D -> HTTPCalls : select internal order
activate HTTPCalls
HTTPCalls -> ezwh : getInternalOrder(params.id)
activate ezwh
ezwh -> HTTPCalls : response
deactivate ezwh
deactivate HTTPCalls

D -> HTTPCalls : retrieve rfid for each skuid
activate HTTPCalls

HTTPCalls -> ezwh : getBySKUId(params.id)
activate ezwh
ezwh -> HTTPCalls : skuitem
deactivate ezwh
deactivate HTTPCalls

D -> HTTPCalls : set skuitems as not available
activate HTTPCalls
loop for each skuitem
HTTPCalls -> ezwh : modifySKUitem(params)
activate ezwh
ezwh -> S : skuitem.setAvailability(0)
activate S
S -> ezwh : void
deactivate S
ezwh -> DAO : updateSKUItem(skuitem)
activate DAO
DAO -> ezwh : void
deactivate DAO
deactivate ezwh
ezwh -> HTTPCalls : 200 OK
deactivate HTTPCalls
end

D -> HTTPCalls : check internal order as COMPLETED
activate HTTPCalls
HTTPCalls -> ezwh : modifyInternalOrder(id,"COMPLETED",products)
activate ezwh
ezwh -> I : internalOrder.setState()
activate I
ezwh <- I : void
deactivate I
ezwh -> I : internalOrder.setProducts()
activate I
ezwh <- I : void
deactivate I
ezwh->DAO : updateInternalOrder(internalOrder)
activate DAO
DAO -> ezwh: void
deactivate DAO

ezwh -> HTTPCalls : 200 OK
deactivate ezwh
deactivate HTTPCalls
```

## **SC11.1: *Create Item I***

```plantuml
actor Supplier as S
participant HTTPCalls as H
participant EzWarehouse as ezwh
participant Item as I
participant DAO as DAO

S -> H : insert item description
S -> H : insert SKUid
S -> H : insert price
S -> H : confirm inserted data
activate H
H -> ezwh : createItem(params)

activate ezwh
ezwh -> I : new Item(params)
activate I
I -> ezwh : item
deactivate I
deactivate ezwh

ezwh -> DAO : storeItem(item)
activate DAO
activate ezwh
DAO -> ezwh : void
deactivate DAO
ezwh -> H : 201 created
deactivate ezwh
deactivate H
```

## **SC12.1: *Create test description***

```plantuml
actor Manager as M
participant HTTPCalls as H
participant EzWarehouse as ezwh
participant TestDescriptor as T
participant DAO as DAO

M -> H : insert name
M -> H : insert SKU id
M -> H : insert procedure description
M -> H : confirm inserted data
H -> ezwh : createTestDescriptor(name, procedureDescription, idSKU)
activate H
activate ezwh
ezwh -> T : TestDescriptor(name, procedureDescription, idSKU) 
activate T
ezwh <- T : test
deactivate T
ezwh -> DAO : storeTestDescriptor(test)
activate DAO
ezwh <- DAO : void
deactivate DAO
H <- ezwh : 201 Created
deactivate H
deactivate ezwh
```
