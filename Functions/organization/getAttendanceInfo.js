export default function getAttendanceInfo(token, attendanceId, mounth='', year='') {
    return new Promise(resolve => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/organization/attendances/get-info?id=${attendanceId}&mounth=${mounth}&year=${year}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => resolve(res))
    });
}