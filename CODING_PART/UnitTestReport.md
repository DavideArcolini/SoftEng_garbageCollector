# Unit Testing Report

Date:

Version:
| Version | Changes |
| ------- |---------|
| 1 | Added first version of Unit Test Report document. |

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)

- [White Box Unit Tests](#white-box-unit-tests)

# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

## **Class UserController**

### Class *UserController* - method **getStoredUsers**

**Criteria for method **getStoredUsers:**

- Database is reachable

**Predicates for method *getStoredUsers*:**

| Criteria | Predicate |
| -------- | --------- |
| Database is reachable | Yes |
|                       | No|

**Combination of predicates**:

Please note: There are users in the database

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | `getStoredUsers_TEST()` terminates retrieving the expected list of users | `function`<br> getStoredUsers_TEST(name, expected) |
| No | Invalid | `getStoredUsers_TEST()` catch 500 and terminates with that error| `function`<br> getStoredUsers_TEST(name, expected) |

### Class *UserController* - method **getSuppliers**

**Criteria for method **getSuppliers:**

- Database is reachable

**Predicates for method *getSuppliers*:**

| Criteria | Predicate |
| -------- | --------- |
| Database is reachable | Yes |
|                       | No|

**Combination of predicates**:

Please note: There are users in the database

| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | `getSuppliers_TEST()` terminates retrieving the expected list of users | `function`<br> getSuppliers_TEST(name, expected) |
| No | Invalid | `getSuppliers_TEST()` catch 500 and terminates with that error| `function`<br> getSuppliers_TEST(name, expected) |

### **Class *UserController* - method *newUser***

**Criteria for method *newUser*:**

- req is not empty
- `username` is *unique* in the database

**Predicates for method *newUser*:**

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
| Valid | True | Valid | `newUser_TEST()` terminates with 201 | `function`<br>newUser_TEST("user ok", { <br>username : "clerk1@ezwh.com",<br>name: "Donald",<br>surname: "Trump",<br>type: "clerk",<br>password: "testpassword"<br>}, 201)|
| Valid | False | Invalid | `newUser_TEST()` terminates with 409 | `function`<br>newUser_TEST("user ok", { <br>username : "clerk1@ezwh.com",<br>name: "Donald",<br>surname: "Trump",<br>type: "clerk",<br>password: "testpassword"<br>}, 201) <br><br>newUser_TEST("user ok", { <br>username : "clerk1@ezwh.com",<br>name: "Donald",<br>surname: "Trump",<br>type: "clerk",<br>password: "testpassword"<br>}, 409) |
| undefined | undefined | Invalid | `newUser_TEST()` terminates with 503 | `function`<br>newUser_TEST("bad request", undefined, 503)|


### **Class *UserController* - method *getUser***

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
| True | Yes | Yes | Valid | `getUser_TEST()` terminates returning the exact expected value | `function`<br>getUser_TEST("ok",<br>{username: "mj@ezwh.com",<br>password: "testpassword"},<br>{id:1,<br>username: "mj@ezwh.com",<br>name: "Mary"}) |
| True | No | Yes | Invalid | `getUser_TEST()` terminates with 401 | `function`<br>getUser_TEST("wrong password", {id:1, username: "mj@ezwh.com", password: "ciaociao"}, 401) -> failed|
| False | Yes | Yes | Invalid | `getUser_TEST()` terminates with 401 | `function`<br>getUser_TEST("wrong username", {id:1, username: "customer1@ezwh.com", password: "testpassword"}, 401) |
| undefined | undefined | undefined | Invalid | `getUser_TEST()` terminates with `undefined`| `function`<br>getUser_TEST("bad request", undefined, undefined) |

### **Class *UserController* - method *editUser***

**Criteria for method *editUser*:**

- `username` exists in the database
- req not empty
- param not empty

**Predicates for method *editUser*:**

| Criteria | Predicate |
| -------- | --------- |
| `username` exists in the database | True |
|          | False |
|          | undefined |
| req not empty | Yes |
|          | No |
| param not empty | Yes |
|          | No |

**Combination of predicates**:

| `username` exists in the database | req not empty | param not empty | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| True | Yes | Yes | Valid | `editUser_TEST()` terminates with 200 | `function`<br>editUser_TEST("edited ok", {<br>"oldType" : "clerk",<br>"newType" : "qualityEmployee"},<br>"mj@ezwh.com",200) |
| False | Yes | Yes | Invalid | `editUser_TEST()` terminates with 404 | `function`<br>editUser_TEST("user not found",{<br>"oldType" : "clerk",<br>"newType" : "qualityEmployee"},<br>"user2@ezwh.com",404) |
| undefined | No | No | Invalid | `editUser_TEST()` terminates with 503 | `function`<br>editUser_TEST("bad request", undefined, "mj@ezwh.com", 503)|
| undefined | No | No | Invalid |`editUser_TEST()` terminates with 503 | `function`<br>editUser_TEST("bad request", {"oldType" : "clerk",<br>"newType" : "qualityEmployee"},<br>undefined, 503) |

### **Class *UserController* - method *deleteUser***

**Criteria for method *deleteUser*:**

- `username` exists in the database
- `type` corresponds to inserted user
- param not empty

**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
| `username` exists in the database | True |
|          | False |
|          | undefined |
| `type` corresponds to inserted user | True |
|| False |
|| undefined |
| param not empty | Yes |
|          | No |

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

| `username` exists in the database | `type` corresponds to inserted user | param not empty | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| True | True | Yes | Valid | `deleteUser_TEST()` terminates with 204 | `function`<br> deleteUser_TEST("deleted ok", {type: "supplier", username : "mj@ezwh.com"}, 204)|
| True | False | Yes | Invalid | `deleteUser_TEST()` terminates with 503 | `function`<br> deleteUser_TEST("type didn't match with user", {type: "clerk", username : "mj@ezwh.com"}, 503)|
| False | True | Yes | Invalid |  `deleteUser_TEST()` terminates with 503 | `function`<br> deleteUser_TEST("username not found", {type: "supplier", username : "pippo@ezwh.com"}, 503)|
| undefined | undefined | No | Invalid | `deleteUser_TEST()` terminates with 503 | `function`<br> deleteUser_TEST("bad request", undefined, 503)|

### Class *UserController* - method **logout**

**Criteria for method *logout***:

- Database 

**Predicates for method *logout*:**

| Criteria | Predicate |
| -------- | --------- |
|||
|||
|||
|||

**Combination of predicates**:

| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||




## **Class PositionController**
### **Class *PositionController* - method *getPositions()***
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
| *true* | valid |`getPositions_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getPositions_TEST(describe_NAME, expectedResult)`|
|*false*|invalid|`getPositions_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getPositions_TEST(describe_NAME, expectedResult)`|

### **Class *PositionController* - method *newPosition()***
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
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*| valid |`newPosition_TEST()` terminates with <br>`{code: 201, message: "CREATED"}` |`function` <br>`newPosition_TEST(describe_NAME, request, expectedResult)`|
| *true* |*false*| invalid |`newPosition_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`newPosition_TEST(describe_NAME, request, expectedResult)`|
| *false* |*true*| invalid |`newPosition_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`newPosition_TEST(describe_NAME, request, expectedResult)`|
| *false* |*false*| invalid |`newPosition_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`newPosition_TEST(describe_NAME, request, expectedResult)`|


### **Class *PositionController* - method *editPosition()***
**Criteria for method *editPosition()*:**
 - Database is reachable
 - `positionID` *exists* in the database
 - **Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints

**Predicates for method *editPosition()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `positionID` *exists* in the database|*true*|
||*false*|
|**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`positionID` *exists* in the database|**Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*|*true*| valid |`editPosition_TEST()` terminates with <br>`{code: 200, message: "OK"}` |`function` <br>`editPosition_TEST(describe_NAME, params, request, expectedResult)`|
| *true* |*true*|*false*| invalid |`editPosition_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}` |`function` <br>`editPosition_TEST(describe_NAME, params, request, expectedResult)`|
| *true* |*false*|*/*| invalid |`editPosition_TEST()` terminates with <br>`{code: 404, message: "Not Found"}` |`function` <br>`editPosition_TEST(describe_NAME, params, request, expectedResult)`|
| *false* |*/*|*/*| invalid |`editPosition_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}` |`function` <br>`editPosition_TEST(describe_NAME, params, request, expectedResult)`|


### **Class *PositionController* - method *editPositionID()***
**Criteria for method *editPositionID()*:**
 - Database is reachable
 - `positionID` *exists* in the database
 - `newPositionID` is *unique* in the database

**Predicates for method *editPositionID()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
| `positionID` *exists* in the database|*true*|
||*false*|
|`newPositionID` is *unique* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`positionID` *exists* in the database|`newPositionID` is *unique* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*|*true*| valid |`editPositionID_TEST()` terminates with <br>`{code: 200, message: "OK"}` |`function` <br>`editPositionID_TEST(describe_NAME, params, request, expectedResult)`|
| *true* |*true*|*false*| invalid |`editPositionID_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}` |`function` <br>`editPositionID_TEST(describe_NAME, params, request, expectedResult)`|
| *true* |*false*|*/*| invalid |`editPositionID_TEST()` terminates with <br>`{code: 404, message: "Not Found"}` |`function` <br>`editPositionID_TEST(describe_NAME, params, request, expectedResult)`|
| *false* |*/*|*/*| invalid |`editPositionID_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}` |`function` <br>`editPositionID_TEST(describe_NAME, params, request, expectedResult)`|


### **Class *PositionController* - method *deletePosition()***
**Criteria for method *deletePosition()*:**
 - Database is reachable

**Predicates for method *deletePosition()*:**
 | Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deletePosition_TEST()` terminates with <br>`{code: 204, message: "NO CONTENT"}` |`function` <br>`deletePosition_TEST(describe_NAME, params, expectedResult)`|
