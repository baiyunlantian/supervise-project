const DEV_PROXY = {
    '/api': {
        target: 'http://192.168.1.105:83',
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api' : ''
        // },
    }
};

const PRO_PROXY = {
    '/api': {
        target: 'www.v-zone.online',
        changeOrigin: true,
    }
};
module.exports = {
    DEV_PROXY,
    PRO_PROXY
}