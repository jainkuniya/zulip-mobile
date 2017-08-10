/* @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import type { Auth, Message, Actions, StyleObj, SupportedHtmlClasses } from '../types';
import styles from './HtmlStyles';
import cascadingStyles from './cascadingStylesView';
import cascadingStylesText from './cascadingStylesText';
import indexedStyles from './indexedStyles';
import indexedViewsStyles from './indexedViewsStyles';
import textStylesFromClass from './textStylesFromClass';
import HtmlTagSpan from './tags/HtmlTagSpan';
import HtmlTagSpanMention from './tags/HtmlTagSpanMention';
import HtmlTagA from './tags/HtmlTagA';
import HtmlTagLi from './tags/HtmlTagLi';
import HtmlTagImg from './tags/HtmlTagImg';
import HtmlTagPre from './tags/HtmlTagPre';
import HtmlTagStrong from './tags/HtmlTagStrong';
import HtmlTagItalic from './tags/HtmlTagItalic';
import HtmlTagDiv from './tags/HtmlTagDiv';
import { getEmojiUrl } from '../utils/url';
import { getOwnEmail } from '../selectors';

const specialTags = {
  span: HtmlTagSpan,
  p: HtmlTagSpan,
  code: HtmlTagSpan,
  a: HtmlTagA,
  li: HtmlTagLi,
  img: HtmlTagImg,
  pre: HtmlTagPre,
  strong: HtmlTagStrong,
  b: HtmlTagStrong,
  em: HtmlTagItalic,
  i: HtmlTagItalic,
  div: HtmlTagDiv,
  blockquote: HtmlTagDiv,
  ul: HtmlTagDiv,
  ol: HtmlTagDiv,
  table: HtmlTagDiv,
  thead: HtmlTagDiv,
  tbody: HtmlTagDiv,
  tr: HtmlTagDiv,
  th: HtmlTagDiv,
  td: HtmlTagDiv,
};

const stylesFromClassNames = (classNames: SupportedHtmlClasses = '', styleObj) =>
  classNames.split(' ').map(className => styleObj[className]);

class HtmlNodeTag extends PureComponent {
  props: {
    auth: Auth,
    attribs: Object,
    name: SupportedHtmlClasses,
    cascadingStyle: StyleObj,
    cascadingTextStyle: StyleObj,
    childrenNodes: Object[],
    ownEmail: string,
    onPress: () => void,
    message: Message,
    actions: Actions,
  };

  render() {
    const {
      auth,
      actions,
      attribs,
      name,
      cascadingStyle,
      cascadingTextStyle,
      childrenNodes,
      onPress,
      message,
      ownEmail,
    } = this.props;
    const style = [styles[name], ...stylesFromClassNames(attribs.class, styles)];
    const newCascadingStyle = [
      cascadingStyle,
      cascadingStyles[name],
      ...stylesFromClassNames(attribs.class, cascadingStyles),
    ];
    const newCascadingStylesText = [
      cascadingTextStyle,
      cascadingStylesText[name],
      ...stylesFromClassNames(attribs.class, textStylesFromClass),
    ];
    const newIndexedStyles = indexedStyles[name];
    const newIndexedViewsStyles = indexedViewsStyles[name];

    let HtmlComponent = specialTags[name] || HtmlTagSpan;

    if (attribs.class) {
      if (attribs.class.startsWith('emoji emoji-')) {
        HtmlComponent = HtmlTagImg;
        attribs.src = getEmojiUrl(attribs.class.split('-').pop());
      } else if (attribs.class === 'user-mention' && attribs['data-user-email'] === ownEmail) {
        HtmlComponent = HtmlTagSpanMention;
      }
    }

    return (
      <HtmlComponent
        auth={auth}
        attribs={attribs}
        name={name}
        actions={actions}
        target={attribs.target}
        src={attribs.src}
        href={attribs.href}
        className={attribs.class}
        style={[styles.common, style]}
        cascadingStyle={newCascadingStyle}
        cascadingTextStyle={newCascadingStylesText}
        indexedViewsStyles={newIndexedViewsStyles}
        indexedStyles={newIndexedStyles}
        childrenNodes={childrenNodes}
        onPress={onPress}
        message={message}
      />
    );
  }
}

export default connect(
  state => ({
    ownEmail: getOwnEmail(state),
  }),
  {},
)(HtmlNodeTag);