|*false*| valid |`deletePosition_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}` |`function` <br>`deletePosition_TEST(describe_NAME, params, expectedResult)`|



## **Class SKUitemController**
### **Class *SKUitemController* - method *getSKUitems()***
**Criteria for method *getSKUitems()*:**
 - Database is reachable

**Predicates for method *getSKUitems()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getSKUitems_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getSKUitems_TEST(describe_NAME, expectedResult)`|
|*false*| invalid |`getSKUitems_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}` |`function` <br>`getSKUitems_TEST(describe_NAME, expectedResult)`|



### **Class *SKUitemController* - method *getSKUitemsBySKUId()***
**Criteria for method *getSKUitemsBySKUId()*:**
 - Database is reachable
 - `SKUid` *exists* in the database

**Predicates for method *getSKUitemsBySKUId()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`SKUid` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`SKUid` *exists* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid |`getSKUitemsBySKUId_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getSKUitemsBySKUId_TEST(describe_NAME, params, expectedResult)`|
| *true* | *false* | invalid |`getSKUitemsBySKUId_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`getSKUitemsBySKUId_TEST(describe_NAME, params, expectedResult)`|
| *false* | */* | invalid |`getSKUitemsBySKUId_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getSKUitemsBySKUId_TEST(describe_NAME, params, expectedResult)`|



### **Class *SKUitemController* - method *getSKUitemsByRFID()***
**Criteria for method *getSKUitemsByRFID()*:**
 - Database is reachable
 - `RFID` *exists* in the database

**Predicates for method *getSKUitemsByRFID()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`RFID` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`RFID` *exists* in the database| Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid |`getSKUitemsByRFID_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getSKUitemsByRFID_TEST(describe_NAME, params, expectedResult)`|
| *true* | *false* | invalid |`getSKUitemsByRFID_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`getSKUitemsByRFID_TEST(describe_NAME, params, expectedResult)`|
| *false* | */* | invalid |`getSKUitemsByRFID_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getSKUitemsByRFID_TEST(describe_NAME, params, expectedResult)`|

