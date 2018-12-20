/* @flow strict-local */

import React, { PureComponent } from 'react';
import { StyleSheet, Image } from 'react-native';

import type { RealmEmojiType, ZulipExtraEmojiType } from '../types';
import { getFullUrl } from '../utils/url';

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
});

type Props = {|
  emoji: RealmEmojiType | ZulipExtraEmojiType,
  realmUrl: string,
|};

export default class RealmEmoji extends PureComponent<Props> {
  render() {
    const { emoji, realmUrl } = this.props;
    return <Image style={styles.image} source={{ uri: getFullUrl(emoji.source_url, realmUrl) }} />;
  }
}
