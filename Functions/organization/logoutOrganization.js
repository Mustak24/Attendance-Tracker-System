export default function logoutOrganization(token){
    return new Promise((resolve) => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/organization/logout`, {
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