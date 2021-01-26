import * as React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';

import WelcomeScreen from './screens/WelcomeScreen';
import {DrawerNavigator} from './components/AppDrawerNavigator';
import { AppTabNavigator } from './components/AppTabNavigator';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const SwitchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  Drawer:{screen: DrawerNavigator},
  BottomTab: {screen: AppTabNavigator}
})

const AppContainer =  createAppContainer(SwitchNavigator);

//AIzaSyDEpbcDl9Yc5tDNAYTr6i6x32QRqmuT-Jw