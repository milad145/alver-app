import React from 'react';
import axios from 'axios';
import appConfig from '../../config';

import {EventRegister} from 'react-native-event-listeners';

import {StorageService} from './StorageService';
import {getContentLength} from '../Modules/Assets';
import GlobalVariables from '../Modules/GlobalVariables';
import {NavigationService} from './NavigationService';
import {UserService} from './UserService';

export const RequestService = {
    post(url, params, navigation = null) {
        return new Promise((resolve, reject) => {
            axios.post(appConfig.url.api + url, params, {
                headers: {
                    'version': appConfig.version,
                },
            })
                .then(resp => resolve(resp))
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },
    get(url, navigation = null) {
        return new Promise((resolve, reject) => {
            axios.get(appConfig.url.api + url, {
                headers: {
                    'version': appConfig.version,
                },
            })
                .then(resp => resolve(resp))
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },
    authorizedPost(url, params, navigation = null) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.post(appConfig.url.api + url, params, {
                        headers: {
                            'authorization': payload,
                            'version': appConfig.version,
                        },
                    });
                })
                .then(resp => {
                    // NotificationService.setNewNotification(resp.data.newNotification);
                    resolve(resp);
                })
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },
    authorizedPatch(url, params, navigation = null) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.patch(appConfig.url.api + url, params, {
                        headers: {
                            'authorization': payload,
                            'version': appConfig.version,
                        },
                    });
                })
                .then(resp => {
                    // NotificationService.setNewNotification(resp.data.newNotification);
                    resolve(resp);
                })
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },
    authorizedDelete(url, params, navigation = null) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.delete(appConfig.url.api + url, {
                        headers: {
                            'authorization': payload,
                            'version': appConfig.version,
                        },
                        data: params,
                    });
                })
                .then(resp => {
                    // NotificationService.setNewNotification(resp.data.newNotification);
                    resolve(resp);
                })
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },

    authorizedPostWithProgress(url, params, navigation = null, eventRegister) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.post(appConfig.url.api + url, params, {
                        onUploadProgress: progressEvent => {
                            let {loaded, total} = progressEvent;
                            let uploadPercent = ((loaded / total) * 100);
                            if (uploadPercent < 100) {
                                EventRegister.emit(eventRegister, uploadPercent);
                            }
                        },
                        headers: {
                            'authorization': payload,
                            'version': appConfig.version,
                            'content-type': 'image/jpeg',
                        },
                    });
                })
                .then(resp => {
                    GlobalVariables.SetUploadStatus(false);
                    EventRegister.emit('renewPost');
                    EventRegister.emit(eventRegister, 0);
                    EventRegister.emit(eventRegister + 'End');
                    resolve(resp);
                })
                .catch(err => {
                    GlobalVariables.SetUploadStatus(false);
                    EventRegister.emit(eventRegister, 0);
                    EventRegister.emit(eventRegister + 'End');
                    EventRegister.emit('renewPost');
                    EventRegister.emit(eventRegister + 'Error', errHandler(err, navigation));
                    reject(errHandler(err, navigation));
                });
            // .then(resp => {
            //     console.log(resp);
            //     EventRegister.emit(eventRegister, 0);
            //     resolve(resp);
            // })
            // .catch(err => {
            //     console.log(err);
            //     EventRegister.emit(eventRegister, 0);
            //     reject(errHandler(err, navigation));
            // });
        });
    },
    authorizedPatchWithProgress(url, params, navigation = null, eventRegister) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.patch(appConfig.url.api + url, params, {
                        onUploadProgress: progressEvent => {
                            let {loaded, total} = progressEvent;
                            let uploadPercent = ((loaded / total) * 100);
                            if (uploadPercent < 100) {
                                EventRegister.emit(eventRegister, uploadPercent);
                            }
                        },
                        headers: {
                            'authorization': payload,
                            'version': appConfig.version,
                            'content-type': 'image/jpeg',
                        },
                    });
                })
                .then(resp => {
                    GlobalVariables.SetUploadStatus(false);
                    EventRegister.emit(eventRegister, 0);
                    EventRegister.emit(eventRegister + 'End');
                    EventRegister.emit('renewPost');
                    resolve(resp);
                })
                .catch(err => {
                    GlobalVariables.SetUploadStatus(false);
                    EventRegister.emit(eventRegister, 0);
                    EventRegister.emit('renewPost');
                    EventRegister.emit(eventRegister + 'End');
                    EventRegister.emit(eventRegister + 'Error', errHandler(err, navigation));
                    reject(errHandler(err, navigation));
                });
            // .then(resp => {
            //     console.log(resp);
            //     EventRegister.emit(eventRegister, 0);
            //     resolve(resp);
            // })
            // .catch(err => {
            //     console.log(err);
            //     EventRegister.emit(eventRegister, 0);
            //     reject(errHandler(err, navigation));
            // });
        });
    },
    authorizedGet(url, navigation = null) {
        return new Promise((resolve, reject) => {
            return UserService.getUserToken()
                .then(payload => {
                    return axios.get(appConfig.url.api + url, {
                        headers: {
                            'authorization': payload,
                            'Content-Type': 'application/json',
                            'version': appConfig.version,

                        },
                    });
                })
                .then(resp => {
                    // NotificationService.setNewNotification(resp.data.newNotification);
                    resolve(resp);
                })
                .catch(err => {
                    reject(errHandler(err, navigation));
                });
        });
    },
};

function errHandler(err, navigation) {
    let error = {};
    if (err.response) {
        error = {type: 'response', data: err.response.data, status: err.response.status};
        if (error.status === 401) {
            // todo : find best navigation
            // NavigationService.reset(navigation, 'SetState')
        } else if (error.status === 426) {
            return NavigationService.reset(navigation, 'Update', {force: true});
        } else {
            // error.data = {message: 'مشکلی در سرور به وجود آمده است.'};
        }
    } else if (err.request) {
        error = {type: 'request', message: 'عدم دسترسی به سرور. لطفا از اتصال دستگاه تلفن خود به اینترنت مطمين شوید.'};
    } else {
        error = {type: 'Error', message: err.message};
    }
    return error;
}

