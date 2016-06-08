import { NativeModules, DeviceEventEmitter } from 'react-native'
import { EventEmitter } from 'events'

const RNZeroconf = NativeModules.RNZeroconf

export default class Zeroconf {

  static emitter;
  static _services;
  static _registeredService;
  static RNZeroconfStart;
  static RNZeroconfStop;
  static RNZeroconfError;
  static RNZeroconfFound;
  static RNZeroconfRemove;
  static RNZeroconfResolved;
  static RNZeroconfRegistered;
  static RNZeroconfRegisterFailed;
  static RNZeroconfUnregistered;
  static RNZeroconfUnregisterFailed;

  static init () {

    Zeroconf.emitter = new EventEmitter();

    Zeroconf._services = {}
    Zeroconf._registeredService = {}

    if(DeviceEventEmitter.listenerCount('RNZeroconfStart') > 0) {
      DeviceEventEmitter.removeListener('RNZeroconfStart', Zeroconf.RNZeroconfStart);
      DeviceEventEmitter.removeListener('RNZeroconfStop', Zeroconf.RNZeroconfStop);
      DeviceEventEmitter.removeListener('RNZeroconfError', Zeroconf.RNZeroconfError);
      DeviceEventEmitter.removeListener('RNZeroconfFound', Zeroconf.RNZeroconfFound);
      DeviceEventEmitter.removeListener('RNZeroconfRemove', Zeroconf.RNZeroconfRemove);
      DeviceEventEmitter.removeListener('RNZeroconfResolved', Zeroconf.RNZeroconfResolved);
      DeviceEventEmitter.removeListener('RNZeroconfRegistered', Zeroconf.RNZeroconfRegistered);
      DeviceEventEmitter.removeListener('RNZeroconfRegisterFailed', Zeroconf.RNZeroconfRegisterFailed);
      DeviceEventEmitter.removeListener('RNZeroconfUnregistered', Zeroconf.RNZeroconfUnregistered);
      DeviceEventEmitter.removeListener('RNZeroconfUnregisterFailed', Zeroconf.RNZeroconfUnregisterFailed);
    }


    Zeroconf.RNZeroconfStart = () => Zeroconf.emitter.emit('start');
    Zeroconf.RNZeroconfStop = () => Zeroconf.emitter.emit('stop');
    Zeroconf.RNZeroconfError = err => Zeroconf.emitter.emit('error', err);

    Zeroconf.RNZeroconfFound = service => {
      if (!service || !service.name) { return }
      const { name } = service

      Zeroconf._services[name] = service
      Zeroconf.emitter.emit('found', name)
      Zeroconf.emitter.emit('update')
    };

    Zeroconf.RNZeroconfRemove = service => {
      if (!service || !service.name) { return }
      const { name } = service

      delete Zeroconf._services[name]

      Zeroconf.emitter.emit('remove', name)
      Zeroconf.emitter.emit('update')
    }

    Zeroconf.RNZeroconfResolved = service => {
      if (!service || !service.name) { return }

      Zeroconf._services[service.name] = service
      Zeroconf.emitter.emit('resolved', service)
      Zeroconf.emitter.emit('update')
    };

    Zeroconf.RNZeroconfRegistered = (service) => {
      if (!service || !service.name) { return }

      Zeroconf._registeredService = {
        name : service.name
      }

      Zeroconf.emitter.emit('registered')
    };

    Zeroconf.RNZeroconfRegisterFailed = err => Zeroconf.emitter.emit('register_failed', err);

    Zeroconf.RNZeroconfUnregistered = (service) => {
      if (!service || !service.name) { return }

      Zeroconf._registeredService = {};

      Zeroconf.emitter.emit('unregistered')
    };

    Zeroconf.RNZeroconfUnregisterFailed = err => Zeroconf.emitter.emit('unregister_failed', err);


    if(DeviceEventEmitter.listenerCount('RNZeroconfStart') === 0) {
      DeviceEventEmitter.addListener('RNZeroconfStart', Zeroconf.RNZeroconfStart);
      DeviceEventEmitter.addListener('RNZeroconfStop', Zeroconf.RNZeroconfStop);
      DeviceEventEmitter.addListener('RNZeroconfError', Zeroconf.RNZeroconfError);
      DeviceEventEmitter.addListener('RNZeroconfFound', Zeroconf.RNZeroconfFound);
      DeviceEventEmitter.addListener('RNZeroconfRemove', Zeroconf.RNZeroconfRemove);
      DeviceEventEmitter.addListener('RNZeroconfResolved', Zeroconf.RNZeroconfResolved);
      DeviceEventEmitter.addListener('RNZeroconfRegistered', Zeroconf.RNZeroconfRegistered);
      DeviceEventEmitter.addListener('RNZeroconfRegisterFailed', Zeroconf.RNZeroconfRegisterFailed);
      DeviceEventEmitter.addListener('RNZeroconfUnregistered', Zeroconf.RNZeroconfUnregistered);
      DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed', Zeroconf.RNZeroconfUnregisterFailed);
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
