const { ApiClient } = require('twitch');
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const dotenv = require('dotenv');
const clientId = '';
const clientSecret = '';
const accessToken = '';
const refreshToken = '';
var apiClient, user_id;

async function init(aToken, rToken){
	
    const authProvider = new RefreshableAuthProvider(new StaticAuthProvider(clientId, aToken), {
        clientSecret,
        rToken,
        onRefresh: (token) => {
            console.log("Token Refreshed", token)
        }
    });
    apiClient = new ApiClient({authProvider});
	
	try{
        const tokenInfo = await apiClient.getTokenInfo(accessToken);
        if(!!tokenInfo) {
            user_id = tokenInfo.userId;
            await list();
			await create_reward("Test 1");
			await create_reward("Test 2");
		}
	} catch(e){
		
	}
}

async function create_reward(data){
    try {
        let reward_data = {
            autoFulfill: false,
            cost: 1,
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
        console.log("Created returned: ", r);
    } catch(e){
        console.log("106", e);
    }
}

async function list(){
    try {
        let resp = await apiClient.helix.channelPoints.getCustomRewards(user_id)
        for (let r = 0; r < resp.length; r++) {
            let reward = resp[r];
        }
        console.log("List Loaded");
    }catch(e){
        console.log("123", e);
    }
}

init(accessToken, refreshToken);
	