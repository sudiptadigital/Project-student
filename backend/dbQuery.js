const createSubjectTable = `CREATE TABLE IF NOT EXISTS master_tbl_subjects(
    sub_id SERIAL NOT NULL PRIMARY KEY,
    sub_name VARCHAR(50) NOT NULL 
)`


const createStudentsTable = `CREATE TABLE IF NOT EXISTS tbl_students(
    student_id SERIAL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL PRIMARY KEY,
    subject_ids INTEGER[]
)`

const addDataSubjectTbl = `CREATE OR REPLACE FUNCTION add_data_to_subject_tbl(
    p_sub_name VARCHAR(100)
)
RETURNS TABLE(
    sub_id INT,
    sub_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
    INSERT INTO master_tbl_subjects(sub_name)
    VALUES (p_sub_name)
    RETURNING master_tbl_subjects.sub_id, master_tbl_subjects.sub_name;
END;
$$;`



const addDataStudentTblFun = `CREATE OR REPLACE FUNCTION add_data_to_students_tbl(
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_email VARCHAR(100),
    p_subject_ids INTEGER[]
)
RETURNS TABLE(
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    subject_ids INTEGER[]
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
    INSERT INTO tbl_students(first_name, last_name, email, subject_ids)
    VALUES (p_first_name, p_last_name, p_email, p_subject_ids )
    RETURNING tbl_students.first_name, tbl_students.last_name, tbl_students.email, tbl_students.subject_ids;
END;
$$;`

const updateDataStudentTblFun = `CREATE OR REPLACE FUNCTION update_data_in_students_tbl(
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_email VARCHAR(100)
)
RETURNS TABLE(
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    subject_ids INTEGER[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE tbl_students
    SET 
        first_name = COALESCE(p_first_name, tbl_students.first_name),
        last_name = COALESCE(p_last_name, tbl_students.last_name)
    WHERE tbl_students.email = p_email
    RETURNING tbl_students.first_name, tbl_students.last_name, tbl_students.email, tbl_students.subject_ids;
END;
$$;`