### **Class *SKUitemController* - method *newSKUitem()***
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


### **Class *SKUitemController* - method *editSKUitem()***
**Criteria for method *editSKUitem()*:**
 - Database is reachable
 - `RFID` *exists* in the database

**Predicates for method *editSKUitem()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`RFID` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`RFID` *exists* in the database|Valid / Invalid| Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *true* | valid |`editSKUitem_TEST()` terminates with <br>`{code: 201, message: "CREATED"}`|`function` <br>`editSKUitem_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *false* | invalid |`editSKUitem_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`editSKUitem_TEST(describe_NAME, params, request, expectedResult)`|
| *false* | */* | invalid |`editSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`editSKUitem_TEST(describe_NAME, params, request, expectedResult)`|


### **Class *SKUitemController* - method *deleteSKUitem()***
**Criteria for method *deleteSKUitem()*:**
 - Database is reachable

**Predicates for method *deleteSKUitem()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable |Valid / Invalid| Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`deleteSKUitem_TEST()` terminates with <br>`{code: 204, message: "No Content"}`|`function` <br>`deleteSKUitem_TEST(describe_NAME, params, expectedResult)`|
| *false* | invalid |`deleteSKUitem_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`deleteSKUitem_TEST(describe_NAME, params, expectedResult)`|



## **Class SKUController**
### **Class *SKUController* - method *getStoredSKUs()***
**Criteria for method *getStoredSKUs()*:**
 - Database is reachable

**Predicates for method *getStoredSKUs()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`getStoredSKUs_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getStoredSKUs_TEST(describe_NAME, expectedResult)`|
|*false*| invalid |`getStoredSKUs_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}` |`function` <br>`getStoredSKUs_TEST(describe_NAME, expectedResult)`|

### **Class *SKUController* - method *getStoredSKUById()***
**Criteria for method *getStoredSKUById()*:**
 - Database is reachable
 - `SKUid` *exists* in the database

**Predicates for method *getStoredSKUById()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|
|`SKUid` *exists* in the database|*true*|
||*false*|

**Combination of predicates**:
| Database is reachable |`SKUid` *exists* in the database | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* |*true*| valid |`getStoredSKUById_TEST()` terminates with <br>`{code: 200}`|`function` <br>`getStoredSKUById_TEST(describe_NAME, params, expectedResult)`|
| *true* |*false*| invalid |`getStoredSKUById_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`getStoredSKUById_TEST(describe_NAME, params, expectedResult)`|
| *false* |*/*| invalid |`getStoredSKUById_TEST()` catch `TypeError` and terminates with <br>`{code: 500, message: "Internal Server Error"}`|`function` <br>`getStoredSKUById_TEST(describe_NAME, params, expectedResult)`|


