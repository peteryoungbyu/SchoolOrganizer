-- 1. Create the Class table first (Parent table)
CREATE TABLE class (
    classcode VARCHAR(20) PRIMARY KEY,
    classname VARCHAR(50),
    teacher VARCHAR(25)
);

-- 2. Create the Assignment table (Child table)
CREATE TABLE assignment (
    assignid SERIAL PRIMARY KEY,
    classcode VARCHAR(20),
    assignmentname VARCHAR(50) NOT NULL,
    duedate TIMESTAMP NOT NULL,
    assigntype VARCHAR(30),
    done BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Define the Foreign Key relationship
    CONSTRAINT fk_assignment_class 
        FOREIGN KEY (classcode) 
        REFERENCES class (classcode)
        ON DELETE SET NULL
);

INSERT INTO class (classcode, classname, teacher)
VALUES 
    ('MUSIC 312R', 'Men''s Chorus', 'B. Wells'),
    ('IS 455', 'Machine Learning', 'M. Keith'),
    ('IS 413', 'Enterprise App Development', 'S. Hilton'),
    ('IS 414', 'IS Security & Controls', 'T. Wells'),
    ('IS 401', 'Proj Mgmt & Sys Design', 'L. Cutler');