import {NativeModules, ToastAndroid, Platform} from 'react-native';

const RCTToast =    Platform.OS === 'android' ? ToastAndroid : NativeModules.LRDRCTSimpleToast;

export const ToastService = {
    // Toast duration constants
    SHORT: RCTToast.SHORT,
    LONG: RCTToast.LONG,

    // Toast gravity constants
    TOP: RCTToast.TOP,
    BOTTOM: RCTToast.BOTTOM,
    CENTER: RCTToast.CENTER,

    show: function (message, duration, gravity = 'c', xOffset, yOffset) {
        let gravities = {
            t: RCTToast.TOP,
            b: RCTToast.BOTTOM,
            c: RCTToast.CENTER,
        };
        RCTToast.showWithGravityAndOffset(
            message,
            duration === undefined ? RCTToast.SHORT : duration,
            gravities[gravity],
            xOffset === undefined ? 0 : xOffset,
            yOffset === undefined ? 0 : yOffset,
        );
    },

    showWithGravity: function (message, duration, gravity) {
        RCTToast.showWithGravity(
            message,
            duration === undefined ? RCTToast.SHORT : duration,
            gravity,
        );
    },
};
