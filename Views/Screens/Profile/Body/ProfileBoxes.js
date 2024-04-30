import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import GlobalVariables from '../../../Modules/GlobalVariables';

import ProfileBox from '../../../Components/ProfileBox/ProfileBox';

import {NavigationService} from '../../../Services/NavigationService';

export default class ProfileBoxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            city: GlobalVariables.GetCity(),
        };
    }

    componentDidMount() {
        const {isLogin} = this.props;
        this.setState({isLogin});
    }


    componentDidUpdate() {
        if (this.props.isLogin !== this.state.isLogin) {
            this.setState({isLogin: this.props.isLogin});
        }
    }

    render() {
        return (
            <View
                style={[styles.body]}>
                {this.state.isLogin ?
                    <ProfileBox navigation={this.props.navigation} route={this.props.route}
                                icon={{name: 'dvr', type: 'MaterialIcons'}}
                                title="آگهی‌های من"
                                onPress={() => NavigationService.navigate(this.props.navigation, 'MyPosts', {})}/>
                    :
                    null
                }
                {this.state.isLogin && 0 ?
                    < ProfileBox navigation={this.props.navigation} route={this.props.route}
                                 icon={{name: 'credit-card', type: 'Feather'}}
                                 title="پرداخت‌های من" onPress={() => console.log('پرداخت‌های من')}/>
                    :
                    null
                }
                <ProfileBox navigation={this.props.navigation} route={this.props.route} title="نشان‌ها"
                            icon={{name: 'staro', type: 'AntDesign'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'FavoriteList', {})}/>
                <ProfileBox navigation={this.props.navigation} route={this.props.route} title="بازدید‌های اخیر"
                            icon={{name: 'history', type: 'MaterialIcons'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'LastVisits', {})}/>
                <ProfileBox navigation={this.props.navigation} route={this.props.route} title="تنظیمات"
                            icon={{name: 'settings', type: 'Feather'}}
                            onPress={() => NavigationService.navigate(this.props.navigation, 'Setting', {})}/>
                {this.state.city ?
                    <ProfileBox navigation={this.props.navigation} route={this.props.route}
                                title={this.state.city.label + ' - ' + this.state.city.parentLabel}
                                icon={{name: 'location-pin', type: 'MaterialIcons'}}
                                textLine={1}
                                onPress={() => NavigationService.navigate(this.props.navigation, 'SelectCity', {
                                    back: true,
                                    changeUserCity: true,
                                })}/>
                    :
                    null
                }
                <ProfileBox navigation={this.props.navigation} route={this.props.route}
                            title={GlobalVariables.GetDarkMode() ? 'حالت روز' : 'حالت شب'}
                            icon={{name: GlobalVariables.GetDarkMode() ? 'sun' : 'moon', type: 'Feather'}}
                            textLine={1}
                            onPress={() => {
                                GlobalVariables.SetDarkMode(!GlobalVariables.GetDarkMode());
                                EventRegister.emit('changedDarkMode');
                            }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        paddingLeft: '2%',
    },
});
