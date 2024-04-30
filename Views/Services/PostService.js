import {RequestService} from './RequestService';
import _ from 'lodash';
import GlobalVariables from '../Modules/GlobalVariables';
import {StorageService} from './StorageService';
import {EventRegister} from 'react-native-event-listeners';

export const PostService = {
    homePost(query, navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`post/home` + query, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    mine(query, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedGet(`post/mine` + query, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    getPost(postId, navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`post/${postId}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    getPostContactInfo(postId, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedPost(`post/contact`, {post: postId}, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    getMyPost(postId, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedGet(`post/mine/${postId}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    deleteMyPost(postId, navigation) {
        return new Promise((res, rej) => {
            return RequestService.authorizedDelete(`post/mine/${postId}`, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    send(post, navigation) {
        const formData = new FormData();
        if (post.images && post.images.length) {
            post.images.map(i => {
                let obj = {name: i.fileName, type: i.type, uri: i.uri};
                formData.append('images', obj);
            });
        }
        if (post.audio && post.audio.duration && post.audio.uri && post.audio.duration >= GlobalVariables.MinAudioDuration && post.audio.duration <= GlobalVariables.MaxAudioDuration) {
            let {uri, duration} = post.audio;
            let obj = {uri, type: 'audio/m4a', name: duration + '_myPostAudio.m4a'};
            formData.append('audios', obj);
        }
        let cities = [post.city._id];
        if (post.city.parentId) {
            cities = _.union(cities, [post.city.parentId]);
        }
        let data = {
            title: post.title,
            description: post.description,
            categories: post.categories,
            cat: post.cat._id,
            city: post.city._id,
            cities,
            fieldsValue: post.fieldsValue,
            images: post.images,
        };
        if (post.location) {
            data.location = post.location;
        }
        formData.append('post', JSON.stringify(data));
        return new Promise((res, rej) => {
            return RequestService.authorizedPostWithProgress('post', formData, navigation, 'postUploadingProgress')
                .then(payload => {
                    res(payload);
                })
                .catch(err => {
                    rej(err);
                });
        });
    },
    edit(post, navigation) {
        let mainImage = null;
        const formData = new FormData();
        if (post.images && post.images.length) {
            post.images.map(i => {
                if (!i.server) {
                    formData.append('images', {name: i.fileName, type: i.type, uri: i.uri});
                }
                if (i.mainImage) {
                    mainImage = {uri: i.uri, server: i.server};
                }
            });
        }
        if (post.audio && post.audio.duration && post.audio.uri && post.audio.duration >= GlobalVariables.MinAudioDuration && post.audio.duration <= GlobalVariables.MaxAudioDuration) {
            let {uri, duration} = post.audio;
            let obj = {uri, type: 'audio/m4a', name: duration + '_myPostAudio.m4a'};
            formData.append('audios', obj);
        }
        let cities = [post.city._id];
        if (post.city.parentId) {
            cities = _.union(cities, [post.city.parentId]);
        }
        let data = {
            title: post.title,
            description: post.description,
            categories: post.categories,
            cat: post.cat._id,
            city: post.city._id,
            fieldsValue: post.fieldsValue,
            images: post.images,
            audios: post.audios,
            cities,
        };
        if (post.location) {
            data.location = post.location;
        }
        formData.append('post', JSON.stringify(data));
        return new Promise((res, rej) => {
            return RequestService.authorizedPatchWithProgress('post/' + post._id, formData, navigation, 'postUploadingProgress')
                .then(payload => {
                    EventRegister.emit('postEdited', {_id: post._id, mainImage});
                    res(payload);
                })
                .catch(err => {
                    rej(err);
                });
        });
    },
    filter(query, navigation) {
        return new Promise((res, rej) => {
            return RequestService.get(`post/filter` + query, navigation)
                .then(payload => res(payload))
                .catch(err => rej(err));
        });
    },
    addToLastVisits(post) {
        return new Promise(resolve => {
            return StorageService.get('lastVisits')
                .then(payload => {
                    let posts = _.slice(_.unionBy([post], payload, '_id'), 0, 20);
                    StorageService.set('lastVisits', posts);
                    resolve();
                })
                .catch(() => {
                    StorageService.set('lastVisits', [post]);
                    resolve();
                });
        });
    },
    toggleToFavoriteList(post) {
        return new Promise(resolve => {
            return StorageService.get('favoriteList')
                .then(payload => {
                    let isFavorite = _.find(payload, {_id: post._id});
                    let posts = [];
                    if (isFavorite) {
                        _.remove(payload, (p) => p._id === post._id);
                        posts = payload;
                    } else {
                        posts = [post, ...payload];
                    }
                    StorageService.set('favoriteList', posts);
                    EventRegister.emit('editFavoriteList');
                    resolve(!isFavorite);
                })
                .catch(() => {
                    StorageService.set('favoriteList', [post]);
                    EventRegister.emit('editFavoriteList');
                    resolve(true);
                });
        });
    },
    removeFromFavoriteList(_id) {
        return new Promise(resolve => {
            return StorageService.get('favoriteList')
                .then(payload => {
                    _.remove(payload, (p) => p._id === _id);
                    StorageService.set('favoriteList', payload);
                    EventRegister.emit('editFavoriteList');
                    resolve();
                })
                .catch(() => {
                    resolve();
                });
        });
    },
    isFavorite(_id) {
        return new Promise(resolve => {
            return StorageService.get('favoriteList')
                .then(payload => {
                    let isFavorite = _.find(payload, {_id});
                    resolve(!!isFavorite);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    },
    getFavoriteList() {
        return StorageService.get('favoriteList');
    },
    getLastVisits() {
        return StorageService.get('lastVisits');
    },
    clearLastVisits() {
        return StorageService.remove('lastVisits');
    },
};
