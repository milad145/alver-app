import React from 'react';
import _ from 'lodash';

import {StorageService} from './StorageService';

export const HistoryService = {
    addToSearchHistory(searchKey, cat = {}) {
        return new Promise(resolve => {
            let search = {searchKey, _id: new Date().getTime() + '', cat, searchID: cat._id + '_' + searchKey};
            this.getSearchHistory()
                .then(payload => {
                    let searchHistory = _.slice(_.unionBy([search], payload, 'searchID'), 0, 50);
                    StorageService.set('searchHistory', searchHistory);
                    resolve();
                })
                .catch(() => {
                    StorageService.set('searchHistory', [search]);
                    resolve();
                });
        });
    },
    getSearchHistory() {
        return StorageService.get('searchHistory');
    },
    clearSearchHistory() {
        return StorageService.remove('searchHistory');
    },
    deleteFromSearchHistory(_id) {
        this.getSearchHistory()
            .then(payload => {
                let searchHistory = _.remove(payload, (sh) => sh._id !== _id);
                return StorageService.set('searchHistory', searchHistory);
            });
    },
};
