// stable
import { StyleSheet, Dimensions, Platform } from "react-native";
import { Fonts } from "../../variables";
const dwidth = Dimensions.get("window").width;
const dheight = Dimensions.get("window").height;
const aspectRatio = dheight / dwidth; // if aspectRatio > 1.6 Code for Iphone, else code for Ipad
export default StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    width:
      Platform.OS === "ios" ? (aspectRatio > 1.6 ? 224 : dwidth / 1.7) : 220,
    borderRadius: 10,
    zIndex: -333
  },
  image: {
    width:
      Platform.OS === "ios" ? (aspectRatio > 1.6 ? 224 : dwidth / 1.7) : 220,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 7
  },
  ImageView: {
    height: Platform.OS === "ios" ? 350 : 250,
    backgroundColor: "transparent"
  },
  descView: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "flex-start"
  },
  nameage: {
    fontSize: 22,
    fontFamily: Fonts.PoppinsMedium,
    color: "#5C6B7A",
    lineHeight: 20,
    paddingTop: 5
  },
  workinfo: {
    fontSize: 14,
    fontFamily: Fonts.Poppins,
    color: "#444",
    lineHeight: 20,
    paddingTop: 5
  },
  personalinfo: {
    fontSize: 14,
    fontFamily: Fonts.Poppins,
    color: "#444",
    lineHeight: 20,
    paddingTop: 5
  },
  distanceView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  yupStyle: {
    width: Platform.OS === "ios" ? 90 : 70,
    height: Platform.OS === "ios" ? 50 : 35,
    borderRadius: Platform.OS === "ios" ? 5 : 3,
    padding: 10,
    position: "absolute",
    top: 10,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00D777",
    borderWidth: 3,
    zIndex: 1000
  },
  nopeStyle: {
    width: Platform.OS === "ios" ? 90 : 70,
    height: Platform.OS === "ios" ? 50 : 35,
    borderRadius: Platform.OS === "ios" ? 5 : 3,
    padding: 10,
    position: "absolute",
    top: 10,
    left: Platform.OS === "ios" ? dwidth / 2 : 200,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF4A2D",
    borderWidth: 2,
    zIndex: 1000
  },
  yupTextStyle: {
    color: "#00D777",
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontWeight: "bold"
  },
  nopeTextSTyle: {
    color: "#FF4A2D",
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontWeight: "bold"
  },
  textStyledist: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: "#5C6B7A"
  },
  iconLocation: {
    fontSize: 35,
    color: "#5C6B7A"
  },
  tagStyle: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  arrowUpIconStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: -5
  },
  modalProfileImageContainer: {
    height: dheight / 2 - 20,
    width: dwidth
  },
  shareContainer: {
    height: dheight / 3,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
