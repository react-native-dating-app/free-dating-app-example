// stable
import React from "react";
import { View, Container, Content, Item, Text, Spinner } from "native-base";
import { Image, StatusBar } from "react-native";
import Header from "../../components/header";
import { GradientButton } from "./../../components/gradient";
import UserProvider from "./../../containers/userProvider";
import styles from "./styles";
import ErrorHandler from "../../components/errorHandler";

const Account = ({ navigation }) => {
  const navigateTo = (key, params) => {
    navigation.navigate({ routeName: key, key, params });
  };
  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Header title="Account" main />
      <UserProvider
        payload={`
        profilePicture
        name
        averageAge
        jobTitle
        id
      `}
        renderLoading={() => <Spinner />}
        renderError={error => <ErrorHandler error={error} />}
        render={({ id, profilePicture, name, averageAge, jobTitle }) => (
          <Content style={{ backgroundColor: "#fafafa", flex: 1 }}>
            <View style={styles.main}>
              <View style={{ marginVertical: 20 }}>
                <Item
                  style={styles.iMageItem}
                  onPress={() => navigateTo("CardProfile", { id })}
                >
                  <Image
                    source={{
                      uri: profilePicture
                    }}
                    style={styles.image}
                  />
                </Item>
              </View>
              <Text style={styles.desc}>
                {name}, {averageAge}
              </Text>
              <Text style={styles.jobTitle}>{jobTitle || ""}</Text>
              <View style={styles.buttonContainer}>
                <GradientButton
                  onPress={() => navigateTo("Setting")}
                  text="Settings"
                  iconName="cog"
                />
              </View>
              <View style={styles.buttonContainer}>
                <GradientButton
                  onPress={() => navigateTo("Profile")}
                  text="Edit Profile"
                  iconName="pencil"
                />
              </View>
            </View>
          </Content>
        )}
      />
    </Container>
  );
};

export default Account;
