/* @flow */
import connectWithActions from '../connectWithActions';
import { getStreamInNarrow, getSubscriptions, getStreams } from '../selectors';
import TitleStream from './TitleStream';

export default connectWithActions((state, props) => ({
  stream: getStreamInNarrow(props.narrow, getSubscriptions(state), getStreams(state)),
}))(TitleStream);
