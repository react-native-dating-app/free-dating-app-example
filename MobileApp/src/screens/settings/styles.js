// stable
import commonColor from "../../theme/variables/commonColor";
import { Fonts } from "../../variables";
export default {
  container: {
    backgroundColor: "#FAFAFA"
  },
  card: {
    paddingTop: 11,
    paddingBottom: 11,
    flex: 1,
    flexDirection: "column",
    borderColor: "#FAFAFA",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 18
  },
  borderedView: {
    width: 250,
    height: 50,
    borderRadius: 30,
    padding: 1,
    marginTop: 56,
    elevation: 0
  },
  logoutbutton: {
    backgroundColor: "transparent",
    borderRadius: 18,
    width: 250,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    elevation: 0
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderRadius: 30,
    width: 250,
    height: 50,
    borderColor: commonColor.brandPrimary,
    borderWidth: 2,
    marginTop: 56,
    marginBottom: 56,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    elevation: 0
  },
  deleteText: {
    color: commonColor.brandPrimary,
    fontSize: 17,
    fontFamily: Fonts.PoppinsMedium
  },
  logoutText: {
    color: "white",
    fontSize: 17,
    fontFamily: Fonts.PoppinsMedium
  },
  headingText: {
    color: commonColor.brandPrimary,
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium
  },
  discoveryText: {
    color: "#5C6B7A",
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    paddingLeft: 2
  },
  heading: {
    marginBottom: 10
  },
  someText: {
    color: "rgba(0,0,0,0.35)",
    margin: 10,
    fontFamily: Fonts.PoppinsRegular
  },
  menSwitch: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 5
    // margin:10
  },
  notBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5
  },
  searchKmText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.PoppinsMedium
  },
  slider: {
    // padding:10,
    margin: 10,
    marginTop: -5
  },
  switchBlockHeader: {
    fontSize: 16,
    color: "grey",
    fontFamily: Fonts.PoppinsMedium
  }
};
