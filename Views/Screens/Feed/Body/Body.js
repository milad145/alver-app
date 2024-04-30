import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import _ from 'lodash';

import {NavigationService} from '../../../Services/NavigationService';

import GlobalVariables from '../../../Modules/GlobalVariables';

import PostForm from '../../../Components/PostForm/PostForm';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
        };
    }

    componentDidMount() {
        let post = GlobalVariables.GetPost();
        if (post) {
            NavigationService.setParams(this.props.navigation, post);
        } else {
            this.setParams(this.props.route.params);
        }
    }


    componentDidUpdate() {
        if (!_.isEqual(this.state.params, this.props.route.params)) {
            this.setParams(this.props.route.params);
        }
    }

    setParams(post) {
        this.setState({params: post});
    }


    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <PostForm post={this.state.params} route={this.props.route} navigation={this.props.navigation}
                          type="Feed"/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    scroll: {
        paddingLeft: 13,
        paddingRight: 13,
    },
    catFieldName: {flex: 1},
    catFieldValue: {color: '#555'},
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    rowFlex: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    separator: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    searchInput: {
        flex: 1,
        textAlignVertical: 'top',
    },
    searchView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    margin: {
        marginTop: 8,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        flex: 0.48,
    },
});
