import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView} from 'react-native';

import GlobalVariables from '../../Modules/GlobalVariables';

import Icon from '../Icon/Icon';

export default class GuideModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
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
        this.props.closeGuideModal();
    }

    textItems(text, show = true) {
        return (
            show ?
                <Text
                    style={[GlobalVariables.TextStyle('v', 'xxl1', 'p')]}>
                    .{' '}
                    <Text style={[GlobalVariables.TextStyle('l', 's', 'dp')]}>
                        {text}
                    </Text>
                </Text>
                : null
        );
    }

    titleItems(text) {
        return (
            <Text style={[GlobalVariables.TextStyle('m', 'l', 't'), {marginTop: 20}]}>{text}</Text>
        );
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <View
                    style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                    <View style={[styles.header, {backgroundColor: GlobalVariables.HeaderColor()}]}>
                        <TouchableOpacity style={{height: '100%', justifyContent: 'center'}}
                                          onPress={() => this.closeModal()}>
                            <Icon name="arrow-right" type="Feather" style={GlobalVariables.TextStyle(null, null, 't')}
                                  size={GlobalVariables.MediumIconSize}/>
                        </TouchableOpacity>
                        <Text style={[GlobalVariables.TextStyle('b', 'xl', 't'), styles.titleText]}>راهنمای ثبت
                            آگهی</Text>
                    </View>
                    <View style={styles.main}>
                        <ScrollView style={{paddingRight: 15, paddingLeft: 15}}>
                            {this.titleItems('عکس آگهی')}
                            {this.textItems('از تصاویر با کیفیت و واقعی استفاده کنید.')}
                            {this.textItems('تصاویر با لوگو و برچسب آلور، قابل انتشار نیستند.')}
                            {this.textItems('تصاویر شامل اطلاعات شخصی مجاز نیستند.')}
                            {this.textItems('تصاویر متعلق به آگهی دیگری در آلور نباشند.')}
                            {this.textItems('از درج شماره تلفن و قیمت روی عکس آگهی خودداری کنید.')}
                            {this.textItems('استفاده ابزاری از تصاویر اشخاص در آگهی، درج بی‌مورد عکس صورت اشخاص یا استفاده از عکس کودکان برای معرفی کالا مجاز نیست.')}
                            <View style={styles.separator}/>
                            {this.titleItems('عنوان آگهی')}
                            {this.textItems('نام کالا یا خدمات خود را در عنوان آگهی قرار دهید.')}
                            {this.textItems('هر آگهی فقط برای یک کالا است.')}
                            {this.textItems('امکان انتشار آگهی با محتوای مشابه وجود ندارد.')}
                            {this.textItems('از درج قیمت در عنوان آگهی خودداری کنید.')}
                            {this.textItems('استفاده از عبارت‌ها یا کلماتی مانند: ویژه، رند، مفت، ارزان، زیر قیمت، استثنایی، حراج و موارد مشابه مجاز نیست.')}
                            <View style={styles.separator}/>
                            {this.titleItems('توضیحات آگهی')}
                            {this.textItems('توضیحات آگهی را کامل بنویسید.')}
                            {this.textItems('درج شماره تلفن در توضیحات آگهی مجاز نیست.')}
                            {this.textItems('در آگهی درخواست بیعانه نکنید.')}
                            {this.textItems('درج اطلاعات بانکی و هویتی در توضیحات مجاز نیست.')}
                            {this.textItems('برای ارایه خدمات آنلاین (شامل درج سایت اینترنتی، درج آدرس شبکه‌های اجتماعی و ... در آگهی) باید پرداخت هزینه‌ی «لینک وب سایت» را انجام دهید.', false)}
                            <View style={styles.separator}/>
                        </ScrollView>
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
    },
    header: {
        height: GlobalVariables.HeaderHeight,
        ...GlobalVariables.DefaultShadow,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
    },
    titleText: {
        marginLeft: 10,
    },
    main: {
        flex: 1,
    },
    separator: {
        height: 30,
    },
});
