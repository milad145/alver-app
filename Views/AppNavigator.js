import 'react-native-gesture-handler';

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SetStateScreen from './Screens/SetState/SetStateScreen';
import HomeScreen from './Screens/Home/HomeScreen';
import FeedScreen from './Screens/Feed/FeedScreen';
import CategoryScreen from './Screens/Category/CategoryScreen';
import ProfileScreen from './Screens/Profile/ProfileScreen';
import FilterScreen from './Screens/Filter/FilterScreen';
import MyPostsScreen from './Screens/MyPosts/MyPostsScreen';
import SettingScreen from './Screens/Setting/SettingScreen';

import LoginModal from './Modals/Login/LoginModal';
import ConfirmModal from './Modals/Confirm/ConfirmModal';
import SelectCityModal from './Modals/SelectCity/SelectCityModal';
import SelectCategoryModal from './Modals/SelectCategory/SelectCategoryModal';
import FieldsModal from './Modals/Fields/FieldsModal';
import PostModal from './Modals/Post/PostModal';
import ContactModal from './Modals/Contact/ContactModal';
import LastVisitsModal from './Modals/LastVisits/LastVisitsModal';
import FavoriteListModal from './Modals/FavoriteList/FavoriteListModal';
import SearchModal from './Modals/Search/SearchModal';
import UpdateModal from './Modals/Update/UpdateModal';
import EditPostModal from './Modals/EditPost/EditPostModal';
import ManagePostModal from './Modals/ManagePost/ManagePostModal';
import AboutUsModal from './Modals/AboutUs/AboutUsModal';
import PolicyModal from './Modals/Policy/PolicyModal';

//==========================================================
import TestScreen from './Screens/Test/TestScreen';
//==========================================================

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();


function MainStackScreen(props) {
    return (
        <MainStack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
            <MainStack.Screen name="Home" component={HomeScreen} initialParams={props.navigation}
                              parentNavigation={props.navigation}/>
            <MainStack.Screen name="Feed" component={FeedScreen}/>
            <MainStack.Screen name="Category" component={CategoryScreen}/>
            <MainStack.Screen name="Profile" component={ProfileScreen}/>
            <MainStack.Screen name="Filter" component={FilterScreen}/>
            <MainStack.Screen name="MyPosts" component={MyPostsScreen}/>
            <MainStack.Screen name="Setting" component={SettingScreen}/>
        </MainStack.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <RootStack.Navigator mode="modal" screenOptions={{headerShown: false}}>
                {/*<RootStack.Screen name="Test" component={TestScreen}/>*/}
                <RootStack.Screen name="SetState" component={SetStateScreen}/>
                <RootStack.Screen name="Main" component={MainStackScreen}/>
                <RootStack.Screen name="Login" component={LoginModal}/>
                <RootStack.Screen name="Confirm" component={ConfirmModal}/>
                <RootStack.Screen name="SelectCity" component={SelectCityModal}/>
                <RootStack.Screen name="SelectCategory" component={SelectCategoryModal}/>
                <RootStack.Screen name="Fields" component={FieldsModal}/>
                <RootStack.Screen name="Post" component={PostModal}/>
                <RootStack.Screen name="Contact" component={ContactModal}/>
                <RootStack.Screen name="LastVisits" component={LastVisitsModal}/>
                <RootStack.Screen name="FavoriteList" component={FavoriteListModal}/>
                <RootStack.Screen name="Search" component={SearchModal} options={{animationEnabled: false}}/>
                <RootStack.Screen name="Update" component={UpdateModal}/>
                <RootStack.Screen name="EditPost" component={EditPostModal}/>
                <RootStack.Screen name="ManagePost" component={ManagePostModal}/>
                <RootStack.Screen name="AboutUs" component={AboutUsModal}/>
                <RootStack.Screen name="Policy" component={PolicyModal}/>
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
