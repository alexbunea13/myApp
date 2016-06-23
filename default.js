var StatusEnum = Object.freeze({ "New": 1, "In Progress": 2, "ReadyForTesting": 3, "Feedback": 4, "Reworked": 5, "Resolved": 6 })

function getCurrentTime (){
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return str;
}

function getLoggedUser() {
    if (!window.sessionStorage.getItem("user")) {
        var person = prompt("Please enter your name");
        window.sessionStorage.setItem("user", person);
        console.log("you are logged in");
        return person;
    }
    return window.sessionStorage.getItem("user");
}

function Task(name, sprint, assignee, description, status, messages, updatedAt, parentID) {
    this.Name = name;
    this.Sprint = sprint;
    this.Assignee = assignee;
    this.CreatedBy = getLoggedUser();
    this.ID = new Date().getTime() + "@" + this.CreatedBy;
    this.Description = description;
    this.Status = StatusEnum.New;
    this.Messages = [];
    this.UpdatedAt = getCurrentTime();
    this.CreatedAt = getCurrentTime();
    this.ParentID = parentID;
}

Feature.prototype = new Task();
Bug.prototype = new Task();
function Feature() {
    Task.apply(this, arguments);
    this.Tasks = [];
    this.type = "Feature";
}

function Bug() {
    Task.apply(this, arguments);
    this.Tasks = [];
    this.type = "Bug";
}

var myApp = {

    createTicket: function (type) {
        switch (type) {
            case "Feature":
                {
                    Feature(name, sprint, assignee, createdBy, description, status, messages, parentID);
                }
                break;

            case "Bugs":
                {
                    Bug(name, sprint, assignee, createdBy, description, status, messages, parentID);
                }
                break;

            case "Task":
                {
                    Task(name, sprint, assignee, createdBy, description, status, messages, parentID);
                }
                break;
        }
    },
    update: function (TaskUpdated) {
        if (TaskUpdated.ID) {
            tasks.forEach(function (entry) {
                if (entry.ID == TaskUpdated.ID) {
                    entry.Name = TaskUpdated.Name;
                    entry.Sprint = TaskUpdated.Sprint;
                    entry.Assignee = TaskUpdated.Assignee;
                    entry.CreatedBy = TaskUpdated.CreatedBy;
                    entry.Description = TaksUpdated.Description;
                    entry.Status = TaskUpdated.Status;
                    entry.Messages = TaskUpdated.Messages;
                    entry.UpdatedAt = this.getCurrentTime();
                    entry.parentID = TaskUpdated.parentID;
                }
            });

        }
    },

  
    createSprint: function (name) {
        newSprint = new Object();
        newSprint.name = name;
        newSprint.ID = new Date().getTime();
        newSprint.dateCreated = getCurrentTime();
        this.sprints.push(newSprint);
        var index = this.sprints.indexOf(newSprint);
        newSprint.ID = newSprint.ID + index;
    },
    sprints: [],
    tasks: [],
    
    getTask: function (taskID) {
        var task;
        var subtasks = [];
       this.tasks.forEach(function (entry) {
            if (taskID == entry.ID) {
                task = entry;
            }
            else if (taskID == entry.ParentID) {
                subtasks.push(entry);
            }
        }
        )
        if (task) {
            task.Tasks = subtasks;
        }
        return task;
    },
    moveTask: function (taskID, newSprintID) {
        var task = this.getTask(taskID);
        if (task) {
            if ((task.type == "Feature" || task.type == "Bug") && task.Tasks) {
                task.Sprint = newSprintID;
                task.Tasks.forEach(function (entry) {
                    entry.Sprint = newSprintID;
                }
                 )
            }
        }
    },
    getBySprintIDType: function (SprintID, type) {
        var tasksToReturn = [];
        var _clouser = this;
        this.tasks.forEach(function (entry) {
            if (entry.Sprint == SprintID) {
                if (entry.type == type) {
                    var taskModel = _clouser.getTask(entry.ID);
                    tasksToReturn.push(taskModel);
                }
            }
            
        })
        return tasksToReturn;
 
    },
    getBySprintID: function (SprintID) {
        var tasksToReturn = [];
        this.tasks.forEach(function (entry) {
            if (entry.Sprint == SprintID) {
                tasksToReturn.push(entry);
            }
        })
        return tasksToReturn;
    },
    getStatusStats: function (tasks) {
        var statusStats = new Object();
        if (tasks) {
            tasks.forEach(function (entry) {
                if (!statusStats[entry.type]) {
                    statusStats[entry.type] = 1;
                }
                else statusStats[entry.type]++;
            })
            return statusStats;
        }
    },
    overview: function () {
        var overviewObj = [];
        for (sp in this.sprints) {
                var Sprint = this.sprints[sp].ID;
                var FeatureNumber = this.getBySprintIDType(Sprint, "Feature") ? this.getBySprintIDType(Sprint, "Feature").length : 0;
                var BugsNumber = this.getBySprintIDType(Sprint, "Bug") ? this.getBySprintIDType(Sprint, "Bug").length : 0;
                var stats = this.getStatusStats(this.getBySprintIDType(Sprint));
                overviewObj.push({ "Sprint": Sprint, "FeatureNumber": FeatureNumber, "BugsNumber": BugsNumber, "TicketsStatistics": stats });
        }
        return overviewObj;
    },

    filterByStatus: function (status) {
        var filteredResult = [];
        this.tasks.forEach(function (entry) {
            if (entry.Status == status) {
                filteredResult.push(entry);
            }
        })
        return filteredResult;
    },
    changeStatusToReady: function (TaskID) {
        var subtasks = [];
        this.tasks.forEach(function (entry) {
            if (entry.parentID) {
                if (TaskID == entry.ParentID) {
                    subtasks.push(entry);
                }
            }
        })
        var TaskUpdated = this.getTask(TaskID);
        if (subtasks.length == 0)
        { TaskUpdated.Status = StatusEnum.ReadyForTesting; }

        return (TaskUpdated);
    },
    init: function () {
        this.createSprint("Sprint1");
       this.createSprint("Sprint2");
        //  this.createSprint("Sprint3");
       var firstSprintID = this.sprints[0].ID;
       var secondSprintID = this.sprints[1].ID;
        myFeature = new Feature("Feature1", firstSprintID, "intern1", "creator", "trebuie implementat urgent", [], null);
        myBug = new Bug("Bug1",firstSprintID, "intern1", "creator", "Trebuie rezolvat", [], null);
        //moveTask(featureulMeu.ID, firstSprintID);
        this.tasks.push(myFeature);
        this.tasks.push(myBug);
        this.overview();
        myBug = this.changeStatusToReady(myBug.ID);
        this.filterByStatus(StatusEnum.New);
        this.moveTask(myBug.ID, secondSprintID);



    }
};

myApp.init();
