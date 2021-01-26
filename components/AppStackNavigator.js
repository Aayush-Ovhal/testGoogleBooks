import * as React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import BookDonateScreen from '../screens/BookDonateScreen';
import RecieverDetailScreen from '../screens/RecieverDetailScreen';

export const AppStackNavigator = createStackNavigator({
    BDL: {screen: BookDonateScreen,
     navigationOptions: {headerShown: false}
    },
    RDL: {screen: RecieverDetailScreen,
     navigationOptions: {headerShown: false}
    }
},
{
    initialRouteName: "BDL"
})