import sqlite from "sqlite";



const initialize_ParkingSpots = async () => {

    const db = await sqlite.open("./db.sqlite");

    const getParkingSpots = async () => {
        try {
            let stmt = `SELECT * FROM ParkingSpots`;

            const rows = await db.all(stmt)
            return rows
        }
        catch (err) {
            throw new Error("could not get spots")

        }

    }

    const controller = {
        getParkingSpots
    };
    return controller
};
export default initialize_ParkingSpots;








