//stable
import { StyleSheet, Platform, Dimensions } from "react-native";
import { Fonts } from "../../variables";
import CommonColor from "../../theme/variables/commonColor";
const dwidth = Dimensions.get("window").width;
const lwidth = Dimensions.get("window").height;

const styles = StyleSheet.create({
  modalView: {
    marginTop: lwidth / 4,
    alignSelf: "center",
    width: dwidth - 50,
    height: lwidth / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 30
  },
  reportText: {
    alignSelf: "center",
    color: "#666",
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 26,
    fontWeight: "500"
  },
  descText: {
    color: "#aaa",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 16,
    fontWeight: "500"
  },
  FlatList: {
    marginTop: 25
    // borderBottomWidth: 1,
    // borderColor: "#ddd"
  },
  listItem: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    paddingLeft: 10
  },
  listText: {
    alignSelf: "center",
    color: "#AAA",
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 16,
    fontWeight: "500"
  },
  reportGradientStyle: {
    borderRadius: 25,
    width: "100%",
    elevation: 0
  },
  reportButton: {
    backgroundColor: "transparent",
    height: 50,
    width: "100%",
    padding: 10,
    elevation: 0
  },
  reportBtnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default styles;
