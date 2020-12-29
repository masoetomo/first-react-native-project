import React from 'react';
import {SafeAreaView} from 'react-native';
import {AppState, StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  ActivityIndicator,
  Colors,
  Provider as PaperProvider,
} from 'react-native-paper';
import AppNavigator from './AppNavigator';
import AppService from './service/AppService';

type State = {
  appState: string | undefined;
  databaseIsReady: boolean;
};
type Props = {};
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      databaseIsReady: false,
    };
  }

  componentDidMount() {
    // App is starting up
    this._appIsNowRunningInForeground();
    this._setAppStateActive();
    // Listen for app state changes
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    SplashScreen.hide();
  }

  componentWillUnmount() {
    // Remove app state change listener
    AppState.removeEventListener(
      'change',
      this._handleAppStateChange.bind(this),
    );
  }

  _setAppStateActive() {
    this.setState({
      appState: 'active',
    });
  }

  _handleAppStateChange(nextAppState: string) {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has moved from the background (or inactive) into the foreground
      this._appIsNowRunningInForeground();
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      this._appHasGoneToTheBackground();
    }
    this.setState({appState: nextAppState});
  }

  _appIsNowRunningInForeground() {
    console.log('App is now running in the foreground!');
    return AppService.openDatabase().then(() =>
      this.setState({
        databaseIsReady: true,
      }),
    );
  }

  _appHasGoneToTheBackground() {
    console.log('App has gone to the background.');
    AppService.closeDatabase();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <PaperProvider>
          {this.state.databaseIsReady ? (
            <AppNavigator />
          ) : (
            <ActivityIndicator
              style={styles.activity}
              animating={true}
              color={Colors.blue300}
            />
          )}
        </PaperProvider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  activity: {flex: 1, alignSelf: 'center'},
});

export default App;
