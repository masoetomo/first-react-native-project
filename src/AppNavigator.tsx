import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import DetailStudent from './screen/DetailStudent';
import FormLogin from './screen/FormLogin';
import FormStudent from './screen/FormStudent';
import Home from './screen/Home';

let AuthNavigator = createStackNavigator(
  {
    Login: {screen: FormLogin},
  },
  {headerMode: 'none'},
);
let StudentNavigator = createStackNavigator(
  {
    Home: {screen: Home},
    DetailStudent: {screen: DetailStudent},
    FormStudent: {screen: FormStudent},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);
let AppNavigator = createSwitchNavigator(
  {
    Auth: {screen: AuthNavigator},
    App: {screen: StudentNavigator},
  },
  {initialRouteName: 'Auth'},
);

export default createAppContainer(AppNavigator);
