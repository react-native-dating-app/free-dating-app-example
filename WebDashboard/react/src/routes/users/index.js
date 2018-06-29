import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';
import { USER_SUBSCRIPTION, FEED_USERS } from './graphql';
import ErrorHandler from '../../components/errorHandler';

class Users extends Component {
	state = {
		menuActive: false
	};

	componentDidMount() {
		const { User } = this.props;
		User.subscribeToMore({
			document: USER_SUBSCRIPTION,
			updateQuery: (previousState, { subscriptionData }) => {
				let newData = subscriptionData.data.User.node;
				let oldData = [];
				for (var i = 0, len = previousState.allUsers.length; i < len; i++) {
					oldData[i] = {};
					for (var prop in previousState.allUsers[i]) {
						oldData[i][prop] = previousState.allUsers[i][prop];
					}
				}
				let obj = oldData.find(function(obj) {
					return obj.id === newData.id;
				});
				obj.gender = newData.gender;
				obj.active = newData.active;
				obj.deleted = newData.deleted;
				obj.averageAge = newData.averageAge;
				obj.name = newData.name;
				obj.email = newData.email;
				obj.role = newData.role;
				return {
					allUsers: oldData
				};
			}
		});
	}

	toggleMenu() {
		let menuState = !this.state.menuActive;
		this.setState({
			menuActive: menuState
		});
	}
	render() {
		const { User } = this.props;
		if (User.error) {
			return <ErrorHandler error={User.error} />;
		}
		if (User.loading) {
			return null;
		} else {
			return <UserList User={User} />;
		}
	}
}

export default withRouter(graphql(FEED_USERS, { name: 'User' })(Users));
