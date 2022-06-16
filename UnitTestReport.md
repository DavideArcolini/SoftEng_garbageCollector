# Unit Testing Report

**Authors**:
 * Riccardo Medina
 * Simran Singh
 * Davide Arcolini
 * Giuseppe Atanasio

**Date**: 08 June 2022

**Version**: `1.0`

| Version number | Change |
| ----------------- |:-----------|
| 1.0 | Added first version of Unit Test Report document. |
| 1.1 | Modifications due to the separation in Controllers and DAOs |
| 2.0 | Remodeled unit tests |

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)

- [White Box Unit Tests](#white-box-unit-tests)

# Black Box Unit Tests

- [Class UserDAO](#class-userdao)
- [Class PositionDAO](#class-positiondao)
- [Class SKUitemDAO](#class-skuitemdao)
- [Class SKUDAO](#class-skudao)
- [Class InternalOrderDAO](#class-internalorderdao)
- [Class ItemDAO](#class-itemdao)
- [Class RestockOrderController](#class-restockordercontroller)
- [Class ReturnOrderController](#class-returnordercontroller)
- [Class TestDescriptorDAO](#class-testdescriptordao)
- [Class TestResultDAO](#class-testresultdao)

## **Class UserDAO**

### **Class *UserDAO* - method *createUser***

**Criteria for method *createUser*:**

- req is not empty
- `username` is *unique* in the database

**Predicates for method *createUser*:**

| Criteria | Predicate |
| -------- | --------- |
| req not empty |Valid|
|          | undefined |
| `username` is *unique* in the database | True |
|          | False |
|          | undefined |

**Combination of predicates**:

| req not empty | `username` is *unique* in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Valid | True | Valid | `testNewUser()` terminates correctly | `function`<br>testNewUser("user ok", { <br>username : "clerk1@ezwh.com",<br>name: "Donald",<br>surname: "Trump",<br>type: "clerk",<br>password: "testpassword"<br>}, undefined)|
| Valid | False | Invalid | `testNewUser()` throws `Error` | `function`<br>testNewUser("user ok", { <br>username : "clerk1@ezwh.com",<br>name: "Donald",<br>surname: "Trump",<br>type: "clerk",<br>password: "testpassword"<br>}, `Error`) |
| undefined | undefined | Invalid | `testNewUser()` throws `Error` | `function`<br>testNewUser("failed", undefined, `Error`)|

### **Class *UserDAO* - method *getUser***

**Criteria for method *getUser*:**

- `username` is *unique* in the database
- Password valid
- req not empty

**Predicates for method *getUser*:**

| Criteria | Predicate |
| -------- | --------- |
| `username` is *unique* in the database | True |
|          | False |
|          | undefined |
| `password` valid | Yes |
|          | No |
|| undefined |
| req not empty | Valid |
|| undefined |

**Combination of predicates**

User already exists in the db:

```
{ 
    username: "mj@ezwh.com", 
    name: "Mary",
    surname: "Jane",
    password: "testpassword",
    type: "supplier"
}
```

| `username` is *unique* in the database | `password` valid | req not empty | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| True | Yes | Yes | Valid | `testGetUser()` terminates returning the exact expected value | `function`<br>testGetUser("login", {username : user.username,<br> type: user.type}, <br>{id:1, <br>username: user.username, <br>name: user.name}) |
| True | Yes | Yes | Valid | `testGetUser()` terminates returning the exact expected value | `function`<br>testGetUser("get user", {username: user.username}, <br>{id:1, <br>username: user.username, <br>name: user.name}) |
| True | Undefined | No | Invalid | `testGetUser()` throws `Error` | `function`<br>testGetUser("failed", undefined, `Error`) -> failed|

### **Class *UserDAO* - method *modifyPermissions***

**Criteria for method *modifyPermissions*:**

- `username` exists in the database
- `req` not empty

**Predicates for method *modifyPermissions*:**

| Criteria | Predicate |
| -------- | --------- |
| `username` exists in the database | True |
|          | False |
|          | undefined |
| req not empty | Yes |
|          | No |
||undefined|
**Combination of predicates**:

| `username` exists in the database | req not empty | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| True | Yes | Valid | `testModifyPermissions()` retrieve the exact value expected | `function`<br>testModifyPermissions('modified successfully', <br>{username: user.username, <br>oldType: user.type, <br>newType: "clerk"}, <br>{id:1}) |
| False | Yes | Invalid | `testModifyPermissions()` terminates with `undefined` | `function` testModifyPermissions('modification failed', {}, undefined) |
| False | No | Invalid | `testModifyPermissions()` throws `Error` | `function` testModifyPermissions('modification failed', undefined, `Error`) |

### **Class *UserDAO* - method *removeUser***

**Criteria for method *removeUser*:**

- `req` not empty

**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
| `req` not empty | True |
|| False |

**Combination of predicates**:

User already inserted:
```
{ 
    username: "mj@ezwh.com", 
    name: "Mary",
    surname: "Jane",
    password: "testpassword",
    type: "supplier"
}
```

| `req` is not empty | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| True  | Valid | `testRemoveUser()` terminates successfully | `function`<br> testRemoveUser("remove successfully", {<br> username: "mj@ezwh.com", <br> type: "supplier"}, <br> undefined)|+
| False | Invalid | `testRemoveUser()` throws `Error` | `function`<br>testRemoveUser("failed", undefined, Error) |


## **Class PositionDAO**
### **Class *PositionDAO* - method *getPositions()***
**Criteria for method *getPositions()*:**
 - Database is reachable

**Predicates for method *getPositions()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testGetPositions_REAL()` receives an `Array` object of positions and **passes the test**|`function` <br>`testGetPositions_REAL(testName, expectedResult)`|
|*false*|invalid|`testGetPositions_REAL()` catches `Error` and **fails the test**|`function` <br>`testGetPositions_REAL(testName, expectedResult)`|


### **Class *PositionDAO* - method *getPositionByID()***
**Criteria for method *getPositionByID()*:**
 - Database is reachable

**Predicates for method *getPositionByID()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testGetPositionByID_REAL()` receives position object corresponding to `positionID` and **passes the test**|`function` <br>`testGetPositionByID_REAL(testName, positionID, expectedResult)`|
|*false*|invalid|`testGetPositionByID_REAL()` catches `Error` and **fails the test**|`function` <br>`testGetPositionByID_REAL(testName, positionID, expectedResult)`|

### **Class *PositionDAO* - method *newPosition()***
**Criteria for method *newPosition()*:**
 - Database is reachable
 - `positionID` is *unique* in the database

**Predicates for method *newPosition()*:**
| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `positionID` is *unique* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`positionID` is *unique* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*| valid |`testNewPosition_REAL()` receives the last `positionID` and **passes the test** |`function` <br>`testNewPosition_REAL(testName, positionObject, expectedResult)`|
| *true* |*false*| invalid |`testNewPosition_REAL()` catches `Error` and **fails the test**|`function` <br>`testNewPosition_REAL(testName, positionObject, expectedResult)`|
| *false* |*/*| invalid |`testNewPosition_REAL()` catches `Error` and **fails the test**|`function` <br>`testNewPosition_REAL(testName, positionObject, expectedResult)`|


### **Class *PositionDAO* - method *updatePositionByPositionID()***
**Criteria for method *updatePositionByPositionID()*:**
 - Database is reachable
 - `positionObject.newPositionID` is *unique* in the database

**Predicates for method *editPosition()*:**
 | Criteria              | Predicate |
| :--------:                                                        | :---------: |
| Database is reachable                                             | *true*    |
|                                                                   | *false*   |
| `positionObject.newPositionID` is *unique* in the database        | *true*    |
|                                                                   | *false*   |


**Combination of predicates**:
| Database is reachable |`positionObject.newPositionID` is *unique* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
|*true* |*true*| valid |`testUpdatePositionByPositionID_REAL()` receive the last `positionID` and **passes the test** |`function`<br>`testUpdatePositionByPositionID_REAL(testName, positionID, positionObject, expectedResult)`|
|*true* |*false*| invalid |`testUpdatePositionByPositionID_REAL()` catches `Error` and **fails the test** |`function`<br>`testUpdatePositionByPositionID_REAL(testName, positionID, positionObject, expectedResult)`|
|*false* |*/*| invalid |`testUpdatePositionByPositionID_REAL()` catches `Error` and **fails the test** |`function`<br>`testUpdatePositionByPositionID_REAL(testName, positionID, positionObject, expectedResult)`|

### **Class *PositionDAO* - method *updatePositionID()***
**Criteria for method *updatePositionID()*:**
 - Database is reachable
 - `newPositionID` is *unique* in the database

**Predicates for method *updatePositionID()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`newPositionID` is *unique* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable|`newPositionID` is *unique* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*| valid |`testUpdatePositionID_REAL()` receive the last `positionID` and **passes the test** |`function` <br>`testUpdatePositionID_REAL(testName, positionID, newPositionID, expectedResult)`|
| *true* |*false*| invalid |`testUpdatePositionID_REAL()` catches `Error` and **fails the test** |`function` <br>`testUpdatePositionID_REAL(testName, positionID, newPositionID, expectedResult)`|
| *false*|*/*| invalid |`testUpdatePositionID_REAL()` catches `Error` and **fails the test** |`function` <br>`testUpdatePositionID_REAL(testName, positionID, newPositionID, expectedResult)`|

### **Class *PositionDAO* - method *updatePositionQuantity()***
**Criteria for method *updatePositionQuantity()*:**
 - Database is reachable

**Predicates for method *updatePositionQuantity()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testUpdatePositionQuantity_REAL()` receive the last `positionID` and **passes the test** |`function` <br>`testUpdatePositionQuantity_REAL(testName, positionID, newOccupiedWeight, newOccupiedVolume, expectedResult)`|
| *false*| invalid |`testUpdatePositionQuantity_REAL()` catches `Error` and **fails the test** |`function` <br>`testUpdatePositionQuantity_REAL(testName, positionID, newOccupiedWeight, newOccupiedVolume, expectedResult)`|


### **Class *PositionDAO* - method *removePosition()***
**Criteria for method *removePosition()*:**
 - Database is reachable

**Predicates for method *removePosition()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testRemovePosition_REAL()` receive the last `positionID` and **passes the test** |`function` <br>`testRemovePosition_REAL(testName, positionID, expectedResult)`|
| *false*| invalid |`testRemovePosition_REAL()` catches `Error` and **fails the test** |`function` <br>`testRemovePosition_REAL(testName, positionID, expectedResult)`|



## **Class SKUitemDAO**
### **Class *SKUitemDAO* - method *getSKUitems()***
**Criteria for method *getSKUitems()*:**
 - Database is reachable

**Predicates for method *getSKUitems()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testGetSKUitems_REAL()` receive an `Array` of SKUitems objects and **passes the test** |`function` <br>`testGetSKUitems_REAL(testName, expectedResult)`|
|*false*| invalid |`testGetSKUitems_REAL()` catches `Error` and **fails the test** |`function` <br>`testGetSKUitems_REAL(testName, expectedResult)`|



### **Class *SKUitemDAO* - method *getSKUitemsBySKUid()***
**Criteria for method *getSKUitemsBySKUid()*:**
 - Database is reachable
 - `SKUid` *exists* in the database

**Predicates for method *getSKUitemsBySKUid()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable |Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testGetSKUitemsBySKUid_REAL()` receive an `Array` of SKUitems objects and **passes the test** |`function` <br>`testGetSKUitemsBySKUid_REAL(testName, SKUid, expectedResult)`|
|*false*| invalid |`testGetSKUitemsBySKUid_REAL()` catches `Error` and **fails the test** |`function` <br>`testGetSKUitemsBySKUid_REAL(testName, SKUid, expectedResult)`|



### **Class *SKUitemDAO* - method *getSKUitemsByRFID()***
**Criteria for method *getSKUitemsByRFID()*:**
 - Database is reachable
 - `RFID` *exists* in the database

**Predicates for method *getSKUitemsByRFID()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testGetSKUitemsByRFID_REAL()` receive an `Array` of SKUitems objects and **passes the test** |`function` <br>`testGetSKUitemsByRFID_REAL(testName, RFID, expectedResult)`|
|*false*| invalid |`testGetSKUitemsByRFID_REAL()` catches `Error` and **fails the test** |`function` <br>`testGetSKUitemsByRFID_REAL(testName, RFID, expectedResult)`|

### **Class *SKUitemDAO* - method *newSKUitem()***
**Criteria for method *newSKUitem()*:**
 - Database is reachable
 - `SKUid` *exists* in the database
 - `RFID` is *unique* in the database

**Predicates for method *newSKUitem()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`SKUid` *exists* in the database|*true*|
||*false*|
|`RFID` is *unique* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`SKUid` *exists* in the database|`RFID` is *unique* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* |*true*| valid |`newSKUitem_TEST()` terminates with <br>`{code: 201, message: "CREATED"}`|`function` <br>`newSKUitem_TEST(describe_NAME, request, expectedResult)`|
| *true* | *true* |*false*| invalid |`newSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`newSKUitem_TEST(describe_NAME, request, expectedResult)`|
| *true* | *false* |*/*| invalid |`newSKUitem_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`newSKUitem_TEST(describe_NAME, request, expectedResult)`|
| *false* | */* |*/*| invalid |`newSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`newSKUitem_TEST(describe_NAME, request, expectedResult)`|


### **Class *SKUitemDAO* - method *updateSKUitem()***
**Criteria for method *updateSKUitem()*:**
 - Database is reachable
 - `RFID` *exists* in the database

**Predicates for method *updateSKUitem()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`RFID` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`RFID` *exists* in the database|Valid / Invalid| Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid |`updateSKUitem_TEST()` terminates with <br>`{code: 201, message: "CREATED"}`|`function` <br>`updateSKUitem_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *false* | invalid |`updateSKUitem_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`updateSKUitem_TEST(describe_NAME, params, request, expectedResult)`|
| *false* | */* | invalid |`updateSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`updateSKUitem_TEST(describe_NAME, params, request, expectedResult)`|


### **Class *SKUitemDAO* - method *deleteSKUitem()***
**Criteria for method *deleteSKUitem()*:**
 - Database is reachable

**Predicates for method *deleteSKUitem()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable |Valid / Invalid| Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deleteSKUitem_TEST()` terminates with <br>`{code: 204, message: "No Content"}`|`function` <br>`deleteSKUitem_TEST(describe_NAME, params, expectedResult)`|
| *false* | invalid |`deleteSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`deleteSKUitem_TEST(describe_NAME, params, expectedResult)`|

## **Class SKUDAO**

### **Class *SKUDAO* - method *getSKUByID()***

**Criteria for method *getSKUByID()*:**
 - Database is reachable
 - `SKUid` *exists* in the database

**Predicates for method *getSKUByID()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`SKUid` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`SKUid` *exists* in the database | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*| valid |`testGetSKUByID_REAL()` terminates with the expected value |`function` <br>`testGetSKUByID_REAL('- Success: ', 1, skusTestArray[0]);`|
| *true* |*false*| invalid |`testGetSKUByID_REAL()` terminates with <br>`undefined`|`function` <br>`testGetSKUByID_REAL('- Success: ', 1, undefined);`|

### **Class *SKUDAO* - method *newSKU()***
**Criteria for method *newSKU()*:**
 - Database is reachable

**Predicates for method *newSKU()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`testNewSKU_REAL()` terminates with expected array |`function` <br>`testNewSKU_REAL('- Success: ', {description: "A new SKU", weight: 100, volume: 100, notes: "First SKU", price: 10.99, availableQuantity: 1}, {id: 1});`|
| *false* | Invalid | `testNewSKU_REAL()` throws `Error` | `function` <br> `testNewSKU_MOCK('- Database error: ', skusTestArray[0], Error);` |

### **Class *SKUDAO* - method *updateSKU()***
**Criteria for method *updateSKU()*:**
 - Database is reachable
 - `SKUid` *exists* in the database
 - **Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints

**Predicates for method *updateSKU()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`SKUid` *exists* in the database|*true*|
||*false*|
|**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`SKUid` *exists* in the database |**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | *true* | valid |`testUpdateSKU_REAL()` terminates with the expected value |`function` <br>`testUpdateSKU_REAL(testName, ID, skuObject, expectedResult)`|
| *true* | *false* | */* | invalid |`testUpdateSKU_REAL()` terminates with the expected value |`function` <br>`testUpdateSKU_REAL(testName, ID, skuObject, expectedResult)`|
| *false* | */* | */* | invalid |`testUpdateSKU_REAL()` throws `Error`|`function` <br>`testUpdateSKU_MOCK(testName, ID, skuObject, expectedResult)`|

### **Class *SKUDAO* - method *updateSKUpositionID()***

**Criteria for method *updateSKUpositionID()*:**
 - Database is reachable
 - `positionID` is already assigned to **SKU**
 - `SKUid` *exists* in the database
 - `positionID` *exists* in the database
 - **Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints

**Predicates for method *updateSKU()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`positionID` is already assigned to **SKU**|*true*|
||*false*|
|`SKUid` *exists* in the database|*true*|
||*false*|
|`positionID` *exists* in the database|*true*|
||*false*|
|**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`positionID` is already assigned to **SKU** |`SKUid` *exists* in the database|`positionID` *exists* in the database|**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *false* | *true* | *true* | *true* | valid |`testUpdateSKUpositionID_REAL()` terminates with the expected value |`function` <br>`testUpdateSKUpositionID_REAL(testName, ID, newPositionID, expectedResult)` |
| *false* | */* | */* | */* | */* | invalid |`testUpdateSKUpositionID_REAL()` throws `Error` |`function` <br>`testUpdateSKUpositionID_MOCK(testName, ID, newPositionID, expectedResult)`|

### **Class *SKUDAO* - method *deleteSKU()***

**Criteria for method *deleteSKU()*:**

 - Database is reachable
 - **SKU** is associated with **TestDescriptors**
 - **SKU** is associated with **SKUItems**

**Predicates for method *deleteSKU()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|**SKU** is associated with **TestDescriptors**|*true*|
||*false*|
|**SKU** is associated with **SKUItems**|*true*|
||*false*|


**Combination of predicates**:
| Database is reachable |**SKU** is associated with **TestDescriptors** |**SKU** is associated with **SKUItems**| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *false* | *false* | valid |`testDeleteSKU_REAL()` terminates with the expected value |`function` <br>`testDeleteSKU_REAL(testName, ID, expectedResult)`|
`function` <br>`testDeleteSKU_REAL(testName, ID, expectedResult)`|
| *false* | */* | */* | invalid |`testDeleteSKU_REAL()` throws `Error` |`function` <br>`testDeleteSKU_MOCK(testName, ID, expectedResult)`|

## **Class InternalOrderDAO**

**Criteria for method *getInternalOrders*:**

- Database is reachable

**Predicates for method *getInternalOrders*:**
| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getInternalOrders(expected)` returns <br>an array of the internal orders retrieved |`function` <br> `getInternalOrders(expected)`|
|*false*|invalid|`getInternalOrders(expected)` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getInternalOrders(expected)`|

### **Class *InternalOrderDAO* - method *getInternalOrderById***



**Criteria for method *getInternalOrderById*:**
- Database is reachable 
- Internal order associated to the `id` *exists* in the db





**Predicates for method *getInternalOrderById*:**

| Criteria | Predicate |
| :--------: | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| internal order associated to the `id` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:

| Database reachable | `id` *exists* in the database | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid | `getInternalOrderById` retrieves the <br>internal order associated to the `id` |`function` <br>` getInternalOrderById(req,expected)` |
| *true* | *false* | invalid | `getInternalOrderById` terminates with <br>`{message: "Not Found"}`|  `function` <br> `getInternalOrderById(req,expected)` |
| *false* | */* | invalid | `getInternalOrderById` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}` | `function` <br>` getInternalOrderById(req,expected)` |

### **Class *InternalOrderDAO* - method *createInternalOrder***


### **Class *InternalOrderDAO* - method *createInternalOrder***



**Criteria for method *createInternalOrder*:**

- Database is reachable
- `issueDate` saved in the db as expected
- `customerId` saved in the db as expected
- `products` saved in the db as expected




**Predicates for method *createInternalOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `issueDate` | *true* |
|                       | *false*|
| `customerId` | *true* |
|                       | *false*|
| `products` | *true* |
|                       | *false*|




**Combination of predicates**:


| Database is reachable | `issueDate` | `customerId` | `products` | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* |*true* |*true* | valid | `createInternalOrder(issueDate,products,customerId,expected)` creates a new internal order and it retrieves the new internal order to compare with the one expected  |`function` <br>`createInternalOrder(issueDate,products,customerId,expected)`|
| *true* | *false* |*true* |*true* | invalid | `createInternalOrder(issueDate,products,customerId,expected)` creates a new internal order but the internal order's the `issueDate` is not as expected therefore the test failes |`function` <br>`createInternalOrder(issueDate,products,customerId,expected)`|
| *true* | *true* |*false* |*true* | invalid | `createInternalOrder(issueDate,products,customerId,expected)` creates a new internal order but the internal order's the `customerId` is not as expected  |`function` <br>`createInternalOrder(issueDate,products,customerId,expected)`|
| *true* | *true* |*true* |*false* | invalid | `createInternalOrder(issueDate,products,customerId,expected)` creates a new internal order but the internal order's the `products` is not as expected  |`function` <br>`createInternalOrder(issueDate,products,customerId,expected)`|
| *false* | *true* |*true* |*true* | invalid | `createInternalOrder(issueDate,products,customerId,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`  |`function` <br>`createInternalOrder(issueDate,products,customerId,expected)`|




### **Class *InternalOrderDAO* - method *modifyInternalOrderState***



**Criteria for method *modifyInternalOrderState*:**
    
 - Database is reachable
 - internal order associated to the `id`  *exists* in the database
 - `newState` constraint



**Predicates for method *modifyInternalOrderState*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`id` *exists* in the database|*true*|
||*false*|
| `newState`|"ISSUED"|
| |"ACCEPTED"|
| |"REFUSED"|
| |"CANCELED"|
| |"COMPLETED"|
| `products` are defined |*true*|
||*false*|


**Combination of predicates**:


| Database is reachable |`id` *exists* in the database| `newState` |  `products`| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | "ISSUED"  | *false* |  valid |`modifyInternalOrderState(id,newState,products,expected)` returns the `id` of the internal order successfully edited|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *true* | "ACCEPTED"  | *false* |  valid |`modifyInternalOrderState(id,newState,products,expected)` returns the `id` of the internal order successfully edited|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *true* | "REFUSED"  | *false* |  valid |`modifyInternalOrderState(id,newState,products,expected)` returns the `id` of the internal order successfully edited|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *true* | "CANCELED"  | *false* |  valid |`modifyInternalOrderState(id,newState,products,expected)` returns the `id` of the internal order successfully edited|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *true* | "COMPLETED"  | *true* |  valid |`modifyInternalOrderState(id,newState,products,expected)` returns the `id` of the internal order successfully edited|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *true* | "COMPLETED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{Unprocessable}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *false* | "COMPLETED"  | *true* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{message: "Not Found"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *false* | "ISSUED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{message: "Not Found"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *false* | "ACCEPTED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{message: "Not Found"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *false* | "CANCELED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{message: "Not Found"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *true* | *false* | "REFUSED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` returns `{message: "Not Found"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *false* | *true* | "ISSUED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *false* | *true* | "ACCEPTED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *false* | *true* | "REFUSED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *false* | *true* | "CANCELED"  | *false* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |
| *false* | *true* | "COMPLETED"  | *true* |  invalid |`modifyInternalOrderState(id,newState,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyInternalOrderState(id,newState,products,expected)` |



### **Class *InternalOrderDAO* - method *deleteInternalOrder***



**Criteria for method *deleteInternalOrder*:**
    
 - Database is reachable





**Predicates for method *deleteInternalOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deleteInternalOrder(req)` return the `id` of the internal order deleted successfully|`function` <br>`deleteInternalOrder(req)`|
| *false* | invalid |`deleteInternalOrder(req)` catch `TypeError` and terminates with <br>`{code: 503, message: "Unprocessable Entity"}`|`function` <br>`deleteInternalOrder(req)`|

## **Class ItemDAO**

### **Class *ItemDAO*- method *getItemById***

**Criteria for method *getItemById*:**

- Database is reachable  
- id is unique in the DB

**Predicates for method *getItemById*:**

| Criteria | Predicate |
| -------- | --------- |
|    DB is reachable        |     true      |
|          |    false       |
|    id exists in the DB      |     true      |
|          |    false       |

**Combination of predicates**:

| DB is reachable | Id exists in the DB |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|------|-------|-------|
|true|true| valid | `getItemById()` terminates with the expected value|`function`<br>`getItemById(name,id,expected)` | `getItemById()` throws `Error` |`function` <br> `getItemById(name,id,expected)` |

### **Class *ItemDAO*- method *createItem***

**Criteria for method *createItem*:**

 - Database is reachable
 - SKUId exists in database
 - supplier doesn't sell same id
 - supplier doesn't sell same SKUid

**Predicates for method *createItem*:**

| Criteria | Predicate |
| -------- | --------- |
|    DB is reachable      |      true     |
|          |    false       |
|    SKUId exists in the DB      |   true        |
|          |    false       |
|supplier doesn't sell same id|true|
|          |    false       |
|supplier doesn't sell same SKUId|true|
|          |    false       |



**Combination of predicates**:


| DB is reachable | SKUId exists in the DB|supplier doesn't sell same id|supplier doesn't sell same SKUId| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|true|true|true|true|valid|`createItem()` terminates with the expected value |`function`<br> `createItem(name,expected,json)`|
|false|/|/|/|invalid| `createItem()` throws `Error` | `function`<br>  `createItem(name,expected,json)`|

### **Class *ItemDAO*- method *modifyItem***

**Criteria for method *modifyItem*:**

- Database is reachable
- id exists in the database

**Predicates for method *modifyItem*:**

| Criteria | Predicate |
| -------- | --------- |
|   DB is reachable       |   true        |
|          |    false       |
|  id exists in the DB        |   true        |
|          |    false       |

**Combination of predicates**:

| DB is reachable | id exists in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|true|true|valid|`modifyItem()` terminates with 200|`function` `modifyItem(name,expected,id,json)`|
|false|/|invalid| `modifyItem()` throws `Error` | `function` `modifyItem(name,expected,id,json)`|

### **Class *ItemDAO*- method *deleteItem***

**Criteria for method *deleteItem*:**

- Database is reachable

**Predicates for method *deleteItem*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |      true     |
|          |    false       |

**Combination of predicates**:

| DB is reachable|Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|true|valid| `deleteItem()` terminates with expected value |`function` <br> `deleteItem(name,expected,id)`|
|false|invalid| `deleteItem()` throws `Error`|`function` <br> `deleteItem(name,expected,id)`|

## **Class RestockOrderController**

### **Class *RestockOrderController* - method *getRestockOrders***

**Criteria for method *getRestockOrders*:**

- Database is reachable

**Predicates for method *getRestockOrders*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getRestockOrders(expected)` returns <br>an array of the restock orders retrieved |`function` <br>`getRestockOrders(expected)`|
|*false*|invalid|`getRestockOrders(expected)` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getRestockOrders(expected)`|

### **Class *RestockOrderController* - method *getRestockOrdersIssued***

**Criteria for method *getRestockOrdersIssued*:**

- Database is reachable

**Predicates for method *getRestockOrdersIssued*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getRestockOrdersIssued(expected)` returns <br>an array of the restock orders issued retrieved |`function` <br>`getRestockOrdersIssued(expected)`|
|*false*|invalid|`getRestockOrders(expected)` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getRestockOrdersIssued(expected)`|

### **Class *RestockOrderController* - method *getRestockOrderById***

**Criteria for method *getRestockOrderById*:**

- Database is reachable
- restock order associated to the `id` *exists* in the db

**Predicates for method *getRestockOrderById*:**

| Criteria | Predicate |
| :--------: | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| restock order associated to the `id` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:

| Database reachable | `id` *exists* in the database | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid | `getRestockOrderById` retrieves the <br>restock order associated to the `id` |`function` <br>` getRestockOrderById(req,expected)` |
| *true* | *false* | invalid | `getRestockOrderById` terminates with <br>`{message: "Not Found"}`|  `function` <br> `getRestockOrderById(req,expected)` |
| *false* | */* | invalid | `getRestockOrderById` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}` | `function` <br>` getRestockOrderById(req,expected)` |

### **Class *RestockOrderController* - method *createRestockOrder***

**Criteria for method *createRestockOrder*:**

- Database is reachable
- `issueDate` saved in the db as expected
- `supplierId` saved in the db as expected
- `products` saved in the db as expected

**Predicates for method *createRestockOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `issueDate` | *true* |
|                       | *false*|
| `supplierId` | *true* |
|                       | *false*|
| `products` | *true* |
|                       | *false*|

**Combination of predicates**:

| Database is reachable | `issueDate` | `supplierId` | `products` | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* |*true* |*true* | valid | `createRestockOrder(issueDate,supplierId,products,expected)` creates a new restock order and it retrieves the new restock  order to compare with the one expected  |`function` <br>`createRestockOrder(issueDate,supplierId,products,expected)`|
| *true* | *false* |*true* |*true* | invalid | `createRestockOrder(issueDate,supplierId,products,expected)` creates a new restock  order but the restock  order's the `issueDate` is not as expected therefore the test failes |`function` <br>`createRestockOrder(issueDate,supplierId,products,expected)`|
| *true* | *true* |*false* |*true* | invalid | `createRestockOrder(issueDate,supplierId,products,expected)` creates a new restock order but the restock  order's the `supplierId` is not as expected  |`function` <br>`createRestockOrder(issueDate,supplierId,products,expected)`|
| *true* | *true* |*true* |*false* | invalid | `createRestockOrder(issueDate,supplierId,products,expected)` creates a new restock  order but the restock  order's the `products` is not as expected  |`function` <br>`createRestockOrder(issueDate,supplierId,products,expected)`|
| *false* | *true* |*true* |*true* | invalid | `createRestockOrder(issueDate,supplierId,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`  |`function` <br>`createRestockOrder(issueDate,supplierId,products,expected)`|

### **Class *RestockOrderController* - method *modifyRestockOrderState***

**Criteria for method *modifyRestockOrderState*:**

 - Database is reachable
 - internal order associated to the `id`  *exists* in the database
 - `newState`

**Predicates for method *modifyRestockOrderState*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`id` *exists* in the database|*true*|
||*false*|
| `newState`|"ISSUED"|
| |"DELIVERY"|
| |"DELIVERED"|
| |"TESTED"|
| |"COMPLETEDRETURN"|
| |"COMPLETED"|

**Combination of predicates**:

| Database is reachable |`id` *exists* in the database| `newState` | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | "ISSUED"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *true* | "DELIVERY"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *true* | "DELIVERED"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *true* | "TESTED"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *true* | "COMPLETED"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *true* | "COMPLETEDRETURN"  | valid |`modifyRestockOrderState(id,newState,expected)` returns the `id` of the restock order successfully edited|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "ISSUED"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "DELIVERY"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "DELIVERED"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "TESTED"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "COMPLETED"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *true* | *false* | "COMPLETEDRETURN"  | invalid |`modifyRestockOrderState(id,newState,expected)` returns returns `{message: "Not Found"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "ISSUED"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "DELIVERY"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "DELIVERED"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "TESTED"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "COMPLETED"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |
| *false* | *true* | "COMPLETEDRETURN"  | invalid |`modifyRestockOrderState(id,newState,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`modifyRestockOrderState(id,newState,expected)` |



### **Class *RestockOrderController* - method *addTransportNote***



**Criteria for method *addTransportNote*:**
    
- Database is reachable
- restock order associated to the `id`  *exists* in the database
- restock order's `state` = "DELIVERY"
- `deliveryDate` after `issueDate`




**Predicates for method *addTransportNote*:**
| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`id` *exists* in the database|*true*|
||*false*|
| `newState`|"DELIVERY"|
| | other|
| `deliveryDate` after `issueDate` | *true* |
|                       | *false*|




**Combination of predicates**:


| Database is reachable |`id` *exists* in the database| `newState` |   `deliveryDate` after `issueDate` | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | "DELIVERY"  | *true* |  valid |`addTransportNote(id,transportNote,expected)` returns the `id` of the restock order successfully edited|`function` <br>`addTransportNote(id,transportNote,expected)` |
| *true* | *true* | other  | *true* |  invalid |`addTransportNote(id,transportNote,expected)` returns `{unprocessable: "Cannot put transport note"}`|`function` <br>`addTransportNote(id,transportNote,expected)` |
| *true* | *true* | "DELIVERY"  | *false* |  invalid |`addTransportNote(id,transportNote,expected)` returns `{unprocessable: "Cannot put transport note"}`|`function` <br>`addTransportNote(id,transportNote,expected)` |
| *true* | *false* | "DELIVERY"  | *true* |  invalid |`addTransportNote(id,transportNote,expected)` returns `{message: "Not Found"}`|`function` <br>`addTransportNote(id,transportNote,expected)` |
| *false* | *true* | "DELIVERY"  | *true* |  invalid |`addTransportNote(id,transportNote,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`addTransportNote(id,transportNote,expected)` |


### **Class *RestockOrderController* - method *addSkuItems***



**Criteria for method *addSkuItems*:**
    
- Database is reachable
- restock order associated to the `id`  *exists* in the database
- restock order's `state` = "DELIVERED"






**Predicates for method *addSkuItems*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`id` *exists* in the database|*true*|
||*false*|
| `newState`|"DELIVERED"|
| | other|






**Combination of predicates**:


| Database is reachable |`id` *exists* in the database| `newState` |Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | "DELIVERED"  |  valid |`addSkuItems(id,skuItems,expected)` returns the `id` of the restock order successfully edited|`function` <br>`addSkuItems(id,skuItems,expected)` |
| *true* | *true* | other  |  invalid |`addSkuItems(id,skuItems,expected)` returns `{unprocessable: "Cannot put transport note"}` <br>`addSkuItems(id,skuItems,expected)` |`function` <br>`addSkuItems(id,skuItems,expected)` |
| *true* | *false* | "DELIVERED"   |  invalid |`addSkuItems(id,skuItems,expected)` returns `{message: "Not Found"}` <br>`addSkuItems(id,skuItems,expected)` |`function` <br>`addSkuItems(id,skuItems,expected)` |
| *false* | *true* | "DELIVERED"   |  invalid |`addSkuItems(id,skuItems,expected)` returns `{code: 503, message: "Service Unavailable"}` |`function` <br>`addSkuItems(id,skuItems,expected)` |


### **Class *RestockOrderController* - method *deleteRestockOrder***



**Criteria for method *deleteRestockOrder*:**
    
 - Database is reachable





**Predicates for method *deleteRestockOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|




**Combination of predicates**:


| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deleteRestockOrder(req)` return the `id` of the restock order deleted successfully|`function` <br>`deleteRestockOrder(req)`|
| *false* | invalid |`deleteRestockOrder(req)` catch `TypeError` and terminates with <br>`{code: 503, message: "Unprocessable Entity"}`|`function` <br>`deleteRestockOrder(req)`|

## **Class ReturnOrderController**

**Criteria for method *getReturnOrders*:**
    
 - Database is reachable





**Predicates for method *getReturnOrders*:**
| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|


**Combination of predicates**:


| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getReturnOrders(expected)` returns <br>an array of the return orders retrieved |`function` <br>`getReturnOrders(expected)`|
|*false*|invalid|`getReturnOrders(expected)` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getReturnOrders(expected)`|

### **Class *ReturnOrderController* - method *getReturnOrderById***



**Criteria for method *getReturnOrderById*:**
- Database is reachable 
- Return order associated to the `id` *exists* in the db





**Predicates for method *getReturnOrderById*:**

| Criteria | Predicate |
| :--------: | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| return order associated to the `id` *exists* in the database|*true*|
||*false*|









**Combination of predicates**:


| Database reachable | `id` *exists* in the database | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid | `getReturnOrderById` retrieves the <br>return order associated to the `id` |`function` <br>` getReturnOrderById(req,expected)` |
| *true* | *false* | invalid | `getReturnOrderById` terminates with <br>`{message: "Not Found"}`|  `function` <br> `getReturnOrderById(req,expected)` |
| *false* | */* | invalid | `getReturnOrderById` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}` | `function` <br>` getReturnOrderById(req,expected)` |





### **Class *ReturnOrderController* - method *createReturnOrder***



**Criteria for method *createReturnOrder*:**


- Database is reachable
- `returnDate` saved in the db as expected
- `restockOrderId` saved in the db as expected
- `products` saved in the db as expected



**Predicates for method *createReturnOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `returnDate` | *true* |
|                       | *false*|
| `restockOrderId` | *true* |
|                       | *false*|
| `products` | *true* |
|                       | *false*|






**Combination of predicates**:



| Database is reachable | `returnDate` | `restockOrderId` | `products` | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* |*true* |*true* | valid | `createReturnOrder(returnDate,restockOrderId,products,expected)` creates a new return order and it retrieves the new return order to compare with the one expected  |`function` <br>`createReturnOrder(returnDate,restockOrderId,products,expected)`|
| *true* | *false* |*true* |*true* | invalid | `createReturnOrder(returnDate,restockOrderId,products,expected)` creates a new return order but the return order's the `returnDate` is not as expected therefore the test failes |`function` <br>`createReturnOrder(returnDate,restockOrderId,products,expected)`|
| *true* | *true* |*false* |*true* | invalid | `createReturnOrder(returnDate,restockOrderId,products,expected)` creates a new return order but the return order's the `restockOrderId` is not as expected  |`function` <br>`createReturnOrder(returnDate,restockOrderId,products,expected)`|
| *true* | *true* |*true* |*false* | invalid | `createReturnOrder(returnDate,restockOrderId,products,expected)` creates a new return order but the return order's the `products` is not as expected  |`function` <br>`createReturnOrder(returnDate,restockOrderId,products,expected)`|
| *false* | *true* |*true* |*true* | invalid | `createReturnOrder(returnDate,restockOrderId,products,expected)` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`  |`function` <br>`createReturnOrder(returnDate,restockOrderId,products,expected)`|

### **Class *ReturnOrderController* - method *deleteReturnOrder***



**Criteria for method *deleteReturnOrder*:**
    
 - Database is reachable





**Predicates for method *deleteReturnOrder*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|





**Combination of predicates**:


| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deleteReturnOrder(req)` returns the `id` of the return order deleted successfully|`function` <br>`deleteReturnOrder(req)`|
| *false* | invalid |`deleteReturnOrder(req)` catch `TypeError` and terminates with <br>`{code: 503, message: "Unprocessable Entity"}`|`function` <br>`deleteReturnOrder(req)`|

## **Class TestDescriptorDAO**

### **Class *TestDescriptorDAO* - method *getTestDescriptorById***



**Criteria for method *getTestDescriptorById*:**
    

 - Database is reachable  
 - id is unique in the DB





**Predicates for method *getTestDescriptorById*:**

| Criteria | Predicate |
| -------- | --------- |
|    DB is reachable        |     true      |
|          |    false       |
|    id exists in the DB      |     true      |
|          |    false       |



**Combination of predicates**:


| DB is reachable | Id exists in the DB |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|------|-------|-------|
|true|true| valid |`getTestDescriptorById()` terminates with expected value |`function` <br> `getTestDescriptorById(id,expected)`|
|false|true| invalid | `getTestDescriptorById()` throws `Error` |`function` `getTestDescriptorById(id,expected)`|

### **Class *TestDescriptorDAO* - method *createTestDescriptor***



**Criteria for method *createTestDescriptor*:**
    

 - Database is reachable
 - idSKU exists in database





**Predicates for method *createTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|    DB is reachable      |      true     |
|          |    false       |
|    idSKU exists in the DB      |   true        |
|          |    false       |




**Combination of predicates**:


| DB is reachable | idSKU exists in the DB| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|true|true|valid| `createTestDescriptor()` terminates with the expected value|`function` <br> `createTestDescriptor(expected,json)`|
|false|false|invalid|`createTestDescriptor()` throws `Error` |`function` <br> `createTestDescriptor(expected,json)`|

### **Class *TestDescriptorDAO* - method *modifyTestDescriptor***



**Criteria for method *modifyTestDescriptor*:**
    

 - Database is reachable
 - id exists in the database
 - newidSKU exists in the database





**Predicates for method *modifyTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|   DB is reachable       |   true        |
|          |    false       |
|  id exists in the DB        |   true        |
|          |    false       |
|newidSKU exist in the DB|true|
||false|




**Combination of predicates**:


| DB is reachable | id exists in the DB |newidSKU exist in the DB| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|true|true|true|valid| `modifytestDescriptor()` terminates with expected value |`function` <br> `modifyTestDescriptor(expected,json,id)`|
|false|false|false|invalid|`modifyTestDescriptor()` throws `Error`|`function` <br> `modifyTestDescriptor(expected,json,id)`|

### **Class *TestDescriptorDAO* - method *deleteTestDescriptor***



**Criteria for method *deleteTestDescriptor*:**
    

 - Database is reachable





**Predicates for method *deleteTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |      true     |
|          |    false       |





**Combination of predicates**:


| DB is reachable|Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|true|valid|`deleteTestDescriptor()` terminates with expected value|`function` <br> `deleteTestDescriptor(expected,id)`|
|true|invalid|`deleteTestDescriptor()` can't delete a undefined test |`function` <br> `deleteTestDescriptor(expected,id)`|
|false|invalid|`deleteTestDescriptor()` throws `Error`|`function` <br> `deleteTestDescriptor(expected,id)`|


## **Class TestResultDAO**

### **Class *TestResultDAO* - method *getTestResultById***

**Criteria for method *getTestResultById*:**

 - Database is reachable
 - rfid exists in the database
 -id exists in the database

**Predicates for method *getTestResultById*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |  true         |
|          |    false       |
|   rfid exist in the DB       |     true      |
|          |   false        |
|id exists in the DB|true|
||false|

**Combination of predicates**:

| DB is reachable |  rfid exist in the DB    |  id exist in the DB    | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|true|true|true|valid|`getTestResultById()` terminates with expected value |`function` <br> `getTestResultById(expected,req)`|
|true|true|false|invalid|`getTestResultById()` fails on id check and return 404|`function` <br> `getTestResultById(expected,req)`|
|true|false|true|invalid|`getTestResultById()` fails on rfid check and return 404|`function` <br> `getTestResultById(expected,req)`|
|true|false|false|invalid|`getTestResultById()` fails on rfid check and return 404|`function` <br> `getTestResultById(expected,req)`|
|false|true|true|invalid|`getTestResultById()` throws `Error`|`function` <br> `getTestResultById(expected,req)`|


### **Class *TestResultDAO* - method *createTestResult***

**Criteria for method *createTestResult*:**

- Database is reachable

**Predicates for method *createTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |  true         |
|          |    false       |
|   rfid exist in the DB        | true          |
|          |   false        |
|idTestDescriptor exists in the DB|true|
||false|

**Combination of predicates**:

| DB is reachable |rfid exist in the DB  |idTestDescriptor exists in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|true|true|true|valid|`createTestResult()` terminates with expected value|`function` <br> `createTestResult(expected, req)`|
|true|true|false|invalid|`createTestResult()` fails on idTestDescriptor check and return 404|`function` <br> `createTestResult(expected, req)`|
|true|false|true|invalid|`createTestResult()` fails on rfid check and return 404|`function` <br> `createTestResult(expected, req)`|
|true|false|false|invalid|`createTestResult()` fails on rfidcheck and return 404|`function` <br> `createTestResult(expected, req)`|
|false|true|true|invalid|`createTestResult()` throws `Error`|`function` <br> `createTestResult(expected, req)`|

### **Class *TestResultDAO* - method *modifyTestResult***

**Criteria for method *modifyTestResult*:**

 - Database is reachable
 - rfid exists in database
 - newIdTestDescriptor exist in the database
 - id exist in the database

**Predicates for method *modifyTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |  true         |
|          |    false       |
|   rfid exists DB       | true          |
|          |    false       |
|   id exists in DB     |      true     |
|          |    false       |
|newIdTestDescriptor exist in the DB|true|
|          |    false       |

**Combination of predicates**:

| DB is reachable |   rfid exists DB   |newIdTestDescriptor exist in the DB    | id exists in DB| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|true|true|true|true|valid|`modifyTestResult()` terminates with 200 returned|`function` <br> `modifyTestResult(expected, req1, req2)`|
|true|true|true|false|invalid|`modifyTestResult()` fails on id check and return 404|`function` <br> `modifyTestResult(expected, req1, req2)`|
|true|true|false|/|invalid|`modifyTestResult()` fails on newIdTestDescriptor check and return 404|`function` <br> `modifyTestResult(expected, req1, req2)`|
|true|false|/|/|invalid|`modifyTestResult()` fails on rfid check and return 404|`function` <br> `modifyTestResult(expected, req1, req2)`|
|false|/|/|/|invalid|`modifyTestResult()` throws `Error`|`function` <br> `modifyTestResult(expected, req1, req2)`|

### **Class *TestResultDAO* - method *deleteTestResult***

**Criteria for method *deleteTestResult*:**

- Database is reachable

**Predicates for method *deleteTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|     DB is reachable     |  true         |
|          |    false       |

**Combination of predicates**:

| DB is reachable |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|true|valid|`deleteTestResult()` terminates with 204 returned|`function` <br> `deleteTestResult(expected, req)`|
|false|invalid|`deleteTestResult()` throws `Error`|`function` <br> `deleteTestResult(expected, req)`|

# White Box Unit Tests

### Test cases definition

| Unit name | Jest test case |
|--|--|
| Class **UserDAO.js** method `createUser()` | `testNewUser()` |
| Class **UserDAO.js** method `getUser()` | `testGetUser()` |
| Class **UserDAO.js** method `modifyPermissions()` | `testModifyPermissions()` |
| Class **UserDAO.js** method `removeUser()` | `testRemoveUser()` |
| Class **PositionDAO.js** method `newPosition()` | `newPosition_TEST()` |
| Class **PositionDAO.js** method `editPosition()` | `editPosition_TEST()` |
| Class **PositionDAO.js** method `editPositionID()` | `editPositionID_TEST()` |
| Class **PositionDAO.js** method `deletePosition()` | `deletePosition_TEST()` |
| Class **SKUitemDAO.js** method `getSKUitemsBySKUId()` | `getSKUitemsBySKUId_TEST()` |
| Class **SKUitemDAO.js** method `getSKUitemsByRFID()` | `getSKUitemsByRFID_TEST()` |
| Class **SKUitemDAO.js** method `newSKUitem()` | `newSKUitem_TEST()` |
| Class **SKUitemDAO.js** method `updateSKUitem()` | `updateSKUitem()` |
| Class **SKUitemDAO.js** method `deleteSKUitem()` | `deleteSKUitem_TEST()` |
| Class **SKUDAO.js** method `getSKUByID()` | `testGetSKUByID_REAL()` |
| Class **SKUDAO.js** method `newSKU()` | `testNewSKU_REAL()` |
| Class **SKUDAO.js** method `updateSKU()` | `testUpdateSKU_REAL()` |
| Class **SKUDAO.js** method `updateSKUpositionID()` | `testUpdateSKUpositionID_REAL()` |
| Class **SKUDAO.js** method `deleteSKU()` | `testDeleteSKU_REAL()` |
| Class **RestockOrderController.js** method `createRestockOrder()` | `createRestockOrder()` |
| Class **RestockOrderController.js** method `getRestockOrderById()` | `getRestockOrderById()` |
| Class **RestockOrderController.js** method `getRestockOrders()` | `getRestockOrders()` |
| Class **RestockOrderController.js** method `getRestockOrdersIssued()` | `getRestockOrdersIssued()` |
| Class **RestockOrderController.js** method `modifyRestockOrderState()` | `modifyRestockOrderState()` |
| Class **RestockOrderController.js** method `addTransportNote()` | `addTransportNote()` |
| Class **RestockOrderController.js** method `setSkuItems()` | `addSkuItems()` |
| Class **RestockOrderController.js** method `deleteRestockOrder()` | `deleteRestockOrder()` |
| Class **InternalOrderDAO.js** method `createInternalOrder()` | `createInternalOrder()` |
| Class **InternalOrderDAO.js** method `modifyInternalOrderState()` | `modifyInternalOrderState()` |
| Class **InternalOrderDAO.js** method `deleteInternalOrder()` | `deleteInternalOrder()` |
| Class **ReturnOrderController.js** method `createReturnOrder()` | `createReturnOrder()` |
| Class **ReturnOrderController.js** method `getReturnOrderById()` | `getReturnOrderById()` |
| Class **ReturnOrderController.js** method `deleteReturnOrder()` | `deleteReturnOrder()` |
| Class **ItemDAO.js** method `getItemById()`| `getItemById()`|
| Class **ItemDAO.js** method `createItem()`| `createItem()`|
| Class **ItemDAO.js** method `modifyItem()`| `modifyItem()`|
| Class **ItemDAO.js** method `deleteItem()`| `deleteItem()`|
| Class **TestDescriptorDAO.js** method `getTestDescriptorById()`| `getTestDescriptorById()`|
| Class **TestDescriptorDAO.js** method `createTestDescriptor()`| `createTestDescriptor()`|
| Class **TestDescriptorDAO.js** method `modifyTestDescriptor()`| `modifyTestDescriptor()`|
| Class **TestDescriptorDAO.js** method `deleteTestDescriptor()`| `deleteTestDescriptor()`|
| Class **TestResultDAO.js** method ``getTestResultById()``| ``getTestResultById()``|
| Class **TestResultDAO.js** method ``createTestResult()``| ``createTestResult()``|
| Class **TestResultDAO.js** method ``modifyTestResult()``| ``modifyTestResult()``|
| Class **TestResultDAO.js** method `deleteTestResult()`| `deleteTestResult()`|




### Code coverage report

Please note: TestDAO is not testable due to the server architecture. It creates and drop only the DB's tables, and also auxiliary methods `run()`, `get()`, `all()`.


![coverage](./images/coverage.png)

    

### Loop coverage analysis

| Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
| Class **RestockOrderController.js**  method `createRestockOrder()`        | 27-35 | products.length | `createRestockOrder_TEST(issueDate,supplierId,products,expected)` |
| Class **RestockOrderController.js**  method `setSkuItems()`               | 201-2015 | skuItems.length | `addSkuItems(id,skuItems,expected)` |
| Class **RestockOrderController.js**  method `getRestockOrders()`          | 56-63 | one for each restock order retrieved | `getRestockOrders(id,skuItems,expected)` |
| Class **InternalOrderDAO.js** method `createInternalOrder()`       | 26-34 | products.length | `createInternalOrder(issueDate,products,customerId,expected)` |
| Class **InternalOrderDAO.js** method `modifyInternalOrderState()`  | 188-193 | products.length | `modifyInternalOrderState(id,newState,products,expected)` |
| Class **InternalOrderDAO.js** method `getInternalOrders()`         | 51-63 | products.length | ` getInternalOrders(expected)` |
| Class **InternalOrderDAO.js** method `getInternalOrdersIssued()`   | 86-97 | products.length | ` getInternalOrdersIssued(expected)` |
| Class **InternalOrderDAO.js** method `getInternalOrdersAccepted()` | 113-123 | products.length | ` getInternalOrdersAccepted(expected)` |
| Class **SKUDAO.js**           method `getSKUs()`             | 80-86 | number of SKUS in the DB | `testGetSKUs_REAL(testName, expectedResult)` |
| Class **TestResultDAO.js**    method `getTestResults()`            | 30     |number of Test Result retrieved|`getTestResults(expected,rfid)`|
| Class **ReturnOrderController.js**   method `createReturnOrder()`         | 24 | products.length | `createInternalOrder(issueDate,products,customerId,expected)` |
| Class **TestResultDAO.js**    method ``modifyTestResult()``          | 136    |number of Test Result retrieved|`modifyTestResult(expected,req1,req2)`|



