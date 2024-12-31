export default function logoutUser(token){
    return new Promise((resolve) => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/users/logout`, {
            method: "GET",
            headers: {
                'token': token,
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            return resolve(res);
        })
    })
}