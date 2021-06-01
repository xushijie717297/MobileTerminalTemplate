const path = require("path");
const BaseUrl = require("./src/axios/config.js");
const resolve = function(dir) {
    return path.join(__dirname, dir);
};
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
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    },
    css: {
		// 启用 CSS modules
		modules: false,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			css: {},
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
        // proxy: {
        //     '/api': {
        //         // target: 'http://121.40.242.176:11001/api/Questionnaire/', //API服务器的地址
        //         target: 'https://www.wealion.cn', //API服务器的地址
        //         ws: true, //代理websockets
        //         changeOrigin: true, // 虚拟的站点需要更管origin
        //         pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
        //             '^/api': ''
        //         }
        //     }
        // }
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