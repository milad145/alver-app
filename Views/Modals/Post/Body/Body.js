import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Share} from 'react-native';

import _ from 'lodash';

import GlobalVariables from '../../../Modules/GlobalVariables';
import {latinNumToPersianNum, DivideNumber3Digits} from '../../../Modules/Assets';

import {NavigationService} from '../../../Services/NavigationService';
import {PostService} from '../../../Services/PostService';
import {ToastService} from '../../../Services/ToastService';

import Icon from '../../../Components/Icon/Icon';
import LightMap from '../../../Components/Map/LightMap';
import NetworkError from '../../../Components/NetworkError/NetworkError';
import ImageSlider from '../../../Components/ImageSlider/ImageSlider';
import Loader from '../../../Components/Loader/Loader';
import TimeAgo from '../../../Components/Time/TimeAgo';
import AudioPlayer from '../../../Components/AudioController/AudioPlayer';

import appConfig from '../../../../config';
import AdvanceAlert from '../../../Components/Alert/AdvanceAlert';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            headerOpacity: 0.2,
            galleryHeight: 0,
            headerHeight: 0,
            galleryWidth: 0,
            headerTitleOpacity: 0,
            fields: [],
            elevation: 0,
            networkError: false,
            getContactInfo: false,
            contactInfo: null,
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            advanceAlertModalMessage: '',
            extraAlertButtons: [],
            socialMedia: [],
            isFavorite: false,
        };
    }

    componentDidMount() {
        this.getPost(this.props.route.params.post);
        this.isFavoriteList(this.props.route.params.post);
    }

    componentDidUpdate() {
        let {refresh} = this.props.route.params;
        if (refresh) {
            this.getContactInfo();
        }
    }

    getFields(post, fields) {
        let state = {post};
        if (post.fieldsValue) {
            state.fields = _.sortBy(_.filter(fields, f => Object.keys(post.fieldsValue).includes(f.name)), 'sort');
        }
        this.setState(state);
    }

    getPost(postID) {
        this.setState({networkError: false});
        PostService.getPost(postID, this.props.navigation)
            .then(payload => {
                let {post, fields} = payload.data.result;
                this.getFields(post, fields);
                this.addToLastVisits(post);
            })
            .catch(error => {
                if (error.type === 'request') {
                    this.setState({networkError: true});
                } else if (error.type === 'response') {
                    if (error.status === 404) {
                        PostService.removeFromFavoriteList(postID);
                    }
                    ToastService.show(error.data.message, 3000, 'c');
                    NavigationService.goBack(this.props.navigation);
                }
            });
    }

    toggleToFavoriteList = () => {
        let {cat, city, createdAt, fieldsValue, mainImage, title, _id} = this.state.post;
        PostService.toggleToFavoriteList({cat, city, createdAt, fieldsValue, mainImage, title, _id})
            .then(isFavorite => this.setState({isFavorite}));
    };

    isFavoriteList = (postId) => {
        PostService.isFavorite(postId)
            .then(isFavorite => this.setState({isFavorite}));
    };

    setHeaderOpacity(offsetY) {
        let galleyEdge = (this.state.galleryHeight);
        let headerOpacity = (offsetY / galleyEdge).toFixed(2);
        if (headerOpacity < 0.2) {
            this.setState({headerOpacity: 0.2, headerTitleOpacity: 0, elevation: (headerOpacity * 2)});
        } else if (parseInt(headerOpacity) < 1) {
            this.setState({headerOpacity, headerTitleOpacity: 0, elevation: (headerOpacity * 2)});
        } else {
            this.setState({headerOpacity: 1, headerTitleOpacity: 1, elevation: 2});
        }

    }

    getContactInfo() {
        NavigationService.setParams(this.props.navigation, {refresh: false});
        if (!this.state.getContactInfo && !this.state.contactInfo) {
            this.setState({getContactInfo: true});
            PostService.getPostContactInfo(this.state.post._id, this.props.navigation)
                .then(payload => {
                    let {contactInfo, socialMedia} = payload.data;
                    this.setState({getContactInfo: false, contactInfo, socialMedia});
                    this.showContactInfo(contactInfo, socialMedia);
                })
                .catch(error => {
                    this.setState({getContactInfo: false});
                    if (error.type === 'request') {
                        this.setState({networkError: true});
                    } else if (error.type === 'response') {
                        if (error.status === 401) {
                            NavigationService.navigate(this.props.navigation, 'Login', {screen: 'Post'});
                        } else {
                            ToastService.show(error.data.message, 3000, 'c');
                        }
                    }
                });
        } else {
            this.showContactInfo(this.state.contactInfo, this.state.socialMedia);
        }
    }

    showContactInfo(contactInfo, socialMedia) {
        console.log(socialMedia);
        let extraAlertButtons = [
            {
                message: 'تماس با ' + latinNumToPersianNum(contactInfo.phoneNumber),
                iconName: 'phone',
                iconType: 'AntDesign',
                onPress: () => Linking.openURL(`tel:${contactInfo.phoneNumber}`),
            },
            {
                message: 'ارسال پیام به ' + latinNumToPersianNum(contactInfo.phoneNumber),
                iconName: 'message1',
                iconType: 'AntDesign',
                onPress: () => Linking.openURL(`sms:${contactInfo.phoneNumber}`),
            },
        ];
        for (let sm of socialMedia) {
            let {message, iconName, iconType, linking} = sm;
            if ((typeof message === 'string' && message.length) && (typeof iconName === 'string' && iconName.length) && (typeof iconType === 'string' && iconType.length) && (typeof linking === 'string' && linking.length)) {
                let button = {
                    message: message,
                    iconName: iconName,
                    iconType: iconType,
                    onPress: () => Linking.openURL(linking),
                };
                if (sm.style) {
                    button.style = sm.style;
                }
                extraAlertButtons.push(button);
            }
        }
        this.setState({
            advanceAlertModalMessage: 'هشدار پلیس و قضایی: لطفا پیش از انجام معامله و هر نوع پرداخت وجه، از صحت کالا یا خدمات ارايه شده، به صورت حضوری اطمینان حاصل نمایید.',
            advanceAlertModalVisible: true, advanceAlertModalTitle: 'اطلاعات تماس', extraAlertButtons,
        });

    }

    closeAdvanceAlert() {
        this.setState({
            advanceAlertModalVisible: false,
            advanceAlertModalTitle: '',
            advanceAlertModalMessage: '',
            extraAlertButtons: [],
        });
    }

    onShare = async () => {
        try {
            await Share.share({
                message: `${appConfig.url.uri}p/${this.state.post._id}/${this.state.post.title.replace(/ /g, '_')}`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    renderHeader() {
        return (
            <View
                style={[styles.header, {backgroundColor: GlobalVariables.HeaderColorRGBA(this.state.headerOpacity)}, {elevation: this.state.elevation}]}
                onLayout={(event) => this.setState({headerHeight: event.nativeEvent.layout.height})}>
                <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                  onPress={() => NavigationService.goBack(this.props.navigation)}>
                    <Icon name="arrow-right" type="Feather"
                          style={{color: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                          size={GlobalVariables.MediumIconSize}/>
                </TouchableOpacity>
                <Text numberOfLines={1}
                      style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.titleText, {
                          opacity: this.state.headerTitleOpacity,
                          // width: '80%',
                          flex: 1,
                      }]}>{latinNumToPersianNum(this.state.post.title || '')}</Text>
                <View style={{height: '100%', paddingRight: 10, paddingLeft: 10, flexDirection: 'row'}}>
                    <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                      onPress={this.onShare}>
                        <Icon name="share" type="Entypo"
                              style={{color: GlobalVariables.BlueColor()}}
                              size={GlobalVariables.MediumIconSize}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{height: '100%', justifyContent: 'center', paddingLeft: 10}}
                                      onPress={this.toggleToFavoriteList}>
                        <Icon name={this.state.isFavorite ? 'star' : 'staro'} type="AntDesign"
                              style={{color: this.state.isFavorite ? GlobalVariables.BrandSuccess : GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'color')}}
                              size={GlobalVariables.MediumIconSize}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.renderHeader()}
                {this.state.post.title ?
                    <View style={styles.body}>
                        <ScrollView onScroll={(event) => this.setHeaderOpacity(event.nativeEvent.contentOffset.y)}>

                            <View style={styles.gallery} onLayout={(event) => {
                                this.setState({
                                    galleryHeight: event.nativeEvent.layout.height,
                                });
                            }}>
                                {this.state.post.images.length ?
                                    <ImageSlider style={styles.gallery}
                                                 images={this.state.post.images.map(i => appConfig.url.api + 'image/' + i.uri)}
                                                 onLayout={(event) => {
                                                     this.setState({
                                                         galleryHeight: event.nativeEvent.layout.height,
                                                     });
                                                 }}/>
                                    :
                                    <View style={styles.galleryPlaceHolder}><Icon type="Feather" name="image"
                                                                                  style={GlobalVariables.TextStyle('v', null, 'p')}
                                                                                  size={GlobalVariables.DeviceWidth / 3}/></View>}
                            </View>
                            <View style={styles.details}>
                                <View style={[styles.filedWrapper, styles.rowFlex]}>
                                    <Text
                                        style={[GlobalVariables.TextStyle('b', 'l', 't'), styles.catFieldName]}>
                                        {latinNumToPersianNum(this.state.post.title)}
                                    </Text>
                                </View>
                                <View style={[]}>
                                    <Text
                                        style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName]}>
                                        <TimeAgo time={this.state.post.createdAt} interval={20000}
                                                 style={[styles.time]}/>{latinNumToPersianNum(' در ' + this.state.post.city.label + '، ' + this.state.post.city.parent.label)} | {'آگهی‌های ' + this.state.post.cat.title}
                                    </Text>
                                </View>
                                <View style={styles.separator}/>
                                {
                                    (this.state.post.audios && this.state.post.audios.length) ?
                                        <View>
                                            <Text
                                                style={[GlobalVariables.TextStyle('v', 'me', 'dp'), styles.catFieldName]}>
                                                توضیحات صوتی
                                            </Text>
                                            <AudioPlayer type="server" audio={this.state.post.audios[0]}/>
                                            <View style={styles.separator}/>
                                        </View>
                                        :
                                        null
                                }
                                {this.state.fields.map(f => {
                                    let field = this.state.post.fieldsValue[f.name];
                                    return (
                                        <View key={f._id}>
                                            <View style={[styles.filedWrapper, styles.rowFlex]}>
                                                <Text
                                                    style={[GlobalVariables.TextStyle('v', 'me', 'dp'), styles.catFieldName]}>
                                                    {f.title}
                                                </Text>
                                                <Text
                                                    style={[GlobalVariables.TextStyle('v', 'l', 't')]}>
                                                    {f.type === 'select' ? _.find(f.options, a => a.value === field.v).title :
                                                        f.type === 'boolean' ?
                                                            field.v ? 'بله' : 'خیر'
                                                            :
                                                            latinNumToPersianNum(DivideNumber3Digits(field.v))
                                                    }
                                                    {field.u ? ' ' + _.find(f.unit, a => a.name === field.u).title : ''}
                                                </Text>
                                            </View>
                                            <View style={styles.separator}/>
                                        </View>
                                    );
                                })}
                                {typeof this.state.post.description === 'string' && this.state.post.description.length ?
                                    <View style={[styles.filedWrapper]}>
                                        <Text
                                            style={[GlobalVariables.TextStyle('b', 'me1', 't'), styles.catFieldName]}>
                                            توضیحات
                                        </Text>
                                        <Text
                                            style={[GlobalVariables.TextStyle('v', 'me1', 't')]}>
                                            {latinNumToPersianNum(this.state.post.description)}
                                        </Text>
                                    </View>
                                    : null
                                }
                                {this.state.post.location ?
                                    <View style={[styles.filedWrapper]}>
                                        <Text
                                            style={[GlobalVariables.TextStyle('b', 'me1', 't'), styles.catFieldName]}>
                                            محدوده آگهی
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(`geo:${this.state.post.location.latitude},${this.state.post.location.longitude}`)}>
                                            <View style={styles.locationView}>
                                                <LightMap selectedLocation={this.state.post.location}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                            </View>
                        </ScrollView>
                        <View
                            style={[styles.getContactView, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                            <TouchableOpacity style={[GlobalVariables.DefaultButtons, styles.footerElement]}
                                              onPress={() => this.getContactInfo()}>
                                <Text style={[styles.footerButtonText]}>اطلاعات تماس</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    this.state.networkError ?
                        <NetworkError onPress={() => this.getPost(this.props.route.params.post)}/>
                        :
                        <View style={styles.loaderWrapper}>
                            <Loader type="refresh" color="#888"/>
                        </View>
                }
                {
                    this.state.getContactInfo ?
                        <View style={[styles.loaderWrapper, styles.loaderBlur]}>
                            <Loader type="refresh" color="#888"/>
                        </View>
                        :
                        null
                }
                <AdvanceAlert extraAlertButtons={this.state.extraAlertButtons}
                              customCancelButton={false}
                              title={this.state.advanceAlertModalTitle}
                              message={this.state.advanceAlertModalMessage}
                              visible={this.state.advanceAlertModalVisible}
                              closeModal={() => this.closeAdvanceAlert()}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    header: {
        backgroundColor: 'rgba(255,192,0,0.0)',
        height: GlobalVariables.HeaderHeight,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        zIndex: 10,
        width: '100%',
        ...GlobalVariables.DefaultShadow,
    },
    titleText: {
        marginLeft: 10,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBlur: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.1)',
        top: 0,
        left: 0,
        elevation: 3,
    },
    gallery: {
        width: GlobalVariables.DeviceWidth,
        flex: 1,
        aspectRatio: 4 / 3,
    },
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
    catFieldName: {flex: 1},
    details: {
        padding: 10,
    },
    separator: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    getContactView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        ...GlobalVariables.DefaultShadow,
        borderTopWidth: 1,
        borderColor: GlobalVariables.BorderColor,
    },
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerButton: GlobalVariables.DefaultButtons,
    footerElement: {
        flex: 1,
    },
    galleryPlaceHolder: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    locationView: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 5,
        backgroundColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
});
