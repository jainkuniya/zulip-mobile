/* @flow */
import React, { PureComponent } from 'react';
import { AppState, NetInfo, View, StyleSheet } from 'react-native';
import SafeArea from 'react-native-safe-area';
import Orientation from 'react-native-orientation';

import type { Auth, Actions, ChildrenArray, SafeAreaInsets } from '../types';
import connectWithActions from '../connectWithActions';
import { getAuth } from '../selectors';
import { registerAppActivity } from '../utils/activity';
import { handlePendingNotifications } from '../utils/notifications';

const componentStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

type Props = {
  auth: Auth,
  isHydrated: boolean,
  needsInitialFetch: boolean,
  actions: Actions,
  children?: ChildrenArray<*>,
  safeAreaInsets: SafeAreaInsets,
};

class AppEventHandlers extends PureComponent<Props> {
  props: Props;

  handleOrientationChange = orientation => {
    const { actions } = this.props;
    actions.appOrientation(orientation);
  };

  handleConnectivityChange = connectionInfo => {
    const { actions, needsInitialFetch } = this.props;
    const isConnected = connectionInfo.type !== 'none' && connectionInfo.type !== 'unknown';
    actions.appOnline(isConnected);
    if (!needsInitialFetch && isConnected) {
      actions.trySendMessages();
    }
  };

  handleAppStateChange = state => {
    const { auth, actions, needsInitialFetch } = this.props;
    registerAppActivity(auth, state === 'active');
    actions.appState(state === 'active');
    if (state === 'active' && !needsInitialFetch && auth.realm !== '') {
      handlePendingNotifications(actions.doNarrow);
    }
  };

  handleMemoryWarning = () => {
    // Release memory here
  };

  componentWillMount() {
    const { actions } = this.props;

    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    AppState.addEventListener('change', this.handleAppStateChange);
    AppState.addEventListener('memoryWarning', this.handleMemoryWarning);
    Orientation.addOrientationListener(this.handleOrientationChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    AppState.removeEventListener('change', this.handleAppStateChange);
    AppState.removeEventListener('memoryWarning', this.handleMemoryWarning);
    Orientation.removeOrientationListener(this.handleOrientationChange);
  }

  componentWillUpdate(nextProps) {
    const { actions, safeAreaInsets, isHydrated, orientation } = nextProps;
    if ((safeAreaInsets === undefined && isHydrated) || orientation !== this.props.orientation) {
      SafeArea.getSafeAreaInsetsForRootView().then(actions.initSafeAreaInsets);
    }
  }

  render() {
    return <View style={componentStyles.wrapper}>{this.props.children}</View>;
  }
}

export default connectWithActions(state => ({
  auth: getAuth(state),
  needsInitialFetch: state.app.needsInitialFetch,
  safeAreaInsets: state.device.safeAreaInsets,
  isHydrated: state.app.isHydrated,
  orientation: state.app.orientation,
}))(AppEventHandlers);
