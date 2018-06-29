//stable
import { StyleSheet, Platform } from "react-native";
import { Fonts } from "../../variables";
import CommonColor from "../../theme/variables/commonColor";

const styles = StyleSheet.create({
  doneButton: {
    backgroundColor: "transparent",
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 10,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0
  },
  doneText: {
    color: CommonColor.brandPrimary,
    fontSize: 18,
    fontWeight: "600"
  },
  input: {
    paddingLeft: 10
  },
  addButton: {
    backgroundColor: CommonColor.brandPrimary,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 10,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  addText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  errorView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  noInterests: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70
  },
  addIcon: {
    borderBottomWidth: 0,
    backgroundColor: CommonColor.brandSecondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  addIconStyle: {
    paddingRight: 0,
    color: "#fff",
    fontSize: 12
  },
  noMoreInterests: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    marginTop: -20,
    color: "#aaa",
    textAlign: "center",
    fontFamily: Fonts.PoppinsRegular
  },
  errorText: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    marginTop: -20,
    color: "#ff6666",
    textAlign: "center",
    fontFamily: Fonts.PoppinsRegular
  },
  listText: {
    color: "#888",
    fontFamily: Fonts.PoppinsMedium,
    marginLeft: 15
  }
});

export default styles;
