/* @flow */
import React, { PureComponent } from 'react';

import type { Actions } from '../types';
import connectWithActions from '../connectWithActions';
import { Screen } from '../common';
import OptionRow from '../settings/OptionRow';
import OptionDivider from '../settings/OptionDivider';

type Props = {
  actions: Actions,
  debug: Object,
};

class DebugScreen extends PureComponent<Props> {
  props: Props;

  handleSettingToggle = (key: string) => {
    const { actions, debug } = this.props;
    actions.debugFlagToggle(key, !debug[key]);
  };

  render() {
    const { debug } = this.props;

    return (
      <Screen title="Debug">
        <OptionRow
          label="Render messages with HTML"
          defaultValue={debug.htmlMessages}
          onValueChange={() => this.handleSettingToggle('htmlMessages')}
        />
        <OptionDivider />
        <OptionRow
          label="Distinguish unread messages"
          defaultValue={debug.unreadMessages}
          onValueChange={() => this.handleSettingToggle('unreadMessages')}
        />
        <OptionDivider />
        <OptionRow
          label="Split Message Text"
          defaultValue={debug.splitMessageText}
          onValueChange={() => this.handleSettingToggle('splitMessageText')}
        />
      </Screen>
    );
  }
}

export default connectWithActions(state => ({
  debug: state.app.debug,
}))(DebugScreen);
