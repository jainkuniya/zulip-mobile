/* @flow */
import css from './css';
import js from './js-es3';
import messageLoadingList from './messageLoadingListAsHtml';

export default (content: string, theme: string, isEmptyView: boolean) =>
  `
${css(theme)}

<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<body>
  <div id="spinner-older" class="hidden loading-spinner"></div>
  <div id="message-list">${content}</div>
  <div id="message-loading" class="${isEmptyView ? '' : 'hidden'}">
    ${messageLoadingList}
  </div>
  <div id="spinner-newer" class="hidden loading-spinner"></div>
  <div id="typing" class="message"></div>
</body>

<script>
${js}
</script>
`;
