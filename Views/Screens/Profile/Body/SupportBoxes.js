import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import appConfig from '../../../../config';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {latinNumToPersianNum} from '../../../Modules/Assets';

import ProfileBox from '../../../Components/ProfileBox/ProfileBox';
import {NavigationService} from '../../../Services/NavigationService';

export default class SupportBoxes extends Component {
    constructor(props) {
        super(props);
        this.state = {isLogin: false};
    }

    componentDidMount() {
        const {isLogin} = this.props;
        this.setState({isLogin});
    }

    componentDidUpdate(nextProps, nextState, nextContext) {
        if (this.props.isLogin !== this.state.isLogin) {
            this.setState({isLogin: this.props.isLogin});
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <ProfileBox navigation={this.props.navigation} route={this.props.route} title="قوانین و مقررات"
                            icon={{name: 'life-buoy', type: 'Feather'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'Policy')}/>
                <ProfileBox navigation={this.props.navigation} route={this.props.route} title={'درباره ما'}
                            icon={{name: 'infocirlceo', type: 'AntDesign'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'AboutUs')}/>
                <ProfileBox navigation={this.props.navigation} route={this.props.route}
                            title={latinNumToPersianNum(GlobalVariables.Version) + '\n' + 'به روز رسانی'}
                            icon={{name: 'download-outline', type: 'Ionicons'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'Update')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        paddingLeft: '2%',
    },
});
