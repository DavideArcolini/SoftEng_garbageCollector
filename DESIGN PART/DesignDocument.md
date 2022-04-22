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

EzWh <-- GUI
EzWh <-- EzWhModel
EzWhData <-- EzWhModel
EzWhExceptions <-- EzWhModel
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

  interface "EZWarehouseInterface" as API{
    reset() : void
    -- SKU Management --
    getAll() : Array
    get(ID : String) : Object
    createSKU(description: String, weight : Integer , volume: Integer, notes : String, price : Float, availableQuantity : Integer) : void
    updateDimensions(weight : Integer, volume : Integer) : void
    
    -- SKUItem Management --
    getAll() : Array
    getBySkuID(ID: String) : Object
    getByRFID(RFID: String) : Object
    createSkuItem(RFID: String, SKUID: Integer, DateOfStock: Date) : void
    modify(newRFID: String, newAvailable: Boolean, newDateOfStock: Date) : void
    delete(RFID: String) : void
    getAllTests() : Array
    getTest(id : Integer) : Object
    createTestResult(idTestDescriptor : Integer, Date : String, Result : boolean) : void
    modifyTestResult(newTestDescriptor : Integer, newDate : String, newResult : boolean) : void
    deleteTestResult(id : Integer) : void
    
    -- Position Management --
    getAll() : Array
    createPosition(positionID : String, aisleID : String, row : String, col : String, maxWeight : Integer, maxVolume : Integer) : void
    modify(newAisleID : String, newRow : String, newCol : String, newMaxWeight : Integer, newMaxVolume : Integer, newOccupiedWeight : String, newOccupiedVolume) : void
    updatePID(newPositionId : String, aisleID : String, row : String, col : String) : void
    delete(positionID : String) : void
    
    -- Test Descriptor Management --
    getAll() : Array
    getByID(id : Integer) : Object
    create(name : String, procedureDescription : String, idSKU : Integer) : void
    modify(newName : String, newProcedureDescription : String, newIdSKU : Integer) : void
    delete(id : Integer) : void

    -- User Management --
    get(ID : String) : Object
    getAllSuppliers() : Array
    getAllUsers() : Array
    create(ID : String, username : String, name : String, surname : String, type : String) : void
    login(username : String, password : String) : Object
    modify(newType : String) : void
    delete(username : String, type : String) : void
    
    -- Restock Order Management --
    getAll(void) : Array
    getIssued(void) : Array
    getByID(ID: String) : Object
    getReturnItems(ID: String) : Array
    create(issueDate : Date, products : List, supplierID : Integer) : void
    modifyState( newState : Integer) : void
    addItems(items : List) : void
    addTransportNote( transportNote : String ) : void
    delete(ID : String) : void

    -- Return Order Management --
    getAll() : Array
    get(id : Integer) : Object
    create(returnDate : String, products : Array, restockOrderId : Integer) : void
    delete(id : Integer) : void
    
    -- Internal Order Management --
    getAll(void) : Array
    getIssued(void) : Array
    getAccepted(void) : Array
    getByID(ID: String) : Object
    create(issueDate : Date, products : List, customerID : Integer) : void
    modify(newState : Integer, products : Array) : Array
    delete(id : Integer) : void
    
    -- Item Management --
    getAll() : Array
    getByID(ID: String) : Object
    create(description : string, price : Integer, SKUId: String, supplierId : String) : void
    modify(description : string, price : Integer) : void
    delete(ID : String) : void

  }

}

package it.polito.ezwh.model {
  top to bottom direction

  class Warehouse {
    + suppliers: Array
    + customers: Array
    + items_list: Array
    + restock_orders: Array
    + return_orders: Array
    + internal_orders: Array
    + test_descriptors: Array
    + sku_list: Array
    + map: Array
  }
  
  class Supplier {
    + ID : String
    + name : String
  }

  class Customer {
    + ID : String
    + name : String
    + surname : String
  }

  class Item {
    + ID : String
    + description : String
    + price : Float
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
  }

  class ReturnOrder {
    + ID : String
    + returnDate: Date
  }

  class SKU {
    + ID : String
    + description : String
    + weight: Integer
    + volume : Integer
    + price : Float
    + notes : String
    + availableQuantity : Integer
  }

  class SKUItem {
    + RFID : String
    + Available : boolean
  }

  class TestDescriptor {
    + ID : String
    + name : String
    + procedureDescription : String
  }

  class TestResult {
    + ID : String
    + date : Date
    + result: boolean
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
  }

  enum internalOrderState {
    ISSUED
    ACCEPTED
    REFUSED
    CANCELED
    COMPLETED
  }

  class InternalOrder {
    date : Date
    from : String
    state: internalOrderState
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
| **FR2**: *manage SKU* | X ||||||| X | X |||
| **FR3**: *manage Warehouse* | X | X | ||||||||| X |
| **FR4**: *manage internal customers* | X || X |||||
| **FR5**: *manage a restock order* | X |||| X |||||
| **FR6**: *manage internal orders* | X |||||| X ||||
| **FR7**: *manage Items* | X ||| X ||||||








# Verification sequence diagrams 
\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>

