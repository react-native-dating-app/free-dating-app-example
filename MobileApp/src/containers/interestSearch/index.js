//stable
import React, { Component } from "react";
import _ from "lodash";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Text, Item, Icon, Input, ListItem, Spinner, Button } from "native-base";
import { View, FlatList, Modal, Keyboard } from "react-native";
import PropTypes from "prop-types";
import InterestProvider from "../interestProvider";
import Loader from "../../components/loader";
import Header from "../../components/header";
import MIcon from "../../components/icon";
import RenderTag from "../../components/renderTag";
import { GET_INTEREST_QUERY } from "../../graphql/query";
import styles from "./styles";

class InterestSearch extends Component {
  state = {
    modalVisible: false,
    searchInput: "",
    loading: false,
    createTagError: false
  }
  interests = []
  componentDidMount() {
    const { getReference } = this.props;
    getReference(this);
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
  handleText = text => {
    this.setState({
      searchInput: text.trim(),
      createTagError: false
    });
  }
  renderItem = ({ item, index }) => {
    return (
      <ListItem onPress={() => this.addInterest(item)}>
        <Item style={styles.addIcon}>
          <MIcon family="FontAwesome" name="plus" style={styles.addIconStyle} />
        </Item>
        <Text style={styles.listText}>{item.name}</Text>
      </ListItem>
    );
  }
  isPresentInExisting = () => {
    return _.find(
      this.interests,
      interest =>
        interest.name.toLowerCase() ===
        this.state.searchInput.trim().toLowerCase()
    );
  }
  clearText = () => {
    this.setState({
      searchInput: "",
      loading: false,
      createTagError: false
    });
  }
  createTag = async () => {
    if (this.state.searchInput.length > 2) {
      const { mutate } = this.props;
      const isPresentInExisting = this.isPresentInExisting();
      if (isPresentInExisting) {
        this.addInterest(isPresentInExisting);
        this.clearText();
      } else {
        try {
          this.setState({
            loading: true
          });
          const res = await mutate({
            variables: {
              name: this.state.searchInput
            }
          });
          const interest = {
            id: _.get(res, "data.createInterest.id"),
            name: _.get(res, "data.createInterest.name")
          };
          this.addInterest(interest);
          this.clearText();
        } catch (err) {
          const mutationErrors = JSON.parse(JSON.stringify(err));
          if (
            _.get(mutationErrors, "graphQLErrors") &&
            mutationErrors.graphQLErrors.some(
              errObj =>
                errObj.code == 3010 && errObj.path.includes("createInterest")
            )
          ) {
            // Handle duplicate tag name
            try {
              const tagData = await this.context.client.query({
                query: GET_INTEREST_QUERY,
                variables: {
                  name: this.state.searchInput
                }
              });
              const interest = {
                id: _.get(tagData, "data.allInterests[0].id"),
                name: _.get(tagData, "data.allInterests[0].name")
              };
              this.addInterest(interest);
              this.clearText();
            } catch (e) {
              this.setState({
                loading: false,
                createTagError: "Something went wrong."
              });
            }
          } else {
            this.setState({
              loading: false,
              createTagError: "Something went wrong."
            });
          }
        }
      }
    } else {
      this.setState({
        createTagError: "Enter minimum three characters."
      });
    }
  }
  addInterest = interest => {
    const { onChange, selectedTags } = this.props;
    const isPresent = _.find(selectedTags, o => o.id === interest.id);
    if (!isPresent) {
      Keyboard.dismiss();
      onChange([interest].concat(selectedTags));
      this.clearText();
    }
  }
  render() {
    const { selectedTags, onChange } = this.props;
    const { modalVisible, searchInput, loading, createTagError } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => this.close()}
      >
        <View>
          <Header
            title="Select Interests"
            right={
              <Button style={styles.doneButton} onPress={() => this.close()}>
                <Text uppercase={false} style={styles.doneText}>
                  Done
                </Text>
              </Button>
            }
          />
          <View style={{ padding: 10 }}>
            <RenderTag
              tags={selectedTags}
              remove={true}
              onSelectTag={tag =>
                onChange(_.filter(selectedTags, o => o.id !== tag.id))
              }
            />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Item style={{ flex: 1 }}>
                <Icon
                  name="ios-search"
                  style={[styles.closeIcon, { marginLeft: 12 }]}
                />
                <Input
                  maxLength={15}
                  value={searchInput}
                  onChangeText={text => this.handleText(text)}
                  placeholder="Search"
                  placeholderTextColor="#888"
                  style={styles.input}
                />
                {
                  <Button
                    onPress={() => this.createTag()}
                    style={styles.addButton}
                  >
                    <Text style={styles.addText}>Add</Text>
                  </Button>
                }
              </Item>
            </View>
            <InterestProvider
              startsWith={searchInput.toLowerCase()}
              limit={5}
              selectedIds={selectedTags.map(item => item.id)}
              render={({ allInterests, error, loading }) => {
                this.interests = allInterests;
                if (error || createTagError) {
                  return (
                    <View style={styles.errorView}>
                      <Text style={styles.errorText}>
                        {createTagError || "Unable to fetch interests"}
                      </Text>
                    </View>
                  );
                }
                if (loading) {
                  return <Spinner />;
                }
                if (!loading && !this.interests.length && searchInput) {
                  return (
                    <View style={styles.noInterests}>
                      <Text style={styles.noMoreInterests}>
                        No interest found with this name
                      </Text>
                    </View>
                  );
                }
                if (!this.interests.length) {
                  return (
                    <View style={styles.noInterests}>
                      <Text style={styles.noMoreInterests}>
                        That's all folks
                      </Text>
                    </View>
                  );
                }
                return (
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    data={this.interests}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.id}
                  />
                );
              }}
            />
          </View>
        </View>
        <Loader loading={loading} />
      </Modal>
    );
  }
}

InterestSearch.propTypes = {
  selectedTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  getReference: PropTypes.func
};

InterestSearch.contextTypes = {
  client: PropTypes.any
};

const CREATE_INTEREST_MUTATION = gql`
  mutation createInterest($name: String!) {
    createInterest(name: $name) {
      id
      name
    }
  }
`;

export default graphql(CREATE_INTEREST_MUTATION)(InterestSearch);
