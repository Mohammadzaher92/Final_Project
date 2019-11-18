import sqlite from "sqlite";
var randtoken = require('rand-token');

// Generate a 16 character alpha-numeric token:
var token = randtoken.generate(16);

// Use it as a replacement for uid:
var uid = require('rand-token').uid;
var token = uid(16);

// Generate mostly sequential tokens:
var suid = require('rand-token').suid;


const initialize_Reservation = async () => {
    const db = await sqlite.open("./db.sqlite");

    const getReservation = async () => {
        try {
            let stmt = `SELECT * FROM Reservation`;

            const rows = await db.all(stmt)
            return rows
        }
        catch (err) {
            throw new Error("could not get Reservation")

        }
    }


    const getReservationByid = async id => {
        try {
            let stmt = `SELECT *  FROM Reservation where  reservation_id = ${id}`;
            const rows = await db.all(stmt);
            const reservation = rows[0];
            if (!reservation) {
                throw new Error(` reservation with id = ${id} doesnt exist`);
            }
            else return reservation;
        }
        catch (err) {
            throw new Error(`could not get the reservation with id = ${id}` + err.message);
        };
    };
    const deleteReservation = async (id) => {
        try {
            const result = await db.run(
                `Delete FROM Reservation where reservation_id = ${id}`
            );
            if (result.stmt.changes === 0) {
                throw new Error(`could not delete reservation with id = ${id} or wrong id`);
            }
            return true;
        } catch (err) {
            throw new Error("could not delete the reservation");
        }
    };
    const updateReservation = async (id, props) => {
        const { status, parking_spots_id, user_id, ticket, period } = props;
        // console.log("controller props", props)
        try {
            if (!id || !reservation_id || !status || !parking_spots_id || !user_id || ticket || !period) {
                throw new Error("you must provide an id and/or one of the inputs");
            }
            const stmt = `UPDATE Reservation SET reservation_id=${reservation_id}, status="${status}", parking_spots_id=${parking_spots_id}, user_id=${user_id},ticket="${ticket}",period=${period} WHERE reservation_id=${id}`;
            // update user data
            await db.run(stmt);

            const employee = await db.get("SELECT * FROM Reservation WHERE reservation_id=?", [id])
            return employee;
        } catch (err) {
            throw new Error("Can't update reservation details")
        }
    };
    const createReservation = async (props) => {
        const { status, period, parking_spots_id, user_id } = props;
        console.log(props)
        try {
            if (!props || !status || !period || !parking_spots_id || !user_id) {
                throw new Error("you must provide all the fields");
            }
            var ticket = suid(16)

            //const date = new datet
            const stmt = `INSERT INTO Reservation (status, period, parking_spots_id,user_id,ticket, created_at)
             VALUES ("${status}", "${period}", ${parking_spots_id},${user_id},'${ticket}', datetime('now'))`;
            console.log(stmt)
            const rows = await db.run(stmt);
            const result = rows.stmt.lastID;
            // const user = await db.get('SELECT * FROM Employee WHERE employee_id=?', [result])
            return result;
        } catch (err) {
            throw new Error(err, " cannot insert reservation");
        };
    }



    const controller = {
        getReservation,
        getReservationByid,
        deleteReservation,
        updateReservation,
        createReservation






    };
    return controller


}

export default initialize_Reservation;