// stable
import React, { PureComponent } from 'react';
import { WebView } from 'react-native';
import { Container, Spinner, Toast } from 'native-base';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import Header from '../../components/header';
import { UPDATE_USER_MUTATION } from './../../graphql/mutation';

const instaCliendId = 'YOUR_INSTAGRAM_CLIENT_ID';
const spotifyClientId = 'YOUR_SPOTIFYY_CLIENT_ID';
const redirectUrl = 'https://geekyants.com/';
const instaUrl = `https://instagram.com/oauth/authorize/?client_id=${instaCliendId}&redirect_uri=${redirectUrl}&response_type=token`;
const spotifyUrl = `https://accounts.spotify.com/authorize/?client_id=${spotifyClientId}&redirect_uri=${redirectUrl}&response_type=token&expires_in=86400&state=123&scope=user-follow-read%20`;

export async function getInstaAboutMe(instaToken) {
	try {
		const responseData = await fetch(`https://api.instagram.com/v1/users/self/?access_token=${instaToken}`);
		const resJSON = await responseData.json();
		const data = _.get(resJSON, 'data', null);
		return _.get(data, 'username', null);
	} catch (e) {
		return null;
	}
}

export async function getInstaPictures(instaToken) {
	try {
		const responseData = await fetch(
			`https://api.instagram.com/v1/users/self/media/recent/?access_token=${instaToken}&count=10`,
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		const resJSON = await responseData.json();
		const data = _.get(resJSON, 'data', []);
		const images = data.map(imageData => imageData.images.standard_resolution.url);
		return images;
	} catch (e) {
		return null;
	}
}

class SocialLogin extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { currentUrl: '', isLoading: true };
		this.onBack = this.onBack.bind(this);
		this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
	}

	async onNavigationStateChange(navState) {
		const { navigation, mutate } = this.props;
		const onError = navigation.getParam('onError');
		const userId = _.get(navigation, 'state.params.userId');
		this.setState({ isLoading: navState.loading }, async () => {
			const isInstaTokenFetched = navState.url.search('https://geekyants.com/#access_token=');
			let token = null;
			if (isInstaTokenFetched !== -1) {
				token = navState.url.replace('https://geekyants.com/#access_token=', '').trim();
				if (token) {
					try {
						const instaUserName = await getInstaAboutMe(token);
						const instaPictures = await getInstaPictures(token);

						if (instaUserName && instaPictures) {
							await mutate({
								variables: {
									id: userId,
									instaPictures,
									instaUserName
								}
							});
							Toast.show({
								text: 'images synced successfully',
								position: 'bottom',
								type: 'success',
								duration: 1000
							});
							return navigation.goBack();
						} else {
							throw new Error();
						}
					} catch (e) {
						Toast.show({
							text: 'Not able to sync insta account',
							position: 'bottom',
							type: 'warning',
							duration: 1000
						});
						onError();
						return navigation.goBack();
					}
				}
			}

			this.setState({ currentUrl: navState.url });
		});
	}

	onBack() {
		const { currentUrl } = this.state;
		const { navigation } = this.props;
		const isUrl = currentUrl.search('geekyants');
		if (isUrl !== -1) {
			return navigation.goBack();
		}
		this.WEBVIEW_REF.goBack();
	}

	render() {
		const { navigation } = this.props;
		const { isLoading } = this.state;
		const onError = navigation.getParam('onError');

		return (
			<Container style={{ flex: 1 }}>
				<Header
					backButton
					title="Connect"
					onPressBack={() => {
						navigation.goBack();
						onError();
					}}
				/>
				<WebView
					ref={c => {
						this.WEBVIEW_REF = c;
					}}
					style={{ flex: 1 }}
					onNavigationStateChange={this.onNavigationStateChange.bind(this)}
					source={{
						uri: _.get(navigation, 'state.params.name') === 'instagram' ? instaUrl : spotifyUrl
					}}
					onError={() => {
						Toast.show({
							text: 'Error in loading WebView..Please try again',
							position: 'bottom',
							duration: 1000
						});
						onError();
						return navigation.goBack();
					}}
				/>
				{isLoading && <Spinner />}
			</Container>
		);
	}
}

SocialLogin.defaultProps = {
	onSuccess: () => {},
	onError: () => {}
};

export default graphql(
	UPDATE_USER_MUTATION(`
id
`)
)(SocialLogin);
