import debug from 'debug'

import chokidar from 'chokidar'

import normalise from '#watch-cache/normalise'

const log = debug('@sequencemedia/watch-cache')
const error = debug('@sequencemedia/watch-cache:error')

const CACHE = '.cache'

const cacheSet = new Set()

function use (key, f = () => {}) {
  const l = debug(`@sequencemedia/watch-cache:${key}`)

  return function log (v) {
    let r
    try {
      r = f(v)
      l(v)
    } catch (e) {
      handleError(e)
    }

    return r
  }
}

function handleAdd (filePath) {
  log('handleAdd')

  cacheSet.add(filePath)
}

function handleUnlink (filePath) {
  log('handleUnlink')

  cacheSet.delete(filePath)
}

function handleError ({ message = 'No error message defined' } = {}) {
  error(`Error in watcher: "${message}"`)
}

export function has (filePath) {
  log('has')

  return (
    cacheSet.has(filePath)
  )
}

export default function watchCache (cache = CACHE) {
  log('watchCache')

  return (
    chokidar.watch(normalise(cache))
      .on('change', use('handle-change'))
      .on('add', use('handle-add', handleAdd))
      .on('unlink', use('handle-unlink', handleUnlink))
      .on('error', handleError)
  )
}
