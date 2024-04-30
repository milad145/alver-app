import {RequestService} from './RequestService'

export const CityService = {
    cityList(navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`city`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err))
        })
    },
    get(body, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedGet(`city/get/${body}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err))
        })
    }
};
