var express = require('express');
var ejs = require('ejs')
var app = express()
.set('view engine', 'ejs')
.set('views', __dirname + '/views');
var bodyParser = require('body-parser');
var path = require("path")
var multer = require('multer')
var nodemailer = require("nodemailer")
var axios = require('axios');
var util = require('util')
var dotenv = require('dotenv')
require('dotenv').config()


const { version } = require('./package.json');
var filter = require('./filter.js')


// ---------------------- Dependencies

const PORT = process.env.PORT || 8000;
const httpString=process.env.NODE_ENV=="development"?'http':'https'
const mailSMTP= process.env.NODE_ENV=="development"? process.env.smtpNodeMailer: process.env.smtpNODEMAILER

// ----------------------- Engine variables
//app.set('views', path.join(__dirname, './views'))

app.use(express.static('client'));
app.use(express.static('u'));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery'));


//app.use(cors())

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'u/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.originalname )/*+path.extname(file.originalname));*/
    }
});


app.get('/',function(req,res){
    res.render('home',{version:version})
})

app.post('/sendReport', function(req, res) {
  async function main(msg) {
    const Body=msg.report
    console.log(Body)
    let configMail= mailSMTP.toString()
    let transporter = nodemailer.createTransport(configMail)
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take messages");
      }
    });

    var message = {
      from: "app186833444@heroku.com",
      to: "Benjy.larcher@aol.com",
      subject: "[Submission] New submission by "+Body.Discord,
      attachments:[],
      text: Body._discord+" sent "+Body._files.length+" files; Has accepted the terms: "+Body._terms,
      html: Body._discord+" sent "+Body._files.length+" files; Has accepted the terms: "+Body._terms
    }
    for(var i=0; i<Body._files.length;i++){
        /*fs.writeFile(`out-${msg.files[i].name}.png`, base64Data, 'base64', function(err) {
            if(err) {
                console.log(err);
            }
        });*/
        message.text=message.text.concat('</br> '+Body._files[i].name+" is "+Body._files[i].sizeX)
        message.html=message.html.concat('</br> '+Body._files[i].name+" is "+Body._files[i].sizeX)
        message.attachments.push(
            {
                filename: Body._files[i].name+'.png',
                content: Buffer.from(Body._files[i].imgPath.split("base64,")[1],"base64")
              },
              {
                filename: Body._files[i].name,
                path:  Body._files[i].vox
              }
        )
    }

    
    let info = await transporter.sendMail(message)
    console.log("Message sent: %s", info.messageId);
    transporter.close();
    res.status(200).send()
    
  }

  main(req.body).catch(console.error);
})

app.post('/submit_file', function(req, res) {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: filter.voxFilter }).single("voxfile");

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send({err:true,msg:req.fileValidationError});
        }
        else if (!req.file) {
            return res.send({err:true,msg:'Please select a file to submit'});
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation

        var url = httpString+'://'+req.headers.host+'/'+req.file.filename 

        res.status(200).send({err:false,msg:url});
    });
});

app.listen(PORT, function() {

    console.log('App running on port '+PORT);

});