//TODO FileIO this data
const fs = require('fs');

var webcam;
var redemptions;

function init(){
    let rawWebcam = fs.readFileSync('data/webcam.json');
    global.store.webcam = JSON.parse(rawWebcam);
    webcam = global.store.webcam;
    let rawRewards = fs.readFileSync('data/rewards.json');
    global.store.redemptions = JSON.parse(rawRewards);
    redemptions = global.store.redemptions;
}

function updateJSON(type){
    switch(type){
        case 'webcam':
            webcam = global.store.webcam;
            fs.writeFileSync('data/webcam.json', JSON.stringify(global.store.webcam));
            break;
        case 'rewards':
            redemptions = global.store.redemptions;
            fs.writeFileSync('data/rewards.json', JSON.stringify(global.store.redemptions));
            break;
    }
}

function find_by_id(id, callback){
    let found = false;
    for(let i in redemptions){
        if(redemptions[i].id == id) {
            found = redemptions[i];
            return callback(found);
        }
    }
    return callback(found);
}
async function process_by_name(name, callback){
    let found = false;
    if(redemptions[name] != undefined){
        found = redemptions[name];
        let data = {index : found.id, username : 'Test', response : 'Just A Test', redemption_id : 0  }
        await process_product(found, data, function(ret){
            return callback({
                error: ret.error,
                msg : ret.data.msg,
                data,
                errors : ret.errors
            });
        });
    } else {
        return callback(found);
    }
}
async function process_product_id(id, data, callback){
    //console.log('process_product_id');
    await find_by_id(id, async function(found){
        if(!found){
            return callback({error: true, msg : 'Product ID not found', data});
        } else {
            await process_product(found, data, function(ret){
                return callback({
                    error: ret.error,
                    msg : ret.data.msg,
                    data,
                    errors : ret.errors
                });
            });
        }
    })
}

function process_product(data, message, callback){
    switch(data.trigger){
        case "turn_on":
            //toggle all other available items on
            //toggle self off
            webcam.status.on = true;
            setTimeout(function(){ countDown(); }, 1000);
            global.twitch.toggle(0, false);
            break;
        default:
            break;
    }
    webcam.status.time += data.time*1;
    webcam.redemption = data;
    webcam.last_action = 'purchase';
    //send latest to overlay
    //console.log(webcam.status);
    global.io.emit("webcam", webcam);
    callback({error : false, data : {msg : '' }, errors : {}});
    /*if(data.category && Object.keys(rewards).length > 0){
        global.rewards.toggle(data.category, data.toggle_tier);
    }*/
}

function countDown(){
    webcam.status.time--;
    if(webcam.status.time > 0) {
        setTimeout(function () {
            countDown();
        }, 1000);
    } else {
        webcam.status.on = false;
        //emit update to overlay
        webcam.last_action = 'countdown finished';
        global.io.emit("webcam", webcam);
        //console.log(webcam.status);
        global.twitch.toggle(-1, false);
    }
}


module.exports = {
    process_product_id,
    process_by_name,
    redemptions,
    webcam,
    updateJSON,
    init
}