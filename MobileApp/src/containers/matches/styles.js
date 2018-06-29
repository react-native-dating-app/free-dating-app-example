//stable
import { Dimensions, Platform } from "react-native";
import { Fonts } from "../../variables";
const dwidth = Dimensions.get("window").width;

export default {
  listItem: {
    paddingLeft: 15
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  bodyDesc: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  noMatchView: {
    marginTop: Platform.OS === "ios" ? dwidth / 3 : dwidth / 4
  },
  textView: {
    paddingLeft: 10,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  textNAme: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    color: "#5C6B7A"
  },
  textComma: {
    marginLeft: 0,
    fontSize: 18,
    color: "#5C6B7A",
    fontWeight: "bold"
  },
  textAge: {
    marginLeft: 0,
    fontSize: 18,
    color: "#5C6B7A",
    fontFamily: Fonts.PoppinsMedium
  },
  tNote: {
    fontFamily: Fonts.Poppins,
    color: "#888",
    fontSize: 14
  },
  listBody: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  bodyView: {
    paddingLeft: 15,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  bodyText: {
    fontSize: Platform.OS === "ios" ? 16 : 15,
    color: "#5C6B7A",
    fontWeight: "500",
    fontFamily: Fonts.Poppins
  },
  messageText: {
    fontFamily: Fonts.PoppinsRegular,
    paddingLeft: 5,
    color: "#5C6B7A",
    fontWeight: "300"
  }
};
