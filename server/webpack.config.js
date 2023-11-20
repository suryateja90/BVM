//const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
target: 'node',
  entry: './index.js',  // Entry point of your application
  externals: [nodeExternals()],
//   output: {
//     filename: 'bundle.js',  // Output bundle file name
//     path: path.resolve(__dirname, 'dist')  // Output directory
//   }
};
