/* @flow strict-local */
import type { ApiResponse, Auth } from '../transportTypes';
import { apiPost } from '../apiFetch';

/** See https://zulipchat.com/api/create-stream */
export default (
  auth: Auth,
  name: string,
  description?: string = '',
  principals?: string[] = [],
  inviteOnly?: boolean = false,
  isAnnounceOnly?: boolean = false,
  announce?: boolean = false,
): Promise<ApiResponse> =>
  apiPost(auth, 'users/me/subscriptions', {
    subscriptions: JSON.stringify([{ name, description }]),
    principals: JSON.stringify(principals),
    invite_only: inviteOnly,
    is_announcement_only: isAnnounceOnly,
    announce,
  });
