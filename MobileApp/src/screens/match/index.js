// stable
import React from "react";
import { Container } from "native-base";
import { StatusBar } from "react-native";
import Header from "../../components/header";
import Matches from "./../../containers/matches";

const MatchScreen = ({ navigation }) => {
  const navigateToChat = match => {
    navigation.navigate({ routeName: "Chat", key: "Chat", params: { match } });
  };
  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Header title="Matches" main />
      <Matches onPressMatch={navigateToChat} />
    </Container>
  );
};

export default MatchScreen;
