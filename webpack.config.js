const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/pages/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	module: {
  	rules: [
    	{
      test	: /\.m?js$/,
      	exclude: /(node_modules)/,
      	use: {
        	loader: 'babel-loader',
      	}
    	},
    	{
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
  	]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin(),
	]
};