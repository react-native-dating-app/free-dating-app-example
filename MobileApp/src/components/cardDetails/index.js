// stable
import React from "react";
import { ScrollView, Image } from "react-native";
import { View, Text, Button } from "native-base";
import { GradientButton } from "../../components/gradient";
import RenderTag from "../../components/renderTag";
import ReportUser from "../../containers/ReportUser";
import { getOrderedPictures } from "../../utils";
import { interestsDummy, descriptionDummy } from "../../variables";
import PropTypes from "prop-types";
import styles from "./styles";

const CardDetails = ({
  activeCard,
  isSelfProfile,
  handleLike,
  onPressConnect
}) => {
  const {
    name,
    averageAge,
    profilePicture,
    worksAt,
    jobTitle,
    interests,
    description,
    instagram,
    instaPictures,
    instaUserName,
    pictures,
    picturePreferences
  } = activeCard;
  const orderedPictures = getOrderedPictures(
    pictures,
    picturePreferences,
    profilePicture
  );
  return (
    <View>
      <View style={styles.modalProfileImageContainer}>
        <ScrollView horizontal={true} pagingEnabled={true}>
          {orderedPictures.map(obj => {
            return (
              <View key={obj.id} style={styles.modalProfileImageContainer}>
                <Image
                  source={{
                    uri: obj.url || ""
                  }}
                  style={{ flex: 1, resizeMode: "cover" }}
                />
              </View>
            );
          })}
        </ScrollView>
        {!isSelfProfile && (
          <GradientButton
            onPress={handleLike}
            iconName="heart"
            gradientStyle={styles.heartGradientStyle}
            iconStyle={styles.heartIcon}
          />
        )}
      </View>
      <View style={styles.descView}>
        <View style={styles.aboutView}>
          <Text style={styles.nameText}>
            {name || "None"}, {averageAge || "N/A"}
          </Text>
          <Text style={styles.jobText}>
            {jobTitle || "Active Dating App User"}
          </Text>
          <Text style={styles.jobText}>{worksAt || "Dating corp. ltd"}</Text>
        </View>
        <View style={{ marginLeft: -10 }}>
          <RenderTag tags={interests.length ? interests : interestsDummy} />
        </View>
      </View>
      <View style={styles.descAbout}>
        <Text style={styles.descAboutText}>
          {description || descriptionDummy}
        </Text>
      </View>
      {!isSelfProfile && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 15,
            marginBottom: 50
          }}
        >
          {/*<GradientButton
          onPress={() => {
            this._modal.open();
          }}
          text={`Report ${name}`}
          gradientStyle={styles.reportGradientStyle}
          buttonStyle={styles.reportButton}
          btnTextStyle={styles.reportBtnText}
        />*/}
          <Button
            full
            onPress={() => {
              this._modal.open();
            }}
            style={styles.reportButton}
          >
            <Text style={styles.reportBtnText}>{`Report ${name}`}</Text>
          </Button>
        </View>
      )}
      <ReportUser
        getReferencemodal={c => {
          this._modal = c;
        }}
      />
      {instagram && instaPictures && instaPictures.length ? (
        <View style={{ paddingLeft: 30, paddingTop: 10 }}>
          <View style={styles.socialView}>
            <Text style={styles.socialText}>Instagram</Text>
            <View style={styles.connectView}>
              {!isSelfProfile && (
                <GradientButton
                  onPress={() => onPressConnect(instaUserName)}
                  gradientStyle={styles.connectGradientStyle}
                  buttonStyle={styles.connectButton}
                  text={"connect"}
                  textPosition="center"
                />
              )}
            </View>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {instaPictures.map((uri, index) => {
              return (
                <View style={styles.socialImageView} key={index}>
                  <Image source={{ uri }} style={{ flex: 1 }} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

CardDetails.propTypes = {
  // Card data
  activeCard: PropTypes.shape({
    name: PropTypes.string,
    averageAge: PropTypes.number,
    profilePicture: PropTypes.string,
    worksAt: PropTypes.string,
    jobTitle: PropTypes.string,
    interests: PropTypes.array,
    description: PropTypes.string,
    instagram: PropTypes.bool,
    instaPictures: PropTypes.array,
    instaUserName: PropTypes.string,
    pictures: PropTypes.array,
    picturePreferences: PropTypes.array
  }).isRequired,
  // True, if the user is viewing it's own profile
  isSelfProfile: PropTypes.bool.isRequired,
  // Function to like a user
  handleLike: PropTypes.func.isRequired,
  // Instagram connect function
  onPressConnect: PropTypes.func.isRequired
};

export default CardDetails;
