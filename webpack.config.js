module.exports = {
  entry: "./client/js/client.js",
  output: {
    filename: "./client/bin/bundle.js"
  },
  cache: true,
  watch: true,
  debug: true,
  progress: true,
  colors: true
}