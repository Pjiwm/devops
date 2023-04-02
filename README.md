

# devops

School project for building a kanban board with a variety of devops features.
The goal of this project is to use a handful of design patterns to achive a structured and maintainable codebase.


![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&labelColor=ffffff&logoColor=3178C6&logo=typescript)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pjiwm_devops&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pjiwm_devops)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/pjiwm/devops)
![workflow](https://github.com/Pjiwm/devops/actions/workflows/build.yml/badge.svg)
![workflow](https://github.com/Pjiwm/devops/actions/workflows/jest.yml/badge.svg)
![workflow](https://github.com/Pjiwm/devops/actions/workflows/code_quality.yml/badge.svg)


## List strategy
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/BackLogList_diagram.png)


# Diagram of each module:

## Backlog Item
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/BacklogItem_diagram.png)

## Jobs
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Jobs_diagram.png)

## Observers
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Observer_diagram.png)

## Person and roles
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Person_diagram.png)
#### *T extends Role
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Roles_diagram.png)

## Sprint backlog
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/BackLogFactory_diagram.png)
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/SprintBacklog_diagram.png)

## Sprint
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Sprint_diagram.png)

## Threads
![image](https://github.com/Pjiwm/devops/blob/main/docs/uml/Thread_diagram.png)

# Test coverage:
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines               
--------------------------|---------|----------|---------|---------|-------------------------------------
All files                 |   94.52 |    73.68 |   96.42 |   94.49 |                                     
 src                      |   96.42 |    94.44 |   95.52 |   96.37 |                                     
  ActivityMap.ts          |     100 |      100 |     100 |     100 |                                     
  BackLogItem.ts          |     100 |       80 |     100 |     100 | 76                                  
  Branch.ts               |     100 |      100 |     100 |     100 |                                     
  Person.ts               |     100 |      100 |     100 |     100 |                                     
  PersonFactory.ts        |     100 |      100 |     100 |     100 |                                     
  Pipeline.ts             |   68.75 |      100 |    62.5 |   68.75 | 17,31-32,46-47                      
  Repository.ts           |     100 |      100 |     100 |     100 |                                     
  SprintBackLog.ts        |     100 |      100 |     100 |     100 |                                     
 src/BackLogFactory       |     100 |      100 |     100 |     100 |                                     
  SprintBackLogFactory.ts |     100 |      100 |     100 |     100 |                                     
 src/BackLogList          |     100 |      100 |     100 |     100 |                                     
  DoingList.ts            |     100 |      100 |     100 |     100 |                                     
  DoneList.ts             |     100 |      100 |     100 |     100 |                                     
  ListStategy.ts          |     100 |      100 |     100 |     100 |                                     
  ReadyForTestingList.ts  |     100 |      100 |     100 |     100 |                                     
  TestedList.ts           |     100 |      100 |     100 |     100 |                                     
  TestingList.ts          |     100 |      100 |     100 |     100 |                                     
  TodoList.ts             |     100 |      100 |     100 |     100 |                                     
 src/Jobs                 |     100 |      100 |     100 |     100 |                                     
  BuildJob.ts             |     100 |      100 |     100 |     100 |                                     
  DeployJob.ts            |     100 |      100 |     100 |     100 |                                     
  FailingJob.ts           |     100 |      100 |     100 |     100 |                                     
  InstallPackagesJob.ts   |     100 |      100 |     100 |     100 |                                     
  Job.ts                  |     100 |      100 |     100 |     100 |                                     
  TestJob.ts              |     100 |      100 |     100 |     100 |                                     
 src/Observer             |     100 |      100 |     100 |     100 |                                     
  EmailNotifier.ts        |     100 |      100 |     100 |     100 |                                     
  LogObserver.ts          |     100 |      100 |     100 |     100 |                                     
  SlackNotifier.ts        |     100 |      100 |     100 |     100 |                                     
 src/Roles                |     100 |      100 |     100 |     100 |                                     
  Developer.ts            |     100 |      100 |     100 |     100 |                                     
  LeadDeveloper.ts        |     100 |      100 |     100 |     100 |                                     
  ProductOwner.ts         |     100 |      100 |     100 |     100 |                                     
  Role.ts                 |     100 |      100 |     100 |     100 |                                     
  ScrumMaster.ts          |     100 |      100 |     100 |     100 |                                     
  Tester.ts               |     100 |      100 |     100 |     100 |                                     
 src/Sprint               |   89.86 |    59.57 |   94.64 |   89.86 |                                     
  ActivatedState.ts       |   87.27 |    60.86 |     100 |   87.27 | 42,47,81-82,98-99,108               
  CanceledState.ts        |     100 |      100 |     100 |     100 |                                     
  ClosedState.ts          |     100 |      100 |     100 |     100 |                                     
  CreatedState.ts         |     100 |      100 |     100 |     100 |                                     
  FinishedState.ts        |     100 |      100 |     100 |     100 |                                     
  Sprint.ts               |   83.72 |    66.66 |   86.36 |   83.72 | 139,165,176-184,208,216,229-237,251 
  SprintBuilder.ts        |   82.97 |       25 |     100 |   82.97 | 83,86-88,91,94,97,101               
  SprintProperties.ts     |     100 |      100 |     100 |     100 |                                     
  Type.ts                 |     100 |      100 |     100 |     100 |                                     
 src/Thread               |     100 |      100 |     100 |     100 |                                     
  Message.ts              |     100 |      100 |     100 |     100 |                                     
  Reply.ts                |     100 |      100 |     100 |     100 |                                     
  Thread.ts               |     100 |      100 |     100 |     100 |                                     
