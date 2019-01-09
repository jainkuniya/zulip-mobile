/* @flow strict-local */
import type { Auth, ApiResponseSuccess } from '../transportTypes';
import type { Message, Narrow } from '../apiTypes';
import type { ReactionCommon } from '../modelTypes';
import { apiGet } from '../apiFetch';
import migrateMessages from './migrateMessages';

type CommonResponse = {|
  ...ApiResponseSuccess,
  anchor: number,
  found_anchor?: boolean,
  found_newest?: boolean,
  found_oldest?: boolean,
|};

export type ApiMessageReaction = $ReadOnly<{|
  ...$Exact<ReactionCommon>,
  user: $ReadOnly<{|
    email: string,
    full_name: string,
    id: number,
  |}>,
|}>;

export type ApiMessage = $ReadOnly<{|
  ...$Exact<Message>,
  reactions: $ReadOnlyArray<ApiMessageReaction>,
|}>;

type OriginalApiResponseMessages = {|
  ...$Exact<CommonResponse>,
  messages: ApiMessage[],
|};

type ApiResponseMessages = {|
  ...$Exact<CommonResponse>,
  messages: Message[],
|};

const migrateResponse = (response: OriginalApiResponseMessages): ApiResponseMessages => {
  const { messages, ...restResponse } = response;
  return {
    ...restResponse,
    messages: migrateMessages(messages),
  };
};

/**
 * See https://zulipchat.com/api/get-messages
 *
 * These values exist only in Zulip 1.8 or newer:
 *   * found_anchor
 *   * found_newest
 *   * found_oldest
 */
export default async (
  auth: Auth,
  narrow: Narrow,
  anchor: number,
  numBefore: number,
  numAfter: number,
  useFirstUnread: boolean = false,
): Promise<ApiResponseMessages> => {
  const response: OriginalApiResponseMessages = await apiGet(auth, 'messages', {
    narrow: JSON.stringify(narrow),
    anchor,
    num_before: numBefore,
    num_after: numAfter,
    apply_markdown: true,
    use_first_unread_anchor: useFirstUnread,
  });
  return migrateResponse(response);
};
