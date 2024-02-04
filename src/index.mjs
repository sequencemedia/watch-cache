import debug from 'debug'

import chokidar from 'chokidar'

import normalise from '#watch-cache/normalise'

const log = debug('@sequencemedia/watch-cache')
const error = debug('@sequencemedia/watch-cache:error')

const PATH = '.cache'

/**
 * The cache is not exposed so that its contents can be managed
 * interally (without the risk of an extraneous `add`, `delete`
 * or `clear`) to keep it in sync with the the file system path
 * being watched
 */
const CACHE = new Set()

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

  CACHE.add(filePath)
}

function handleUnlink (filePath) {
  log('handleUnlink')

  CACHE.delete(filePath)
}

function handleError ({ message = 'No error message defined' } = {}) {
  error(`Error in watcher: "${message}"`)
}

/**
 * Returns a duplicate of the cache
 */
export function getCache () {
  return (
    new Set(CACHE)
  )
}

/**
 * An interface to the contents of the cache
 *
 * @param {string} filePath
 * @returns {boolean}
 */
export function has (filePath) {
  log('has')

  return (
    CACHE.has(filePath)
  )
}

/**
 * Parameter `path` is the file system path to watch. It should be a
 * directory path. It is nominally optional (so you should supply a path,
 * but if you don't then `watchPath` will apply a default)
 *
 * @param {string} path
 * @returns {chokidar.FSWatcher}
 */
export default function watchCache (path = PATH) {
  log('watchCache')

  return (
    chokidar.watch(normalise(path))
      .on('change', use('handle-change'))
      .on('add', use('handle-add', handleAdd))
      .on('unlink', use('handle-unlink', handleUnlink))
      .on('error', handleError)
  )
}
