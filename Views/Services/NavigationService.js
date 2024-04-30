import {CommonActions, useRoute} from '@react-navigation/native';

import {EventRegister} from 'react-native-event-listeners';

export const NavigationService = {
    navigate(navigation, screen, params = {}) {
        EventRegister.emit('onChangeState');
        navigation.navigate(screen, params);
    },
    push(navigation, screen, params) {
        EventRegister.emit('onChangeState');
        navigation.push(screen, params);
    },
    popToTop(navigation, screen, params) {
        EventRegister.emit('onChangeState');
        navigation.popToTop(screen, params);
    },
    setParams(navigation, params) {
        EventRegister.emit('onChangeState');
        navigation.setParams(params);
    },
    goBack(navigation) {
        EventRegister.emit('onChangeState');
        navigation.goBack();
    },
    reset(navigation, screen, params = {}) {
        EventRegister.emit('onChangeState');
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: screen, params},
                ],
            }),
        );
    },
    getState(navigation) {
        return navigation.dangerouslyGetState();
    },
};
