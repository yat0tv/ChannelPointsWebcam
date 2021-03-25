export async function getAllWebcam() {

    const response = await fetch('/api/webcam');
    return await response.json();
}

export async function updateWebcam(data) {
    const response = await fetch(`/api/webcam`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({webcam: data})
    })
    return await response.json();
}