import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';
import {EventRegister} from 'react-native-event-listeners';

export default class NetworkError extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // this.isLogin();
        this.listener = EventRegister.addEventListener('checkNetwork', () => {
            this.props.onPress();
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <Text style={[GlobalVariables.TextStyle('b', 'xl', 't'), {textAlign: 'center'}]}>
                    ارتباط برقرار نشد
                    {'\n'}
                </Text>
                <Text style={[GlobalVariables.TextStyle('l', 'me', 't'), {textAlign: 'center'}]}>
                    متاسفانه ارتباط بین دستگاه شما و آلور برقرار نشد. لطفا دوباره تلاش کنید.
                </Text>
                <TouchableOpacity style={[GlobalVariables.DefaultButtons, {width: '45%', marginTop: 50}]}
                                  onPress={() => EventRegister.emit('checkNetwork')}>
                    <Text style={GlobalVariables.DefaultButtonsText}>تلاش دوباره</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});
