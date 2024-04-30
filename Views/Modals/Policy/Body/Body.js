import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import GlobalVariables from '../../../Modules/GlobalVariables';
import Loader from '../../../Components/Loader/Loader';
import {UserService} from '../../../Services/UserService';
import {NavigationService} from '../../../Services/NavigationService';

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckBox: false,
            disableCheckBox: true,
            acceptance: false,
        };
    }

    componentDidMount() {
        let {acceptance} = this.props.route.params;
        this.setState({acceptance});
    }

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    acceptPolicy() {
        UserService.setPolicyAcceptance(true)
            .then(() => NavigationService.reset(this.props.navigation, 'SetState'));
    }

    renderCheckBox() {
        // const [toggleCheckBox, setToggleCheckBox] = useState(false);
        return (
            <View style={styles.acceptanceBox}>
                <View style={styles.checkBox}>
                    <CheckBox
                        disabled={this.state.disableCheckBox}
                        value={this.state.toggleCheckBox}
                        onValueChange={(toggleCheckBox) => {
                            this.setState({toggleCheckBox});
                        }}
                    />
                    <Text style={GlobalVariables.TextStyle('l', 'm')}>تمامی موارد بالا مطالعه کرده و قبول دارم.</Text>
                </View>
                <View style={styles.buttonsBox}>
                    <TouchableOpacity disabled={!this.state.toggleCheckBox}
                                      style={[styles.footerButton, this.state.toggleCheckBox ? null : {backgroundColor: 'gray'}, styles.footerElement]}
                                      onPress={() => this.acceptPolicy()}>
                        <Text style={[styles.footerButtonText]}>ادامه</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderPolicyText() {
        return (
            <ScrollView style={[styles.body, {paddingLeft: 10, paddingRight: 10}]}
                        onScroll={({nativeEvent}) => {
                            if (this.isCloseToBottom(nativeEvent)) {
                                this.setState({disableCheckBox: false});
                            }
                        }}>
                <View style={{marginBottom: 10}}/>
                <Text style={[GlobalVariables.TextStyle('v', 'me', 't')]}>
                    آگاهی از تمام قوانین و مقررات استفاده از بستر آلور برای کلیه کاربران که قصد استفاده از خدمات آن
                    را دارند، لازم و ضروری می باشد. ثبت هر گونه آگهی بر بستر آلور به منزله علم و آگاهی کلیه کاربران
                    از قبل نسبت به قوانین و مقررات استفاده از آن می باشد. به طوری که تمام اقدامات کاربر مربوط به ثبت در
                    خواست آگهی و عضویت در آلور توام با آگاهی به کلیه قوانین و مقررات و متعهد به ماده 10 قانون مدنی
                    می باشد. بنابراین، هر گونه ادعایی مبنی بر عدم آگاهی نسبت به قوانین و مقررات آورده شده در ادامه از
                    مسئولیت ما خارج و در قبال آن هیچ مسئولیتی در نظر گرفته نمی شود. در ضمن، قوانین و مقررات ذکر شده در
                    طول زمان قابل تغییر می باشد که این تغییرات در تمام به روز رسانی های بستر آلور اعمال می گردد، لذا
                    عدم آگاهی از تغییرات بر عهده کابران می باشد.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.subjects}>
                        الف) تعاریف
                    </Text>
                    {'\n'}
                    آلور: نرم افزار موبایلی/اپلیکیشنی که در قالب اندروید(Android) طراحی و جهت استفاده در دسترس
                    کاربران گرفته شده است.
                    {'\n'}
                    کاربر: هر متقاضی حقوقی و حقیقی یا ثبت/درج کننده آگهی که درخواست خود را جهت استفاده از بستر آلور
                    ثبت می نماید.
                    {'\n'}
                    قوانین و مقررات جمهوری اسلامی ایران: تمام قوانین حاکم بر کشور از جمله قانون اساسی، قوانین عادی و
                    تکمیلی، آیین نامه های اجرایی، بخشنامه ها، دستورالعمل ها و تابع کلیه ضوابط های نظارتی بر فعالیت می
                    باشد.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.subjects}>
                        ب) قوانین و تعهدات عمومی کاربران جهت فعالیت در بستر آلور:
                    </Text>
                    {'\n'}
                    1. آلور بستری برای ثبت و درج آگهی ها بوده و تنها به عنوان واسطه ی بین فروشنده و خریدار بوده و در
                    این راستا چه در سطح مدیران و کارمندان و سهامداران و حتی فی مابین فروشندگان و خریداران ذینفع نمی باشد
                    و در حال حاضر هیچ فروشگاهی بر بستر آلور فعالیت نمی کند. بنابراین، بررسی تمام جوانب مربوط به
                    دریافت خدمات و خرید محصول یا کالا برعهده کاربر بوده و آلور هیچ مسئولیتی در خصوص محتوای آگهی
                    منتشر شده توسط اشخاص ثالث ندارد.
                    {'\n'}
                    2. کلیه مسئولیت های قانونی ممنوعیت عضویت و فعالیت کاربر کمتر از 18 سال، در صورت بروز هر گونه مشکل در
                    خرید و فروش بر بستر آلور متوجه شخص ثبت کننده آگهی و ولی قانونی وی می باشد و آلور هیچ
                    مسئولیتی در قبال آن ندارد.
                    {'\n'}
                    3. ثبت هر گونه کالا و خدمات از لحاظ اصالت، درستی و صحت متوجه شخص کاربر می باشد که دارای ادعای قانونی
                    نسبت به دارایی قابل خرید و فروش می باشد و لذا مسئولیت کلیه فروش یا ارائه خدمات غیر مجاز متوجه کاربر
                    بوده و آلور هیچ مسئولیتی در قبال ارائه کالا و خدمات بدون اصالت ندارد.
                    {'\n'}
                    4. تمام مسئولیت حقوقی و قانونی آگهی ثبت شده بر بستر آلور از قبیل درستی اطلاعات ارائه شده و
                    مطابقت آن با قوانین و مقررات، متناسب با موازین اخلاقی و اسلامی و اجتماعی بر عهده کاربر می باشد و
                    کاربر متعهد می شود که تمام فعالیت های صورت گرفته بر بستر آلور طبق قوانین و مقررات جمهوری اسلامی
                    ایران می باشد و هر گونه ارائه خدمات و فعالیت مغایر با قانون و مقررات کشور متوجه کاربر بوده و
                    آلور هیچ مسئولتی در قبال فعالیت های نقض کننده حقوق اشخاص ثالث، ضوابط و مقررات ندارد.
                    {'\n'}
                    5. مسئولیت خسارت وارده بر بستر آلور با استفاده از کرولر های اتوماتیک و نامحسوس و پایش های سایبری
                    جهت دسترسی و جمع آوری هر اطلاعاتی بدون دریافت مجوز کتبی و رسمی از آلور و همچنین هر گونه فعالیت
                    مخل زیر ساخت های فنی آلور، متوجه کابر بوده و متعهد به پرداخت خسارت وارده می باشد.
                    {'\n'}
                    6. مسئولیت هر گونه کپی برداری، جعل آگهی، ویرایش هر متحوایی متعلق به اشخاص ثالث و درج آن در آلور
                    بر عهده کاربر می باشد.
                    {'\n'}
                    7. مسئولیت بارگزاری هر گونه لینک در محتوای درج شده بر عهده کاربر می باشد. به همین جهت، شفافیت و
                    درستی و صحت خدمات، کالا و محصولات مربوطه ازمسئولیت آلور خارج بوده و تماما بر عهده کاربر می باشد.
                    {'\n'}
                    8. آلور در راستای تامین موازین اخلاقی و اجتماعی و سیاسی، می تواند محتوای تمام آگهی های درج و ثبت
                    شده را ویرایش و حتی حذف کند. و هرگونه فعالیت بر بستر آلور از سوی هر کاربری که منجر به نقض تعهدات
                    مندرج در این ضوابط و الزامات حقوقی، قانونی و معنوی شخص ثالث گردد، می تواند برحسب صلاحدید، فعالیت
                    کاربر را محدود، تعلیق و حتی مسدود نماید.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.subjects}>
                        ج) حفظ حریم شخصی و اطلاعات
                    </Text>
                    {'\n'}
                    آلور در راستای حفظ حریم خصوصی کاربران جهت دسترسی به برخی مجوزهای داخل برنامه ای از کاربران خود
                    اجازه دسترسی را در حین نصب یا استفاده ی برنامه به کاربر قبل از راه اندازی برنامه اطلاع رسانی می شود
                    که تمام مجوزهای داده شده، جهت ارائه خدمات بهتر و امن می باشد. آلور در خصوص دسترسی به اطلاعات
                    درون برنامه ای کاربر تابع قانون حریم خصوصی جمهوری اسلامی ایران می باشد. (موارد دسترسی آلور به
                    مجوزهای درون برنامه ای: دوربین، میکروفن، موقعیت مکانی و حافظه ذخیره سازی) تمام موارد ذکر شده فقط در
                    خصوص ارائه خدمات ثبت آگهی در زیر ساخت آلور مورد استفاده قرار می گیرد و آلور متعد می گردد که
                    از اطلاعات جمع آوری شده در راستای فعالیت کاربران بر بستر آلور محافظت نماید. علیرغم اقدامات
                    احتیاطی و حفاظتی، دسترسی غیر مجاز و غیر قانونی اشخاص ثالث به موارد ذکر شده، آلور هیچگونه
                    مسئولیتی در این خصوص نخواهد داشت.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.subjects}>
                        د) شرایط آگهی
                    </Text>
                    {'\n'}
                    ثبت هر آگهی از طرف هر کاربری به منزله ی تبلیغ برای فروش و عرضه یک کالا و خدمات خاص یا فروش عمده می
                    باشد که حاوی مشخصات واقعی (تصویر و صدا گزاری شده) از کالا یا خدمات درج شده در آگهی می باشد. در صورتی
                    که کلیه محتوای درج شده با هریک از قوانین و مقررات آلور مغایرت داشته باشد، صرف نظر از اینکه
                    مسئولیت های قانونی مربوطه بر عهده ی کاربر می باشد، به محض اطلاع از گزارش آگهی، آگهی ثبت شده حذف می
                    گردد.
                </Text>
                <View style={{marginBottom: 10}}/>
            </ScrollView>
        );
    }

    render() {
        return (
            <View
                style={[styles.body, {
                    // padding: 10,
                    // paddingTop: 0,
                }, {backgroundColor: GlobalVariables.StyleMode(GlobalVariables.GetDarkMode(), 'backgroundColor')}]}>
                {this.renderPolicyText()}
                {this.state.acceptance ? this.renderCheckBox() : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        // padding: 10,
    },
    acceptanceBox: {
        padding: 10,
    },
    checkBox: {flexDirection: 'row', alignItems: 'center'},
    subjects: {
        ...GlobalVariables.TextStyle('b'),
    },
    footerButton: GlobalVariables.DefaultButtons,
    footerButtonText: GlobalVariables.DefaultButtonsText,
    footerElement: {
        width: '45%',
        justifyContent: 'center',
    },
    buttonsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
