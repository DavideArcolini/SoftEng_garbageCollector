# Project Estimation  
Date:

Version:


# Estimation approach
Consider the EZWH  project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   | 18 |             
|  A = Estimated average size per class, in LOC       | 200 | 
| S = Estimated size of project, in LOC (= NC * A) | 3.600 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  | 360 |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | €10.800 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 12 |               

# Estimate by product decomposition
### 
> Assumption: we are considering a team of 4 experts in their field, for this reason the following estimations rely on Delphi Expert Estimation technique.

|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Requirement Document    | 46 |
| GUI prototype | 25 |
| Design Document | 54 |
| Code | 180 |
| Unit tests | 49 |
| API tests | 44 |
| Management Documents  | 19 |

# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Planning | 6 |
| Requirements | 90 |
| Design | 72 |
| Implementation | 226 |
| Unit testing | 52 |
| Integration testing | 83 |
| Acceptance testing | 10 |
###
Insert here Gantt chart with above activities
>
```plantuml
@startgantt
title Gantt's diagram
saturday are closed
sunday are closed
project starts the 2022/03/27
[Planning] lasts 19 days
[Requirements] lasts 3 days
[Design] lasts 3 days
[Design] starts at [Requirements]'s end
[Implementation] lasts 7 days
[Implementation] starts at [Design]'s end
[Unit Testing] lasts 2 day
[Unit Testing] starts at [Implementation]'s end
[Integration Testing] lasts 3 days
[Integration Testing] starts at [Unit Testing]'s end
[Acceptance Testing] lasts 1 day
[Acceptance Testing] starts at [Integration Testing]'s end
@endgantt
```
# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size |  |
| estimate by product decomposition |  |
| estimate by activity decomposition |  |
