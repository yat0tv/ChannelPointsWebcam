export async function checkLogin() {
    const response = await fetch('/api/check_login');
    return await response.json();
}