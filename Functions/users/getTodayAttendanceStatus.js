export default function getTodayAttendance(token){
    return new Promise((resolve) => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/users/attendance/get-today-attendance-status`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`,
            }
        }).then(res => res.json()).then(res => resolve(res));
    })
}