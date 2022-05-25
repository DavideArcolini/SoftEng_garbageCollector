# Integration and API Test Report

**Authors**:
 * Riccardo Medina
 * Simran Singh
 * Davide Arcolini
 * Giuseppe Atanasio

**Date**: 25 May 2022

**Version**: 
| Version | Changes |
| ------- |---------|
| 1.0 | Added first version of API Test Report document. |

# Contents

- [Integration and API Test Report](#integration-and-api-test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Integration Tests](#integration-tests)
  - [Step 1](#step-1)
  - [Step 2](#step-2)
- [API testing - Scenarios](#api-testing---scenarios)
  - [Scenario UCx.y](#scenario-ucxy)
- [Coverage of Scenarios and FR](#coverage-of-scenarios-and-fr)
- [Coverage of Non Functional Requirements](#coverage-of-non-functional-requirements)
    - [](#)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

The integration sequence we adopted is **bottom-up**. We started with unit-testing, in particular first with mock tests and then with real tests, in which we tested the controllers and their methods, and those are documented in `UnitTestReport.md`. Then, we proceeded to test the APIs in which we tested the routers for each controller class(`ItemRouter.js`, `UserRouter.js`, `PositionRouter.js`, `SKURouter.js`).
We used a single mockup, which is `mock_dao.js`

#  Integration Tests

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
| **UserController** | `getStoredUsers_TEST_mock()` | `getStoredUsers_TEST()` |
| **UserController** | | `getSuppliers_TEST()` |
| **UserController** | `newUser_TEST_mock()` | `newUser_TEST()` |
| **UserController** | `getUser_TEST_mock()` | `getUser_TEST()` |
| **UserController** | `editUser_TEST_mock()` | `editUser_TEST()` |
| **UserController** | `deleteUser_TEST_mock()` | `deleteUser_TEST()` |
| **PositionController**  | `getPositions_MOCK()` | `getPositions_TEST()` |
| **PositionController**  | `newPosition_MOCK()` | `newPosition_TEST()` |
| **PositionController**  | `editPosition_MOCK()` | `editPosition_TEST()` |
| **PositionController**  | `editPositionID_MOCK()` | `editPositionID_TEST()` |
| **PositionController**  | `deletePosition_MOCK()` | `deletePosition_TEST()` |
| **SKUitemController** | `getSKUitems_MOCK() ` | `getSKUitems_TEST() ` |
| **SKUitemController** | `getSKUitemsBySKUId_MOCK()` | `getSKUitemsBySKUId_TEST()` |
| **SKUitemController** | `getSKUitemsByRFID_MOCK()` | `getSKUitemsByRFID_TEST()` |
| **SKUitemController** | `newSKUitem_MOCK()` | `newSKUitem_TEST()` |
| **SKUitemController** | `editSKUitem_MOCK()` | `editSKUitem_TEST()` |
| **SKUitemController** | `deleteSKUitem_MOCK()` | `deleteSKUitem_TEST()` |
| **SKUController** | `getStoredSKUs_MOCK()` | `getStoredSKUs_TEST()` |
| **SKUController** | `getStoredSKUById_MOCK()` | `getStoredSKUById_TEST()` |
| **SKUController** | `newSKU_MOCK()` | `newSKU_TEST()` |
| **SKUController** | `editSKU_MOCK()` | `editSKU_TEST()` |
| **SKUController** | `addOrEditPositionSKU_MOCK()` | `addOrEditPositionSKU_TEST()` |
| **SKUController** | `deleteSKU_MOCK()` | `deleteSKU_TEST()` |
| **RestockOrderController** | `create restock order` | `createRestockOrder()` |
| **RestockOrderController** | `get restock order by id` | `getRestockOrderById()` |
| **RestockOrderController** | `get restock orders` | `getRestockOrders()` |
| **RestockOrderController** | `get restock orders issued` | `getRestockOrdersIssued()` |
| **RestockOrderController** | `modify restock orders state` | `modifyRestockOrderState()` |
| **RestockOrderController** | `put transport note` | `addTransportNote()` |
| **RestockOrderController** | `put skuItems` | `addSkuItems()` |
| **RestockOrderController** | `delete restock order` | `deleteRestockOrder()` |
| **InternalOrderController** | `create internal order` | `createInternalOrder()` |
| **InternalOrderController** | `get internal orders` | `getInternalOrders()` |
| **InternalOrderController** | `get internal order by id` | `getInternalOrdersById()` |
| **InternalOrderController** | `get internal orders issued` | `getInternalOrdersIssued()` |
| **InternalOrderController** | `get internal orders issued` | `getInternalOrdersAccepted()` |
| **InternalOrderController** | `modify internal orders state` | `modifyInternalOrderState()` |
| **InternalOrderController** | `delete internal order` | `deleteInternalOrder()` |
| **ReturnOrderController** | `create return order` | `createReturnOrder()` |
| **ReturnOrderController** | `get return order by id`| `getReturnOrderById()` |
| **ReturnOrderController** | `get return orders` | `getReturnOrders()` |
| **ReturnOrderController** | `delete return order` | `deleteReturnOrder()` |
| **ItemController**| `getItems()` | `getItems()` |
| **ItemController** | `getItemById()` | `getItemById()`|
| **ItemController** | `createItem()` | `createItem()`|
| **ItemController** | `modifyItem()` | `modifyItem()`|
| **ItemController** | `deleteItem()` | `deleteItem()` |
| **TestDescriptorController** | `getTestDescriptors()` | `getTestDescriptors()`|
| **TestDescriptorController** | `getTestDescriptorById()` | `getTestDescriptorById()`|
| **TestDescriptorController** | `createTestDescriptor()` | `createTestDescriptor()`|
| **TestDescriptorController** | `modifyTestDescriptor()` | `modifyTestDescriptor()`|
| **TestDescriptorController** | `deleteTestDescriptor()` | `deleteTestDescriptor()`|
| **TestResultController**|`getTestResults()` | `getTestResults()`|
| **TestResultController**|`getTestResultById()` | `getTestResultById()`|
| **TestResultController**|`createTestResult()` | `createTestResult()`|
| **TestResultController**|`modifyTestResult()` | `modifyTestResult()`|
| **TestResultController**|`deleteTestResult()` | `deleteTestResult()`|

## Step 2
| Classes  | Mocha-Chaii test cases |
|--|--|
| **UserController** | `getStoredUsers()` |
| **UserController** | `getSuppliers()` |
| **UserController** | `newUser()` |
| **UserController** | `getUser()` |
| **UserController** | `editUser()` |
| **UserController** | `deleteUser()` |
| **PositionController**  | `getPositions_TEST()` |
| **PositionController**  | `newPosition_TEST()` |
| **PositionController**  | `editPosition_TEST()` |
| **PositionController**  | `editPositionID_TEST()` |
| **PositionController**  | `deletePosition_TEST()` |
| **SKUitemController** | `getSKUitems_TEST()` |
| **SKUitemController** | `getSKUitemsBySKUId_TEST()` |
| **SKUitemController** | `getSKUitemsByRFID_TEST()` |
| **SKUitemController** | `newSKUitem_TEST()` |
| **SKUitemController** | `editSKUitem()` |
| **SKUitemController** | `deleteSKUitem_TEST()` |
| **SKUController** | `getStoredSKUs_TEST()` |
| **SKUController** | `getStoredSKUById_TEST()` |
| **SKUController** | `newSKU_TEST()` |
| **SKUController** | `editSKU_TEST()` |
| **SKUController** | `addOrEditPositionSKU_TEST()` |
| **SKUController** | `deleteSKU_TEST()` |
| **RestockOrderController** | `createRestockOrder()` |
| **RestockOrderController** | `getRestockOrderById()` |
| **RestockOrderController** | `getRestockOrders()` |
| **RestockOrderController** | `getRestockOrdersIssued()` |
| **RestockOrderController** | `modifyRestockOrderState()` |
| **RestockOrderController** | `addTransportNote()` |
| **RestockOrderController** | `addSkuItems()` |
| **RestockOrderController** | `deleteRestockOrder()` |
| **InternalOrderController** | `createInternalOrder()` |
| **InternalOrderController** | `getInternalOrders()` |
| **InternalOrderController** | `getInternalOrdersIssued()` |
| **InternalOrderController** | `getInternalOrdersAccepted()` |
| **InternalOrderController** | `modifyInternalOrderState()` |
| **InternalOrderController** | `deleteInternalOrder()` |
| **ReturnOrderController** | `createReturnOrder()` |
| **ReturnOrderController** | `getReturnOrderById()` |
| **ReturnOrderController** | `getReturnOrders()` |
| **ReturnOrderController** | `deleteReturnOrder()` |
| **ItemController**| `getItems()` |
| **ItemController** | `getItemById()`|
| **ItemController** | `createItem()`|
| **ItemController** | `modifyItem()`|
| **ItemController** | `deleteItem()` |
| **TestDescriptorController** | `getTestDescriptors()`|
| **TestDescriptorController** | `getTestDescriptorById()`|
| **TestDescriptorController** | `createTestDescriptor()` | 
| **TestDescriptorController** | `modifyTestDescriptor()` | 
| **TestDescriptorController** | `deleteTestDescriptor()` | 
| **TestResultController**|`getTestResults()` | 
| **TestResultController**|`getTestResultById()` | 
| **TestResultController**|`createTestResult()` | 
| **TestResultController**|`modifyTestResult()` | 
| **TestResultController**|`deleteTestResult()` | 


# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UCx.y

**Scenario 1.4**
| Scenario 1.4 |  Get all SKUs |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|       |  SKUs exist |
| Post condition | All SKUs retrieved |
| Step#        | Description  |
|  1     |  M searches SKUs |  
|  2     |  M retrieves SKUs |

**Scenario 1.5**
| Scenario 1.5 |  Get SKU S by ID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|       |  SKU S exist |
| Post condition | SKU S retrieved |
| Step#        | Description  |
|  1     |  M inserts ID |  
| 2 | M confirms data inserted |
|  3     |  M retrieves SKU S |

**Scenario 1.6**
| Scenario 1.6 |  Delete SKU S by ID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| Post condition | SKU S deleted |
| Step#        | Description  |
|  1     |  M inserts ID |  
| 2 | M confirms data inserted |
|  3     |  M deleted SKU S |

**Scenario 2.6**
| Scenario 2.6 |  Get all positions |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| Positions exist|
| Post condition | All positions retrieved |
| Step#        | Description  |
|  1     |  M searches positions |  
| 2 | M retrieves positions |

**Scenario 4.4**
| Scenario 4.4 |  List all users |
| ------------- |:-------------:| 
|  Precondition     | Admin A exists and is logged in |
|  | Account X exists |
|  Post condition     | A has received users list |
| Step#        | Description  |
|  1    |  A asks for users list  |
|  2    |  A has received users list |


**Scenario 11.3**
| Scenario 11.3 |  Get items by ID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||  exists|
| Post condition | item is retrieved |
| Step#        | Description  |
|  1     |  M chooses a item|  
|2 |M confirms data inserted |
| 3 | M retrieves item|

**Scenario 11.4**
| Scenario 11.4 |  delete item |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||  exists|
| Post condition | delete is deleted|
| Step#        | Description  |
|  1     |  M chooses a item|  
|2 |M confirms data inserted |
| 3 | EZWH deletes item|


**Scenario 12.4**
| Scenario 12.4 |  Get test descriptor by ID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||  exists|
| Post condition | test descriptor is retrieved |
| Step#        | Description  |
|  1     |  M chooses a test descriptor|  
|2 |M confirms data inserted |
| 3 | M retrieves test descriptor|


**Scenario 12.5**
| Scenario 12.5 |  Get tests descriptor|
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||  exists|
| Post condition | tests descriptor are retrieved |
| Step#        | Description  |
|  1     |  M chooses to see all tests descriptor|  
|2 |M confirms data inserted |
| 3 | M retrieves tests descriptor|


**Scenario 13.1**
| Scenario 13.1 |  Get all SKUitems |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| SKUitems exist|
| Post condition | All SKUitems retrieved |
| Step#        | Description  |
|  1     |  M searches SKUitems |  
| 2 | M retrieves SKUitems |

**Scenario 13.2**
| Scenario 13.2 |  Get all SKUitem by ID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| SKUitems exist|
| Post condition | all SKUitems retrieved |
| Step#        | Description  |
|  1     |  M inserts ID |  
|2 |M confirms data inserted |
| 3 | M retrieves SKUitems |

**Scenario 13.3**
| Scenario 13.3 |  Get SKUitem Si by RFID |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| SKUitem exists|
| Post condition | SKUitem Si retrieved |
| Step#        | Description  |
|  1     |  M inserts RFID |  
|2 |M confirms data inserted |
| 3 | M retrieves SKUitem Si |

**Scenario 13.4**
| Scenario 13.4 |  Create new SKUitem Si |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| SKUitems Si does not exist|
| Post condition | SKUitem Si created |
| Step#        | Description  |
|  1     |  M inserts RFID |  
|  2     |  M inserts SKUid |
|  3     |  M inserts DateOfStock |   
|4 |M confirms data inserted |
| 5 | SKUitem Si created |

**Scenario 13.5**
| Scenario 13.5 |  Modify SKUitem Si |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|| SKUitems Si exists|
| Post condition | SKUitem Si modified |
| Step#        | Description  |
|  1     |  M inserts RFID |  
|  2     |  M inserts newRFID |
|  3     |  M inserts newAvailable |
|  4     |  M inserts newDateOfStock |   
|5 |M confirms data inserted |
| 6 | SKUitem Si modified |

**Scenario 13.6**
| Scenario 13.6 |  Delete SKUitem Si |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| Post condition | SKUitem Si removed |
| Step#        | Description  |
| 1 |  M inserts RFID |  
| 2 | M confirms data inserted |
| 3 | SKUitem Si removed |

**Scenario 14.1**
| Scenario 14.1 |  Delete test result |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| Post condition | test result TR is removed |
| Step#        | Description  |
| 1 |  M inserts RFID and ID |  
| 2 | M confirms data inserted |
| 3 | test result TR removed |

**Scenario 14.2**
| Scenario 14.2 |  Modify test result |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| Post condition | test result TR is modified |
| Step#        | Description  |
| 1 |  M inserts RFID and ID | 
|2| M insert new data| 
| 3 | M confirms data inserted |
| 4 | test result TR modified|



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | :-------------------------------: | :-----------: | 
| 1-1         | FR2.1                           | `newSKU_APITEST()` |
| 1-2         | FR2.1                           | `addOrEditPositionSKU_APITEST()` |
| 1-3         | FR2.1                           | `editSKU_APITEST()` |
| 1-4 (new)   | FR2.3                           | `getStoredSKUs_APITEST()` |
| 1-5 (new)   | FR2.4                           | `getStoredSKUById_APITEST()` |
| 1-6 (new)   | FR2.2                           | `deleteSKU_APITEST()` |
| 2-1         | FR3.1.1                         | `newPosition_APITEST()` |
| 2-2         | FR3.1.1                         | `editPositionID_APITEST()` |
| 2-3         | FR3.1.4                         | `editPosition_APITEST()` |
| 2-4         | FR3.1.4                         | `editPosition_APITEST()` |
| 2-5         | FR3.1.2                         | `deletePosition_APITEST()` |
| 2-6 (new)   | FR3.1.3                         | `getPositions_APITEST()` |
|  3-1        |   FR5.1,<br>FR5.6,<br>FR7                          |   `createRestockOrder()`,<br>`getItems()`|  
|  3-2        |   FR5.6 ,FR7                       |   `createRestockOrder()`,<br>`getItems()`|  
| 4-1         | FR1.1                           | `newUser()` |             
| 4-2         | FR1.1                           | `editUser()` |             
| 4-3         | FR1.2                           | `deleteUser()` |
| 4-4 (new)   | FR1.3                           | `getStoredUsers()` |
|  5-1-1        |       FR5.7, <br> FR5.8 |   `modifyRestockOrderState()`|  
|  5-2-1        |         FR5.7,<br>FR5.8.2                   |   `modifyRestockOrderState()`,<br>`createTestResult()`|  
|5-2-2| FR5.7, <br>FR5.8.2    | `modifyRestockOrderState()`,<br>`createTestResult()`|
|5-2-3| FR5.7,<br>FR5.8.2    | `modifyRestockOrderState()`,<br>`createTestResult()`|
| 5-3-1| FR5.7 | `modifyRestockOrderState()`,<br>`setSkuItems()`|
| 5-3-2| FR5.7| `modifyRestockOrderState()`,<br>`getReturnItems()`,<br>`getTestResults()`|
| 5-3-3| FR5.7 | `modifyRestockOrderState()`,<br>`getReturnItems()`|
| 6-1| FR6.1 | `createReturnOrder()`,<br>`getTestResultById()`|
| 6-2| FR5.0, <br> FR6.1 | `createReturnOrder()`,<br> `getRestockOrderById()`,<br>`getTestResultById()`|
| 9-1| FR6.5, <br> FR6.6| `createInternalOrder()`,<br> `modifyInternalOrderState()`|
| 9-2| FR6.6, <br> FR6.7 | `modifyInternalOrderState()`|
| 9-3| FR6.6, <br> FR6.7 | `modifyInternalOrderState()`|
| 10-1| FR6.7, <br> FR6.8 | `getInternalOrderById()`,<br>`modifyInternalOrderState()`|
|     11-1     |       FR7                           |  `createItem()`       |
|     11-2     |      FR7                            |  `modifyItem()`       |
| 11-3 (new)    |        FR7                        |  `getItemById()`       |
| 11-4 (new)    |        FR7                        |  `deleteItem()`       |
|     12-1     |   FR3.2,<br> FR3.2.1                               |  `createTestDescriptor()`       |
|     12-2     |       FR3.2,<br> FR3.2.2                            |  `modifyTestDescriptor()`       |
|     12-3     |        FR3.2,<br>FR3.2.3                           |  `deleteTestDescriptor()`       |
|  12-4(new)   |        FR3.2                           |  `getTestDescriptorById()`       |
|  12-5(new)   |        FR3.2                           |  `getTestDescriptors()`       |
| 13-1 (new)  |     /                           | `getSKUitems_APITEST()` |
| 13-2 (new)  |     /                           | `getSKUitemsBySKUId_APITEST()` |
| 13-3 (new)  |     /                           | `getSKUitemsByRFID_APITEST()` |
| 13-4 (new)  | FR5.8.3                         | `newSKUitem_APITEST()` |
| 13-5 (new)  |     /                           | `editSKUitem_APITEST()` |
| 13-6 (new)  | FR6.10                          | `deleteSKUitem_APITEST()` |
| 14-1 (new)  |                           | `deleteTestResult()` |
| 14-2 (new)  |                           | `modifyTestResult()` |
           



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|     NFR2                       |   Every test case. Some tests may take a bit longer than 0.5sec, depending on the CPU.        |
|     NFR3                       |   `newUser()` hashes passwords   |
|     NFR4                       | `editPosition_APITEST()` <br> `editPositionID_APITEST()` <br> `deletePosition_APITEST` |
|     NFR5                       |  `getSKUitemsBySKUId_APITEST()` <br> `newSKUitem_APITEST()` <br> `getStoredSKUById_APITEST` <br> `editSKU_APITEST()` <br> `addOrEditPositionSKU_APITEST()` <br> `deleteSKU_APITEST()`|
|     NFR6                       |  `editSKUitem_APITEST()` <br> `newSKUitem_APITEST()` <br> `getSKUitemsByRFID_APITEST()` |
|     NFR9                       |     `newSKUitem_APITEST()` <br>  `editSKUitem_APITEST()` |


