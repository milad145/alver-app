import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import Header from './Body/MyPostsHeader';
import Footer from '../../Components/Footer/Footer';
import Body from './Body/Body';

export default class MyPostsScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Header navigation={this.props.navigation} route={this.props.route}/>
                <Body navigation={this.props.navigation} route={this.props.route}/>
                <Footer navigation={this.props.navigation} route={this.props.route}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
});
