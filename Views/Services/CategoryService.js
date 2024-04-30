import {RequestService} from './RequestService'

export const CategoryService = {
    categoryList(navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`category`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err))
        })
    },
    get(body, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedGet(`category/get/${body}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err))
        })
    }
};
