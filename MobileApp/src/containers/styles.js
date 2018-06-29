//stable
import { Dimensions, Platform } from "react-native";
import { Fonts } from "../variables";
const dwidth = Dimensions.get("window").width;

export default {
  loginButton: {
    marginTop: Platform.OS === "android" ? 10 : null,
    width: dwidth - 100,
    alignSelf: "center",
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  loginButtonText: {
    paddingTop: 5,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "400",
    color: "#666",
    fontFamily: Fonts.Poppins
  }
};
