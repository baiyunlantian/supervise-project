const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { PRO_PROXY, DEV_PROXY} = require("./src/request/proxy");
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
    publicPath: '/', // 默认'/'，部署应用包时的基本 URL
    outputDir: IS_PROD === true ? 'dist-prod' : 'dist_project', // build时生成的文件名
    assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境的 source map
    parallel: require('os').cpus().length > 1,
    devServer: {
        proxy: IS_PROD === true ? PRO_PROXY : DEV_PROXY
    },
    css: {
        // requireModuleExtension: false,   //引入此配置会导致elementUI样式失效
        loaderOptions:{
            less:{
                lessOptions: {
                    strictMath: true,
                    globalVars:{
                        divShadow: '0px 0px 10px 0px #a2bce4',
                        inputShadow: '1px 2px 3px 0px #a7d4ff',
                    },
                },
            }
        }
    },
    chainWebpack: config => {
        // 添加目录别名
        config.resolve.alias
            .set('@', resolve('src'))
        //热更新
        config.resolve.symlinks(true);
        //配置externals
        // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        config.externals = {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios'
        };
        //配置typescript
        config.module.rule('ts');
        config.module.rule('ts').use('ts-loader');
        config.module.rule('ts').use('babel-loader');
        config.module.rule('ts').use('cache-loader');
        config.plugin('fork-ts-checker');
        //开启gzip压缩
        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                //开启gzip压缩
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                }),
                //去掉console.log
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
            config.plugins = [
                ...config.plugins,
                ...plugins
            ];
        }

        //压缩图片
        config.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
          .use('image-webpack-loader')
          .loader('image-webpack-loader')
          .options({
              mozjpeg: {
                  progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                  enabled: false,
              },
              pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
              },
              gifsicle: {
                  interlaced: false,
              },
              // webp不兼容IOS和edge
              // the webp option will enable WEBP
              // webp: {
              //     quality: 75
              // }
          })
          .end()
    },
    configureWebpack: config => {
        config.entry.app = ["babel-polyfill", "./src/main.ts"];
    }
}