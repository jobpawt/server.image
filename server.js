const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = requrie('cors');
const dotenv = require('dotenv');

const app = express();
const upload = multer({dest: __dirname+'/uploads/'})

dotenv.config();

app.use(express.json());
app.use(cors());
app.use("*", cors());

// upload image
app.post('/upload', upload.single("file"), function(req, res) {
    console.log("Received file" + req.file.originalname);
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream(__dirname+'/uploads/' + req.file.originalname);
    src.pipe(dest);
    src.on('end', function() {
        fs.unlinkSync(req.file.path);
        res.status(200).send({"url":`/uploads/${req.file.originalname}`});
    });
    src.on('error', function(err) {
        res.status(500).send({"error":`something went wrong`});
    });
});


//serve image to client
app.get("/files/:name", function(req, res) {
    const fileName = req.params.name;
    const directoryPath = __dirname + "/uploads/" + fileName;
    res.status(200).sendFile(directoryPath);
});

let port = Number(process.env.PORT || 8040);

app.listen(port, function(){
    console.log(`FileServer running on port ${port}`);
});