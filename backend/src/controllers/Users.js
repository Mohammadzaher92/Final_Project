import sqlite from "sqlite";


const initializeUsers = async () => {

    const db = await sqlite.open("./db.sqlite");

    const getUsers = async () => {
        try {
            let stmt = `SELECT * FROM Users`;

            const rows = await db.all(stmt)
            return rows
        }
        catch (err) {
            console.log('err', err)
            throw new Error("could not get users")
        }

    }
    const getUsersByid = async id => {
        try {
            console.log(id)
            let stmt = `SELECT *  FROM Users where  user_id = ${id}`;
            const rows = await db.all(stmt);
            const user = rows[0];
            if (!user) {
                throw new Error(` user with id = ${id} doesnt exist`);
            } else return user;
        } catch (err) {
            throw new Error(`could not get the user with id = ${id}` + err.message);
        };
    };

    const deleteUsers = async (id) => {
        try {
            const result = await db.run(
                `Delete FROM Users where user_id = ${id}`
            );
            if (result.stmt.changes === 0) {
                throw new Error(`could not delete user with id = ${id} or wrong id`);
            }
            return true;
        } catch (err) {
            throw new Error("could not delete the user");
        }
    };

    const updateUser = async (id, props) => {
        const { name, email, password, image, plate_number } = props;
        try {
            if (!id || !name || !email || !password || !image || !plate_number) {
                throw new Error("you must provide an id and/or one of the inputs");
            }
            const stmt = `UPDATE Users SET email="${email}", name="${name}", image="${image}", password="${password}", plate_number="${plate_number}" WHERE user_id="${id}"`;
            // update user data
            await db.run(stmt);

            const user = await db.get("SELECT * FROM Users WHERE user_id=?", [id])
            return user;
        } catch (err) {
            throw new Error("Can't update user details")
        }
    };

    const createUser = async (props) => {
        const { name, email, password, image, plate_number } = props;
        console.log(props)
        try {
            if (!props || !name || !email || !password || !image | !plate_number) {
                throw new Error("you must provide all the fields");
            }
            const stmt = `INSERT INTO Users (name, email, password, image, plate_number, created_at ) VALUES ("${name}", "${email}", "${password}", "${image}", "${plate_number}", datetime('now'))`;
            console.log(stmt)
            const rows = await db.run(stmt);
            const id = rows.stmt.lastID;
            const user = await db.get('SELECT * FROM Users WHERE user_id=?', [id])
            return user;
        } catch (err) {
            throw new Error(err, " cannot insert user");
        };
    }
    const login = async (email, password) => {
        try {
            const stmt = `select Users.user_id from Users where email = '${email}' and password='${password}';`;
            console.log(stmt)
            const rows = await db.get(stmt);
            if (rows) {
                return rows.user_id
            }
            else {
                return null;
            }
        }
        catch (err) {
            throw new Error(err, "cannot find")
        }
    }

    const controller = {
        getUsers,
        getUsersByid,
        deleteUsers,
        updateUser,
        createUser,
        login
    };
    return controller
};
export default initializeUsers;
