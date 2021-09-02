const glob = require('glob');
const path = require('path');

module.exports = {
  entry: {
    'crm-login': glob.sync('./dist/login/*.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../shell/src/assets/microapps/'),
  },
  performance: {
    hints: false,
  },
};
