const {
  RawSource
} = require('webpack-sources');

class NamedChunksList {
  // List named chunks of webpack assets result
  constructor({
    outputName = 'assets',
    callback
  } = {}) {
    this.options = {
      outputName,
      callback
    }
  }
  apply(compiler) {
    const {
      outputName,
      callback
    } = this.options
    const action = function (compilation, cb) {
      // namedChunks: name, chunkReason, files, contentHash
      const {
        namedChunks
      } = compilation
      let chunks = Object.keys(namedChunks).map(key => [key, namedChunks[key]])
      if (namedChunks instanceof Map) {
        chunks = Array.from(namedChunks.keys()).map(key => [
          key,
          namedChunks.get(key)
        ])
      }
      const result = chunks.map(([key, val]) => {
        const {
          name,
          chunkReason,
          files,
          contentHash
        } = val
        return {
          key,
          name,
          chunkReason,
          files,
          contentHash
        }
      })
      if (typeof callback === 'function') {
        result = callback(result)
      }

      compilation.assets[outputName + '.json'] = new RawSource(JSON.stringify(result, null, 2))

      typeof cb === 'function' && cb()
    }
    if (compiler.hooks) {
      compiler.hooks.emit.tap('NamedChunksList', action)
    } else {
      compiler.plugin('emit', action)
    }
  }
}

module.exports = NamedChunksList