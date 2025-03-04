import { NORMAL } from './consts'
import { capitalizeFirstLetter, time, wrap } from './utils'

export default function ({ enabled = true, title = 'Auto Group' }) {
  let active = false

  const config = {
    enabled,
    title,
    loopEnabled: false,
    loopTitle: undefined,
  }

  const wrapConfig = (key) => [
    `set${capitalizeFirstLetter(key)}`,
    (value) => {
      config[key] = value
    },
  ]

  function groupEnd() {
    active = false
    config.loopTitle = undefined
    config.loopEnabled = !!config.loopEnabled
    console?.groupEnd()
  }

  function group() {
    active = true
    console?.group(`${config.loopTitle || config.title} %c${time()}`, NORMAL)
    queueMicrotask(groupEnd)
  }

  const wrapConsole = (key) => [key, (...msg) => {
    if (!config.enabled && !config.loopEnabled) return true
    if (!active) group()
    return console[key](...msg)
  }]

  return {
    ...wrap(config, wrapConfig),
    ...wrap(console, wrapConsole),
  }
}
