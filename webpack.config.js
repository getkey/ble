const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'cheap-eval-source-map',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
		],
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src/'),
		},
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/index.ejs',
	})],
};
