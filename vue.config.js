module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === "production" ? './' : '/',
    devServer: {
        disableHostCheck: true,
    },
    transpileDependencies: [
        'vuetify'
    ]
}