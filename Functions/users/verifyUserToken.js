export default function verifyUserToken(token){
    return new Promise((resolve) => {
        fetch(`${window.location.origin}/api/users/verify-token`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            return resolve(res);
        })
    })
}