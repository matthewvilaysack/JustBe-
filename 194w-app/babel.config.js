module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // Add this line
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": ".",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: false,
        }
      ],
    ],
  };
};
