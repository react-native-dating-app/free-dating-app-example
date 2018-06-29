//stable
import React from "react";
import { StackNavigator } from "react-navigation";
import { Root } from "native-base";
import TabNav from "./tabNavigator";
import Chat from "./screens/chat";
import Onboard from "./screens/onBoard";
import CardProfile from "./screens/cardProfile";
import Setting from "./screens/settings";
import Profile from "./screens/profile";
import UploadPhoto from "./screens/uploadPhoto";
import SocialLogin from "./screens/socialLogin";

const Navigator = ({ initialRouteName, screenProps }) => {
  const CustomNavigator = StackNavigator(
    {
      Setting: { screen: Setting },
      Profile: { screen: Profile },
      Home: { screen: TabNav },
      Onboard: { screen: Onboard },
      CardProfile: { screen: CardProfile },
      Chat: { screen: Chat },
      UploadPhoto: { screen: UploadPhoto },
      SocialLogin: { screen: SocialLogin }
    },
    {
      initialRouteName: initialRouteName || "Onboard",
      headerMode: "none"
    }
  );
  return <CustomNavigator screenProps={screenProps} />;
};

const NavWrapper = ({ initialRouteName, screenProps }) => (
  <Root>
    <Navigator screenProps={screenProps} initialRouteName={initialRouteName} />
  </Root>
);

export default NavWrapper;
