// stable
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Header from '../Header';
import Sidebar from '../Sidebar';
import './style.scss';

class Layout extends Component {
	state = {
		containerLarge: false,
		sidelarge: false,
		mobconttoggle: false
	};
	onUpdateClasses = () => {
		this.setState({
			sidelarge: !this.state.sidelarge,
			containerLarge: !this.state.containerLarge
		});
	};

	onUpdateMobToggle = () => {
		this.setState({
			mobconttoggle: !this.state.mobconttoggle
		});
	};

	render() {
		const { children } = this.props;
		const { containerLarge, sidelarge, mobconttoggle } = this.state;
		return (
			<div className={classNames('dashboard-page', mobconttoggle ? 'push-right' : null)}>
				<Sidebar sidelarge={sidelarge} />
				<Header onUpdateClasses={this.onUpdateClasses} onUpdateMobToggle={this.onUpdateMobToggle} />
				<section id="bodyContainer" className={classNames('uiView', containerLarge ? 'body-cont-large' : null)}>
					{children}
				</section>
			</div>
		);
	}
}

export default withRouter(Layout);
