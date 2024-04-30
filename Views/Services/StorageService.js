import React from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import GlobalVariables from "../Modules/GlobalVariables";

export const StorageService = {
    async set(key, value) {
        let newVal = JSON.stringify({type: typeof value, data: value});
        try {
            await AsyncStorage.setItem(key, newVal);
        } catch (error) {
            console.log(error)
        }
    },
    get(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key)
                .then(resp => {
                    let value = JSON.parse(resp).data;
                    resolve(value);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    remove(key) {
        AsyncStorage.removeItem(key)
    },
    deleteJunkFiles() {
        Promise.all([
            RNFS.readDir(RNFS.ExternalCachesDirectoryPath + "/video-cache"),
        ])
            .then(payload => {
                let promises = [];
                payload[0].map(p => {
                    if (p.name.includes('.download') || !p.name.includes('.wav') || (new Date() - p.mtime) > GlobalVariables.CacheExpireTime)
                        promises.push(RNFS.unlink(p.path));
                });
                promises.push(RNFS.unlink(RNFS.ExternalDirectoryPath + "/Pictures"));
                return Promise.all(promises)
            })
            .catch(error => {
            })
    }
};
