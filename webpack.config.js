var webpack = require("webpack");

module.exports = {
	entry: './editor/src/js/main.js',
	output: {
		path: './editor/dist/js/',
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