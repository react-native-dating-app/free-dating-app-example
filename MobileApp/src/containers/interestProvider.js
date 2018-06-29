// stable
import PropTypes from "prop-types";
import React from "react";
import { GET_INTEREST_QUERY } from "../graphql/query";
import { graphql } from "react-apollo";

const InterestProvider = ({ data, render }) => {
  return render(data);
};

InterestProvider.propTypes = {
  render: PropTypes.func.isRequired
};

export default props =>
  React.createElement(
    graphql(GET_INTEREST_QUERY, {
      options: {
        variables: {
          startsWith: props.startsWith,
          limit: props.limit,
          selectedIds: props.selectedIds || []
        }
      }
    })(InterestProvider),
    props
  );
