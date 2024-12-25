export default function verifyOrganizationToken(token){
    return new Promise((resolve) => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/organization/verify-token`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => resolve(res))
    })
}