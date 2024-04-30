import {Platform, Dimensions, PixelRatio, StatusBar} from 'react-native';
import {getUniqueId, getModel, getVersion} from 'react-native-device-info';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const StatusBarHeight = StatusBar.currentHeight;
let DarkMode = false;
let User = null;
let Categories = null;
let City = null;
let AppSource = null;
let smsHash = '';
let amISendFeedBack = true;

let Post = null;
let UploadStatus = false;
const UniqueToken = getUniqueId() + '_' + getModel();
const AspectRatios = {
    Player: {W: 16, H: 10},
};
const Version = getVersion();
const pixelRatio = PixelRatio.get();
const FontSizes = {
    '2': {
        Mini: 12,
        Mini1: 13,
        Small: 14,
        Small1: 15,
        Medium: 16,
        Medium1: 17,
        Large: 18,
        Large1: 19,
        XLarge: 20,
        XLarge1: 21,
        XXLarge: 24,
        XXLarge1: 25,
    },
    '3': {
        Mini: 10,
        Mini1: 11,
        Small: 12,
        Small1: 13,
        Medium: 14,
        Medium1: 15,
        Large: 16,
        Large1: 17,
        XLarge: 18,
        XLarge1: 19,
        XXLarge: 22,
        XXLarge1: 23,
    },
};
const BorderColor = '#ccc';
const BorderRadius = 100;
const RedColor = () => GetDarkMode() ? '#f30000' : '#ff0000';
const BlueColor = () => GetDarkMode() ? '#1625ff' : '#060b96';
const BrandColor = () => GetDarkMode() ? '#0f8436' : '#32c00c';
const HeaderColor = () => GetDarkMode() ? '#616161' : '#fafafa';
const DarkColor = () => GetDarkMode() ? '#616161' : '#000000';
const HeaderColorRGBA = (a) => GetDarkMode() ? 'rgba(97,97,97,' + a + ')' : 'rgba(250,250,250,' + a + ')';
const FontFamily = (font) => {
    switch (font) {
        case 'v':
            return 'Vazir';
        case 'l':
            return 'Vazir-Light';
        case 'm':
            return 'Vazir-Medium';
        case 't':
            return 'Vazir-Thin';
        case 'b':
            return 'Vazir-Bold';
        case 'd':
            return 'Vazir-Black';
    }
};
const FontSize = (font) => {
    switch (font) {
        case 'm':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Mini : 12;
        case 'm1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Mini1 : 13;
        case 's':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Small : 14;
        case 's1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Small1 : 15;
        case 'me':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Medium : 16;
        case 'me1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Medium1 : 17;
        case 'l':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Large : 18;
        case 'l1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].Large1 : 19;
        case 'xl':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].XLarge : 20;
        case 'xl1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].XLarge1 : 21;
        case 'xxl':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].XXLarge : 24;
        case 'xxl1':
            return FontSizes['' + pixelRatio] ? FontSizes['' + pixelRatio].XXLarge1 : 25;
    }
};
const TextColor = (type) => {
    switch (type) {
        case 't':
            return GetDarkMode() ? '#e1e1e1' : '#404040';
        case 'p':
            return GetDarkMode() ? '#e8e8e8' : '#aaa';
        case 'dp':
            return GetDarkMode() ? '#e8e8e8' : '#333';
    }
};
const GetDarkMode = () => DarkMode;
const SetDarkMode = (dark) => DarkMode = dark;
const GetCategories = () => Categories;
const SetCategories = (categories) => Categories = categories;
const GetCity = () => City;
const SetCity = (city) => City = city;
const GetUser = () => User;
const SetUser = (u) => User = u;
const GetPost = () => Post;
const SetPost = (p) => Post = p;
const GetSmsHash = () => smsHash;
const SetSmsHash = (h) => smsHash = h;
const GetAppSource = () => AppSource;
const SetAppSource = (p) => AppSource = p;
const GetUploadStatus = () => UploadStatus;
const SetUploadStatus = (s) => UploadStatus = s;
const GetMyFeedBackStatus = () => amISendFeedBack;
const SetMyFeedBackStatus = (f) => amISendFeedBack = f;
const StyleMode = (dark, item) => {
    let obj = {};
    obj.backgroundColor = dark ? '#404040' : 'white';
    obj.backgroundColor_circleIcon = dark ? '#dadada' : 'white';
    obj.color = dark ? '#e1e1e1' : '#404040';
    obj.borderColor = dark ? 'white' : BorderColor;
    obj.statusBar = dark ? 'black' : '#dadada';
    return obj[item];
};
const TextStyle = (family, size, type) => {
    let textStyle = {};
    if (family) {
        textStyle.fontFamily = FontFamily(family);
    }
    if (size) {
        textStyle.fontSize = FontSize(size);
    }
    if (type) {
        textStyle.color = TextColor(type);
    }

    return textStyle;
};
export default {
    DefaultShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.02,
        shadowRadius: 1.41,
        elevation: 2,
    },
    DefaultIconSize: 20,
    BigIconSize: 30,
    ExtraBigIconSize: 35,
    BiggestIconSize: 60,
    MediumIconSize: 25,
    SmallIconSize: 15,
    BrandPrimary: '#00BCD4',
    BrandInfo: '#e2e3e5',
    BrandSuccess: '#ffc000',
    BrandColor,
    RedColor,
    DarkColor,
    BlueColor,
    BrandGreen: '#00ec13',
    BrandDanger: '#d9534f',
    BrandWarning: '#f0ad4e',
    HeaderColor,
    HeaderColorRGBA,
    AppColor: '#A40498',
    MaxAudioDuration: 3 * 60 * 1000,
    MaxAudioDurationByMin: 3,
    // MaxAudioDuration: ((20) + 1) * 1000,
    MinAudioDuration: 10 * 1000,
    MinAudioDurationBySec: 10,
    requestDurationPeriod: 120,
    BorderColor,
    BorderRadius,
    PlaceHolder: '#aaa',
    Bold: {fontWeight: 'bold'},
    LoaderWidth: 50,
    BigLoaderWidth: 100,
    DeviceHeight,
    DeviceWidth,
    Platform,
    StatusBarHeight,
    FooterHeight: 55,
    HeaderHeight: DeviceHeight * 0.1,
    BodyHeight: DeviceHeight - 100 - StatusBarHeight,
    AppHeight: DeviceHeight - StatusBarHeight,
    Center: {justifyContent: 'center', alignItems: 'center'},
    UniqueToken,
    DefaultAvatarWidth: 50,
    CacheExpireTime: 3 * 24 * 60 * 60 * 1000,
    AspectRatios,
    PlayerContainerAspectRatio: AspectRatios.Player.W / AspectRatios.Player.H,
    LogoWidth: DeviceWidth / 5,
    UploadLogoWidth: DeviceWidth / 3,
    DefaultButtons: {
        borderWidth: 1,
        borderColor: BorderColor,
        borderRadius: BorderRadius,
        backgroundColor: BrandColor(),
        alignItems: 'center',
        justifyContent: 'center',
        // margin: 10,
        height: 50,
    },
    DefaultButtonsOutLine: {
        borderWidth: 1,
        borderColor: BrandColor(),
        borderRadius: BorderRadius,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        // margin:10
    },
    DefaultButtonsText: {
        ...TextStyle('v', 'l'),
        color: 'white',
    },
    DefaultButtonsOutLineText: {
        ...TextStyle('v', 'l'),
        color: BrandColor(),
    },
    Version,
    backgroundColor: {backgroundColor: GetDarkMode ? 'black' : 'white'},
    TextColor: GetDarkMode() ? 'white' : 'black',
    GetDarkMode,
    SetDarkMode,
    StyleMode,
    TextStyle,
    GetUser,
    SetUser,
    GetCategories,
    SetCategories,
    GetCity,
    SetCity,
    GetPost,
    SetPost,
    GetUploadStatus,
    SetUploadStatus,
    GetAppSource,
    SetAppSource,
    GetSmsHash,
    SetSmsHash,
    GetMyFeedBackStatus,
    SetMyFeedBackStatus,
};
