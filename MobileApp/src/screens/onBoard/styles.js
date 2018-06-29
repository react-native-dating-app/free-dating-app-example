// stable
import { Dimensions, Platform } from "react-native";
import { Fonts } from "../../variables";

const dwidth = Dimensions.get("window").width;
const lwidth = Dimensions.get("window").height;

export default {
  carouselImage: {
    height: lwidth / 1.9,
    width: dwidth / 1.2,
    marginTop: 40,
    alignSelf: "center"
  },
  carouselView: {
    flex: 1,
    width: dwidth / 1.2,
    backgroundColor: "transparent",
    marginTop: -20
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },
  containerView: {
    flex: 4.5,
    alignItems: "center",
    backgroundColor: "transparent"
  },
  loginView: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 15
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: dwidth,
    height: lwidth
  },
  textStyle: {
    textAlign: "center",
    fontSize: 21,
    color: "white",
    fontFamily: Fonts.Poppins
  },
  screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  }
};
