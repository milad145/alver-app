import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import AppNavigator from './AppNavigator';
import GlobalVariables from './Modules/GlobalVariables';
import {EventRegister} from 'react-native-event-listeners';


export default class Main extends Component {

    componentDidMount() {
        this.listener = EventRegister.addEventListener('changedDarkMode', () => {
            this.setState({darkMode: GlobalVariables.GetDarkMode()});
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    hidden={false}
                    translucent={false}
                    backgroundColor="#32c00c"
                />
                <AppNavigator/>
            </View>
        );
    }
}
