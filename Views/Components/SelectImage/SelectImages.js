import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground} from 'react-native';

import _ from 'lodash';
import {EventRegister} from 'react-native-event-listeners';
import ImageCropper from 'react-native-image-crop-picker';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../Icon/Icon';
import SelectImage from './SelectImage';
import Alert from '../Alert/Alert';
import AdvanceAlert from '../Alert/AdvanceAlert';
import appConfig from '../../../config';

export default class SelectImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageModalVisible: false,
            alertModalVisible: false,
            advanceAlertModalVisible: false,
            images: [],
            alertMessage: '',
            extraAlertButtons: [],
        };
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    }

    componentDidMount() {
        this.setState({images: this.props.defaultImages || []});
        this.listener = EventRegister.addEventListener('renewPost', () => {
            GlobalVariables.SetPost(null);
            this.setState({images: []});
        });
    }

    componentDidUpdate() {
        if (!_.isEqual(this.state.images, this.props.route.params.images)) {
            this.props.onChangeImages(this.state.images);
        }
    }

    closeImageModal() {
        this.setState({imageModalVisible: false});
    }

    selectImage() {
        if (this.state.images.length < 5) {
            this.setState({imageModalVisible: true});
        } else {
            this.setState({alertModalVisible: true, alertMessage: 'حداکثر 5 تصویر می‌توانید انتخاب کنید.'});
        }
    }

    onSelectImage(img) {
        let images = this.state.images;
        if (images.length === 0) {
            img.mainImage = true;
        }
        images.push(img);
        this.setState({imageModalVisible: false, images});
    }

    cropImage(img) {
        ImageCropper.openCropper({
            path: img.uri,
        })
            .then(payload => {
                let images = this.state.images;
                let imageIndex = _.findIndex(images, i => i.fileName === img.fileName);
                let {width, path: uri, height, size} = payload;
                images[imageIndex] = {...images[imageIndex], width, uri, height, size};
                this.setState({images, advanceAlertModalVisible: false});
            })
            .catch(() => this.setState({advanceAlertModalVisible: false}));
    }


    editImage(img) {
        let extraAlertButtons = [
            {
                message: 'حذف',
                iconName: 'trash-2',
                iconType: 'Feather',
                onPress: () => this.removeImage(img.fileName),
            }, {
                message: 'ویرایش',
                iconName: 'crop-rotate',
                iconType: 'MaterialCommunityIcons',
                onPress: () => this.cropImage(img),
            },
        ];
        if (!img.mainImage) {
            extraAlertButtons.unshift({
                message: 'انتخاب به عنوان تصویر اصلی', iconName: 'image', iconType: 'Feather',
                onPress: () => this.setAsMainImage(img.fileName),
            });
        }
        this.setState({
            advanceAlertModalVisible: true,
            extraAlertButtons,
        });
    }

    removeImage(imgName) {
        let images = _.remove(this.state.images, img => img.fileName !== imgName);
        let mainImage = _.find(images, img => img.mainImage);
        if (!mainImage && images.length) {
            images[0].mainImage = true;
        }
        this.setState({
            images,
            advanceAlertModalVisible: false,
        });
    }

    setAsMainImage(imgName) {
        let images = this.state.images;
        let previousMainImage = _.findIndex(images, img => img.mainImage);
        let newMainImage = _.findIndex(images, img => img.fileName === imgName);
        if (previousMainImage > -1) {
            images[previousMainImage].mainImage = false;
        }
        if (images[newMainImage]) {
            images[newMainImage].mainImage = true;
        }
        this.setState({advanceAlertModalVisible: false, images});
    }

    render() {
        return (
            <View style={[styles.filedWrapper]}>
                <Text
                    style={[GlobalVariables.TextStyle('v', 'me1', 't'), styles.catFieldName, styles.margin]}>
                    عکس آگهی
                </Text>
                <Text
                    style={[GlobalVariables.TextStyle('l', 's', 't'), styles.catFieldName, styles.margin]}>
                    افزودن عکس بازدید آگهی شما را تا چند برابر افزایش می‌دهد.
                </Text>
                <View style={styles.imagesSection}>
                    <TouchableOpacity style={styles.imageWrapper} onPress={() => this.selectImage()}>
                        <Icon style={GlobalVariables.TextStyle(null, null, 'p')} size={GlobalVariables.ExtraBigIconSize}
                              type="MaterialIcons" name="add-a-photo"/>
                        <Text
                            style={[GlobalVariables.TextStyle('v', 'me1', 'dp')]}>
                            افزودن عکس
                        </Text>
                    </TouchableOpacity>
                    {this.state.images.map((img, i) => {
                        return (
                            <TouchableOpacity style={styles.imageWrapper} onPress={() => this.editImage(img)} key={i}>
                                <ImageBackground style={styles.thumbImage}
                                                 source={{uri: (img.server ? appConfig.url.api + 'image/' : '') + img.uri}}>
                                    <View style={{flex: 1}}/>
                                    {img.mainImage ?
                                        <View style={{
                                            backgroundColor: 'rgba(52, 52, 52, 0.7)',
                                            padding: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text
                                                style={[GlobalVariables.TextStyle('v', 's', null), {color: 'white'}]}>عکس
                                                اصلی</Text>
                                        </View>
                                        : null}
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                    {Array.from(Array(5 - this.state.images.length).keys()).map(p => {
                        return (
                            <View style={styles.imageWrapper} key={p}>
                                <Icon style={GlobalVariables.TextStyle(null, null, 'p')}
                                      size={GlobalVariables.ExtraBigIconSize}
                                      type="Feather" name="image"/>
                                <Text
                                    style={[GlobalVariables.TextStyle('v', 'me1', 'dp')]}>
                                    عکس
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <SelectImage visible={this.state.imageModalVisible} closeImageModal={() => this.closeImageModal()}
                             onSelectImage={(img) => this.onSelectImage(img)}/>
                <Alert visible={this.state.alertModalVisible}
                       closeModal={() => this.setState({alertModalVisible: false, alertMessage: ''})}
                       message={this.state.alertMessage} iconName="alert-triangle" iconType="Feather"/>
                <AdvanceAlert extraAlertButtons={this.state.extraAlertButtons}
                              visible={this.state.advanceAlertModalVisible}
                              closeModal={() => this.setState({advanceAlertModalVisible: false})}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    filedWrapper: {
        width: '100%',
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
    },
    catFieldName: {flex: 1},
    margin: {
        marginTop: 8,
        marginBottom: 8,
    },
    imagesSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        borderWidth: 1,
        borderColor: GlobalVariables.BorderColor,
        width: (GlobalVariables.DeviceWidth / 3) * 0.8,
        aspectRatio: 1,
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 5,
    },
    thumbImage: {
        width: '100%',
        aspectRatio: 1,
    },
});
