import { NativeModules, DeviceEventEmitter } from 'react-native'
import { EventEmitter } from 'events'

EventEmitter.defaultMaxListeners = Infinity;

const RNZeroconf = NativeModules.RNZeroconf
RNZeroconf.DeviceEventEmitter = DeviceEventEmitter;

export default class Zeroconf {

  static emitter;
  static listenerCount = 0;
  static _services;
  static _registeredService;

  static init () {

    Zeroconf.emitter = new EventEmitter();
    Zeroconf.emitter.setMaxListeners(Infinity)

    Zeroconf._services = {}
    Zeroconf._registeredService = {}


    if(Zeroconf.listenerCount && Zeroconf.listenerCount > 0) {
      DeviceEventEmitter.removeAllListeners('RNZeroconfStart');
      DeviceEventEmitter.removeAllListeners('RNZeroconfStop');
      DeviceEventEmitter.removeAllListeners('RNZeroconfError');
      DeviceEventEmitter.removeAllListeners('RNZeroconfFound');
      DeviceEventEmitter.removeAllListeners('RNZeroconfRemove');
      DeviceEventEmitter.removeAllListeners('RNZeroconfResolved');
      DeviceEventEmitter.removeAllListeners('RNZeroconfRegistered');
      DeviceEventEmitter.removeAllListeners('RNZeroconfRegisterFailed');
      DeviceEventEmitter.removeAllListeners('RNZeroconfUnregistered');
      DeviceEventEmitter.removeAllListeners('RNZeroconfUnregisterFailed');

      Zeroconf.listenerCount = 0;
    }

    if(Zeroconf.listenerCount === 0) {

      DeviceEventEmitter.addListener('RNZeroconfStart', () => {
        Zeroconf.emitter.emit('start')
      });
      DeviceEventEmitter.addListener('RNZeroconfStop', () => Zeroconf.emitter.emit('stop'));
      DeviceEventEmitter.addListener('RNZeroconfError', err => Zeroconf.emitter.emit('error', err));
      DeviceEventEmitter.addListener('RNZeroconfFound', service => {
        if (!service || !service.name) { return }
        const { name } = service

        Zeroconf._services[name] = service
        Zeroconf.emitter.emit('found', name)
        Zeroconf.emitter.emit('update')
      });
      DeviceEventEmitter.addListener('RNZeroconfRemove', service => {
        if (!service || !service.name) { return }
        const { name } = service

        delete Zeroconf._services[name]

        Zeroconf.emitter.emit('remove', name)
        Zeroconf.emitter.emit('update')
      });
      DeviceEventEmitter.addListener('RNZeroconfResolved', service => {
        if (!service || !service.name) { return }

        Zeroconf._services[service.name] = service
        Zeroconf.emitter.emit('resolved', service)
        Zeroconf.emitter.emit('update')
      });
      DeviceEventEmitter.addListener('RNZeroconfRegistered', (service) => {
        if (!service || !service.name) { return }

        Zeroconf._registeredService = {
          name : service.name
        }

        Zeroconf.emitter.emit('registered')
      });
      DeviceEventEmitter.addListener('RNZeroconfRegisterFailed', err => Zeroconf.emitter.emit('register_failed', err));

      DeviceEventEmitter.addListener('RNZeroconfUnregistered', (service) => {
        if (!service || !service.name) { return }

        Zeroconf._registeredService = {};

        Zeroconf.emitter.emit('unregistered')
      });
      DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed', err => Zeroconf.emitter.emit('unregister_failed', err));

      Zeroconf.listenerCount = 1;
    }

  }

  /**
   * Get all the services already resolved
   */
  static getServices () {
    return Zeroconf._services
  }

  /**
   * Get registered service
   */
  static getRegisteredService () {
    return Zeroconf._registeredService
  }

  /**
   * Scan for Zeroconf services,
   * Defaults to _http._tcp. on local domain
   */
  static scan (type = 'http', protocol = 'tcp', domain = 'local.') {
    Zeroconf._services = {}
    Zeroconf.emitter.emit('update')
    RNZeroconf.scan(type, protocol, domain)
  }

  /**
   * Register new Zeroconf service,
   * Defaults to _http._tcp. on local domain
   */
  static register (type = 'http', protocol = 'tcp', service_name = 'RNDefaultName', port = 48500) {
    Zeroconf._registeredService = {}
    RNZeroconf.register(type, protocol, service_name, port)
  }

  /**
   * Stop current scan if any
   */
  static stop () {
    RNZeroconf.stop()
  }

  /**
   * Unregister current registered service
   */
  static unregister () {
    RNZeroconf.unregister()
  }

}
