import { NativeModules, DeviceEventEmitter } from 'react-native'
import { EventEmitter } from 'events'

const RNZeroconf = NativeModules.RNZeroconf

export default class Zeroconf extends EventEmitter {

  constructor (props) {
    super(props)

    this._services = {}
    this._registeredService = {}

    DeviceEventEmitter.addListener('RNZeroconfStart', () => this.emit('start'))
    DeviceEventEmitter.addListener('RNZeroconfStop', () => this.emit('stop'))
    DeviceEventEmitter.addListener('RNZeroconfError', err => this.emit('error', err))

    DeviceEventEmitter.addListener('RNZeroconfFound', service => {
      if (!service || !service.name) { return }
      const { name } = service

      this._services[name] = service
      this.emit('found', name)
      this.emit('update')
    })

    DeviceEventEmitter.addListener('RNZeroconfRemove', service => {
      if (!service || !service.name) { return }
      const { name } = service

      delete this._services[name]

      this.emit('remove', name)
      this.emit('update')
    })

    DeviceEventEmitter.addListener('RNZeroconfResolved', service => {
      if (!service || !service.name) { return }

      this._services[service.name] = service
      this.emit('resolved', service)
      this.emit('update')
    })

    DeviceEventEmitter.addListener('RNZeroconfRegistered', (service) => {
      if (!service || !service.name) { return }

      this._registeredService = {
        name : service.name,
        fullName : service.fullName,
        host : service.host,
        port : service.port,
      }

      this.emit('registered')
    })
    DeviceEventEmitter.addListener('RNZeroconfRegisterFailed', err => this.emit('register_failed', err))
    DeviceEventEmitter.addListener('RNZeroconfUnregistered', (service) => {
      if (!service || !service.name) { return }

      this._registeredService = {};

      this.emit('unregistered')
    })
    DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed', err => this.emit('unregister_failed', err))

  }

  /**
   * Get all the services already resolved
   */
  getServices () {
    return this._services
  }

  /**
   * Get registered service
   */
  getRegisteredService () {
    return this._registeredService
  }

  /**
   * Scan for Zeroconf services,
   * Defaults to _http._tcp. on local domain
   */
  scan (type = 'http', protocol = 'tcp', domain = 'local.') {
    this._services = {}
    this.emit('update')
    RNZeroconf.scan(type, protocol, domain)
  }

  /**
   * Register new Zeroconf service,
   * Defaults to _http._tcp. on local domain
   */
  register (type = 'http', protocol = 'tcp', service_name = 'RNDefaultName', port = 48500) {
    this._registeredService = {}
    RNZeroconf.register(type, protocol, service_name, port)
  }

  /**
   * Stop current scan if any
   */
  stop () {
    RNZeroconf.stop()
  }

  /**
   * Unregister current registered service
   */
  unregister () {
    RNZeroconf.unregister()
  }

}
