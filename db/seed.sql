INSERT INTO department(name) VALUES
('Engineering'), 
('Finance'), 
('Legal'), 
('Sales');


INSERT INTO role(title, salary, department_id) VALUES
('Sales Lead', 120000, 4),
('SalesPerson', 80000, 4),
('Lead Engineering', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);




INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Greta', 'Gallagher', 1, NULL),
('Leslie', 'Hamilton', 5, NULL),
('Kason', 'Choi', 2, 1),
('Rayne', 'Murphy', 4, 3),
('Kyson', 'Mann', 3, NULL),
('Colton', 'Swanson', 6, 5),
('John', 'Doe', 7, NULL),
('Kevin', 'Allen', 8, 7);


