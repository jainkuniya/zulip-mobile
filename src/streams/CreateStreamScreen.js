/* @flow strict-local */
import React, { PureComponent } from 'react';

import type { Dispatch } from '../types';
import { connect } from '../react-redux';
import { createNewStream, navigateBack } from '../actions';
import { getOwnEmail } from '../selectors';
import { Screen } from '../common';
import EditStreamCard from './EditStreamCard';

type Props = $ReadOnly<{|
  dispatch: Dispatch,
  ownEmail: string,
|}>;

class CreateStreamScreen extends PureComponent<Props> {
  handleComplete = (
    name: string,
    description: string,
    isPrivate: boolean,
    isAnnouncementOnly: boolean,
  ) => {
    const { dispatch, ownEmail } = this.props;

    dispatch(createNewStream(name, description, [ownEmail], isPrivate, isAnnouncementOnly));
    dispatch(navigateBack());
  };

  render() {
    return (
      <Screen title="Create new stream" padding>
        <EditStreamCard
          isNewStream
          initialValues={{
            name: '',
            description: '',
            invite_only: false,
            is_announcement_only: false,
          }}
          onComplete={this.handleComplete}
        />
      </Screen>
    );
  }
}

export default connect(state => ({
  ownEmail: getOwnEmail(state),
}))(CreateStreamScreen);
