const createTableQueries = [
  `
  CREATE TABLE IF NOT EXISTS teacher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    dob VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL
  ) AUTO_INCREMENT = 10;
  
  `,
  `
  CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL
  );
  
  `
  ,
  `
  CREATE TABLE IF NOT EXISTS student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    mobile VARCHAR(255),
    gender VARCHAR(255),
    dob VARCHAR(255),
    address VARCHAR(255),
    num_classes VARCHAR(255),
    grade VARCHAR(45),
    course VARCHAR(255),
    note VARCHAR(255),
    mail VARCHAR(255)
  ) AUTO_INCREMENT = 14000;

  `,
  `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img VARCHAR(255) NOT NULL,
    teacher_id INT,
    name VARCHAR(255),
    title VARCHAR(255),
    done BOOLEAN,
    priority VARCHAR(255),
    due_date VARCHAR(255),
    note TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);

  `
  ,
  `
  CREATE TABLE IF NOT EXISTS teacher_student (
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    PRIMARY KEY (teacher_id, student_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id),
    FOREIGN KEY (student_id) REFERENCES student(id)
);

  `
  ,
  `
  CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(255) NOT NULL
  );    

  `
  ,
  `CREATE TABLE IF NOT EXISTS curriculum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade_id INT,
    sno INT,
    lesson_name VARCHAR(255),
    description VARCHAR(255),
    link VARCHAR(255),
    FOREIGN KEY (grade_id) REFERENCES grades(id)
);
  `
  ,
  `
  CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    student_id INT,
    tch_mail VARCHAR(255),
    eventdetails VARCHAR(255),
    title VARCHAR(255),
    class VARCHAR(255),
    start_date VARCHAR(255),
    end_date VARCHAR(255),
    assigned BOOLEAN,
    completed BOOLEAN,
    approved BOOLEAN,
    status VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id),
    FOREIGN KEY (student_id) REFERENCES student(id)
);
  `,
  `
  CREATE TABLE IF NOT EXISTS demo_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    eventdetails VARCHAR(255),
    stdname VARCHAR(255),
    startDate VARCHAR(255),
    endDate VARCHAR(255),
    assigned BOOLEAN,
    completed BOOLEAN,
    approved BOOLEAN,
    status VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);
  `,
  `
  CREATE TABLE IF NOT EXISTS support (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raiseby_id INT,
    raiseby_name VARCHAR(255),
    date VARCHAR(255),
    description VARCHAR(255),
    closure VARCHAR(255),
    done BOOLEAN,
    role VARCHAR(255)
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    demo_erng VARCHAR(255),
    paid_erng VARCHAR(255),
    incentive_erng VARCHAR(255),
    month_no VARCHAR(255),
    month_name VARCHAR(255),
    year VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);
  `,
  `
  CREATE TABLE IF NOT EXISTS pricings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demo_pricing VARCHAR(255),
    paid_pricing VARCHAR(255)
  )
  `
];

module.exports = createTableQueries;