const DEV_PROXY = {
    '/api': {
        target: 'https://www.v-edu.net.cn',
        changeOrigin: true,
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