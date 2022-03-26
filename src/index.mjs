import debug from 'debug'

import chokidar from 'chokidar'

import normalise from '#watch-cache/normalise'

const log = debug('@sequencemedia/watch-cache')
const error = debug('@sequencemedia/watch-cache:error')
const info = debug('@sequencemedia/watch-cache:info')

const CACHE = '.cache'

const cacheSet = new Set()

function handleAdd (filePath) {
  log('handleAdd')

  info(filePath)

  cacheSet.add(filePath)
}

function handleUnlink (filePath) {
  log('handleUnlink')

  info(filePath)

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
      .on('add', handleAdd)
      .on('unlink', handleUnlink)
      .on('error', handleError)
  )
}
