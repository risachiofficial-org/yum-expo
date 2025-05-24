const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...
config.resolver,
  extraNodeModules: {
    ...
(config.resolver.extraNodeModules || {}),
    stream: require.resolve("readable-stream"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    url: require.resolve("url-polyfill"),
    crypto: require.resolve("crypto-browserify"),
    net: require.resolve("react-native-tcp-socket"),
    tls: require.resolve("tls-browserify"),
    zlib: require.resolve("browserify-zlib"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
  },
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
