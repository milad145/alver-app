import React, {Component} from 'react';
import {View, StyleSheet, Image, ScrollView, Text, TouchableWithoutFeedback, Modal} from 'react-native';

import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';

import GlobalVariables from '../../Modules/GlobalVariables';
import {latinNumToPersianNum} from '../../Modules/Assets';

import Icon from '../Icon/Icon';
import ImageLoaded from '../ImageLoaded/ImageLoaded';


export default class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            galleryHeight: 0,
            galleryWidth: 0,
            images: [],
            zoom: false,
            imageIndex: 0,
            zoomAbleImages: [],
            imageLoaded: [],
            imageLoadingStatus: [],
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        if (!_.isEqual(this.state.images, this.props.images)) {
            let {images} = this.props;
            let zoomAbleImages = [];
            let imageLoaded = [], imageLoadingStatus = [];
            _.map(images, img => {
                zoomAbleImages.push({url: img});
                imageLoaded.push(true);
                imageLoadingStatus.push(true);
            });
            this.setState({images, page: 0, zoomAbleImages, imageLoaded, imageLoadingStatus});
        }
    }

    pagination(x) {
        this.setState({page: this.state.images.length - Math.round(x) - 1});
    }

    zoomImage(k) {
        this.setState({zoom: true, imageIndex: k});
    }

    closeZoomModal() {
        this.setState({zoom: false});
    }

    renderIndicator() {
        return (
            <View style={styles.indexWrapper}>
                {
                    this.state.images.map((im, k) => {
                        return (
                            <View key={k} style={[{
                                width: 7,
                                aspectRatio: 1,
                                backgroundColor: '#ccc',
                                borderRadius: 10,
                                margin: 5,
                            }, this.state.page === k ? {
                                backgroundColor: GlobalVariables.BrandColor(),
                                width: 9,
                            } : null]}/>
                        );
                    })
                }

            </View>
        );
    }

    render() {
        let style = {
            height: this.state.galleryHeight,
            width: this.state.galleryWidth,
        };
        return (
            <View style={styles.body}>
                <ScrollView scrollEventThrottle={16} horizontal={true}
                            onMomentumScrollEnd={(event) => this.pagination(event.nativeEvent.contentOffset.x / this.state.galleryWidth)}
                            showsHorizontalScrollIndicator={false} pagingEnabled={true}
                            onLayout={(event) => {
                                this.setState({
                                    galleryHeight: event.nativeEvent.layout.height,
                                    galleryWidth: event.nativeEvent.layout.width,
                                });
                            }
                            }>
                    {
                        this.state.images.map((im, k) => {
                            return (
                                <TouchableWithoutFeedback key={k} onPress={() => this.zoomImage(k)}>
                                    <View style={[style, styles.imageLoadedWrapper]}>
                                        {this.state.imageLoaded[k] ?
                                            <ImageLoaded/>
                                            : null
                                        }
                                        <Image
                                            onLoadEnd={() => {
                                                let {imageLoaded} = this.state;
                                                imageLoaded[k] = false;
                                                this.setState({imageLoaded});
                                            }}
                                            onError={() => {
                                                let {imageLoadingStatus} = this.state;
                                                imageLoadingStatus[k] = false;
                                                this.setState({imageLoadingStatus});
                                            }}
                                            source={this.state.imageLoadingStatus[k] ? {uri: im} : require('../../Assets/Images/logo.png')}
                                            style={this.state.imageLoaded[k] ? {width: 0, height: 0} : style}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })
                    }
                </ScrollView>
                {this.renderIndicator()}
                <Modal visible={this.state.zoom} onRequestClose={() => this.closeZoomModal()} animationType="fade">
                    <ImageViewer imageUrls={this.state.zoomAbleImages} index={this.state.imageIndex}
                                 style={{backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}}
                                 renderIndicator={() => null}
                                 saveToLocalByLongPress={false} enableSwipeDown={true} useNativeDriver={true}
                                 onSwipeDown={() => this.closeZoomModal()}/>
                </Modal>
                <View style={styles.countView}>
                    <Text
                        style={[GlobalVariables.TextStyle('v', 'l', 't'), {color: 'white'}]}>{latinNumToPersianNum(this.state.images.length)}</Text>
                    <Icon name="image-filter-center-focus" type="MaterialCommunityIcons"
                          style={{color: 'white'}}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    indexWrapper: {
        width: '100%',
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    countView: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flex: 1,
        borderRadius: 20,
        width: 75,
        padding: 5,
    },
    imageLoadedWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
