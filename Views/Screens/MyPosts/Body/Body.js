import React, {Component} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';
import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import LoginLogout from '../../../Components/LoginLogout/LoginLogout';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import Post from '../../../Components/Post/Post';
import Loader from '../../../Components/Loader/Loader';
import NoPosts from '../../../Components/NoPosts/NoPosts';

import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';
import {NavigationService} from '../../../Services/NavigationService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadingStatus: GlobalVariables.GetUploadStatus(),
            showLoader: true,
            networkError: false,
            posts: [],
            requestLoaded: false,
            isRefreshing: false,
            error: null,
        };
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('postUploadingProgressEnd', () => {
            this.setState({uploadingStatus: false});
            GlobalVariables.SetUploadStatus(false);
            this.getPosts();
        });
        this.listener1 = EventRegister.addEventListener('postUploadingProgressError', (err) => {
            if (err && err.data && err.data.messageCode === 1304) {
                this.setState({error: err.data.message});
            }
        });
        this.getPosts();
    }

    componentDidUpdate() {
        if (this.state.uploadingStatus !== GlobalVariables.GetUploadStatus()) {
            this.setState({uploadingStatus: GlobalVariables.GetUploadStatus()});
        }
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.listener1);
    }

    getPosts(lastId) {
        this.setState({networkError: false, requestLoaded: false});
        let query = '?1';
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        PostService.mine(query, this.props.navigation)
            .then(payload => {
                let {posts} = payload.data.result;
                let newState = {networkError: false, isRefreshing: false, requestLoaded: true};
                if (posts.length) {
                    newState.lastId = posts[posts.length - 1]._id;
                    newState.showLoader = true;
                } else {
                    newState.showLoader = false;
                }
                if (lastId) {
                    posts = _.unionBy(this.state.posts, posts, '_id');
                }
                newState.posts = posts;
                this.setState(newState);
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true, showLoader: true});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                }
            });
    }

    onNextPage() {
        if (this.state.showLoader) {
            this.getPosts(this.state.lastId);
        }
    }

    renderPosts() {
        return (
            this.state.networkError ?
                <NetworkError onPress={() => this.getPosts()}/>
                :
                <FlatList
                    ref={(ref) => {
                        this.ListView_Ref = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    data={this.state.posts}
                    keyExtractor={(item) => (item._id)}
                    initialNumToRender={7}
                    removeClippedSubviews={true}
                    renderItem={({item, index}) => (
                        <Post navigation={this.props.navigation} route={this.props.route} post={item}
                              onPress={(post) => NavigationService.navigate(this.props.navigation, 'ManagePost', {post})}
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
                    ListHeaderComponent={() => (
                        this.state.uploadingStatus ?
                            <View style={{height: GlobalVariables.UploadLogoWidth}}>
                                <Loader type="upload" animation={true}/>
                            </View>
                            : this.state.error ?
                            <View style={{padding: 15}}>
                                <Text
                                    style={[GlobalVariables.TextStyle('v', null, null), {color: GlobalVariables.RedColor()}]}>{this.state.error}</Text>
                            </View>
                            : null
                    )}
                    ListEmptyComponent={() => (<NoPosts requestLoaded={this.state.requestLoaded}/>)}
                    onEndReached={this.onNextPage.bind(this)}
                />

        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <View style={{padding: 15, paddingBottom: 0}}>
                    <LoginLogout navigation={this.props.navigation} route={this.props.route}/>
                </View>
                {this.renderPosts()}
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
