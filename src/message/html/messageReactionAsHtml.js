/* @flow */
import emojiMap from '../../emoji/emojiMap';

export default (messageId: number, name: string, voteCount: number, voted: boolean) => `
  <span onClick="" class="reaction${voted ? ' self-voted' : ''}" data-name="${name}">
    ${emojiMap[name]} ${voteCount}
  </span>
`;
