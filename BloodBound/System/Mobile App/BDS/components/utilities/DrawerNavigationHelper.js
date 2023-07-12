// This handles navigation between the many features/menus in the left-sidebar (like in NavbarGeneric.js in the web version).
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Image } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewsfeedScreen from '../screens/NewsfeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MapGetNearbyRequestsScreen from '../screens/MapGetNearbyRequestsScreen';
import CreateEmergencyHighlightScreen from '../screens/CreateEmergencyHighlightScreen';
import ManageEmergencyHighlightsScreen from '../screens/ManageEmergencyHighlightsScreen';
import CreateSupportAccountScreen from '../screens/CreateSupportAccountScreen';
import ManageReportedUsersScreen from '../screens/ManageReportedUsersScreen';
import ManageBloodDonorsScreen from '../screens/ManageBloodDonorsScreen';
import VerifyNGOMIWorkersScreen from '../screens/VerifyNGOMIWorkersScreen';
import ManageDeletionRequestsScreen from '../screens/ManageDeletionRequestsScreen';
import RequestsCreatedScreen from '../screens/RequestsCreatedScreen';
import RequestsFulfilledScreen from '../screens/RequestsFulfilledScreen';
import ChatsListScreen from '../screens/ChatsListScreen';
import ContactCustomerSupportScreen from '../screens/ContactCustomerSupportScreen';
import CreateBloodDonorAccountsScreen from '../screens/CreateBloodDonorAccountsScreen';
import OnboardBloodDonorsScreen from '../screens/OnboardBloodDonorsScreen';
import LogoutHelper from './LogoutHelper';
//Hidden from sidebar.
import ChatScreen from '../screens/ChatScreen';

import React from 'react';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();

function DrawerItem(key, title, link, AccountType) {
    if (key.indexOf(AccountType) > -1) {
        return (
            <Drawer.Screen key={key} name={title} component={link}/>
        );
    }
}

export default function DrawerNavigationHelper(props) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const Screens = [
        { key: ['Admin'], title: 'Create Emergency Highlight', link: CreateEmergencyHighlightScreen },
        { key: ['Admin'], title: 'Manage Emergency Highlight', link: ManageEmergencyHighlightsScreen },
        { key: ['Admin'], title: 'Create Support Accounts', link: CreateSupportAccountScreen },
        { key: ['Admin'], title: 'Manage Reported Users', link: ManageReportedUsersScreen },
        { key: ['NGO_Worker', 'MI_Worker'], title: 'Manage Blood Donors', link: ManageBloodDonorsScreen },
        { key: ['Admin'], title: 'Verify NGO & MI Workers', link: VerifyNGOMIWorkersScreen },
        { key: ['Admin'], title: 'Manage Deletion Requests', link: ManageDeletionRequestsScreen },
        { key: ['Blood_Donor', 'Blood_Requester'], title: 'Requests Created', link: RequestsCreatedScreen },
        { key: ['Blood_Donor', 'Blood_Requester'], title: 'Requests Fulfilled', link: RequestsFulfilledScreen },
        { key: ['Blood_Donor', 'Blood_Requester', 'Customer_Support'], title: 'Chats', link: ChatsListScreen },
        { key: ['NGO_Worker', 'MI_Worker'], title: 'Create Blood Donor Accounts', link: CreateBloodDonorAccountsScreen },
        { key: ['NGO_Worker', 'MI_Worker'], title: 'Onboard Blood Donors', link: OnboardBloodDonorsScreen },
        { key: ['Blood_Donor', 'Blood_Requester', 'NGO_Worker', 'MI_Worker'], title: 'Contact Customer Support', link: ContactCustomerSupportScreen },
    ];

    const { userType, notifications } = useSelector((state) => state.user);
    const AccountType = userType;

    const [newNotifications, setNewNotifications] = React.useState((notifications || []).length > 0);

    const token = useSelector((state) => state.auth.token);

    React.useEffect(() => !token && props.navigation.navigate('Home'), [token]);

    const Stack = createNativeStackNavigator();

	return (
        <>
            <Drawer.Navigator initialRouteName="NewsfeedScreen" screenOptions={{
                headerStyle: {
                    backgroundColor: 'red',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerActiveBackgroundColor: 'pink',
                drawerActiveTintColor: 'red',
                drawerStyle: {
                    backgroundColor: '#FF7F7F',
                    width: 240,
                },
                headerMode: 'screen',
                headerRight: () => (
                    <TouchableOpacity style={{right:20, width:25, height: 25}} onPress={() => setModalVisible(true)}>
                        <Image source={require('../../assets/bellfillicon.png')} />
                    </TouchableOpacity>
                )
            }}
            >
                <Stack.Screen name='Newsfeed'>
                    {() => <NewsfeedScreen modalVisible={modalVisible} setModalVisible={setModalVisible} setNewNotifications={setNewNotifications} />}
                </Stack.Screen> 
                {/* to pass props to the newsfeed */}
                <Drawer.Screen name='Profile' component={ProfileScreen} />
                <Drawer.Screen name='Requests Near You' component={MapGetNearbyRequestsScreen} />
                {
                    Screens.map( (item) => DrawerItem(item.key, item.title, item.link, AccountType) )       
                }
                <Drawer.Screen name='Logout' component={LogoutHelper} />
                <Drawer.Screen name='Chat' component={ChatScreen} options={{drawerItemStyle: { display: 'none' }}}/>
            </Drawer.Navigator>
        </>
	);
}