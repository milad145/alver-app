import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground, Text} from 'react-native';
import GlobalVariables from "../../Modules/GlobalVariables";
import Icon from "../Icon/Icon";

export default class HomeLogo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        const {cat} = this.props;
        if ((cat && typeof this.state.cat === "undefined") || cat && typeof this.state.cat !== "undefined" && cat._id !== this.state.cat._id) {
            this.setState({cat})
        }
    }

    render() {
        const categories = ["liveStock", "farmBirds", "forage", "horse", "cow", "buffalo", "calf", "goat", "sheep",
            "ram", "donkey", "mule", "camel", "dog", "bee", "hen", "rooster", "chicken", "duck", "goose", "ostrich",
            "turkey", "straw", "alfalfa", "press"];
        return (
            <View style={styles.body}>
                {this.state.cat && categories.includes(this.state.cat.name) ?
                    <View style={styles.logo}>
                        <Icon name={this.state.cat.name} type="Category" size="75%"/>
                    </View>
                    :
                    <View style={styles.logo}>
                        <ImageBackground style={styles.logoImg}
                                         source={require('../../Assets/Images/logo.png')}/>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    logo: {
        ...GlobalVariables.DefaultShadow,
        borderRadius: 60,
        width: "90%",
        maxWidth:GlobalVariables.LogoWidth,
        maxHeight:GlobalVariables.LogoWidth,
        minWidth:GlobalVariables.FooterHeight,
        minHeight:GlobalVariables.FooterHeight,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'white',
        // right: ((GlobalVariables.DeviceWidth / 2) - ((GlobalVariables.LogoWidth - 5) / 2)),
        bottom: 5,
        overflow: 'hidden'
    },
    logoImg: {
        flex: 3,
        height: '100%',
        aspectRatio: 1,
        overflow: 'hidden'
    },
    logoTxt: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
