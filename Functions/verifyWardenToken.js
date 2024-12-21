export default function verifyWardenToken(token){
    return new Promise((resolve) => {
        fetch(`${window.location.origin}/api/warden/verify-token`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => resolve(res))
    })
}