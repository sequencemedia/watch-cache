#!/usr/bin/env node

import debug from 'debug'

import {
  Command
} from 'commander'

import watchCache from '#watch-cache'

import PACKAGE from './package.json' with { type: 'json' }

const log = debug('@sequencemedia/watch-cache')

log('`watch-cache` is awake')

const commander = new Command()

async function app () {
  const {
    name
  } = PACKAGE

  const {
    pid,
    argv,
    env: {
      PATH
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  const {
    version
  } = PACKAGE

  try {
    commander
      .version(version)
      .exitOverride()
      .requiredOption('-p, --path [path]', 'Path to watch')
      .parse(argv)
  } catch (e) {
    const {
      code
    } = e

    const error = debug('@sequencemedia/watch-cache:commander:error')

    if (code !== 'commander.missingMandatoryOptionValue') error(e)

    error(`Halting application "${name}" in process ${pid}.`)
    return
  }

  const {
    path = PATH
  } = commander.opts()

  log({
    path
  })

  try {
    await watchCache(path)
  } catch ({ message }) {
    const error = debug('@sequencemedia/watch-cache:error')

    error(message)
  }
}

export default app()
