const APPID = 'cal';

export class StorageManager {
    store(key, obj) {
        window.localStorage.setItem(`${APPID}_${key}`, JSON.stringify(obj));
    }

    fetch(key) {
        const data = window.localStorage.getItem(`${APPID}_${key}`);
        if(!data) {
            return null;
        }
        return JSON.parse(data);
    }

    clear(key) {
        window.localStorage.removeItem(`${APPID}_${key}`);
    }
}