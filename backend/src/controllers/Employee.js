import sqlite from "sqlite";



const initialize_Employee = async () => {

    const db = await sqlite.open("./db.sqlite");

    const getEmployee = async () => {
        try {
            let stmt = `SELECT * FROM Employee`;

            const rows = await db.all(stmt)
            return rows
        }
        catch (err) {
            throw new Error("could not get Employee")

        }

    }
    const getEmployeeByid = async id => {
        try {
            console.log(id)
            let stmt = `SELECT *  FROM Employee where  employee_id = ${id}`;
            const rows = await db.all(stmt);
            const employee = rows[0];
            if (!employee) {
                throw new Error(` employee with id = ${id} doesnt exist`);
            }
            else return employee;
        }
        catch (err) {
            throw new Error(`could not get the employee with id = ${id}` + err.message);
        };
    };

    const deleteEmployee = async (id) => {
        try {
            const result = await db.run(
                `Delete FROM Employee where employee_id = ${id}`
            );
            if (result.stmt.changes === 0) {
                throw new Error(`could not delete employee with id = ${id} or wrong id`);
            }
            return true;
        } catch (err) {
            throw new Error("could not delete the employee");
        }
    };
    const updateEmployee = async (id, props) => {
        const { employee_name, password, parking_spots_id } = props;
        console.log("controller props", props)
        try {
            if (!id || !employee_name || !password || !parking_spots_id) {
                throw new Error("you must provide an id and/or one of the inputs");
            }
            const stmt = `UPDATE Employee SET employee_name="${employee_name}", password="${password}", parking_spots_id=${parking_spots_id} WHERE employee_id=${id}`;
            // update user data
            await db.run(stmt);

            const employee = await db.get("SELECT * FROM Employee WHERE employee_id=?", [id])
            return employee;
        } catch (err) {
            throw new Error("Can't update employee details")
        }
    };

    const createEmployee = async (props) => {
        const { employee_name, password, parking_spots_id } = props;
        try {
            if (!props || !employee_name || !password || !parking_spots_id) {
                throw new Error("you must provide all the fields");
            }
            //const date = new datet
            const stmt = `INSERT INTO Employee (employee_name, password, parking_spots_id, created_at)
             VALUES ("${employee_name}", "${password}", ${parking_spots_id}, datetime('now'))`;
            console.log(stmt)
            const rows = await db.run(stmt);
            const result = rows.stmt.lastID;
            // const user = await db.get('SELECT * FROM Employee WHERE employee_id=?', [result])
            return result;
        } catch (err) {
            throw new Error(err, " cannot insert employee");
        };
    }


    const controller = {
        getEmployee,
        getEmployeeByid,
        deleteEmployee,
        updateEmployee,
        createEmployee



    };
    return controller
};
export default initialize_Employee;
