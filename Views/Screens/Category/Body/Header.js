import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import Header from "../../../Components/Categories/CategoriesList/Header"
export default class CategoryHeader extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<View style={styles.body}>
				<Header navigation={this.props.navigation} route={this.props.route}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	body: {},
});
