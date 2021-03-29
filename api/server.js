const express = require('express');
let http = require('http').Server(express);
const path = require('path');
const randomId = require('random-id');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080,
      debug = require('debug')('http');

global.io = require('socket.io')(http, {
    //withCredentials: false,
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    },
    allowEIO3: true
});
io.on('connection', (socket) => {
    //console.log("A user connected");

    socket.on('disconnect', () => {
        //console.log("A user disconnected");
    });
});
/*setInterval(function(){
    io.emit("hello", { data : ['just a test']});
    console.log("Hello");
}, 30000)*/
http.listen(3000, function(){
    //debug('listening');
});

const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios')
var loggedIn = false;
// place holder for the data
global.store = require("./lib/store.js");
global.store.init();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/dist')));

/*
* Required Pages
* - /Login
* -- if not logged in redirect here
* -- bounce to twitch asking for permissions related to redemptions
* - /Verify
* -- Receives auth info from twitch
* -- Store oauth, refresh tokens
* - /Dashboard
* -- If logged in redirect here
* -- Enabled/Disable available redemptions
* --- Allow the enabling of base webcam redemption
* --- toggle various addon redemptions once webcam is on
* ---- Enhance Webcam (Zoom In)
* ---- UnEnhance Webcam (Zoom Out)
* ---- Webcam Rave (Hue Shift)
* ---- Spin Cam
* ---- Cam 90deg
* ---- Grow Webcam
* ---- Shrink Webcam
* ---- Extend Webcam Timer
* ---- Web Cam On
* ---- Webcam Bounce
* --- Position settings for webcam placement in overlay
* ---- Feed Size (width, height)
* ---- Default Size (width, height)
* ---- Default Location on screen (x, y)
* --- Modification settings related to time
* - /Overlay
* -- Place webcam
* --- Receives info related to how webcam should display
*
* */


app.get('/api/webcam', (req, res) => {
  res.json(global.store.webcam);
});
app.post('/api/webcam', (req, res) => {
    global.store.webcam = req.body.webcam;
    //user.id = randomId(10);
    //console.log('Adding user:::::', user);
    //users.push(user);
    global.store.webcam.last_action = 'updated';
    global.io.emit("webcam", global.store.webcam);
    global.store.updateJSON('webcam');
    res.json("Settings Updated");
});

app.post('/api/create_reward', async (req, res) => {
    if(loggedIn) {
        console.log("Create Started");
        await global.twitch.create_reward(req.body.title);
        console.log("Create Finished");
        res.json("Reward Updated");
        global.io.emit("redemptions", global.store.redemptions);
    } else {
        res.json("Not Logged In");
    }
});
app.post('/api/remove_reward', async (req, res) => {
    if(loggedIn) {
        console.log("Remove Started");
        await global.twitch.remove_reward(req.body.title);
        console.log("Remove Finished");
        res.json("Reward Updated");
        global.io.emit("redemptions", global.store.redemptions);
    } else {
        res.json("Not Logged In");
    }
});
app.post('/api/test_reward', async (req, res) => {
    if(loggedIn) {
    global.store.process_by_name(req.body.title, function(data){
        res.json("Test Sent");
    })
    } else {
        res.json("Not Logged In");
    }
});

app.get('/api/redemptions', (req, res) => {
    res.json(global.store.redemptions);
});

app.post('/api/redemptions', (req, res) => {
    global.store.redemptions = req.body.redemption;
    global.io.emit("redemptions", global.store.redemptions);
    global.store.updateJSON('rewards');
    global.twitch.toggle(-1, false);
    res.json("Settings Updated");
});

app.get('/', (req,res) => {
    console.log(__dirname);
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.get('/api/check_login', (req,res) => {
    res.json(loggedIn);
});

app.get('/api/login', (req,res) => {
    if(!loggedIn) {
        console.log("Begin Login!");
        //res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
        let login = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=' + process.env.TWITCH_CLIENT_ID + '&redirect_uri=http://localhost:8080/api/validate&scope=channel:manage:redemptions+channel:read:redemptions';
        res.writeHead(302, {
            'Location': login
        });
        res.end();
    } else {
        res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
    }
});
app.get('/api/validate', (req,res) => {
    //todo confirm returned information
    if(!loggedIn) {
        console.log("Not Logged in Validating!");
        if (req.query.code != undefined) {
            let code = req.query.code;
            let url = "https://id.twitch.tv/oauth2/token?client_id=" + process.env.TWITCH_CLIENT_ID + "&client_secret=" + process.env.TWITCH_SECRET + "&code=" + code + "&grant_type=authorization_code&redirect_uri=http://localhost:8080/api/validate";
            /*res.writeHead(302, {
                'Location': url
            });
            res.end();*/
            axios
                .post(url)
                .then(resp => {
                    console.log("Done Validating");
                    console.log(`statusCode: ${resp.statusCode}`)
                    //console.log(res)
                    process.env.TWITCH_ACCESS_TOKEN = resp.data.access_token;
                    process.env.TWITCH_REFRESH = resp.data.refresh_token;
                    loggedIn = true;
                    global.twitch = require('./lib/twitch.js');
                    //console.log(resp.data);
                    global.twitch.init(resp.data.access_token, resp.data.refresh_token);
                    //res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
                    res.writeHead(302, {
                        'Location': "http://localhost:8080/"
                    });
                    res.end();
                })
                .catch(error => {
                    console.log("Failed to Validate");
                    //console.error(error)
                })
        } else {
            console.log(req.query);
        }
    } else {
        //console.log("Already Logged In!");
        res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
    }
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});