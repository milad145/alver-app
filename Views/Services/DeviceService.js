import {getUniqueId, getModel} from 'react-native-device-info';
import {RequestService} from './RequestService';

export const DeviceService = {
    getVersion(navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`versions`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
};
