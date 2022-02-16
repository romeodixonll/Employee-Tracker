const express = require("express");
// const db = require("./config/connection");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const res = require("express/lib/response");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",

  password: "1234",
  database: "employee_db",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(`Connected to the employee_db database.`);
  generateTable();
});

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const init = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "tableGenerator",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "View Budget",
        "View Employees by Department"
    
      ],
    },
  ]);
};

const generateTable = async () => {
  const userChoice = await init();
  console.log(userChoice.tableGenerator);
  switch (userChoice.tableGenerator) {
    case "View all departments":
      showAllDepartments();
      break;
    case "View all roles":
      showAllRoles();
      break;
    case "View all employees":
      showAllEmployees();
      break;
    case "Add a department":
      addDepartment();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add an employee":
      addEmployee();
      break;
    case "Update an employee role":
      updateEmployeeRole();
      break;
    case "View Budget":
      totalUtilizedBudget();
      break;
      case "View Employees by Department":
      showAllEmployByDept();
      break;
  }
};

const showAllDepartments = () => {
  db.query(`SELECT id, name FROM department`, (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
    generateTable();
  });
};

const showAllRoles = () => {
  db.query(
    `(SELECT role.title AS "Job Title", 
    role.id AS "Role ID", 
    department.name AS "Department", 
    role.salary AS "Salary"
    FROM role
    INNER JOIN department ON role.department_id = department.id)`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.table(result);
      generateTable();
    }
  );
};
const showAllEmployees = () => {
  db.query(
    `(select employee.id AS 'EmployeeID', 
    employee.first_name AS 'First Name', 
    employee.last_name AS 'Last Name', 
    role.title AS 'Job Title',
    department.name AS 'Department',
    role.salary AS 'Salary',
    concat(manager.first_name, ' ',manager.last_name) AS 'Manager'
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON employee.manager_id = manager.id)`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.table(result);
      generateTable();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addedDept",
        type: "input",
        message: "Please add new Department",
      },
    ])
    .then((Dept) => {
      console.log(Dept);
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        Dept.addedDept,
        (err, result) => {
          if (err) {
            throw err;
          }
          generateTable();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Please add new Role",
      },
      {
        type: "input",
        name: "salary",
        message: "Please add salary for role",
      },
    ])
    .then((role) => {
      db.query(`SELECT name, id FROM department`, (err, result) => {
        if (err) {
          throw err;
        }

        const findDept = result.map(({ name, id }) => ({
          name: name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "findDept",
              message: "Pick a Deptment",
              choices: findDept,
            },
          ])
          .then((pickDept) => {
            db.query(
              `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
              [role.role, role.salary, pickDept.findDept],
              (err, result) => {
                if (err) {
                  throw err;
                }
                generateTable();
              }
            );
          });
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter First Name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter Last Name",
      },
    ])
    .then((emp) => {
      db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
        if (err) {
          throw err;
        }
        const findRole = result.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "findRole",
              message: "Pick a role for the employee",
              choices: findRole,
            },
          ])
          .then((pickRole) => {
            db.query(`SELECT * from employee`, (err, result) => {
              if (err) {
                throw err;
              }
              const findManager = result.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "findManager",
                    message: "Pick a manager for the employee",
                    choices: findManager,
                  },
                ])
                .then((pickMan) => {
                  db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
                    [
                      emp.firstName,
                      emp.lastName,
                      pickRole.findRole,
                      pickMan.findManager,
                    ],
                    (err, result) => {
                      if (err) {
                        throw err;
                      }
                      generateTable();
                    }
                  );
                });
            });
          });
      });
    });
};

const updateEmployeeRole = () => {
  db.query("SELECT * FROM employee", (err, result) => {
    if (err) {
      throw err;
    }
    const findEmploy = result.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "findEmploy",
          message: "Pick employee to update",
          choices: findEmploy,
        },
      ])
      .then((emp) => {
        db.query("SELECT * FROM role", (err, result) => {
          if (err) {
            throw err;
          }

          const findRole = result.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "findRole",
                message: "Pick new role for employee",
                choices: findRole,
              },
            ])
            .then((pickRole) => {
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [pickRole.findRole, emp.findEmploy],
                (err, result) => {
                  if (err) {
                    throw err;
                  }
                  generateTable();
                }
              );
            });
        });
      });
  });
};

const totalUtilizedBudget =()=>{
db.query(`SELECT department.name, sum(salary)
FROM role
JOIN department
ON role.department_id = department.id
GROUP BY department.id`,(err, result)=>{
  if(err){
    throw err
  }
  console.table(result)
  generateTable()
})
}


const showAllEmployByDept =()=>{
  db.query(`SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`,(err, result)=>{
    if(err){
      throw err
    }
    console.table(result)
    generateTable()
  })
  }

  
 
///Bonus
// SELECT department.name, sum(salary)
// FROM role
// JOIN department
// ON role.department_id = department.id
// GROUP BY department.id

// // init()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
