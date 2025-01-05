export default function getTotalPresentUsers(token, date) {
    return new Promise(resolve => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        if(!(date.split('/'))) return resolve({miss: false, alert: {type: 'error', msg: 'invalid info.'}});
        fetch(`${window.location.origin}/api/organization/attendances/get-total-present-users?date=${date}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => resolve(res))
    });
}