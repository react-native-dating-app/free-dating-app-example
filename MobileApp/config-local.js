// stable

// Environment variables
const Environments = {
	devlopment: {
		FILE_HOST: 'https://api.graph.cool/file/v1/YOUR_PROJECT_ID',
		API_HOST: 'https://api.graph.cool/simple/v1/YOUR_PROJECT_ID',
		SOCKS_HOST: 'wss://subscriptions.graph.cool/v1/YOUR_PROJECT_ID',
		DEFAULT_LOCALE: 'en-GB'
	},
	production: {
		FILE_HOST: 'https://api.graph.cool/file/v1/YOUR_PROJECT_ID',
		API_HOST: 'https://api.graph.cool/simple/v1/YOUR_PROJECT_ID',
		SOCKS_HOST: 'wss://subscriptions.ap-northeast-1.graph.cool/v1/YOUR_PROJECT_ID',
		DEFAULT_LOCALE: 'en-GB'
	}
};
/**
 * Here you can set the type of environment ( default set to devlopment )
 */
function getEnvironment() {
	const platform = 'devlopment';
	return Environments[platform];
}
const Environment = getEnvironment();

module.exports = Environment;
