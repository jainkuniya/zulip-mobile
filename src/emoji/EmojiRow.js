/* @flow strict-local */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import type { Auth, GlobalState, RealmEmojiType } from '../types';
import { RawLabel, Touchable } from '../common';
import Emoji from './Emoji';
import ImageEmoji from './ImageEmoji';
import { getActiveRealmEmojiByName } from './emojiSelectors';
import zulipExtraEmojiMap from './zulipExtraEmojiMap';
import { getAuth } from '../account/accountsSelectors';

const styles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    paddingLeft: 6,
  },
});

type Props = {|
  auth: Auth,
  name: string,
  realmEmoji: RealmEmojiType | void,
  onPress: (name: string) => void,
|};

class EmojiRow extends PureComponent<Props> {
  handlePress = () => {
    const { name, onPress } = this.props;
    onPress(name);
  };

  render() {
    const { auth, name, realmEmoji } = this.props;

    // TODO: this only handles Unicode emoji (shipped with the app)
    // and realm emoji, but not Zulip extra emoji.  See our issue #2846.
    return (
      <Touchable onPress={this.handlePress}>
        <View style={styles.emojiRow}>
          {realmEmoji || zulipExtraEmojiMap[name] ? (
            <ImageEmoji emoji={realmEmoji || zulipExtraEmojiMap[name]} realmUrl={auth.realm} />
          ) : (
            <Emoji name={name} size={20} />
          )}
          <RawLabel style={styles.text} text={name} />
        </View>
      </Touchable>
    );
  }
}

export default connect((state: GlobalState, props) => ({
  realmEmoji: getActiveRealmEmojiByName(state)[props.name],
  auth: getAuth(state),
}))(EmojiRow);
