Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _reactNative=require('react-native');
var _events=require('events');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

_events.EventEmitter.defaultMaxListeners=Infinity;

var RNZeroconf=_reactNative.NativeModules.RNZeroconf;
RNZeroconf.DeviceEventEmitter=_reactNative.DeviceEventEmitter;var 

Zeroconf=function(){function Zeroconf(){_classCallCheck(this,Zeroconf);}_createClass(Zeroconf,null,[{key:'init',value:function init()






{

Zeroconf.emitter=new _events.EventEmitter();
Zeroconf.emitter.setMaxListeners(Infinity);

Zeroconf._services={};
Zeroconf._registeredService={};


if(Zeroconf.listenerCount&&Zeroconf.listenerCount>0){
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfStart');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfStop');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfError');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfFound');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfRemove');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfResolved');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfRegistered');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfRegisterFailed');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfUnregistered');
_reactNative.DeviceEventEmitter.removeAllListeners('RNZeroconfUnregisterFailed');

Zeroconf.listenerCount=0;}


if(Zeroconf.listenerCount===0){

_reactNative.DeviceEventEmitter.addListener('RNZeroconfStart',function(){
Zeroconf.emitter.emit('start');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfStop',function(){return Zeroconf.emitter.emit('stop');});
_reactNative.DeviceEventEmitter.addListener('RNZeroconfError',function(err){return Zeroconf.emitter.emit('error',err);});
_reactNative.DeviceEventEmitter.addListener('RNZeroconfFound',function(service){
if(!service||!service.name){return;}var 
name=service.name;

Zeroconf._services[name]=service;
Zeroconf.emitter.emit('found',name);
Zeroconf.emitter.emit('update');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfRemove',function(service){
if(!service||!service.name){return;}var 
name=service.name;

delete Zeroconf._services[name];

Zeroconf.emitter.emit('remove',name);
Zeroconf.emitter.emit('update');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfResolved',function(service){
if(!service||!service.name){return;}

Zeroconf._services[service.name]=service;
Zeroconf.emitter.emit('resolved',service);
Zeroconf.emitter.emit('update');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegistered',function(service){
if(!service||!service.name){return;}

Zeroconf._registeredService={
name:service.name};


Zeroconf.emitter.emit('registered');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegisterFailed',function(err){return Zeroconf.emitter.emit('register_failed',err);});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregistered',function(service){
if(!service||!service.name){return;}

Zeroconf._registeredService={};

Zeroconf.emitter.emit('unregistered');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed',function(err){return Zeroconf.emitter.emit('unregister_failed',err);});

Zeroconf.listenerCount=1;}}




/**
   * Get all the services already resolved
   */},{key:'getServices',value:function getServices()
{
return Zeroconf._services;}


/**
   * Get registered service
   */},{key:'getRegisteredService',value:function getRegisteredService()
{
return Zeroconf._registeredService;}


/**
   * Scan for Zeroconf services,
   * Defaults to _http._tcp. on local domain
   */},{key:'scan',value:function scan()
{var type=arguments.length<=0||arguments[0]===undefined?'http':arguments[0];var protocol=arguments.length<=1||arguments[1]===undefined?'tcp':arguments[1];var domain=arguments.length<=2||arguments[2]===undefined?'local.':arguments[2];
Zeroconf._services={};
Zeroconf.emitter.emit('update');
RNZeroconf.scan(type,protocol,domain);}


/**
   * Register new Zeroconf service,
   * Defaults to _http._tcp. on local domain
   */},{key:'register',value:function register()
{var type=arguments.length<=0||arguments[0]===undefined?'http':arguments[0];var protocol=arguments.length<=1||arguments[1]===undefined?'tcp':arguments[1];var service_name=arguments.length<=2||arguments[2]===undefined?'RNDefaultName':arguments[2];var port=arguments.length<=3||arguments[3]===undefined?48500:arguments[3];
Zeroconf._registeredService={};
RNZeroconf.register(type,protocol,service_name,port);}


/**
   * Stop current scan if any
   */},{key:'stop',value:function stop()
{
RNZeroconf.stop();}


/**
   * Unregister current registered service
   */},{key:'unregister',value:function unregister()
{
RNZeroconf.unregister();}}]);return Zeroconf;}();Zeroconf.listenerCount=0;exports.default=Zeroconf;
