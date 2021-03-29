export async function getAllRedemptions() {

    const response = await fetch('/api/redemptions');
    return await response.json();
}

export async function updateRedemption(data) {
    const response = await fetch(`/api/redemptions`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({redemption: data})
    })
    return await response.json();
}

export async function createReward(data) {
    const response = await fetch(`/api/create_reward`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: data})
    })
    return await response.json();
}

export async function removeReward(data) {
    const response = await fetch(`/api/remove_reward`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: data})
    })
    return await response.json();
}
export async function testReward(data) {
    const response = await fetch(`/api/test_reward`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: data})
    })
    return await response.json();
}