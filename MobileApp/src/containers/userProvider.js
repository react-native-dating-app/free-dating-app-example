import React from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import { GET_USER_QUERY } from "./../graphql/query";
import { UPDATE_USER_LOCAL_MUTATION } from "./../graphql/mutation";

const UserProvider = ({
  data: { user, loading, error },
  renderLoading,
  renderError,
  render,
  updateUserData
}) => {
  const updateUser = ({ id }) => {
    if (id) {
      updateUserData({
        variables: {
          id
        }
      });
    }
  };
  if (loading) {
    return renderLoading();
  }
  if (error || !user) {
    return renderError(error);
  }
  updateUser(user);
  return render(user);
};
UserProvider.propTypes = {
  render: PropTypes.func.isRequired,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func
};
UserProvider.defaultProps = {
  renderLoading: () => null,
  renderError: () => null
};

const defaultPayload = `
  id
  name
`;
export default props =>
  React.createElement(
    compose(
      graphql(GET_USER_QUERY(props.payload || defaultPayload)),
      graphql(UPDATE_USER_LOCAL_MUTATION, {
        name: "updateUserData"
      })
    )(UserProvider),
    props
  );
