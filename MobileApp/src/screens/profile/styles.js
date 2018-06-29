// stable
import { Fonts } from "../../variables";
import CommonColor from "../../theme/variables/commonColor";
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
    marginTop: 56
  },
  headingText: {
    color: "#5c6b7a",
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 20
  },
  heading: {
    marginBottom: 10
  },
  photosheading: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  swapbutton: {
    width: 100,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  swapText: {
    color: "#5c6b7a",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: Fonts.Poppins
  },
  InterestsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  interestAddBtn: {
    backgroundColor: CommonColor.brandPrimary,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: -10,
    height: 30,
    width: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  addText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  interestAddIcon: {
    paddingRight: 0,
    color: "#fff",
    fontSize: 14
  },
  buttonViewStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 35
  },
  switchStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 5
  },
  inputStyle: {
    height: 48,
    width: 328,
    fontFamily: Fonts.Poppins
  },
  aboutStyle: {
    height: 90,
    width: 328,
    fontFamily: Fonts.Poppins
  },
  inputView: {
    // flex: 1,
    // flexDirection: "column",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 7,
    backgroundColor: "white",
    marginBottom: 20,
    paddingLeft: 10
  },
  switchText: {
    color: "#5c6b7a",
    fontSize: 19,
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 8,
    marginTop: 8
  },
  genderButton: {
    flex: 0.7,
    borderWidth: 2,
    justifyContent: "center",
    borderBottomWidth: 3,
    borderRadius: 30,
    elevation: 0
  },
  buttonText: {
    fontSize: 16,
    alignSelf: "center",
    fontFamily: Fonts.PoppinsMedium
  }
};
