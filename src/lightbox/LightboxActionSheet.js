/* @flow */
import type { Auth } from '../types';

import download from '../api/downloadFile';
import share from './share';
import Toast from '../utils/showToast';

type DownloadImageType = {
  url: string,
  auth: Auth,
};

type ShareLinkType = {
  url: string,
};

type ExecuteActionSheetActionType = {
  title: string,
  url: string,
  auth: Auth,
};

type ButtonProps = {
  auth?: Auth,
  url: string,
};

type ButtonType = {
  title: string,
  onPress: (props: ButtonProps) => void | boolean | Promise<any>,
};

const downloadImage = async ({ url, auth }: DownloadImageType) => {
  try {
    await download(url, auth);
    Toast('Download complete.');
  } catch (error) {
    Toast('Can\'t download');
  }
};

const shareLink = ({ url }: ShareLinkType) => {
  share(url);
};

const actionSheetButtons: ButtonType[] = [
  { title: 'Download file', onPress: downloadImage },
  { title: 'Share', onPress: shareLink },
  { title: 'Cancel', onPress: () => false },
];

export const constructActionSheetButtons = () => actionSheetButtons.map(button => button.title);

export const executeActionSheetAction = ({ title, ...props }: ExecuteActionSheetActionType) => {
  const button = actionSheetButtons.find(x => x.title === title);
  if (button) {
    button.onPress(props);
  }
};
