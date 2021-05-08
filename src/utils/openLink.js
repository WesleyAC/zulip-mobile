/* @flow strict-local */
import { NativeModules, Platform, Linking } from 'react-native';
import SafariView from 'react-native-safari-view';

import type { BrowserPreference, GetState } from '../types';
import { getSettings } from '../selectors';

export function openLinkEmbedded(url: string): void {
  if (Platform.OS === 'ios') {
    SafariView.show({ url: encodeURI(url) });
  } else {
    NativeModules.CustomTabsAndroid.openURL(url);
  }
}

export function openLinkExternal(url: string): void {
  Linking.openURL(url);
}

export function shouldUseInAppBrowser(browser: BrowserPreference): boolean {
  if (browser === 'default') {
    return Platform.OS === 'android';
  } else {
    return browser === 'embedded';
  }
}

// TODO: We may want to turn this into a thunk action creator.
// See https://github.com/zulip/zulip-mobile/pull/4679#discussion_r625991786
export function openLinkWithUserPreference(url: string, getState: GetState): void {
  const state = getState();
  const browser = getSettings(state).browser;
  if (shouldUseInAppBrowser(browser)) {
    openLinkEmbedded(url);
  } else {
    openLinkExternal(url);
  }
}
