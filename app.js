const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

//var cors = require('cors');
//app.use(cors());
app.use('/assets', express.static('assets'));


app.use(express.static(__dirname + '/public'));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
app.get('/', function(req, res) {
  // do something here.
  res.sendFile(__dirname + "/index.html");
});
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.post('/upload-profile-pic', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
		 var filename = req.file.filename;
		 
		res.send(`You have uploaded this image: <hr/><img src="/uploads/${filename}" width="500px" height="400px"><hr /><a href="./" style='font-size:20px; color:red; margin-top:20px;'>Upload another image</a>`);
		//res.send(`You have uploaded this image: <hr/><img src="/uploads/profile_pic-1575999700506.png" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});

const helpers = require('./helpers');
