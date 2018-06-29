// stable
import { Platform } from "react-native";
import { Fonts } from "../../variables";

export default {
  buttonContainer: { marginTop: Platform.OS === "ios" ? 50 : 40 },
  main: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? "15%" : "10%"
  },
  iMageItem: {
    borderBottomWidth: 0
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  desc: {
    fontSize: 22,
    fontFamily: Fonts.PoppinsMedium,
    color: "#6e6e6e",
    lineHeight: 38
  },
  jobTitle: {
    color: "#5e5e5e",
    fontFamily: Fonts.Poppins
  }
};
