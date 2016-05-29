var webpack = require("webpack");

module.exports = {
	entry: './js/main.js',
	output: {
		path: './dist',
		filename: 'main.bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		}),
	]
};