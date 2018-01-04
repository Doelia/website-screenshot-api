const GraphQLClient = require('graphql-request').GraphQLClient;

module.exports = (token) => {
	token = token || process.env.GRAPHQL_TOKEN;
	return new GraphQLClient(process.env.GRAPHQL_ENDPOINT, {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	});
};
