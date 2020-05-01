const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? false : 'eval-source-map',
	entry: './src/index.tsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(?:svg|fnt|png)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets',
							name: (resourcePath) => {
								// this is referenced in the fnt file so it can't move
								if (resourcePath === path.join(__dirname, 'static/font/ps2p_0.png')) {
									return '[name].[ext]';
								}

								return '[contenthash].[ext]';
							},
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									useBuiltIns: 'usage',
									corejs: 3,
								}],
								'@babel/preset-react',
							],
						},
					},
					'ts-loader',
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src/'),
			static: path.resolve(__dirname, 'static/'),
		},
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/index.ejs',
	})],
	devServer: {
		contentBase: path.join(__dirname, 'dist/'),
		compress: true,
		liveReload: false, // prevent the fucker from stealing the focus
		host: '0.0.0.0',
	},
};
