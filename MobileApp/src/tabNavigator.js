//stable
import React from "react";
import { TabNavigator } from "react-navigation";
import Home from "./screens/home";
import Match from "./screens/match";
import Account from "./screens/account";
import ThemeFooter from "./components/homeFooter";

export default TabNavigator(
  {
    Home: { screen: Home },
    Match: { screen: Match },
    Account: { screen: Account }
  },
  {
    initialRouteName: "Home",
    tabBarPosition: "bottom",
    swipeEnabled: false,
    lazy: true,
    tabBarComponent: props => {
      return <ThemeFooter footerProps={props} />;
    }
  }
);
