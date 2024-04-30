import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';

import Loader from '../../../Components/Loader/Loader';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import PostForm from '../../../Components/PostForm/PostForm';

import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';
import {NavigationService} from '../../../Services/NavigationService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            networkError: false,
        };
    }

    componentDidMount() {
        this.getPost(this.props.route.params.post);
    }

    componentDidUpdate() {
        let newCat = this.props.route.params.cat;
        let newCategories = this.props.route.params.categories || [];
        let post = this.state.post;
        if (newCategories.length && !_.isEqual(_.sortBy(newCategories), _.sortBy(post.categories))) {
            post.categories = newCategories;
            post.cat = newCat;
            this.setState({post});
        }
    }

    getPost(postID) {
        this.setState({networkError: false});
        PostService.getMyPost(postID, this.props.navigation)
            .then(payload => {
                let {post} = payload.data;
                post.images = post.images.map(img => {
                    img.mainImage = img.uri === post.mainImage;
                    img.fileName = img.uri;
                    img.server = true;
                    return img;
                });
                if (post.city && post.city._id) {
                    post.city.parentLabel = post.city.parent.label;
                    post.city.parentId = post.city.parent._id;
                    if (post.location) {
                        post.city.latitude = post.location.latitude;
                        post.city.longitude = post.location.longitude;
                    }
                }
                this.setState({post});
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true});
                } else if (error.type === 'response') {
                    ToastService.show(error.data.message, 3000, 'c');
                    NavigationService.goBack(this.props.navigation);
                }
            });
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {
                    this.state.post._id ?
                        <PostForm post={this.state.post} route={this.props.route} navigation={this.props.navigation}
                                  type="EditPost"/>
                        : this.state.networkError ?
                        <NetworkError onPress={() => this.getPost(this.props.route.params.post)}/>
                        :
                        <View style={styles.loaderWrapper}>
                            <Loader type="refresh" color="#888"/>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
