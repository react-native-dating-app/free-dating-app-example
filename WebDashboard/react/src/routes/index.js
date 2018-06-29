import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Users from '../routes/users';
import Login from '../routes/login';
import Settings from '../routes/settings';
import Layout from '../components/Layout/index.js';
import Dashboard from '../routes/dashboard';

const RouteWithLayout = ({ children }) => <Layout>{children}</Layout>;
const Routes = () => (
	<Router>
		<div>
			<Route
				exact
				path="/users"
				render={() =>
					!localStorage.getItem('graphcool-auth-token') ? (
						<Redirect from="/users" to="/login" />
					) : (
						<RouteWithLayout>
							<Users />
						</RouteWithLayout>
					)}
			/>
			<Route exact path="/login" component={Login} />
			<Route
				exact
				path="/settings"
				render={() =>
					!localStorage.getItem('graphcool-auth-token') ? (
						<Redirect from="/settings" to="/login" />
					) : (
						<RouteWithLayout>
							<Settings />
						</RouteWithLayout>
					)}
			/>
			<Route
				exact
				path="/"
				render={() =>
					!localStorage.getItem('graphcool-auth-token') ? (
						<Redirect from="/" to="/login" />
					) : (
						<RouteWithLayout>
							<Dashboard />
						</RouteWithLayout>
					)}
			/>
		</div>
	</Router>
);
export default Routes;
