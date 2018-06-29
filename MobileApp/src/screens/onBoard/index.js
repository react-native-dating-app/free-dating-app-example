// stable
import React from "react";
import { View, Image, Dimensions, StatusBar, Platform } from "react-native";
import Carousel from "react-native-carousel";
import { NavigationActions } from "react-navigation";
import { Text, Toast } from "native-base";
import Login from "../../containers/login";
import styles from "./styles";

const dwidth = Dimensions.get("window").width;

// Load images
const backgroundImage = require("./../../../assets/bg.png");
const firstImage = require("./../../../assets/first.png");
const secondImage = require("./../../../assets/second.png");
const thirdImage = require("./../../../assets/third.png");
const fourthImage = require("./../../../assets/fourth.png");

const Onboard = ({ navigation }) => {
  const onSuccess = () => {
    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Home" })]
      })
    );
  };
  const onError = err => {
    console.log(err);
    Toast.show({
      text: "Some thing went wrong",
      position: "bottom",
      type: "danger",
      duration: 1000
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image style={styles.image} source={backgroundImage} />
      <View style={styles.containerView}>
        <View style={styles.carouselView}>
          <Carousel
            width={dwidth / 1.2}
            indicatorOffset={Platform.OS === "ios" ? 5 : -15}
            indicatorSize={30}
            indicatorColor="white"
            inactiveIndicatorColor="#ccc"
            delay={1500}
          >
            <View style={styles.screen}>
              <Text style={styles.textStyle}>Discover interesting people</Text>
              <Text style={styles.textStyle}>around you</Text>
              <Image style={styles.carouselImage} source={firstImage} />
            </View>
            <View style={styles.screen}>
              <Text style={styles.textStyle}>Swipe Right to like</Text>
              <Text style={styles.textStyle}>Swipe Left to pass</Text>
              <Image style={styles.carouselImage} source={secondImage} />
            </View>
            <View style={styles.screen}>
              <Text
                ellipsizeMode={"tail"}
                numberOfLines={2}
                style={styles.textStyle}
              >
                If they swipe right, it's a match
              </Text>
              <Image style={styles.carouselImage} source={thirdImage} />
            </View>
            <View style={styles.screen}>
              <View style={{ marginTop: 40 }}>
                <Text
                  ellipsizeMode={"tail"}
                  numberOfLines={1}
                  style={styles.textStyle}
                >
                  Converse with your match
                </Text>
                <Text style={styles.textStyle}>around you</Text>
              </View>
              <Image style={styles.carouselImage} source={fourthImage} />
            </View>
          </Carousel>
        </View>
      </View>
      <View style={styles.loginView}>
        <Login onSuccess={onSuccess} onError={onError} />
      </View>
    </View>
  );
};

export default Onboard;
