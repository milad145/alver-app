import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from "react-native-splash-screen";

import Header from './Body/Header';
import Body from './Body/Body';

export default class SelectCityModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			help: false
		}
	}

	componentDidMount() {
		setTimeout(() => {
			SplashScreen.hide();
		}, 500)
	}

	render() {
		return (
			<View style={[styles.mainView]}>
				<Header navigation={this.props.navigation} route={this.props.route}/>
				<Body navigation={this.props.navigation} route={this.props.route}/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	mainView: {
		flex: 1,
	}
});