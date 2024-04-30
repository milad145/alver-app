import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageCropper from 'react-native-image-crop-picker';

import GlobalVariables from '../../Modules/GlobalVariables';

import {PermissionService} from '../../Services/PermissionService';

import Icon from '../../Components/Icon/Icon';

const options = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
    storageOptions: {
        skipBackup: true,
    },
    noData: true,
};

export default class GuideModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            file: null,
        };
    }

    componentDidMount() {
        this.setState({modalVisible: this.props.visible});
    }

    componentDidUpdate() {
        if (this.props.visible !== this.state.modalVisible) {
            this.setState({modalVisible: this.props.visible});
        }
    }

    closeModal() {
        this.props.closeImageModal();
    }

    pickMultiple() {
        this.closeModal();
        PermissionService.checkAndRequest('WRITE_EXTERNAL_STORAGE')
            .then(() => {
                ImagePicker.launchImageLibrary(options, (response) => {
                    if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.uri) {
                        this.fileSelected(response);
                    }
                });
            }).catch(() => true);
    }

    launchCamera() {
        this.closeModal();
        PermissionService.checkAndRequest('CAMERA')
            .then(() => {
                ImagePicker.launchCamera(options, (response) => {
                    if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.uri) {
                        this.fileSelected(response);
                    }
                });
            }).catch(() => true);
    }

    fileSelected(file) {
        if (typeof file.type === !'string') {
            file.type = 'image/jpeg';
        }

        return this.props.onSelectImage(file);
        // ImageCropper.openCropper({
        //     path: file.uri,
        // })
        //     .then(payload => {
        //         let {width, path: uri, height, size} = payload;
        //         file = {...file, width, uri, height, size};
        //         if (!file.type) {
        //             file.type = 'image/jpeg';
        //         }
        //         this.props.onSelectImage(file);
        //     })
        //     .catch(() => this.closeModal());
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <View style={styles.body}>
                    <TouchableOpacity onPress={() => this.closeModal()} style={styles.blur}/>
                    <View
                        style={[styles.main, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}, GlobalVariables.GetDarkMode() ? {
                            borderWidth: 1,
                            borderColor: GlobalVariables.StyleMode(true, 'color'),
                        } : null]}>
                        <Text style={[GlobalVariables.TextStyle('m', 'l', 't')]}>افزودن تصویر</Text>
                        <View style={styles.separator}/>
                        <TouchableOpacity style={styles.chooseOptions} onPress={() => this.launchCamera()}>
                            <Icon style={GlobalVariables.TextStyle(null, null, 't')} type="MaterialCommunityIcons"
                                  name="camera"/>
                            <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {marginLeft: 10}]}>
                                از دوربین
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
                        <TouchableOpacity style={styles.chooseOptions} onPress={() => this.pickMultiple()}>
                            <Icon type="Ionicons" name="ios-images" style={GlobalVariables.TextStyle(null, null, 't')}/>
                            <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {marginLeft: 10}]}>
                                از گالری
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.chooseOptions}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={{
                                backgroundColor: GlobalVariables.RedColor(),
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                borderRadius: GlobalVariables.BorderRadius,
                            }} onPress={() => this.closeModal()}>
                                <Text style={[GlobalVariables.TextStyle('v', 'me', 't'), {
                                    color: 'white',
                                }]}>
                                    انصراف
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        width: GlobalVariables.DeviceWidth,
        height: GlobalVariables.DeviceHeight,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        width: '80%',
        ...GlobalVariables.DefaultShadow,
        padding: 15,
    },
    separator: {
        height: 10,
    },
    blur: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'black',
        opacity: 0.1,
    },
    chooseOptions: {
        flexDirection: 'row',
        padding: 5,
    },
});
