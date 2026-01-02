// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
//const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = { 
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},  
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			},
		},
		{
			test:/\.scss$/,
			exclude: /node_modules/,
			use: ["style-loader","css-loader","sass-loader"],
		}
		],  
	},  
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
		}), 
		new webpack.ProvidePlugin({
			'React': 'react',
		}),
/*  		new BundleAnalyzerPlugin({
		    // use value from environment var STATS or 'disabled'
		    analyzerMode: 'disabled',
		    generateStatsFile: true
		}),*/
	],  
	devServer: {
		static: path.join(__dirname, 'public'),
		port: 3000,
		open: true,
		historyApiFallback:{index:'/'},
		proxy: [
			{
				context: ['/api','/actions'],
				target:'http://192.168.11.103',
				secure:false
			},
		],
	},
	//externals: {
	//	'react': 'React'
	//}
	//  resolve: {
	//	extensions: ['.scss'],
	//	modules:['src'],
	//  }
};
