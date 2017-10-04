/* @flow */
import React from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import parseURL from 'url-parse';

import type { Actions } from '../types';
import boundActions from '../boundActions';
import { ZulipButton } from '../common';
import { getCurrentRealm } from '../selectors';
import { extractApiKey } from '../utils/encoding';
import { generateOtp, openBrowser, closeBrowser } from './oauth';

let otp = '';

class OAuthView extends React.Component {
  static contextTypes = {
    styles: () => null,
  };

  props: {
    actions: Actions,
    realm: string,
    name: string,
    icon: string,
    url: string,
  };

  safariViewDismissEvent: Event;

  componentDidMount = () => {
    Linking.addEventListener('url', this.endOAuth);
    Linking.getInitialURL().then(url => {
      if (url) {
        this.endOAuth({ url });
      }
    });
  };

  componentWillUnmount = () => {
    Linking.removeEventListener('url', this.endOAuth);
  };

  beginOAuth = async url => {
    otp = await generateOtp();
    openBrowser(url, otp);
  };

  endOAuth = event => {
    closeBrowser();

    const { actions, realm } = this.props;
    const url = parseURL(event.url, true);

    // OAuth callback should have the following format:
    // zulip://login?realm={}&email={}&otp_encrypted_api_key={}
    if (url.host !== 'login') {
      return;
    }

    if (url.query.realm !== realm) {
      console.log('Zulip realm does not match request.'); // eslint-disable-line
      return;
    }

    if (!otp) {
      console.log('No one time pad stored. This auth redirect may not have been requested.'); // eslint-disable-line
      return;
    }

    if (!url.query.email || !url.query.otp_encrypted_api_key) {
      console.log('No credentials returned in server response.'); // eslint-disable-line
      return;
    }

    if (url.query.otp_encrypted_api_key.length !== otp.length) {
      console.log('API key in server response has the wrong length.'); // eslint-disable-line
      return;
    }

    const apiKey = extractApiKey(url.query.otp_encrypted_api_key, otp);
    actions.loginSuccess(realm, url.query.email, apiKey);
  };

  handleGoogleAuth = () => {
    const { realm, url } = this.props;
    this.beginOAuth(`${realm}/${url}`);
  };

  render() {
    const { styles } = this.context;
    const { name, icon } = this.props;

    return (
      <ZulipButton
        style={styles.smallMarginTop}
        secondary
        text={`Sign in with ${name}`}
        icon={icon}
        onPress={this.handleGoogleAuth}
      />
    );
  }
}

export default connect(
  state => ({
    realm: getCurrentRealm(state),
  }),
  boundActions,
)(OAuthView);
