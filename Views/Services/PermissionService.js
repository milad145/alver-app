import Permissions from 'react-native-permissions';

export const PermissionService = {
    checkPermission(per) {
        return new Promise((res, rej) => {
            Permissions.check(`android.permission.${per}`)
                .then(payload => {
                    if (payload === 'granted') return res(true);
                    else if (payload === 'denied') return res(false);
                    else rej(payload)
                })
                .catch(err => rej(err))
        });
    },
    requestPermission(per) {
        return new Promise((res, rej) => {
            Permissions.request(`android.permission.${per}`)
                .then(payload => {
                    if (payload === 'granted') return res(true);
                    else if (payload === 'denied') return res(false);
                    else rej(payload)
                })
                .catch(err => rej(err))
        });
    },
    checkAndRequest(per) {
        return new Promise((res, rej) => {
            this.checkPermission(per)
                .then(payload => {
                    if (payload) return res(true);
                    else return this.requestPermission(per)
                })
                .then(payload => {
                    if (payload) return res(true);
                    else rej(true)
                })
                .catch(err => rej(err))
        });
    }
};