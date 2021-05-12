const path = require('path');

const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? 'source-map' : 'eval-source-map',
	entry: './src/index.tsx',
	output: {
		filename: 'js/[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		// needed to avoid the hash changing when it should not
		// https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching#webpack_runtime_code
		runtimeChunk: 'multiple',
		splitChunks: {
			// all so not only dynamic imports are considered
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				npm: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// split at the package or scope level
						const directories = module.context.split(path.sep);
						const name = directories[directories.lastIndexOf('node_modules') + 1];

						return `npm.${name}`;
					},
				},
			},
		},
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
						},
					},
				],
			},
			{
				test: /\.(?:fnt)$/,
				use: [
					{
						loader: 'extract-loader',
						options: {
							publicPath: '../',
						},
					},
					{ loader: 'ref-loader' },
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
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
	plugins: [
		new EnvironmentPlugin({
			'SENTRY_DSN': null,
		}),
		new MiniCssExtractPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/index.ejs',
			// https://github.com/jantimon/html-webpack-plugin/tree/0a6568d587a82d88fd3a0617234ca98d26a1e0a6/examples/custom-insertion-position
			// inject has to be false because we add the headTags and bodyTags manually in ejs (to position them in the best spot)
			inject: false,
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist/'),
		compress: true,
		liveReload: false, // prevent the fucker from stealing the focus
		host: '0.0.0.0',
	},
};
