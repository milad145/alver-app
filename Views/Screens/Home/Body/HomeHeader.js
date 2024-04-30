import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';

import GlobalVariables from '../../../Modules/GlobalVariables';

import HeaderSearchBar from '../../../Components/HeaderSearchBar/HeaderSearchBar';

export default class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={[styles.body, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                <View style={styles.logoParent}>
                    <View style={styles.menu}>
                        <Image style={{aspectRatio: 3, height: GlobalVariables.HeaderHeight / 1.8}}
                               source={GlobalVariables.GetDarkMode() ? require('../../../Assets/Images/topBarLogo_dark.png') : require('../../../Assets/Images/topBarLogo.png')}/>
                        {/*<Text style={GlobalVariables.TextStyle('b', 'xxl', 't')}>آلور</Text>*/}
                    </View>
                    <View style={{flex: 4, height: (GlobalVariables.HeaderHeight - 10)}}>
                        <HeaderSearchBar location={true} navigation={this.props.navigation}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: GlobalVariables.HeaderHeight,
        paddingLeft: 10,
        paddingRight: 10,
        ...GlobalVariables.DefaultShadow,
        justifyContent: 'center',
    },
    logoParent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    quickSale: {
        alignItems: 'center',
    },
    quickSaleLogo: {
        height: GlobalVariables.LogoWidth * 0.6,
        aspectRatio: 1,
    },
    menu: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        flex: 1.5,
    },
    logoContain: {flex: 2, alignItems: 'center'},
    logoCircle: {
        borderBottomWidth: 0,
        borderTopLeftRadius: (GlobalVariables.LogoWidth / 2),
        borderTopRightRadius: (GlobalVariables.LogoWidth / 2),
        width: (GlobalVariables.LogoWidth),
        aspectRatio: 3 / 2,
        alignItems: 'center',
        zIndex: 5,
        ...GlobalVariables.DefaultShadow,
        paddingTop: 3,
    },
    logo: {
        ...GlobalVariables.DefaultShadow,
        borderRadius: 60,
        width: (GlobalVariables.LogoWidth - 5),
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    main: {
        marginTop: -1,
        height: 1,
        ...GlobalVariables.DefaultShadow,
    },
});
