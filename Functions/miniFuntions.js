

export const isOnline = () => window.navigator.onLine;

export function isObjectEmpty(obj){
    for(let key in obj){
        if(obj[key]) return false;
    }
    return true;
}