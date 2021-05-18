module.exports = {
  entry: {
    main: "./main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "ToyReact.createElement" },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: "development",
  optimization: {
    minimize: false,
  },
};
