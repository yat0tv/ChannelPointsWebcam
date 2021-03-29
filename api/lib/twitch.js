const { ApiClient } = require('twitch');
const { PubSubClient } = require('twitch-pubsub-client');
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_SECRET;
var apiClient, user_id;
const pubSubClient = new PubSubClient();
var available_rewards = {};

async function init(accessToken, refreshToken){
    //console.log(accessToken, refreshToken);
    const authProvider = new RefreshableAuthProvider(new StaticAuthProvider(clientId, accessToken), {
        clientSecret,
        refreshToken,
        onRefresh: (token) => {
            console.log("Token Refreshed", token)
        }
    });
    apiClient = new ApiClient({authProvider});
    global.twitch.apiClient = apiClient;
    //user_id = 55709266;
    try{
        const tokenInfo = await apiClient.getTokenInfo(accessToken);
        if(!!tokenInfo) {
            //Do something, its valid
            user_id = tokenInfo.userId;
            await list();

            pubSubClient.registerUserListener(apiClient).then(() => {
                pubSubClient.onRedemption(user_id, async (message) => {

                    let store = {index : message.rewardId, username : message.userDisplayName, response : message.message, redemption_id : message.id  }
                    //console.log("pubsub", store);
                    await global.store.process_product_id(store.index, store, async function(data){
                        if(data.msg == "Product ID not found"){
                        } else if (data.error) {
                            await markRejected(store.index, store.redemption_id);
                        } else {
                            await markComplete(store.index, store.redemption_id);
                        }
                    });
                })
            });

        }
    } catch(e){
        console.log("50", e);
    }
    console.log("helix init");
}

function toggle(tier, keep_current_tier){
    //todo enable tier+1 disable all != tier+1
    for(let i in global.store.redemptions){
        let reward = global.store.redemptions[i];
        if(reward.id != "") {
            let isEnabled = false;
            if ((reward.tier == tier + 1 || (keep_current_tier && reward.tier == tier)) && reward.available == true) {
                isEnabled = true;
            }
            apiClient.helix.channelPoints.updateCustomReward(user_id, reward.id, {isEnabled: isEnabled, cost : reward.cost})
        }
    }
}

async function create_reward(data){

    try {
        let reward_data = {
            autoFulfill: false,
            cost: global.store.redemptions[data].cost,
            backgroundColor: "#000000",
            globalCooldown: 0,
            isEnabled: false,
            maxRedemptionsPerStream: 0,
            maxRedemptionsPerUserPerStream: 0,
            prompt: '',
            title: data,
            userInputRequired: false
        };
        console.log("Making New For", user_id);
        let r = await apiClient.helix.channelPoints.createCustomReward(
            user_id,
            reward_data
        )
        console.log("Creat Finished");
        global.store.redemptions[data].id = r.id;
        global.store.updateJSON('rewards');
    } catch(e){
        console.log("106", e);
    }
}
async function remove_reward(data){
    try {
        console.log("Removing For", user_id);
        let r = await apiClient.helix.channelPoints.deleteCustomReward(
            user_id,
            global.store.redemptions[data].id
        )
        console.log("Remove Finished");
        global.store.redemptions[data].id = null;
        global.store.updateJSON('rewards');
    } catch(e){
        console.log("120", e);
    }
}


async function list(){
    //https://api.twitch.tv/helix/channel_points/custom_rewards
    try {
        let resp = await apiClient.helix.channelPoints.getCustomRewards(user_id)
        for (let r = 0; r < resp.length; r++) {
            let reward = resp[r];
            if(global.store.redemptions[reward.title] != undefined){
                global.store.redemptions[reward.title].id = reward.id;
                available_rewards[reward.id] = {
                    title: reward.title,
                    isEnabled: reward.isEnabled,
                    color: reward.backgroundColor
                }
            }
        }
        console.log("List Loaded");
    }catch(e){
        console.log("123", e);
    }
}

async function markRejected(reward_id, redemption_id){
    await apiClient.helix.channelPoints.updateRedemptionStatusByIds(user_id, reward_id, [redemption_id], "CANCELED");
    console.log("Done Rejecting Redemption ", reward_id, redemption_id);
//}
}
async function markComplete(reward_id, redemption_id){
    await apiClient.helix.channelPoints.updateRedemptionStatusByIds(user_id, reward_id, [redemption_id], "FULFILLED");
    console.log("Done Completing Redemption ", reward_id, redemption_id);
}

module.exports = {
    init,
    apiClient,
    remove_reward,
    create_reward,
    toggle
}