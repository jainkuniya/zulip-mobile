/* @flow */
import css from './css';
import htmlBody from './htmlBody';
import script from './script';

type InitOptionsType = {
  anchor: number,
  highlightUnreadMessages: boolean,
  showMessagePlaceholders: boolean,
};

export default (content: string, theme: string, initOptions: InitOptionsType) => `
${script(initOptions.anchor)}
${css(theme, initOptions.highlightUnreadMessages)}

<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<body style="overflow-x: hidden;">
${htmlBody(content, initOptions.showMessagePlaceholders)}
</body>
`;
