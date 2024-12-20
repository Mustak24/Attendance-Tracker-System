

export const isOnline = () => window.navigator.onLine;

export function isObjectEmpty(obj){
    for(let key in obj){
        if(obj[key]) return false;
    }
    return true;
}

export function getTime(){
    let fullTime = new Date().toLocaleTimeString().split(' ');
    if(fullTime.length == 2) return fullTime.join(' ');
    let hr = fullTime[0].split(':')[0];
    if(hr < 13){
        return `${fullTime[0]}  AM`;
    } else{
        fullTime = fullTime[0].split(':')
        fullTime[0] -= 12; 
        return `${fullTime.join(':')} PM`;
    }

}