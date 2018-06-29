//stable
import React, { Component } from "react";
import _ from "lodash";
import { Text, Form, Item, Input, Label, Spinner } from "native-base";
import { View, FlatList, Modal, TouchableOpacity, Alert } from "react-native";
import { GradientButton } from "../../components/gradient";
import Loader from "../../components/loader";
import styles from "./styles";

const data = [
  {
    index: 1,
    title: "Inappropriate Photos"
  },
  {
    index: 2,
    title: "Feels Like Spam"
  },
  {
    index: 3,
    title: "Other"
  }
];

class ReportUser extends Component {
  state = {
    spinner: false,
    modalVisible: false,
    options: true,
    userReported: false,
    others: false,
    loading: false
  }

  _keyExtractor = (item, index) => item.id
  componentDidMount() {
    const { getReferencemodal } = this.props;
    getReferencemodal(this);
  }
  open = () => {
    this.setState({
      modalVisible: true
    });
  }
  close = () => {
    this.setState({
      modalVisible: false
    });
  }
  _onPress = index => {
    if (index === 3) {
      this.setState({
        others: true,
        options: false,
      });
    } else {
      this.setState({
        userReported: true,
        options: false,
        spinner: true
      });
      setTimeout(() => {
        this.setState({ spinner: false });
      }, 1500);
    }

  }
  btnPressed = () => {
    this.setState({
      loading: false,
      // modalVisible: false,
      others: false,
      userReported: false,
      options: true,
      spinner: true
    });
    setTimeout(() => {
      this.setState({ spinner: false, modalVisible: false, });
    }, 1000);
  }

  _renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => this._onPress(item.index)}
    >
      <View>
        <Text style={styles.listText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    const { modalVisible, loading } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => this.close()}
        backDropOpacity={1}
      >
        <View style={{ flex: 1, backgroundColor: "#444" }}>
          <View style={styles.modalView}>
            {this.state.options && (this.state.spinner === false) ? (
              <View style={{ padding: 10 }}>
                <View>
                  <Text style={styles.reportText}>Report User</Text>
                </View>
                <View>
                  <Text style={styles.descText}>
                    Is this person bothering you? Tell us what they did.
                  </Text>
                </View>
                <FlatList
                  style={styles.FlatList}
                  data={data}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                />
              </View>
            ) : null}

            {this.state.userReported && !this.state.options && (this.state.spinner === false) ? (
              <View style={{ padding: 10, marginTop: 50 }}>
                <View>
                  <Text style={styles.reportText}>User Reported</Text>
                </View>
                <View
                  style={{
                    marginTop: 50,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <GradientButton
                    onPress={() => {
                      this.btnPressed();
                    }}
                    text="Okay"
                    gradientStyle={styles.reportGradientStyle}
                    buttonStyle={styles.reportButton}
                    btnTextStyle={styles.reportBtnText}
                  />
                </View>
              </View>
            ) : null}
            {
              this.state.spinner ?
                <View style={{ padding: 10 }}>
                  <Spinner />
                </View>
                : null
            }
            {this.state.others && !this.state.options && (this.state.spinner === false) ? (
              <View style={{ padding: 10 }}>
                <View>
                  <Text style={styles.reportText}>Report User</Text>
                </View>
                <View>
                  <Text style={styles.descText}>
                    Is this person bothering you? Tell us what they did.
                  </Text>
                </View>
                <Form>
                  <Item floatingLabel>
                    <Label>Enter Reason</Label>
                    <Input />
                  </Item>
                </Form>
                <View
                  style={{
                    marginTop: 50,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <GradientButton
                    onPress={() => {
                      this.btnPressed();
                    }}
                    text="Report user"
                    gradientStyle={styles.reportGradientStyle}
                    buttonStyle={styles.reportButton}
                    btnTextStyle={styles.reportBtnText}
                  />
                </View>
              </View>
            ) : null}
            <Loader loading={loading} />
          </View>
        </View>
      </Modal>
    );
  }
}

export default ReportUser;
