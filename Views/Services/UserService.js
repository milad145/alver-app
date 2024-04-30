import React from 'react';
import _ from 'lodash';

import GlobalVariables from '../Modules/GlobalVariables';

import {RequestService} from './RequestService';
import {StorageService} from './StorageService';

export const UserService = {
    isLogin() {
        return new Promise((resolve, reject) => {
            StorageService.get('isLoggedIn')
                .then(() => {
                    return this.getPhoneNumber();
                })
                .then(payload => {
                    if (payload) {
                        return resolve(payload);
                    }
                    reject({status: 401, msg: 'Unauthorized'});
                })
                .catch(() => {
                    reject({status: 401, msg: 'Unauthorized'});
                });
        });
    },
    getPhoneNumber() {
        return StorageService.get('phoneNumber');
    },
    getCity() {
        return StorageService.get('city');
    },
    getUser() {
        return StorageService.get('user');
    },
    checkPolicyAcceptance() {
        return StorageService.get('policyAcceptance');
    },
    setPolicyAcceptance(acceptance) {
        return StorageService.set('policyAcceptance', acceptance);
    },
    getUserToken() {
        return new Promise((resolve, reject) => {
            return StorageService.get('user_token')
                .then(payload => resolve(payload))
                .catch(() => {
                    this.logout1()
                        .then(() => {
                            throw new Error({});
                        })
                        .catch(() => {
                            reject({response: {data: 'Unauthorized', status: 401}, status: 401});
                        });
                });
        });
    },
    setCity(city) {
        return StorageService.set('city', city);
    },
    loggedIn(token, phoneNumber) {
        return Promise.all([
            StorageService.set('isLoggedIn', true),
            StorageService.set('user_token', token),
            StorageService.set('phoneNumber', phoneNumber),
            StorageService.set('user', {token, phoneNumber}),
            GlobalVariables.SetUser({token, phoneNumber}),
        ]);
    },
    logout() {
        return new Promise((resolve, reject) => {
            return RequestService.authorizedDelete('user/logout', {deviceId: GlobalVariables.UniqueToken})
                .then(() => {
                    StorageService.remove('isLoggedIn');
                    StorageService.remove('user_token');
                    StorageService.remove('phoneNumber');
                    StorageService.remove('user');
                    GlobalVariables.SetUser(null);
                    resolve(true);
                })
                .catch(err => reject(err));
        });
    },
    logout1() {
        return new Promise(resolve => {
            StorageService.remove('isLoggedIn');
            StorageService.remove('user_token');
            StorageService.remove('phoneNumber');
            StorageService.remove('user');
            GlobalVariables.SetUser(null);
            resolve(true);
        });
    },
    Login(phoneNumber, activeCode) {
        let params = {phoneNumber, activeCode};
        return new Promise((resolve, reject) => {
            return RequestService.post('user/login', params)
                .then(resp => {
                    resolve(this.loggedIn(resp.data.result.token, phoneNumber));
                })
                .catch(err => reject(err));
        });
    },
    getActiveCode(phoneNumber, smsHash) {
        let params = {phoneNumber, smsHash, uniqueToken: GlobalVariables.UniqueToken};
        return new Promise((resolve, reject) => {
            return RequestService.post('user', params)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err));
        });
    },
    getMyFeedBack() {
        return new Promise((resolve, reject) => {
            return RequestService.get('feedback/' + GlobalVariables.UniqueToken)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err));
        });
    },
    sendMyFeedBack(feedback) {
        return new Promise((resolve, reject) => {
            return RequestService.post('feedback/' + GlobalVariables.UniqueToken, {feedback})
                .then(resp => resolve(resp.data))
                .catch(err => reject(err));
        });
    },
};
