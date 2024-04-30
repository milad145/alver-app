import {RequestService} from './RequestService';

export const FieldService = {
    catFields(cat, navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`field/${cat}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    get(body, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedGet(`field/get/${body}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
};
