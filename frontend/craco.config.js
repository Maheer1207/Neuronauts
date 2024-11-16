module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.ignoreWarnings = [
                (warning) =>
                    warning.message.includes('Failed to parse source map'),
            ];
            return webpackConfig;
        },
    },
};
