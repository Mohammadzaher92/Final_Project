import app from "./app";
import path from "path";
import multer from "multer";

import initialize_ParkingSpots from "./controllers/ParkingSpots.js"
import initialize_Users from "./controllers/Users"


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
            console.log('file', filename)
            const image = req.file && req.file.filename;
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




}
start();
app.listen(8080, () => console.log("server listening on port 8080"));
module.exports = app;