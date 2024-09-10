'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const envalid = require('envalid');
const { makeValidator } = envalid;
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const nonEmptyString = makeValidator((input) => {
	if (typeof input === 'string' && input !== '') {
		return input;
	}

	throw new Error(`Not a non-empty string: '${input}'`);
});

const stringifyKeys = (obj) => (sum, key) =>
	Object.assign({}, sum, { [key]: JSON.stringify(obj[key]) });

const PUBLIC_PATH = '/';

module.exports = function (opts) {
	const { platform } = opts;
	const IS_BROWSER = platform === 'browser';
	const IS_SERVER = platform === 'node';

	/*
    ENVIRONMENT VARIABLES
  */

	const { str } = envalid;
	const env = envalid.cleanEnv(
		process.env,
		Object.assign(
			{
				NODE_ENV: str({
					choices: ['production', 'development'],
					default: 'development',
				}),
				API_BASE_URL: str({ default: 'not provided' }),
				SPA_BASE_URL: nonEmptyString(),
			},
			IS_BROWSER
				? { STATIC_ROOT: str({ default: 'not provided' }) }
				: { INTERNAL_API_BASE_URL: str({ default: 'not provided' }) }
		),
		{ strict: true }
	);

	/*
    PLUGINS
  */

	const plugins = [];

	if (IS_BROWSER) {
		plugins.push(
			new webpack.DefinePlugin({
				'process.env': ['NODE_ENV', 'API_BASE_URL', 'SPA_BASE_URL'].reduce(
					stringifyKeys(env),
					{}
				),
			}),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// all options are optional
				filename: '[name].css',
				chunkFilename: '[id].css',
				ignoreOrder: false, // Enable to remove warnings about conflicting order
			}),
			new HtmlWebpackPlugin({
				favicon: './src/assets/favicon.ico',
				filename: '_index.html',
				template: './src/assets/template.html',
			}),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [{
          urlPattern: /[\s\S]*/,
          handler: 'NetworkFirst'
        }]
      }),
      new CopyWebpackPlugin({
        patterns: [
          //{ from: './src/assets/Favicon.png'},
          { from: './src/assets/manifest.json'}
        ]
      })
		);
	}

	/*
    RULES
  */

	const jsxRule = {
		test: /\.(tsx?|jsx?)$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env', '@babel/preset-typescript'],
			},
		},
	};

	const cssRule = Object.assign(
		{
			test: /\.css$/,
		},
		IS_BROWSER
			? {
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {},
						},
						'css-loader',
					],
				}
			: { loader: 'css-loader/locals' }
	);

	const filesRule = {
		test: /\.(png|svg|gif|jpe?g)$/,
		type: 'asset/resource',
		generator: {
			filename: '[name].[hash:6].[ext]',
			publicPath: PUBLIC_PATH + 'images/',
			outputPath: 'images/',
			emit: IS_BROWSER,
		},
	};

	/*
    CONFIG
  */

	const config = {
		mode: process.env.NODE_ENV,
		entry: IS_BROWSER ? './src/client.tsx' : './src/server.ts',
		devtool: env.isProduction
			? 'cheap-module-source-map'
      : 'eval-cheap-module-source-map',
		output: {
			path: IS_BROWSER ? env.STATIC_ROOT : path.resolve(__dirname, 'bin'),
			publicPath: PUBLIC_PATH,
			filename: IS_BROWSER ? '[name].[chunkhash].js' : 'www',
			library: {
				name: 'ProjectLib',
				type: IS_BROWSER ? 'var' : 'commonjs2',
			},
		},
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin()],
		},
		target: IS_BROWSER ? 'web' : 'node',
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin({})],
			modules: [path.resolve(__dirname, 'src'), 'node_modules'],
		},
		module: {
			rules: [jsxRule, cssRule, filesRule],
		},
		plugins,
	};

	if (IS_SERVER) {
		Object.assign(config, {
			node: { __dirname: false, __filename: false },
			externals: [nodeExternals()],
		});
	}

	return config;
};
