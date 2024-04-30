import React from 'react';
import _ from 'lodash';

/**
 *
 * @param num
 * @returns {string}
 * @constructor
 */
module.exports.DivideNumber3Digits = function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 *
 * @param num
 * @returns {string}
 * @constructor
 */
module.exports.Concat3DigitsNumber = function (num) {
    return num.toString().replace(/,/g, '');
};

/**
 *
 * @param num
 * @returns {*}
 * @constructor
 */
module.exports.GetKOrMFromNum = function (num) {
    if (num < 1000) {
        return num;
    } else if (num < 10 ** 6) {
        return (num / 10 ** 3).toFixed(1) + ' K';
    } else if (num < 10 ** 9) {
        return (num / 10 ** 6).toFixed(1) + ' M';
    } else {
        return (num / 10 ** 9).toFixed(1) + ' G';
    }
};

/**
 *
 * @param size
 * @returns {string}
 * @constructor
 */
module.exports.SetFileSize = function (size) {
    size /= 1000;
    if (size < 1024) {
        return size + ' KB';
    }
    if (size < 1024 ** 2) {
        return (size / 1024).toFixed(1) + ' MB';
    }
};
/**
 *
 * @param email
 * @returns {boolean}
 * @constructor
 */
module.exports.ValidateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 *
 * @param pass
 * @returns {boolean}
 * @constructor
 */
module.exports.ValidPassword = function (pass) {
    let re = /^(?=.*\d)(?=.*[a-z])\w{6,}$/;
    return re.test(String(pass));
};

module.exports.SetTimeFormat = (time = 0, showMiliSeconds = true) => {
    const formattedMinutes = _.padStart(Math.floor(time / 60000).toFixed(0), 2, 0);
    const formattedSeconds = _.padStart(Math.floor((time % 60000) / 1000).toFixed(0), 2, 0);
    const formattedMiliSeconds = _.padStart(Math.floor((time % 1000) / 10).toFixed(0), 2, 0);
    let timeString = `${ formattedMinutes }:${ formattedSeconds }`;
    if (showMiliSeconds) {
        timeString += `:${ formattedMiliSeconds }`;
    }
    return timeString;
};

const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
const latinNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const persianNumbersMap = [/۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g, /۰/g];
const latinNumbersMap = [/1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g, /0/g];

function latinNumToPersianNum(num = '') {
    num = num.toString();
    for (let i = 0; i < 10; i++) {
        num = num.replace(latinNumbersMap[i], persianNumbers[i]);
    }
    return num;
}

module.exports.latinNumToPersianNum = latinNumToPersianNum;
module.exports.persianNumToLatinNum = (num = '۰') => {
    num = num.toString();
    for (let i = 0; i < 10; i++) {
        num = num.replace(persianNumbersMap[i], latinNumbers[i]);
    }
    return num;
};

module.exports.mobileNumberValidation = (num) => {
    const re = /^09\d{9}$/;
    return re.test(String(num));
};

module.exports.listToTree = (list) => {
    let map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i++) {
        map[list[i]._id] = i;
        list[i].children = [];
    }

    for (i = 0; i < list.length; i++) {
        node = list[i];
        if (node.parent === '0' || typeof node.parent === 'undefined') {
            roots.push(node);
        } else {
            list[map[node.parent]].children.push(node);
        }
    }
    return roots;
};

module.exports.nearestLocation = (myLocation, locations) => {
    let distance = 10 ** 8, city = {};
    locations.map(l => {
        let dist = calculateDistance(myLocation.latitude, myLocation.longitude, l.latitude, l.longitude, 'K');
        if (dist < distance) {
            distance = dist;
            city = l;
        }
    });
    return city;
};


function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    const radLat1 = Math.PI * lat1 / 180;
    const radLat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radTheta = Math.PI * theta / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
        dist = dist * 1.609344;
    }
    if (unit === 'N') {
        dist = dist * 0.8684;
    }
    return dist;
}

module.exports.timeAgoTranslate = function (time) {
    time = time.replace('in a few', 'a few');
    time = time.replace('a few', 'چند');
    time = time.replace('a minute', 'یک دقیقه');
    time = time.replace('an hour', 'ساعت');
    time = time.replace('a day', 'یک روز');
    time = time.replace('a month', 'یک ماه');
    time = time.replace('a year', 'یک سال');
    time = time.replace('seconds', 'ثانیه');
    time = time.replace('minutes', 'دقیقه');
    time = time.replace('hours', 'ساعت');
    time = time.replace('days', 'روز');
    time = time.replace('months', 'ماه');
    time = time.replace('years', 'سال');
    time = time.replace('ago', 'پیش');
    return latinNumToPersianNum(time);
};

module.exports.convertVersion = function (myVersion, lastVersion, lastSupportedVersion) {
    let status = 'same';
    myVersion = parseInt(myVersion.replace(/\./g, ''));
    lastVersion = parseInt(lastVersion.replace(/\./g, ''));
    lastSupportedVersion = parseInt(lastSupportedVersion.replace(/\./g, ''));
    if (myVersion === lastVersion) {
        status = 'same';
    } else if (myVersion < lastSupportedVersion) {
        status = 'trash';
    } else if (myVersion < lastVersion) {
        status = 'old';
    }
    return status;
};
