module.exports = {
  entry: {
    audio: "./src/index"
  },
  output: {
    path: "./res",
    publicPath: "/build",
    filename: "[name].build.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel', 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /\.sass$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.gif/,
        loader: "file-loader!url-loader?limit=10000&minetype=image/gif"
      },
      {
        test: /\.jpg/,
        loader: "file-loader!url-loader?limit=10000&minetype=image/jpg"
      },
      {
        test: /\.png/,
        loader: "file-loader!url-loader?limit=10000&minetype=image/png"
      },
      {
        test: /\.svg$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    alias: {
      audioService: __dirname+ "/src/service/audio.service",
      browserService: __dirname+ "/src/service/browser.service",
      borderAnimation: __dirname+ "/src/service/borderAnimation.service"
    }
  }
};