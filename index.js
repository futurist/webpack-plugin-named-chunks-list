class NamedChunksList {
  // List named chunks of webpack assets result
  constructor ({ outputFile = 'assets.json', callback } = {}) {
    this.options = {
      outputFile,
      callback
    }
  }
  apply (compiler) {
    const { outputFile, callback } = this.options
    const action = function (compilation, cb) {
      // namedChunks: name, chunkReason, files, contentHash
      const { namedChunks } = compilation
      let chunks = Object.keys(namedChunks).map(key => [key, namedChunks[key]])
      if (namedChunks instanceof Map) {
        chunks = Array.from(namedChunks.keys()).map(key => [
          key,
          namedChunks.get(key)
        ])
      }
      const result = chunks.map(([key, val]) => {
        const { name, chunkReason, files, contentHash } = val
        return {
          key,
          name,
          chunkReason,
          files,
          contentHash
        }
      })
      outputFile && require('fs').writeFile(outputFile, JSON.stringify(result, null, 2), cb)
      if (typeof callback === 'function') {
        callback(result)
      }
      cb()
    }
    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync('NamedChunksList', action)
    } else {
      compiler.plugin('emit', action)
    }
  }
}

module.exports = NamedChunksList
