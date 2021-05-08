/* @flow strict-local */

import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';

import type { RouteProp } from '../react-navigation';
import type { MainTabsNavigationProp } from '../main/MainTabsScreen';
import * as NavigationService from '../nav/NavigationService';
import type { Dispatch, BrowserPreference } from '../types';
import { createStyleSheet } from '../styles';
import { connect } from '../react-redux';
import { getSettings } from '../selectors';
import { OptionButton, OptionRow } from '../common';
import {
  IconBrowser,
  IconDiagnostics,
  IconNotifications,
  IconNight,
  IconLanguage,
  IconMoreHorizontal,
} from '../common/Icons';
import {
  settingsChange,
  navigateToNotifications,
  navigateToLanguage,
  navigateToDiagnostics,
  navigateToLegal,
} from '../actions';
import { shouldUseInAppBrowser } from '../utils/openLink';

const styles = createStyleSheet({
  optionWrapper: {
    flex: 1,
  },
});

type Props = $ReadOnly<{|
  navigation: MainTabsNavigationProp<'settings'>,
  route: RouteProp<'settings', void>,

  theme: string,
  browser: BrowserPreference,
  dispatch: Dispatch,
|}>;

class SettingsScreen extends PureComponent<Props> {
  handleThemeChange = () => {
    const { dispatch, theme } = this.props;
    dispatch(settingsChange({ theme: theme === 'default' ? 'night' : 'default' }));
  };

  render() {
    const { dispatch, theme, browser } = this.props;

    return (
      <ScrollView style={styles.optionWrapper}>
        <OptionRow
          Icon={IconNight}
          label="Night mode"
          value={theme === 'night'}
          onValueChange={this.handleThemeChange}
        />
        <OptionRow
          Icon={IconBrowser}
          label="Open links with in-app browser"
          value={shouldUseInAppBrowser(browser)}
          onValueChange={value => {
            dispatch(settingsChange({ browser: value ? 'embedded' : 'external' }));
          }}
        />
        <OptionButton
          Icon={IconNotifications}
          label="Notifications"
          onPress={() => {
            NavigationService.dispatch(navigateToNotifications());
          }}
        />
        <OptionButton
          Icon={IconLanguage}
          label="Language"
          onPress={() => {
            NavigationService.dispatch(navigateToLanguage());
          }}
        />
        <OptionButton
          Icon={IconDiagnostics}
          label="Diagnostics"
          onPress={() => {
            NavigationService.dispatch(navigateToDiagnostics());
          }}
        />
        <OptionButton
          Icon={IconMoreHorizontal}
          label="Legal"
          onPress={() => {
            NavigationService.dispatch(navigateToLegal());
          }}
        />
      </ScrollView>
    );
  }
}

export default connect(state => ({
  theme: getSettings(state).theme,
  browser: getSettings(state).browser,
}))(SettingsScreen);
