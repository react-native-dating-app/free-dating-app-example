// stable
import React, { Component } from 'react';
import { AppRegistry, View, PermissionsAndroid, StyleSheet } from 'react-native';
import { Root } from 'native-base';
import { Text } from 'native-base';
import { Sentry } from 'react-native-sentry';
import { ApolloProvider } from 'react-apollo';
import { Toast } from 'native-base';
import Modal from 'react-native-modalbox';
import SplashScreen from 'react-native-splash-screen';
import CodePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import I18n from 'react-native-i18n';
import AppNavigator from './src/appNavigator';
import configureClient, { getToken } from './configureClient';
import ProgressBar from './src/components/progressBar/progressBar';
import messages from './assets/i18n';
import 'babel-polyfill';

async function requestLocationPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
			title: 'Dating app location Permission',
			message: 'Dating app needs access to your location ' + 'so you can find a perfect match.'
		});
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			// Do something if permission is granted
		} else {
			Toast.show({
				text: 'Please grant permission to access your location',
				position: 'bottom',
				type: 'warning',
				duration: 1000
			});
		}
	} catch (err) {
		// Not able to acquire location information
	}
}

const client = configureClient();

/*
Here you can set In App Focus Behavior of one signal notifications
0 = None - (Default) Will not display a notification, instead only onNotificationReceived will fire where you can display your own in app messages.
1 = InA - Will display an AndroiDialog with the message contains.
2 = Notification - Notification will display in the Notification Shade. Same as when the app is not in focus.
**/

OneSignal.inFocusDisplaying(0);

console.disableYellowBox = true;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialRouteName: 'Onboard',
			loading: true,
			isUserLoggedIn: false,
			showDownloadingModal: false,
			showInstalling: false,
			downloadProgress: 0
		};
	}
	async componentWillMount() {
		try {
			await requestLocationPermission();
			const token = await getToken();
			if (token) {
				this.setState({
					initialRouteName: 'Home',
					loading: false,
					isUserLoggedIn: true
				});
			} else {
				this.setState({
					loading: false
				});
			}
			SplashScreen.hide();
		} catch (e) {
			this.setState({
				loading: false
			});
			SplashScreen.hide();
		}
	}
	componentDidMount() {
		CodePush.sync(
			{ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE },
			status => {
				switch (status) {
					case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
						this.setState({ showDownloadingModal: true }, () => {
							this._modal.open();
						});
						break;
					case CodePush.SyncStatus.INSTALLING_UPDATE:
						this.setState({ showInstalling: true });
						break;
					case CodePush.SyncStatus.UPDATE_INSTALLED:
						this._modal.close();
						break;
					default:
						this._modal.close();
						this.setState({ showDownloadingModal: false });
						break;
				}
			},
			({ receivedBytes, totalBytes }) => {
				this.setState({ downloadProgress: receivedBytes / totalBytes * 100 });
			}
		);
	}

	render() {
		if (this.state.loading) {
			return <View />;
		}
		if (this.state.showDownloadingModal) {
			return (
				<View
					style={{
						flex: 1
					}}
				>
					<Modal
						style={[styles.modal, styles.modal1]}
						backdrop={false}
						ref={c => {
							this._modal = c;
						}}
						swipeToClose={false}
					>
						<View
							style={{
								flex: 1,
								alignSelf: 'stretch',
								justifyContent: 'center',
								padding: 20
							}}
						>
							{this.state.showInstalling ? (
								<Text
									style={{
										textAlign: 'center',
										marginBottom: 15,
										fontSize: 15
									}}
								>
									Installing update...
								</Text>
							) : (
								<View
									style={{
										flex: 1,
										alignSelf: 'stretch',
										justifyContent: 'center',
										padding: 20
									}}
								>
									<Text
										style={{
											textAlign: 'center',
											marginBottom: 15,
											fontSize: 15
										}}
									>
										Downloading update... {`${parseInt(this.state.downloadProgress, 10)} %`}
									</Text>
									<ProgressBar progress={parseInt(this.state.downloadProgress, 10)} />
								</View>
							)}
						</View>
					</Modal>
				</View>
			);
		}
		return (
			<ApolloProvider client={client}>
				<Root>
					<AppNavigator initialRouteName={this.state.initialRouteName} />
				</Root>
			</ApolloProvider>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: null,
		height: null
	},
	modal: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal1: {
		flex: 1
	}
});

I18n.translations = messages;
I18n.fallbacks = true;
// Sentry.config('https://YOUR_DNS@sentry.io/292546').install();

AppRegistry.registerComponent('DatingApp', () => App);
