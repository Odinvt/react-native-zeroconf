Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _reactNative=require('react-native');
var _events=require('events');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var RNZeroconf=_reactNative.NativeModules.RNZeroconf;var 

Zeroconf=function(_EventEmitter){_inherits(Zeroconf,_EventEmitter);

function Zeroconf(props){_classCallCheck(this,Zeroconf);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(Zeroconf).call(this,
props));

_this._services={};
_this._registeredService={};

_reactNative.DeviceEventEmitter.addListener('RNZeroconfStart',function(){return _this.emit('start');});
_reactNative.DeviceEventEmitter.addListener('RNZeroconfStop',function(){return _this.emit('stop');});
_reactNative.DeviceEventEmitter.addListener('RNZeroconfError',function(err){return _this.emit('error',err);});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfFound',function(service){
if(!service||!service.name){return;}var 
name=service.name;

_this._services[name]=service;
_this.emit('found',name);
_this.emit('update');});


_reactNative.DeviceEventEmitter.addListener('RNZeroconfRemove',function(service){
if(!service||!service.name){return;}var 
name=service.name;

delete _this._services[name];

_this.emit('remove',name);
_this.emit('update');});


_reactNative.DeviceEventEmitter.addListener('RNZeroconfResolved',function(service){
if(!service||!service.name){return;}

_this._services[service.name]=service;
_this.emit('resolved',service);
_this.emit('update');});


_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegistered',function(service){
if(!service||!service.name){return;}

_this._registeredService={
name:service.name,
fullName:service.fullName,
host:service.host,
port:service.port};


_this.emit('registered');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfRegisterFailed',function(err){return _this.emit('register_failed',err);});
_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregistered',function(service){
if(!service||!service.name){return;}

_this._registeredService={};

_this.emit('unregistered');});

_reactNative.DeviceEventEmitter.addListener('RNZeroconfUnregisterFailed',function(err){return _this.emit('unregister_failed',err);});return _this;}



/**
   * Get all the services already resolved
   */_createClass(Zeroconf,[{key:'getServices',value:function getServices()
{
return this._services;}


/**
   * Get registered service
   */},{key:'getRegisteredService',value:function getRegisteredService()
{
return this._registeredService;}


/**
   * Scan for Zeroconf services,
   * Defaults to _http._tcp. on local domain
   */},{key:'scan',value:function scan()
{var type=arguments.length<=0||arguments[0]===undefined?'http':arguments[0];var protocol=arguments.length<=1||arguments[1]===undefined?'tcp':arguments[1];var domain=arguments.length<=2||arguments[2]===undefined?'local.':arguments[2];
this._services={};
this.emit('update');
RNZeroconf.scan(type,protocol,domain);}


/**
   * Register new Zeroconf service,
   * Defaults to _http._tcp. on local domain
   */},{key:'register',value:function register()
{var type=arguments.length<=0||arguments[0]===undefined?'http':arguments[0];var protocol=arguments.length<=1||arguments[1]===undefined?'tcp':arguments[1];var service_name=arguments.length<=2||arguments[2]===undefined?'RNDefaultName':arguments[2];var port=arguments.length<=3||arguments[3]===undefined?48500:arguments[3];
this._registeredService={};
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
RNZeroconf.unregister();}}]);return Zeroconf;}(_events.EventEmitter);exports.default=Zeroconf;
