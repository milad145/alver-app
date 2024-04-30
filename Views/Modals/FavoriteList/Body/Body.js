import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';

import GlobalVariables from '../../../Modules/GlobalVariables';
import LoginLogout from '../../../Components/LoginLogout/LoginLogout';
import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import Post from '../../../Components/Post/Post';
import Loader from '../../../Components/Loader/Loader';
import NoPosts from '../../../Components/NoPosts/NoPosts';
import {EventRegister} from 'react-native-event-listeners';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            posts: [],
            requestLoaded: false,
        };
    }

    componentDidMount() {
        this.getPosts();
        this.listener = EventRegister.addEventListener('editFavoriteList', () => {
            this.getPosts();
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }


    getPosts() {
        this.setState({showLoader: true, requestLoaded: false});
        PostService.getFavoriteList()
            .then(payload => {
                this.setState({
                    posts: payload,
                    showLoader: false,
                    requestLoaded: true,
                });
            })
            .catch(() => {
                this.setState({
                    showLoader: false,
                    requestLoaded: true,
                });
            });
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <FlatList
                    ref={(ref) => {
                        this.ListView_Ref = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    data={this.state.posts}
                    keyExtractor={(item) => (item._id)}
                    refreshing={this.state.isRefreshing}
                    initialNumToRender={7}
                    removeClippedSubviews={true}
                    renderItem={({item, index}) => (
                        <Post navigation={this.props.navigation} route={this.props.route} post={item}
                              index={index}/>
                    )}
                    ListFooterComponent={() => (
                        this.state.showLoader ?
                            <View style={{height: GlobalVariables.FooterHeight}}>
                                <Loader type="refresh" color="#888"/>
                            </View>
                            :
                            null
                    )}
                    ListEmptyComponent={() => (<NoPosts requestLoaded={this.state.requestLoaded}/>)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        // padding: 15,
    },
});
