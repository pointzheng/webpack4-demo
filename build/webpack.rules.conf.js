const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const rules = [{
		test: /\.(css|scss|sass)$/,
		use: [
			devMode ? 'style-loader' : {
				loader: MiniCssExtractPlugin.loader,
				options: {
					// you can specify a publicPath here
					// by default it use publicPath in webpackOptions.output
					publicPath: '../'
				}
			},
			'css-loader',
			'postcss-loader',
			'sass-loader',
		]
	},
	{
		test: /\.js|\.jsx$/,
		use: [{
			loader: "babel-loader",
			options: {
				presets: ['@babel/preset-env'],
				// presets: [['@babel/preset-env', {
        //   targets: {
        //     browsers: ['>1%', 'last 2 versions']
        //     // chrome: '52'
        //   }
        // }]]
			},
			// options: {
			//            presets: ['@babel/preset-env'],
			//           plugins: [require('@babel/plugin-transform-object-rest-spread')]
			//         }
		}],
		// 不检查node_modules下的js文件
		// exclude: "/node_modules/"
	}, {
		test: /\.(png|jpg|gif)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
				// 图片文件输出的文件夹
				outputPath: "images"
			}
		}]
	},
	{
		test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: 10000,
		}
	},
	{
		test: /\.html$/,
		// html中的img标签
		use: ["html-withimg-loader"]
	}, {
		test: /\.less$/,
		use: [
			devMode ? 'style-loader' : {
				loader: MiniCssExtractPlugin.loader,
				options: {
					// you can specify a publicPath here
					// by default it use publicPath in webpackOptions.output
					publicPath: '../'
				}
			},
			'css-loader',
			'postcss-loader',
			'less-loader',
		]
	},
];
module.exports = rules;
