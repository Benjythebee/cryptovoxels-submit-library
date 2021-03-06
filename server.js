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
const mailSMTP= process.env.smtpNodeMailer;

// ----------------------- Engine variables
//app.set('views', path.join(__dirname, './views'))

app.use(express.static('client'));
app.use(express.static('u'));
app.use('/css', express.static(__dirname + '/node_modules/bulma/css'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery'));
app.use('/components', express.static(__dirname + '/components'));


//app.use(cors())

app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true }));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'u/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.originalname )/*+path.extname(file.originalname));*/
    }
});

// RECAPTCHA -------------------
var Recaptcha = require('express-recaptcha').RecaptchaV2;
//import Recaptcha from 'express-recaptcha'
const recaptcha= process.env.NODE_ENV=="development"? new Recaptcha(process.env.G_SITE_KEY_LOCAL, process.env.G_SECRET_KEY_LOCAL) :new Recaptcha(process.env.G_SITE_KEY, process.env.G_SECRET_KEY);

// ROUTING ------------------
app.get('/',recaptcha.middleware.render,function(req,res){
    res.render('home',{version:version, captcha:res.recaptcha })
})

app.post('/sendReport', function(req, res) {
  async function main(msg) {
    const Body=msg
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
      from: process.env.SEND_TO_EMAIL,
      to: process.env.SEND_TO_EMAIL,
      subject: "[Submission] New submission by "+Body._discord,
      attachments:[],
      text: Body._discord+" sent "+Body._files.length+" files; Has accepted the terms: "+Body._terms+"; Would like to stay anonymous: "+ !Body._anonymous,
      html: Body._discord+" sent "+Body._files.length+" files; Has accepted the terms: "+Body._terms+"; Would like to stay anonymous: "+ !Body._anonymous
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
    res.status(200).send('Submitted')
    
  }
  recaptcha.verify(req, function(error, data){
    if (!error) {
      main(req.body).catch(console.error);
    } else {
      res.status(200).send('captcha')
    }
  });
  
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