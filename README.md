## Taskydo
<p align="center">
  <img src="https://github.com/Sulaimon-Rasheed/taskydo/blob/main/src/public/apple-touch-icon.png" width="80" height="80"/>
</p>

  <p align="center"> ...ensuring you meet task's deadlines for improved productivity</p>

### Introduction
<<<<<<< HEAD
[Taskydo](https://taskydo.onrender.com) Taskydo is a leading to-do application that provides you with a seamless service to properly manage your tasks for productivity.
Staying organised is very key to meeting up with targets and being efficient in fixing and getting things done.Therefore, Taskydo has been carefully engineered to feature relevant and top notch micro services that put you on top of your tasks. A relational databse is used as data storage to enhance future growth (scalability).
This application is the answer to a cluttered set of activities that leads to missing deadlines. The endpoints with examples can be accessed from [Here](https://taskydo.onrender.com)
=======
  [Taskydo](https://documenter.getpostman.com/view/28974381/2sA3XLEj2Q) is a leading to-do application that provides you with a seamless service to properly manage your tasks for productivity.
  Staying organised is very key to meeting up with targets and being efficient in fixing and getting things done.Therefore, Taskydo has been carefully engineered to feature   relevant and top notch micro services that put you on top of your tasks. A relational databse is used as data storage to enhance future growth (scalability).
  This application is the answer to a cluttered set of activities that leads to missing deadlines.Read the documentation [Here](https://documenter.getpostman.com/view/28974381/2sA3XLEj2Q) for every request and response details.
>>>>>>> 949d60158f339fb64bf6239e3202ccc812a7079f

### Getting started (signing up):
1. You need to enter a userName, password and a unique email as a JSON object to open an account with Taskydo .
2. Your password should not be less than 8 characters.

### Authentication and Authorization
1. After signining up,users must login to make all the task related requests.e.g task creation, task updating, task filtering e.t.c. This is because the system authenticate and authorize users before a request is allowed.
2. A Jwt token is generated when a user Login. The token stores encrypted details of the user in the client's cookie storage to authenticate and authorize the user when making request to the API. The Jwt token expires after 2hrs. Meaning, users will be authomatically logged out after 2hrs for security reasons.
3. To login, use the correct email and password as used when signing up. Else, you will get an error message.

### Creating a task
1. To create a task (i.e your to-do), user need to enter the title, description and a due_date as a JSON object.
<<<<<<< HEAD
2. The due_date must be in the format yyyy-mm-ddTHH:MM:ssZ e.g 2024-08-10T14:30:00Z (i.e 10th August, 2024 at 2:30PM)
3. Every task is created with a default status , "Pending"
=======
2. The due_date should be in the format yyyy-mm-ddTHH:MM:ssZ e.g 2024-08-10T14:30:00Z (i.e 10th August, 2024 at 2:30PM)
3. Every task is created with a default status , "Pending" (i.e Not yet done or completed)
>>>>>>> 949d60158f339fb64bf6239e3202ccc812a7079f

### Retreiving task/tasks:
When a task or tasks are retrieved , the response object for each task contains a unique URL to update its status as "Completed" or "Pending" depending on the current status and also contains a unique URL to also delete the task if desired.Retrieved tasks or filtered tasks are paginated. So you can view the next page by adding the query parameter ?page= . E.g ?page=2

### Filtering tasks:
1. Completed tasks can be filtered out by adding the query parameter, ?status=Completed to the filtering endpoint .
2. Pending tasks can also be filtered out by adding the query parameter, ?status=Pending to the filtering endpoint .

### Updating a task:
1. The title, description and a due_date of tasks can be updated. The update should be sent as JSON object just like when creating a task.
2. The endpoint to update a task can be found in the response object of retreived task with an attached <b style="font-weight:bold">id<b> as a path parameter.

### Deleting a task:
1. The response object of every retrieved task contains the field that stores the endpoint to delete the retrieved task. 
2. The endpoint to delete a task can be found in the response object of retreived task with an attached <b style="font-weight:bold">id<b> as a path parameter.

<<<<<<< HEAD
### Key Notes:
=======
#### Key Notes:
>>>>>>> 949d60158f339fb64bf6239e3202ccc812a7079f
- It is advisable you later delete completed tasks to free the memory.
- All responses are JSON objects.
- When done, ensure you Logout from the system for security reasons.
- Excessive or too many requests to the API is prevented with a rate limiting tool.
<<<<<<< HEAD
- The endpoints with examples can be accessed from [Here](https://taskydo.onrender.com)
=======
- Read the documentation [Here](https://documenter.getpostman.com/view/28974381/2sA3XLEj2Q) for every request and response details.
>>>>>>> 949d60158f339fb64bf6239e3202ccc812a7079f

#### Stay in touch
- Author - [Sulaimon Rasheed](https://dev-sulaimon.onrender.com)

#### License
<<<<<<< HEAD
- Taskydo is [MIT licensed](LICENSE).
=======
- Taskydo is [MIT licensed](LICENSE).
>>>>>>> 949d60158f339fb64bf6239e3202ccc812a7079f
