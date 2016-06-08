Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _reactNative=require('react-native');
var _events=require('events');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var RNZeroconf=_reactNative.NativeModules.RNZeroconf;var 

Zeroconf=function(){function Zeroconf(){_classCallCheck(this,Zeroconf);}_createClass(Zeroconf,null,[{key:'init',value:function init()















{

Zeroconf.emitter=new _events.EventEmitter();

Zeroconf._services={};
Zeroconf._registeredService={};

if(_reactNative.DeviceEventEmitter.listenerCount('RNZeroconfStart')>0){
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfStart',Zeroconf.RNZeroconfStart);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfStop',Zeroconf.RNZeroconfStop);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfError',Zeroconf.RNZeroconfError);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfFound',Zeroconf.RNZeroconfFound);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfRemove',Zeroconf.RNZeroconfRemove);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfResolved',Zeroconf.RNZeroconfResolved);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfRegistered',Zeroconf.RNZeroconfRegistered);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfRegisterFailed',Zeroconf.RNZeroconfRegisterFailed);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfUnregistered',Zeroconf.RNZeroconfUnregistered);
_reactNative.DeviceEventEmitter.removeListener('RNZeroconfUnregisterFailed',Zeroconf.RNZeroconfUnregisterFailed);}



Zeroconf.RNZeroconfStart=function(){return Zeroconf.emitter.emit('start');};
Zeroconf.RNZeroconfStop=function(){return Zeroconf.emitter.emit('stop');};
Zeroconf.RNZeroconfError=function(err){return Zeroconf.emitter.emit('error',err);};

Zeroconf.RNZeroconfFound=function(service){
if(!service||!service.name){return;}var 
name=service.name;

Zeroconf._services[name]=service;
Zeroconf.emitter.emit('found',name);
Zeroconf.emitter.emit('update');};


Zeroconf.RNZeroconfRemove=function(service){
if(!service||!service.name){return;}var 
name=service.name;

delete Zeroconf._services[name];

Zeroconf.emitter.emit('remove',name);
Zeroconf.emitter.emit('update');};


Zeroconf.RNZeroconfResolved=function(service){
if(!service||!service.name){return;}

Zeroconf._services[service.name]=service;
Zeroconf.emitter.emit('resolved',service);
Zeroconf.emitter.emit('update');};


Zeroconf.RNZeroconfRegistered=function(service){
if(!service||!service.name){return;}

Zeroconf._registeredService={
name:service.name};


Zeroconf.emitter.emit('registered');};


Zeroconf.RNZeroconfRegisterFailed=function(err){return Zeroconf.emitter.emit('register_failed',err);};

Zeroconf.RNZeroconfUnregistered=function(service){
if(!service||!service.name){return;}

Zeroconf._registeredService={};

Zeroconf.emitter.emit('unregistered');};


Zeroconf.RNZeroconfUnregisterFailed=function(err){return Zeroconf.emitter.emit('unregister_failed',err);};


if(_reactNative.DeviceEventEmitter.listenerCount('RNZeroconfStart')===0){
_reactNative.DeviceEventEmitter.addListener('RNZeroconfStart',Zeroconf.RNZeroconfStart);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfStop',Zeroconf.RNZeroconfStop);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfError',Zeroconf.RNZeroconfError);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfFound',Zeroconf.RNZeroconfFound);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfRemove',Zeroconf.RNZeroconfRemove);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfResolved',Zeroconf.RNZeroconfResolved);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegistered',Zeroconf.RNZeroconfRegistered);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegisterFailed',Zeroconf.RNZeroconfRegisterFailed);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregistered',Zeroconf.RNZeroconfUnregistered);
_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed',Zeroconf.RNZeroconfUnregisterFailed);}}




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
RNZeroconf.unregister();}}]);return Zeroconf;}();exports.default=Zeroconf;
