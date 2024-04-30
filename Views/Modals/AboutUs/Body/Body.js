import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {WebView} from 'react-native-webview';

import config from '../../../../config';

import GlobalVariables from '../../../Modules/GlobalVariables';
import Loader from '../../../Components/Loader/Loader';
import NetworkError from '../../../Components/NetworkError/NetworkError';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: true,
            netWorkError: false,
            webViewRef: null,
            webViewFlex: 0,
        };
        this.WebView_Ref = null;
    }

    componentDidMount() {
        let test = [];
        for (let i = 0; i < 100; i++) {
            test.push(i);
        }
        this.setState({test});
    }

    test() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>

                <ScrollView showsVerticalScrollIndicator={false}
                            style={{
                                width: '100%',
                                padding: 10,
                                paddingBottom: 0,
                            }}>
                    <Text style={[GlobalVariables.TextStyle('v', 'me1', 't'), {marginTop: 10, textAlign: 'justify'}]}>
                        با ظهور بازار های اینترنتی، هر روستایی در هر کجای سرزمین مان نیز نیازمند بسترهای های داد و ستد
                        کارآمد می باشد. به طوری که غالبا درآمد هر روستایی وابسته به فروش محصولات زراعی و باغی و فرآورده
                        های دامی، طیور و شیلات می باشد. از این رو، دغدغه روستائیان که به بازار های فروش آنلاین دسترسی
                        محدود و یا اصلا ندارند، اصلی ترین هدف مجموعه آلور برای معرفی رسالت خود جهت تسهیل دسترسی تمام
                        روستائیان عزیز کشورمان به یک پلتفرم خرید و فروش کارا و خدمات محور می باشد.
                        {'\n'}
                        {'\n'}
                        ­از آنجایی که بنیان گزاران این مجموعه خودشان روستایی بوده اند و هستند و با تمام محدودیت ها و
                        مشکلات زندگی روستایی مواجه بوده اند به همین جهت، بعد از برآورد های میدانی از نیازمندی های
                        روستائیان در خصوص خرید و فروش در حوزه کشاورزی، دام، طیور و شیلات، برآن شدیم تا یک بستر نوین بر
                        مبنای ثبت آگهی رایگان مادالمعمر برای روستائیان در جهت خرید و فروش های آنلاین طراحی به شیوه ای
                        متفاوت جهت خدمات رسانی به کلیه روستائیان کشور راه اندازی شده است.
                        {'\n'}
                        {'\n'}
                        در راستای رسالت های هدف گذاری شده، این مجموعه با در نظر گرفتن کلیه ظرفیت های قابل خرید و فروش بر
                        بستر بازارهای آنلاین در حوزه های عنوان شده همسو با دیگر مجموعه های فعال، فعالیت همه جانبه ی خود
                        را شروع کرده است و علاوه بر این، فضایی کاملا متناسب با نیازمندی های گروه های هدف ما
                        (روستائیان)راه اندازی و عملیاتی شده است
                    </Text>
                    <View style={{marginBottom: 20}}/>
                </ScrollView>
            </View>
        );
    }

    renderLoading = () => {
        return (
            <View style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Loader type="refresh" color={GlobalVariables.BrandColor()}/>
            </View>
        );
    };

    renderError() {
        return (
            <View style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <NetworkError onPress={() => {
                    this.setState({showLoader: true});
                    this.WebView_Ref.reload();
                }}/>
            </View>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                <WebView
                    ref={(ref) => this.WebView_Ref = ref}
                    style={{flex: 1}}
                    renderError={() => this.renderError()}
                    startInLoadingState={true}
                    renderLoading={() => this.renderLoading()}
                    originWhitelist={['*']}
                    textZoom={100}
                    source={{
                        uri: config.url.uri + 'app/aboutUs',
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});
