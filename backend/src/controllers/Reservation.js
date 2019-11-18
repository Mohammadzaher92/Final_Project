import sqlite from "sqlite";

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
    const controller = {
        getReservation,
        getReservationByid,
        deleteReservation





    };
    return controller


}

export default initialize_Reservation;