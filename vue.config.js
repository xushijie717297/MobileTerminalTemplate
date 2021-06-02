const path = require("path");
const BaseUrl = require("./src/axios/config.js");
const resolve = function(dir) {
    return path.join(__dirname, dir);
};
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ['production', 'development'].includes(process.env.NODE_ENV);
const IP = require("ip").address();
module.exports = {
    publicPath: "/", //process.env.NODE_ENV === "production" ? "./" : "./",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: true, // 是否开启eslint保存检测
    productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@v", resolve("src/views"))
            .set("@c", resolve("src/components"))
            .set("@u", resolve("src/utils"))
            .set("@s", resolve("src/service")); /* 别名配置 */
        config.optimization.runtimeChunk("single");
        config.resolve.symlinks(true)
        // 打包分析
        // 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            // 压缩图片
            config.module
              .rule("images")
              .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
              .use("image-webpack-loader")
              .loader("image-webpack-loader")
              .options({
                mozjpeg: { progressive: true, quality: 65 },
                optipng: { enabled: false },
                pngquant: { quality: [0.65, 0.90], speed: 4 },
                gifsicle: { interlaced: false }
              });
      
            // 打包分析
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
              {
                analyzerMode: "static"
              }
            ]);
          }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        const plugins = [];
        if (IS_PROD) {
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
        }
        config.plugins = [...config.plugins, ...plugins];
    },
    css: {
		// 启用 CSS modules
		modules: false,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			css: {},
            less: {
                globalVars: {
                  hack: `true; @import '~@/styles/index.less';`
                }
            },
			postcss: {
				plugins: [
					//remUnit这个配置项的数值是多少呢？？？ 通常我们是根据设计图来定这个值，原因很简单，便于开发。
					//假如设计图给的宽度是750，我们通常就会把remUnit设置为75，这样我们写样式时，可以直接按照设计图标注的宽高来1:1还原开发。
					require('postcss-px2rem')({
						remUnit: 37.5
					})
				]
			}
		},
	},
    devServer: {
        disableHostCheck:true, //webpack4.0 开启热更新
        // host: "localhost",
        host: IP,
        port: "8080",
        hot: true,
        /* 自动打开浏览器 */
        open: false,
        overlay: {
            warning: false,
            error: true,
        },
        /* 跨域代理 */
        proxy: {
            [BaseUrl.ROOT]: {
                target: BaseUrl.URL,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    [`^${BaseUrl.ROOT}`]: "/"
                }
            }
        }
    }

};