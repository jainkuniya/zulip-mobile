/* @flow strict-local */
import type { InputSelectionType } from '../types';

const getTokenIndex = (text: string): number => {
  const lastIndexOfEmojiToken = text.lastIndexOf(':');
  const lastIndexOfStreamToken = text.lastIndexOf('#');
  const lastIndexOfPeopleToken =
    ['\n', ' ', '#', ':'].includes(text[text.lastIndexOf('@') - 1]) || text.lastIndexOf('@') === 0 // to make sure `@` is not the part of email
      ? text.lastIndexOf('@')
      : -1;

  return Math.max(lastIndexOfEmojiToken, lastIndexOfStreamToken, lastIndexOfPeopleToken);
};

/**
 * @param {string} textWhole - Whole text present in the compose box input.
 * @param {Object} selection - Current {start, end} position of the cursor in the compose box input
 *
 * @returns {Object} - This object consists of `autocompleteType` (which can be one of `:`, `#`, `@`)
 * and `filter` text according to which respective autocomplete list needs to be filtered.
 */
export default (textWhole: string, selection: InputSelectionType) => {
  const { start, end } = selection;
  let text = textWhole;
  if (start === end && start !== text.length) {
    // new letter is typed in middle
    text = text.substring(0, start);
  }

  const tokenIndex: number = getTokenIndex(text);

  const autocompleteType: string = tokenIndex !== -1 ? text[tokenIndex] : '';
  const filter: string =
    text.length > tokenIndex + 1 && !['\n', ' '].includes(text[tokenIndex + 1])
      ? text.substring(tokenIndex + 1, text.length)
      : '';

  return { autocompleteType, filter };
};
