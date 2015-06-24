module.exports = {
  app: {
    cache: true,
    entry: './lib/client/index.jsx',
    output: {
      path: __dirname + '/public/assets',
      filename: 'index.js'
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' },
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.png$/, loader: "url-loader?limit=100000" },
        { test: /\.jpg$/, loader: "file-loader" },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url-loader?limit=10000&minetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&minetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file-loader" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&minetype=image/svg+xml" }
      ]
    }
  }
};
