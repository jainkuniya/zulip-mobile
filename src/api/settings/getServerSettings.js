/* @flow strict-local */
import { apiGet } from '../apiFetch';

export type AuthenticationMethods = {|
  dev: boolean,
  github: boolean,
  google: boolean,
  ldap: boolean,
  password: boolean,
  remoteuser: boolean,
|};

export type ApiServerSettings = {|
  authentication_methods: AuthenticationMethods,
  email_auth_enabled: boolean,
  msg: string,
  push_notifications_enabled: boolean,
  realm_description: string,
  realm_icon: string,
  realm_name: string,
  realm_uri: string,
  require_email_format_usernames: boolean,
  zulip_version: string,
|};

/** See https://zulipchat.com/api/server-settings */
export default async (realm: string): Promise<ApiServerSettings> =>
  apiGet({ apiKey: '', email: '', realm }, 'server_settings');
