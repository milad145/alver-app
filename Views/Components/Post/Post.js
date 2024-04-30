import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ImageBackground, Text, Image} from 'react-native';

import {latinNumToPersianNum, DivideNumber3Digits} from '../../Modules/Assets';
import GlobalVariables from '../../Modules/GlobalVariables';

import TimeAgo from '../Time/TimeAgo';

import appConfig from '../../../config';

import {NavigationService} from '../../Services/NavigationService';
import {EventRegister} from 'react-native-event-listeners';
import ImageLoaded from '../ImageLoaded/ImageLoaded';

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            imageLoaded: true,
            deleted: false,
            imageError: false,
        };
    }

    componentDidMount() {
        this.setState({
            post: this.props.post,
            imageLoaded: !!this.props.post.mainImage,
        });
        this.prepareDarkModeLogo(this.props.post);
        this.listener = EventRegister.addEventListener('changedDarkMode', () => {
            this.prepareDarkModeLogo(this.props.post);
        });
        this.listener1 = EventRegister.addEventListener('postDeleted', (postId) => {
            if (this.state.post && this.state.post._id === postId) {
                this.setState({deleted: true});
            }
        });
        this.listener2 = EventRegister.addEventListener('postEdited', (post) => {
            if (this.state.post && this.state.post._id === post._id) {
                if (post.mainImage) {
                    let {server, uri} = post.mainImage;
                    if (server) {
                        this.prepareDarkModeLogo({mainImage: uri});
                    } else {
                        this.setState({imageSource: {uri: uri}});
                    }
                }
                else {
                    this.prepareDarkModeLogo(post);
                }
            }
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.listener1);
        EventRegister.removeEventListener(this.listener2);
    }

    prepareDarkModeLogo(post) {
        let logo = GlobalVariables.GetDarkMode() ? require('../../Assets/Images/defaultImage_3x2_dark.png') : require('../../Assets/Images/defaultImage_3x2.png');
        this.setState({
            imageSource: post.mainImage ? {uri: appConfig.url.api + 'image/' + post.mainImage} : logo,
            logo,
        });
    }

    onPress(post) {
        if (this.props.onPress) {
            this.props.onPress(post);
        } else {
            NavigationService.navigate(this.props.navigation, 'Post', {post: post._id});
        }
    }

    render() {
        const post = this.props.post;
        let status = '';
        if (typeof post.status === 'number') {
            switch (post.status) {
                case 1:
                    status = 'منتشر شده';
                    break;
                case -1:
                    status = 'حذف شده';
                    break;
                case -2:
                    status = 'منقضی شده';
                    break;
                case 0:
                    status = 'در صف انتشار';
                    break;
            }
        }
        return (
            this.state.deleted ? null :
                <TouchableOpacity
                    onPress={() => this.onPress(post)}
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}, GlobalVariables.GetDarkMode() ? {
                        borderWidth: 1,
                        borderColor: GlobalVariables.StyleMode(false, 'borderColor'),
                    } : null]}>
                    <View style={styles.rightSide}>
                        <View style={styles.title}>
                            <Text style={GlobalVariables.TextStyle('m', 'l', 't')}>{post.title}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text
                                style={GlobalVariables.TextStyle('v', 's', 'p')}>{(post.fieldsValue && post.fieldsValue.price && post.fieldsValue.price.v) ? latinNumToPersianNum(DivideNumber3Digits(post.fieldsValue.price.v)) + ' تومان' : 'توافقی'}</Text>
                            <Text style={GlobalVariables.TextStyle('v', 'm', 'p')}>
                                {post.quickSale ?
                                    <Text style={{color: GlobalVariables.RedColor()}}>فوری</Text>
                                    : <TimeAgo time={post.createdAt} interval={20000} style={[styles.time]}/>
                                }{' '}
                                در {post.city.label}</Text>
                        </View>
                    </View>
                    <View style={styles.leftSide}>
                        <View style={styles.postImage}>
                            {this.state.imageLoaded ?
                                <View style={[styles.label, {aspectRatio: 1, zIndex: 0}]}>
                                    <ImageLoaded/>
                                </View>
                                : null
                            }
                            {typeof post.status !== 'undefined' ?
                                <View
                                    style={[styles.label, {backgroundColor: post.status === 0 ? 'rgba(200,200,0,0.8)' : post.status === 1 ? 'rgba(0,200,0,0.8)' : post.status === -1 ? 'rgba(200,0,0,0.8)' : post.status === -2 ? 'rgba(0,0,0,0.8)' : 'rgba(200,0,0,0)'}]}>
                                    <Text style={[GlobalVariables.TextStyle('v', 'me'), {color: 'white'}]}>
                                        {status}
                                    </Text>
                                </View>
                                : null
                            }
                            {this.state.imageSource ?
                                <Image
                                    onError={() => this.setState({
                                        imageLoaded: false,
                                        imageSource: this.state.logo,
                                        imageError: true,
                                    })}
                                    onLoadEnd={() => this.setState({imageLoaded: false})}
                                    style={[styles.postImage]}
                                    source={this.state.imageSource}/>
                                : null}
                        </View>
                    </View>
                </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        ...GlobalVariables.DefaultShadow,
        margin: 7,
        flexDirection: 'row',
        elevation: 4,
    },
    leftSide: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    rightSide: {
        flex: 2,
        height: '100%',
        padding: 10,
    },
    postImage: {
        height: (GlobalVariables.DeviceWidth / 3),
        borderRadius: 15,
        overflow: 'hidden',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
    },
    details: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    priceText: {
        marginBottom: 5,
    },
    label: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
        zIndex: 999,
        aspectRatio: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
