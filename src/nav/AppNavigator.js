/* @TODO flow */
import { StackNavigator } from 'react-navigation';

import AccountPickScreen from '../account/AccountPickScreen';
import RealmScreen from '../start/RealmScreen';
import AuthScreen from '../start/AuthScreen';
import DevAuthScreen from '../start/DevAuthScreen';
import MainScreen from '../main/MainScreenWithDrawers';
import AccountDetailsScreen from '../account-info/AccountDetailsScreen';
import GroupDetailsScreen from '../chat/GroupDetailsScreen';
import SearchMessagesScreen from '../search/SearchMessagesScreen';
import UsersScreen from '../users/UsersScreen';
import SubscriptionsScreen from '../subscriptions/SubscriptionsScreen';
import ChatScreen from '../chat/ChatScreen';
import LoadingScreen from '../start/LoadingScreen';
import MutedTopicContainer from '../mute/MutedTopicContainer';
import SettingsScreen from '../settings/SettingsScreen';
import LanguageScreen from '../settings/LanguageScreen';
import DebugScreen from '../settings/DebugScreen';
import DiagnosticsScreen from '../diagnostics/DiagnosticsScreen';
import VariablesScreen from '../diagnostics/VariablesScreen';
import TimingScreen from '../diagnostics/TimingScreen';
import StorageScreen from '../diagnostics/StorageScreen';
import LightboxScreen from '../lightbox/LightboxScreen';
import GroupScreen from '../group/GroupScreen';
import StreamScreen from '../streams/StreamScreen';
import CreateStreamScreen from '../streams/CreateStreamScreen';
import NotificationsScreen from '../settings/NotificationsScreen';

export default StackNavigator(
  {
    account: { screen: AccountPickScreen },
    'account-details': { screen: AccountDetailsScreen },
    'group-details': { screen: GroupDetailsScreen },
    auth: { screen: AuthScreen },
    chat: { screen: ChatScreen },
    dev: { screen: DevAuthScreen },
    loading: { screen: LoadingScreen },
    main: { screen: MainScreen },
    realm: { screen: RealmScreen },
    search: { screen: SearchMessagesScreen },
    subscriptions: { screen: SubscriptionsScreen },
    users: { screen: UsersScreen },
    settings: { screen: SettingsScreen },
    language: { screen: LanguageScreen },
    lightbox: { screen: LightboxScreen },
    'muted-topic': { screen: MutedTopicContainer },
    group: { screen: GroupScreen },
    diagnostics: { screen: DiagnosticsScreen },
    variables: { screen: VariablesScreen },
    timing: { screen: TimingScreen },
    storage: { screen: StorageScreen },
    debug: { screen: DebugScreen },
    stream: { screen: StreamScreen },
    'stream-create': { screen: CreateStreamScreen },
    notifications: { screen: NotificationsScreen },
  },
  {
    initialRouteName: 'main',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'white',
    },
  },
);
