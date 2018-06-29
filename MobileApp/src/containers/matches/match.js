// stable
import React from "react";
import PropTypes from "prop-types";
import { List, Button, Icon } from "native-base";
import { ListView } from "react-native";
import MatchListItem from "./matchItem";

const Match = props => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const { matches, onDeleteMatch, userId, onPress } = props;
  return (
    <List
      dataSource={ds.cloneWithRows(matches)}
      renderRow={data => {
        return (
          <MatchListItem
            userId={userId}
            onPress={() => onPress(data)}
            matchData={data}
          />
        );
      }}
      disableRightSwipe={true}
      renderRightHiddenRow={data => (
        <Button
          full
          style={{ backgroundColor: "#865EF8" }}
          onPress={() => onDeleteMatch(data)}
        >
          <Icon active name="trash" />
        </Button>
      )}
      leftOpenValue={75}
      rightOpenValue={-90}
    />
  );
};

Match.defaultProps = {
  onDeleteMatch: () => {},
  onPress: () => {}
};
Match.propTypes = {
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      target: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        averageAge: PropTypes.number,
        recentMessage: PropTypes.string
      })
    })
  ),
  onDeleteMatch: PropTypes.func,
  onPress: PropTypes.func,
  userId: PropTypes.string
};

export default Match;