### **Class *SKUController* - method *newSKU()***
**Criteria for method *newSKU()*:**
 - Database is reachable

**Predicates for method *newSKU()*:**

| Criteria              | Predicate |
| :--------:            | :---------: |
| Database is reachable | *true* |
|                       | *false*|

**Combination of predicates**:
| Database is reachable | Valid / Invalid | Description of the test case | Jest test case |
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | valid |`newSKU_TEST()` terminates with <br>`{code: 201, message: "CREATED"}`|`function` <br>`newSKU_TEST(describe_NAME, request, expectedResult)`|
| *false* | invalid |`newSKU_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Unprocessable Entity"}`|`function` <br>`newSKU_TEST(describe_NAME, request, expectedResult)`|



### **Class *SKUController* - method *editSKU()***
**Criteria for method *editSKU()*:**
 - Database is reachable
 - `SKUid` *exists* in the database
 - **Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints

**Predicates for method *editSKU()*:**

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
| *true* | *true* | *true* | valid |`editSKU_TEST()` terminates with <br>`{code: 200}`|`function` <br>`editSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *true* | *false* | invalid |`editSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`editSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *false* | */* | invalid |`editSKU_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`editSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *false* | */* | */* | invalid |`editSKU_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`editSKU_TEST(describe_NAME, params, request, expectedResult)`|


### **Class *SKUController* - method *addOrEditPositionSKU()***
**Criteria for method *addOrEditPositionSKU()*:**
 - Database is reachable
 - `positionID` is already assigned to **SKU**
 - `SKUid` *exists* in the database
 - `positionID` *exists* in the database
 - **Position** associated to **SKU** satisfies `maxWeight` and `maxVolume` constraints

**Predicates for method *editSKU()*:**

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
| *true* | *true* | *true* | *true* | *true* | valid |`addOrEditPositionSKU_TEST()` terminates with <br>`{code: 200}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *true* | *true* | *true* | *false* | invalid |`addOrEditPositionSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *true* | *true* | *false* | */* | invalid |`addOrEditPositionSKU_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | *true* | *false* | */* | */* | invalid |`addOrEditPositionSKU_TEST()` terminates with <br>`{code: 404, message: "Not Found"}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *true* | */* | */* | */* | */* | invalid |`addOrEditPositionSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|
| *false* | */* | */* | */* | */* | invalid |`addOrEditPositionSKU_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult)`|

### **Class *SKUController* - method *deleteSKU()***
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
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| *true* | *false* | *false* | valid |`deleteSKU_TEST()` terminates with <br>`{code: 204, message: "No Content"}`|`function` <br>`deleteSKU_TEST(describe_NAME, params, expectedResult)`|
| *true* | *true* | *false* | invalid |`deleteSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`deleteSKU_TEST(describe_NAME, params, expectedResult)`|
| *true* | *false* | *true* | invalid |`deleteSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`deleteSKU_TEST(describe_NAME, params, expectedResult)`|
| *true* | *false* | *false* | invalid |`deleteSKU_TEST()` terminates with <br>`{code: 422, message: "Unprocessable Entity"}`|`function` <br>`deleteSKU_TEST(describe_NAME, params, expectedResult)`|
| *false* | */* | */* | invalid |`deleteSKU_TEST()` catch `TypeError` and terminates with <br>`{code: 503, message: "Service Unavailable"}`|`function` <br>`deleteSKU_TEST(describe_NAME, params, expectedResult)`|






## **Class InternalOrderController**
### **Class *InternalOrderController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**
s
| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||

## **Class ItemController**
### **Class *ItemController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||



## **Class RestockOrderController**
### **Class *RestockOrderController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||

## **Class ReturnOrderController**
### **Class *ReturnOrderController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||


## **Class TestDescriptorController**
### **Class *TestDescriptorController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||

## **Class TestResultController**
### **Class *TestResultController* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||



# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



