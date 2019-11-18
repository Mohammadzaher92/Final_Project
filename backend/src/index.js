import app from "./app";
import path from "path";
import multer from "multer";

import initialize_ParkingSpots from "./controllers/ParkingSpots.js"
import initialize_Users from "./controllers/Users.js"
import initialize_Employee from "./controllers/Employee.js"
import initialize_Reservation from "./controllers/Reservation.js"


//Please, don't forget to change the directory you are importing the controllers from, accordingly.
const multerStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, '../public/images'));

    },
    filename: (req, file, cb) => {
        const { fieldname, originalname } = file
        const date = Date.now()
        // filename will be: image-1345923023436343-filename.png
        const filename = `${fieldname}-${date}-${originalname}`
        cb(null, filename)
    }
})
const upload = multer({ storage: multerStorage })

const start = async () => {
    const controller_ParkingSpots = await initialize_ParkingSpots();
    const controller_Users = await initialize_Users();
    const controller_Employee = await initialize_Employee();
    const controller_Reservation = await initialize_Reservation();

    app.get("/parkingspots", async (req, res, next) => {
        try {

            const result = await controller_ParkingSpots.getParkingSpots();
            const new_result = result.map(item => {
                item.coordinate = {
                    latitude: item.latitude,
                    longitude: item.longitude,
                }
                return item;
            })
            res.json({ success: true, result });

            return (result);

        }
        catch (err) {
            next(err);
        }
    })

    /////////////////////


    app.get("/users", async (req, res, next) => {
        try {

            const result = await controller_Users.getUsers();

            res.json({ success: true, result });

            return (result);

        }
        catch (err) {
            next(err);
        }
    })
    app.get("/usersbyid/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log("hello", id)
            const result = await controller_Users.getUsersByid(id);
            res.json({ success: true, result });
            return (result);
        }
        catch (err) {
            next(err);
        }

    })

    app.delete('/deleteuser/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await controller_Users.deleteUsers(id);
            res.json({ success: true, result });
        } catch (err) {
            next(err);
        }
    });


    app.put('/updateuser/:id', upload.single('image'), async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, password, email, plate_number } = req.body;
            // const image = req.file && req.file.filename;
            let image = '';
            if (req.file) {
                image = req.file.filename
            }
            const result = await controller_Users.updateUser(id, {
                name,
                password,
                email,
                plate_number,
                image
            });
            res.json({ success: true, result });
            return (result);
        } catch (err) {
            next(err);
        }
    });
    app.post('/createuser', upload.single('image'), async (req, res, next) => {
        try {
            const { name, email, password, plate_number } = req.body;
            let image = '';
            if (req.file) {
                image = req.file.filename
            }
            const id = await controller_Users.createUser({
                name,
                email,
                password,
                plate_number,
                image
            });
            if (id) {
                res.json({ done: true, result: id });
            }
        } catch (err) {
            next(err);
        }
    });

    ///////////

    app.get("/employee", async (req, res, next) => {
        try {

            const result = await controller_Employee.getEmployee();

            res.json({ success: true, result });

            return (result);

        }
        catch (err) {
            next(err);
        }
    })

    app.get("/employeebyid/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log("hello", id)
            const result = await controller_Employee.getEmployeeByid(id);
            res.json({ success: true, result });
            return (result);
        }
        catch (err) {
            next(err);
        }

    })

    app.delete('/deleteemployee/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await controller_Employee.deleteEmployee(id);
            res.json({ success: true, result });
        } catch (err) {
            next(err);
        }
    });

    app.put('/updateemployee/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const { employee_name, password, parking_spots_id } = req.body;
            const result = await controller_Employee.updateEmployee(id, {
                employee_name,
                password,
                parking_spots_id

            });
            res.json({ success: true, result });
            return result
        } catch (err) {
            next(err);
        }
    });

    app.post('/createemployee', async (req, res, next) => {
        try {
            const { employee_name, password, parking_spots_id } = req.body;
            console.log(req.body)
            const id = await controller_Employee.createEmployee({
                employee_name,
                password,
                parking_spots_id
            });
            if (id) {
                res.json({ done: true, result: id });
            }
        } catch (err) {
            next(err);
        }
    });
    /////////////////////////////

    app.get("/reservation", async (req, res, next) => {
        try {

            const result = await controller_Reservation.getReservation();

            res.json({ success: true, result });

            return (result);

        }
        catch (err) {
            next(err);
        }
    })


    app.get("/reservationbyid/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            // console.log("hello", id)
            const result = await controller_Reservation.getReservationByid(id);
            res.json({ success: true, result });
            return (result);
        }
        catch (err) {
            next(err);
        }

    });

    app.delete('/deletereservation/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await controller_Reservation.deleteReservation(id);
            res.json({ success: true, result });
        } catch (err) {
            next(err);
        }
    });

    app.put('/updatereservation/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const { staus, user_id, parking_spots_id, ticket, period } = req.body;
            const result = await controller_Reservation.updateReservation(id, {
                staus,
                user_id,
                parking_spots_id,
                ticket,
                period

            });
            res.json({ success: true, result });
            return result
        } catch (err) {
            next(err);
        }
    });
    app.post('/createreservation', async (req, res, next) => {
        try {
            console.log("here")
            const { status, period, parking_spots_id, user_id } = req.body;
            console.log(req.body)
            const id = await controller_Reservation.createReservation({
                status,
                period,
                parking_spots_id,
                user_id
            });
            if (id) {
                res.json({ done: true, result: id });
            }
        } catch (err) {
            next(err);
        }
    });







}
start();
app.listen(8080, () => console.log("server listening on port 8080"));
module.exports = app;