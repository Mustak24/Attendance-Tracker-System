export default function verifyUserToken(token){
    return new Promise((resolve) => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
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