const {
  RawSource
} = require('webpack-sources')
const revHash = require('rev-hash')

class NamedChunksList {
  // List named chunks of webpack assets result
  constructor({
    outputName = 'assets',
    callback,
    ensureHash
  } = {}) {
    this.options = {
      outputName,
      callback,
      ensureHash
    }
  }
  apply(compiler) {
    const {
      outputName,
      callback,
      ensureHash
    } = this.options
    const action = function (compilation, cb) {
      // namedChunks: name, chunkReason, files, contentHash
      const {
        assets,
        namedChunks
      } = compilation
      let chunks = Object.keys(namedChunks).map(key => [key, namedChunks[key]])
      if (namedChunks instanceof Map) {
        chunks = Array.from(namedChunks.keys()).map(key => [
          key,
          namedChunks.get(key)
        ])
      }
      let result = chunks.map(([key, val]) => {
        let {
          name,
          chunkReason,
          files,
          contentHash = {}
        } = val
        // webpack 3 lost contentHash
        files = files.map(f => {
          const hash = contentHash[f] = revHash(assets[f].source())
          if(ensureHash) {
            const parts = f.split('.');
            if (parts.length < 3 && hash) {
              parts[0] += '.' + hash;
              const oldName = f;
              f = parts.join('.');
              assets[f] = assets[oldName]
              delete assets[oldName]
            }
          }
          return f;
        });

        return {
          key,
          name,
          chunkReason,
          files,
          contentHash
        }
      })
      if (typeof callback === 'function') {
        result = callback(result, compilation)
      }

      assets[outputName + '.json'] = new RawSource(JSON.stringify(result, null, 2))

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