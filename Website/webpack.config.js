const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/js/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "wwwroot"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
  },  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // Inject styles into the DOM
          "css-loader",   // Resolves CSS imports
          "sass-loader",  // Compiles SCSS to CSS
        ],
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader'
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'), // Source directory
          to: path.resolve(__dirname, 'wwwroot/images'), // Destination directory
        },
        {
          from: path.resolve(__dirname, 'src/fonts'), // Source directory
          to: path.resolve(__dirname, 'wwwroot/fonts'), // Destination directory
        },
      ],
    }),
    
    {

      //Lists files output by Webpack

      apply: (compiler) => {

        compiler.hooks.done.tap('AfterBuild', (stats) => {

          const outputFiles = stats.toJson().assets.map((asset) => asset.name);  
          console.log('output files', outputFiles);
        });

      },

      

    },
  ],
  devServer: {
    // Add a separate static path for the images
    port: 3000,
    open: true,
    hot: true,
    proxy: [
      {
        context: ["/"], 
        target: "https://localhost:7272", 
        changeOrigin: true,
        secure: false, 
        pathRewrite: {
          "^/": "/", 
        },
      },
    ],
  },
  
};
