// stable
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { AUTH_TOKEN } from '../../constants';
import './styles.scss';

class TopNav extends Component {
	state = {
		headerLarge: false,
		mobconttoggle: false
	};
	toggleHeader = () => {
		const { onUpdateClasses } = this.props;
		this.setState({ headerLarge: !this.state.headerLarge }, () => onUpdateClasses());
	};
	handleLogout = () => {
		const { history } = this.props;
		history.push('/login');
		localStorage.removeItem(AUTH_TOKEN);
	};
	render() {
		const { headerLarge } = this.state;
		const { onUpdateMobToggle } = this.props;
		return (
			<nav className="navbar navbar-fixed-top topNavbar">
				<div className="navbar-header navbarHeader">
					<button
						type="button"
						className="navbar-toggle"
						onClick={() => onUpdateMobToggle()}
						target="myNavbar"
					>
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar" />
						<span className="icon-bar" />
						<span className="icon-bar" />
					</button>
					<div className="navbar-brand navbarBrand">
						<button
							onClick={this.toggleHeader}
							className="navbarBrand-bars-button"
							style={{
								backgroundColor: 'transparent',
								borderWidth: 0,
								outline: 0
							}}
						>
							<FontAwesome
								className="barsIcon"
								name="bars"
								size="2x"
								style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
							/>
						</button>
					</div>
				</div>

				<div className="navbarHead">
					<div
						id="myNavbar"
						className={classNames(
							'collapse',
							'navbar-collapse',
							'navbarCollapse',
							headerLarge ? 'nav-bar-large-collapse' : null
						)}
					>
						<span className="componentTitle">
							<FormattedMessage id={'dating_app'} defaultMessage={'Dating App'} />
						</span>
						<ul className={'nav navbar-nav pull-right navbar-right pullRight ulNavbar'}>
							<NavDropdown
								id="dropDown4"
								className="navbarProfile"
								eventKey={4}
								title={
									<span>
										<FontAwesome
											className="userIcon"
											name="user-circle"
											size="2x"
											style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
										/>
										<span className={'hidden-sm topnavAdminName'}>
											<FormattedMessage id={'admin'} defaultMessage={'Admin'} />
										</span>
									</span>
								}
							>
								<MenuItem className="dropdownLogout" onClick={this.handleLogout}>
									<FormattedMessage id={'logout'} defaultMessage={'Logout'} />
								</MenuItem>
							</NavDropdown>
						</ul>
					</div>
					<ul className="nav navbar-nav pull-right ulNavbar hidd" style={{ marginTop: 8 }}>
						<NavDropdown
							id="navDropDown11"
							eventKey={4}
							title={
								<span>
									<FontAwesome
										className="userIcon11"
										name="user-circle"
										size="2x"
										style={{
											textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
											color: '#fff',
											marginTop: 11
										}}
									/>
								</span>
							}
							noCaret
							className="dropdown admin-dropdown dropdown"
						>
							<MenuItem onClick={this.handleLogout}>
								<FormattedMessage id={'logout'} defaultMessage={'Logout'} />
							</MenuItem>
						</NavDropdown>
					</ul>
				</div>
			</nav>
		);
	}
}
TopNav.propTypes = {
	onUpdateClasses: PropTypes.func,
	onUpdateMobToggle: PropTypes.func
};
export default withRouter(TopNav);
