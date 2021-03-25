
var webcam = {
    src : {
        title: 'Webcam Feed Dimensions',
        height: 720,
        width: 1080
    },
    pos : {
        title: 'Webcam Starting Position',
        x : 0,
        y : 0
    },
    size : {
        title: 'Webcam Base Visual Size',
        height: 240,
        width: 360
    },
    status : {
        title: 'Webcam Status',
        on : false,
        time : 0
    }
};

var redemptions = {
    '*Web Cam On' : {
        'id' : '',
        'available' : false,
        'enabled' : true,
        'cost' : 500,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'turn_on'
    },
    '*Zoom In' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'zoom_in'
    },
    '*Zoom Out' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'zoom_out'
    },
    '*Webcam Rave' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'rave'
    },
    '*Spin Cam' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'spin'
    },
    '*Cam 90deg' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'rotate'
    },
    '*Grow Webcam' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'grow'
    },
    '*Shrink Webcam' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'shrink'
    },
    '*Webcam Bounce' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'bounce'
    },
    '*Extend Webcam Timer' : {
        'id' : '',
        'available' : true,
        'enabled' : false,
        'cost' : 100,
        'time' : 5,
        'scaled_cost' : false,
        'trigger' : 'extend'
    }
};


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
            break;
        default:
            break;
    }
    webcam.status.time += data.time*1;
    //send latest to overlay
    console.log(webcam.status);
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
        global.io.emit("webcam", webcam);
        console.log(webcam.status);
    }
}


module.exports = {
    process_product_id,
    redemptions,
    webcam
}