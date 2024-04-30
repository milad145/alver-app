import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import GlobalVariables from '../../Modules/GlobalVariables';

import {EventRegister} from 'react-native-event-listeners';

export default class UploadProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
            fullWidth: 0,
            done: false,
        };
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('postUploadingProgress', (data) => {
            Animated.timing(this.state.progress, {
                toValue: (data / 200) * this.state.fullWidth,
                useNativeDriver: true,
                duration: 2000,
            }).start();
            this.setState({done: false});
        });
        this.listener1 = EventRegister.addEventListener('postUploadingProgressEnd', () => {
            Animated.timing(this.state.progress, {
                toValue: this.state.fullWidth,
                useNativeDriver: true,
                duration: 500,
            }).start();
            setTimeout(() => this.setState({progress: new Animated.Value(0)}), 1000);
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.listener1);
    }


    render() {
        return (
            <View onLayout={(event) => {
                this.setState({fullWidth: event.nativeEvent.layout.width});
            }}
                  style={[styles.body]}>
                <Animated.View
                    style={[styles.progressBar, {
                        backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor'),
                        transform: [{translateX: this.state.progress}],
                    }]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: 2,
        width: '100%',
        backgroundColor: GlobalVariables.BrandColor(),
    },
    progressBar: {
        flex: 1,
        width: '100%',
    },
});
