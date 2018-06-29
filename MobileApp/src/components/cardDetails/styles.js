// stable
import { StyleSheet, Dimensions } from "react-native";
import { Fonts } from "../../variables";
const dwidth = Dimensions.get("window").width;
const lwidth = Dimensions.get("window").height;

export default StyleSheet.create({
  modalProfileImageContainer: {
    height: lwidth / 2 - 20,
    width: dwidth
  },
  shareContainer: {
    height: lwidth / 3,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 10
  },
  heartGradientStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: -25,
    right: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  heartIcon: {
    color: "white",
    fontSize: 30,
    paddingLeft: 10
  },
  descView: {
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 20
  },
  aboutView: {
    paddingTop: 10,
    paddingBottom: 20
  },
  nameText: {
    fontSize: 22,
    color: "#666",
    lineHeight: 38,
    fontFamily: Fonts.PoppinsMedium
  },
  jobText: {
    color: "#666",
    fontSize: 14,
    fontFamily: Fonts.PoppinsRegular
  },
  descAbout: {
    paddingRight: 20,
    paddingLeft: 30,
    paddingVertical: 20
  },
  descAboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    fontFamily: Fonts.Poppins
  },
  socialView: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    paddingRight: 20
  },
  socialText: {
    color: "#666",
    justifyContent: "flex-start",
    flex: 1,
    fontFamily: Fonts.PoppinsMedium
  },
  connectView: {
    flex: 1,
    alignSelf: "flex-end"
  },
  connectGradientStyle: {
    borderRadius: 20,
    width: "50%",
    alignSelf: "flex-end",
    elevation: 0
  },
  connectButton: {
    backgroundColor: "transparent",
    height: 24,
    elevation: 0
  },
  // reportGradientStyle: {
  //   borderRadius: 25,
  //   width: "60%",
  //   elevation: 0
  // },
  reportButton: {
    backgroundColor: "#fff",
    height: 50,
    padding: 10,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: "#ddd",
    elevation: 0
  },
  reportBtnText: {
    color: "#bbb",
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 16,
    fontWeight: "bold"
  },
  socialImageView: {
    height: 140,
    width: 140,
    paddingVertical: 10,
    paddingRight: 20
  },
  noPics: {
    color: "gray",
    fontFamily: Fonts.PoppinsRegular
  }
});
