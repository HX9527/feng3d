var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var feng3d;
(function (feng3d) {
    feng3d.Context3D = WebGLRenderingContext;
    feng3d.contextId = "webgl";
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 断言
     * @b			判定为真的表达式
     * @msg			在表达式为假时将输出的错误信息
     * @author feng 2014-10-29
     */
    function assert(b, msg) {
        if (msg === void 0) { msg = "assert"; }
        if (!b)
            throw msg;
    }
    feng3d.assert = assert;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 类工具
     * @author feng 2017-02-15
     */
    var ClassUtils = (function () {
        function ClassUtils() {
        }
        /**
         * 判断a对象是否为b类型
         */
        ClassUtils.is = function (a, b) {
            var prototype = a.prototype ? a.prototype : Object.getPrototypeOf(a);
            while (prototype != null) {
                //类型==自身原型的构造函数
                if (prototype.constructor == b)
                    return true;
                //父类就是原型的原型构造函数
                prototype = Object.getPrototypeOf(prototype);
            }
            return false;
        };
        /**
         * 如果a为b类型则返回，否则返回null
         */
        ClassUtils.as = function (a, b) {
            if (!ClassUtils.is(a, b))
                return null;
            return a;
        };
        /**
         * 是否为基础类型
         * @param object    对象
         */
        ClassUtils.isBaseType = function (object) {
            return object == null || typeof object == "number" || typeof object == "boolean" || typeof object == "string";
        };
        /**
         * 返回对象的完全限定类名。
         * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
         * （如number)和类对象
         * @returns 包含完全限定类名称的字符串。
         */
        ClassUtils.getQualifiedClassName = function (value) {
            if (value == null) {
                return null;
            }
            var className = null;
            var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
            if (prototype.hasOwnProperty(_CLASS_KEY)) {
                className = prototype[_CLASS_KEY];
            }
            if (className == null) {
                className = prototype.constructor.name;
                if (ClassUtils.getDefinitionByName(className) == prototype.constructor) {
                    ClassUtils.registerClass(prototype.constructor, className);
                }
                else {
                    //在可能的命名空间内查找
                    for (var i = 0; i < _classNameSpaces.length; i++) {
                        var tryClassName = _classNameSpaces[i] + "." + className;
                        if (ClassUtils.getDefinitionByName(tryClassName) == prototype.constructor) {
                            className = tryClassName;
                            ClassUtils.registerClass(prototype.constructor, className);
                            break;
                        }
                    }
                }
            }
            feng3d.assert(ClassUtils.getDefinitionByName(className) == prototype.constructor);
            return className;
        };
        /**
         * 获取父类定义
         */
        ClassUtils.getSuperClass = function (value) {
            return value && value["__proto__"];
        };
        /**
         * 返回 value 参数指定的对象的基类的完全限定类名。
         * @param value 需要取得父类的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象
         * @returns 完全限定的基类名称，或 null（如果不存在基类名称）。
         */
        ClassUtils.getQualifiedSuperclassName = function (value) {
            if (value == null) {
                return null;
            }
            var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
            var superProto = Object.getPrototypeOf(prototype);
            if (!superProto) {
                return null;
            }
            var superClass = ClassUtils.getQualifiedClassName(superProto.constructor);
            if (!superClass) {
                return null;
            }
            return superClass;
        };
        /**
         * 返回 name 参数指定的类的类对象引用。
         * @param name 类的名称。
         */
        ClassUtils.getDefinitionByName = function (name) {
            if (!name)
                return null;
            var definition = _definitionCache[name];
            if (definition) {
                return definition;
            }
            var paths = name.split(".");
            var length = paths.length;
            definition = _global;
            for (var i = 0; i < length; i++) {
                var path = paths[i];
                definition = definition[path];
                if (!definition) {
                    return null;
                }
            }
            _definitionCache[name] = definition;
            return definition;
        };
        /**
         * 为一个类定义注册完全限定类名
         * @param classDefinition 类定义
         * @param className 完全限定类名
         */
        ClassUtils.registerClass = function (classDefinition, className) {
            var prototype = classDefinition.prototype;
            Object.defineProperty(prototype, _CLASS_KEY, {
                value: className,
                enumerable: false,
                writable: true
            });
        };
        /**
         * 新增反射对象所在的命名空间，使得getQualifiedClassName能够得到正确的结果
         */
        ClassUtils.addClassNameSpace = function (namespace) {
            if (_classNameSpaces.indexOf(namespace) == -1) {
                _classNameSpaces.push(namespace);
            }
        };
        return ClassUtils;
    }());
    feng3d.ClassUtils = ClassUtils;
    var _definitionCache = {};
    var _global = window;
    var _CLASS_KEY = "__class__";
    var _classNameSpaces = ["feng3d"];
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 对象工具
     * @author feng 2017-02-15
     */
    var ObjectUtils = (function () {
        function ObjectUtils() {
        }
        /**
         * 深克隆
         * @param source        源数据
         * @returns             克隆数据
         */
        ObjectUtils.deepClone = function (source) {
            if (feng3d.ClassUtils.isBaseType(source))
                return source;
            var prototype = source["prototype"] ? source["prototype"] : Object.getPrototypeOf(source);
            var target = new prototype.constructor();
            for (var attribute in source) {
                target[attribute] = ObjectUtils.deepClone(source[attribute]);
            }
            return target;
        };
        /**
         * （浅）克隆
         * @param source        源数据
         * @returns             克隆数据
         */
        ObjectUtils.clone = function (source) {
            if (feng3d.ClassUtils.isBaseType(source))
                return source;
            var prototype = source["prototype"] ? source["prototype"] : Object.getPrototypeOf(source);
            var target = new prototype.constructor();
            for (var attribute in source) {
                target[attribute] = source[attribute];
            }
            return target;
        };
        /**
         * （浅）拷贝数据
         */
        ObjectUtils.copy = function (target, source) {
            var keys = Object.keys(source);
            keys.forEach(function (element) {
                target[element] = source[element];
            });
        };
        /**
         * 深拷贝数据
         */
        ObjectUtils.deepCopy = function (target, source) {
            var keys = Object.keys(source);
            keys.forEach(function (element) {
                if (!source[element] || feng3d.ClassUtils.isBaseType(source[element])) {
                    target[element] = source[element];
                }
                else if (!target[element]) {
                    target[element] = ObjectUtils.deepClone(source[element]);
                }
                else {
                    ObjectUtils.copy(target[element], source[element]);
                }
            });
        };
        /**
         * 合并数据
         * @param source        源数据
         * @param mergeData     合并数据
         * @param createNew     是否合并为新对象，默认为false
         * @returns             如果createNew为true时返回新对象，否则返回源数据
         */
        ObjectUtils.merge = function (source, mergeData, createNew) {
            if (createNew === void 0) { createNew = false; }
            if (feng3d.ClassUtils.isBaseType(mergeData))
                return mergeData;
            var target = createNew ? ObjectUtils.clone(source) : source;
            for (var mergeAttribute in mergeData) {
                target[mergeAttribute] = ObjectUtils.merge(source[mergeAttribute], mergeData[mergeAttribute], createNew);
            }
            return target;
        };
        return ObjectUtils;
    }());
    feng3d.ObjectUtils = ObjectUtils;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var UIDUtils = (function () {
        function UIDUtils() {
        }
        /**
         * 获取对象UID
         * @author feng 2016-05-08
         */
        UIDUtils.getUID = function (object) {
            if (feng3d.ClassUtils.isBaseType(object)) {
                return object;
            }
            //uid属性名称
            var uidKey = "__uid__";
            if (object.hasOwnProperty(uidKey)) {
                return object[uidKey];
            }
            var uid = createUID(object);
            Object.defineProperty(object, uidKey, {
                value: uid,
                enumerable: false,
                writable: false
            });
            return uid;
            /**
             * 创建对象的UID
             * @param object 对象
             */
            function createUID(object) {
                var prototype = object.prototype ? object.prototype : Object.getPrototypeOf(object);
                var className = feng3d.ClassUtils.getQualifiedClassName(object);
                var id = ~~_uidStart[className];
                var time = Date.now(); //时间戳
                var uid = [
                    className,
                    feng3d.StringUtils.getString(~~_uidStart[className], 8, "0", false),
                    time,
                ].join("-");
                //
                feng3d.uidDetails[uid] = { className: className, id: id, time: time };
                _uidStart[className] = ~~_uidStart[className] + 1;
                return uid;
            }
        };
        return UIDUtils;
    }());
    feng3d.UIDUtils = UIDUtils;
    /**
     * uid自增长编号
     */
    var _uidStart = {};
    /**
     * uid细节
     */
    feng3d.uidDetails = {};
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var VersionUtils = (function () {
        function VersionUtils() {
        }
        /**
         * 获取对象版本
         * @param object 对象
         */
        VersionUtils.getVersion = function (object) {
            this.assertObject(object);
            if (!object.hasOwnProperty(_versionKey)) {
                return -1;
            }
            return ~~object[_versionKey];
        };
        /**
         * 升级对象版本（版本号+1）
         * @param object 对象
         */
        VersionUtils.upgradeVersion = function (object) {
            this.assertObject(object);
            if (!object.hasOwnProperty(_versionKey)) {
                Object.defineProperty(object, _versionKey, {
                    value: 0,
                    enumerable: false,
                    writable: true
                });
            }
            object[_versionKey] = ~~object[_versionKey] + 1;
        };
        /**
         * 设置版本号
         * @param object 对象
         * @param version 版本号
         */
        VersionUtils.setVersion = function (object, version) {
            this.assertObject(object);
            object[_versionKey] = ~~version;
        };
        /**
         * 判断两个对象的版本号是否相等
         */
        VersionUtils.equal = function (a, b) {
            var va = this.getVersion(a);
            var vb = this.getVersion(b);
            if (va == -1 && vb == -1)
                return false;
            return va == vb;
        };
        /**
         * 断言object为对象类型
         */
        VersionUtils.assertObject = function (object) {
            if (typeof object != "object") {
                throw "\u65E0\u6CD5\u83B7\u53D6" + object + "\u7684UID";
            }
        };
        return VersionUtils;
    }());
    feng3d.VersionUtils = VersionUtils;
    /**
     * 版本号键名称
     */
    var _versionKey = "__version__";
})(feng3d || (feng3d = {}));
//参考 egret https://github.com/egret-labs/egret-core/blob/master/src/extension/eui/binding/Watcher.ts
var feng3d;
(function (feng3d) {
    /**
     * @private
     */
    var listeners = "__listeners__";
    /**
     * @private
     */
    var bindables = "__bindables__";
    /**
     * @private
     */
    var bindableCount = 0;
    /**
     * Register a property of an instance is can be bound.
     * This method is ususally invoked by Watcher class.
     *
     * @param instance the instance to be registered.
     * @param property the property of specified instance to be registered.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 标记实例的一个属性是可绑定的,此方法通常由 Watcher 类调用。
     *
     * @param instance 要标记的实例
     * @param property 可绑定的属性。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    function registerBindable(instance, property) {
        if (instance.hasOwnProperty(bindables)) {
            instance[bindables].push(property);
        }
        else {
            var list = [property];
            if (instance[bindables]) {
                list = instance[bindables].concat(list);
            }
            instance[bindables] = list;
        }
    }
    feng3d.registerBindable = registerBindable;
    /**
     * @private
     *
     * @param host
     * @param property
     * @returns
     */
    function getPropertyDescriptor(host, property) {
        var data = Object.getOwnPropertyDescriptor(host, property);
        if (data) {
            return data;
        }
        var prototype = Object.getPrototypeOf(host);
        if (prototype) {
            return getPropertyDescriptor(prototype, property);
        }
        return null;
    }
    function notifyListener(host, property) {
        var list = host[listeners];
        var length = list.length;
        for (var i = 0; i < length; i += 2) {
            var listener = list[i];
            var target = list[i + 1];
            listener.call(target, property);
        }
    }
    /**
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods var you define an event handler that is executed whenever a bindable property is updated.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     * @language en_US
     */
    /**
     * Watcher 类能够监视可绑定属性的改变，您可以定义一个事件处理函数作为 Watcher 的回调方法，在每次可绑定属性的值改变时都执行此函数。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     * @language zh_CN
     */
    var Watcher = (function () {
        /**
         * Constructor.
         * Not for public use. This method is called only from the <code>watch()</code> method.
         * See the <code>watch()</code> method for parameter usage.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数，非公开。只能从 watch() 方法中调用此方法。有关参数用法，请参阅 watch() 方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Watcher(property, handler, thisObject, next) {
            /**
             * @private
             */
            this.isExecuting = false;
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }
        /**
         * Creates and starts a Watcher instance.
         * The Watcher can only watch the property of a Object which host is instance of egret.IEventDispatcher.
         * @param host The object that hosts the property or property chain to be watched.
         * You can use the use the <code>reset()</code> method to change the value of the <code>host</code> argument
         * after creating the Watcher instance.
         * The <code>host</code> maintains a list of <code>handlers</code> to invoke when <code>prop</code> changes.
         * @param chain A value specifying the property or chain to be watched.
         * For example, to watch the property <code>host.a.b.c</code>,
         * call the method as: <code>watch(host, ["a","b","c"], ...)</code>.
         * @param handler  An event handler function called when the value of the watched property
         * (or any property in a watched chain) is modified.
         * @param thisObject <code>this</code> object of which binding with handler
         * @returns he ChangeWatcher instance, if at least one property name has been specified to
         * the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建并启动 Watcher 实例。注意：Watcher 只能监视 host 为 egret.IEventDispatcher 对象的属性改变。若属性链中某个属性所对应的实例不是 egret.IEventDispatcher，
         * 则属性链中在它之后的属性改变将无法检测到。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 创建Watcher实例后，您可以利用<code>reset()</code>方法更改<code>host</code>参数的值。
         * 当<code>prop</code>改变的时候，会使得host对应的一系列<code>handlers</code>被触发。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：watch¬(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.watch = function (host, chain, handler, thisObject) {
            if (chain.length > 0) {
                var property = chain.shift();
                var next = Watcher.watch(null, chain, handler, thisObject);
                var watcher = new Watcher(property, handler, thisObject, next);
                watcher.reset(host);
                return watcher;
            }
            else {
                return null;
            }
        };
        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        Watcher.checkBindable = function (host, property) {
            var list = host[bindables];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            if (!host[listeners]) {
                host[listeners] = [];
            }
            var data = getPropertyDescriptor(host, property);
            if (data && data.set && data.get) {
                var orgSet = data.set;
                data.set = function (value) {
                    if (this[property] != value) {
                        orgSet.call(this, value);
                        notifyListener(this, property);
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                bindableCount++;
                var newProp = "_" + bindableCount + property;
                host[newProp] = data ? data.value : undefined;
                data = { enumerable: true, configurable: true };
                data.get = function () {
                    return this[newProp];
                };
                data.set = function (value) {
                    if (this[newProp] != value) {
                        this[newProp] = value;
                        notifyListener(this, property);
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            registerBindable(host, property);
        };
        /**
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从当前宿主中断开此 Watcher 实例及其处理函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.unwatch = function () {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        };
        /**
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 检索观察的属性或属性链的当前值，当宿主对象为空时此值为空。
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.getValue = function () {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        };
        Watcher.prototype.setValue = function (value) {
            if (this.next) {
                this.next.setValue(value);
            }
            else {
                this.setHostPropertyValue(value);
            }
        };
        /**
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置处理函数。
         * @param handler 处理函数，此参数必须为非空。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.setHandler = function (handler, thisObject) {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }
        };
        /**
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 重置此 Watcher 实例使用新的宿主对象。
         * 您可以通过该方法实现一个Watcher实例用于不同的宿主。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.reset = function (newHost) {
            if (newHost == this.host)
                return;
            var oldHost = this.host;
            if (oldHost) {
                var list = oldHost[listeners];
                var index = list.indexOf(this);
                list.splice(index - 1, 2);
            }
            this.host = newHost;
            if (newHost) {
                Watcher.checkBindable(newHost, this.property);
                var list = newHost[listeners];
                list.push(this.onPropertyChange);
                list.push(this);
            }
            if (this.next)
                this.next.reset(this.getHostPropertyValue());
        };
        /**
         * @private
         *
         * @returns
         */
        Watcher.prototype.getHostPropertyValue = function () {
            return this.host ? this.host[this.property] : null;
        };
        /**
         * @private
         *
         * @returns
         */
        Watcher.prototype.setHostPropertyValue = function (value) {
            this.host && (this.host[this.property] = value);
        };
        /**
         * @private
         */
        Watcher.prototype.onPropertyChange = function (property) {
            if (property == this.property && !this.isExecuting) {
                try {
                    this.isExecuting = true;
                    if (this.next)
                        this.next.reset(this.getHostPropertyValue());
                    this.handler.call(this.thisObject, this.getValue());
                }
                finally {
                    this.isExecuting = false;
                }
            }
        };
        return Watcher;
    }());
    feng3d.Watcher = Watcher;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 绑定工具类
     */
    var Binding = (function () {
        function Binding() {
        }
        /**
         * （单向）绑定属性
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         */
        Binding.bindProperty = function (host, chain, target, prop) {
            var watcher = feng3d.Watcher.watch(host, chain, null, null);
            if (watcher) {
                var assign = function (value) {
                    target[prop] = value;
                };
                watcher.setHandler(assign, null);
            }
            return watcher;
        };
        /**
         * 双向绑定属性
         */
        Binding.bothBindProperty = function (hosta, chaina, hostb, chainb) {
            var bothBind = new BothBind(hosta, chaina, hostb, chainb);
            return bothBind;
        };
        return Binding;
    }());
    feng3d.Binding = Binding;
    var BothBind = (function () {
        function BothBind(hosta, chaina, hostb, chainb) {
            this._watchera = feng3d.Watcher.watch(hosta, chaina, this.todata, this);
            this._watcherb = feng3d.Watcher.watch(hostb, chainb, this.fromdata, this);
        }
        BothBind.prototype.todata = function () {
            var value = this._watchera.getValue();
            if (value !== undefined) {
                this._watcherb.setValue(value);
            }
        };
        BothBind.prototype.fromdata = function () {
            var value = this._watcherb.getValue();
            if (value !== undefined) {
                this._watchera.setValue(value);
            }
        };
        BothBind.prototype.unwatch = function () {
            this._watchera.unwatch();
            this._watcherb.unwatch();
        };
        return BothBind;
    }());
    feng3d.BothBind = BothBind;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 获取feng3d运行时间，毫秒为单位
     */
    function getTimer() {
        return Date.now() - feng3d.feng3dStartTime;
    }
    feng3d.getTimer = getTimer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var StringUtils = (function () {
        function StringUtils() {
        }
        /**
         * 获取字符串
         * @param obj 转换为字符串的对象
         * @param showLen       显示长度
         * @param fill          长度不够是填充的字符串
         * @param tail          true（默认）:在尾部添加；false：在首部添加
         */
        StringUtils.getString = function (obj, showLen, fill, tail) {
            if (showLen === void 0) { showLen = -1; }
            if (fill === void 0) { fill = " "; }
            if (tail === void 0) { tail = true; }
            var str = "";
            if (obj.toString != null) {
                str = obj.toString();
            }
            else {
                str = obj;
            }
            if (showLen != -1) {
                while (str.length < showLen) {
                    if (tail) {
                        str = str + fill;
                    }
                    else {
                        str = fill + str;
                    }
                }
                if (str.length > showLen) {
                    str = str.substr(0, showLen);
                }
            }
            return str;
        };
        return StringUtils;
    }());
    feng3d.StringUtils = StringUtils;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 数组工具
     * @author feng 2017-01-03
     */
    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        /**
         * 删除数据元素
         * @param source    数组源数据
         * @param item      被删除数据
         * @param all       是否删除所有相同数据
         */
        ArrayUtils.removeItem = function (source, item, all) {
            if (all === void 0) { all = false; }
            var deleteIndexs = [];
            var index = source.indexOf(item);
            while (index != -1) {
                source.splice(index, 1);
                deleteIndexs.push(index);
                all || (index = -1);
            }
            return { deleteIndexs: deleteIndexs, length: source.length };
        };
        return ArrayUtils;
    }());
    feng3d.ArrayUtils = ArrayUtils;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 构建Map类代替Dictionary
     * @author feng 2017-01-03
     */
    var Map = (function () {
        function Map() {
            this.keyMap = {};
            this.valueMap = {};
        }
        /**
         * 删除
         */
        Map.prototype.delete = function (k) {
            delete this.keyMap[feng3d.UIDUtils.getUID(k)];
            delete this.valueMap[feng3d.UIDUtils.getUID(k)];
        };
        /**
         * 添加映射
         */
        Map.prototype.push = function (k, v) {
            this.keyMap[feng3d.UIDUtils.getUID(k)] = k;
            this.valueMap[feng3d.UIDUtils.getUID(k)] = v;
        };
        /**
         * 通过key获取value
         */
        Map.prototype.get = function (k) {
            return this.valueMap[feng3d.UIDUtils.getUID(k)];
        };
        /**
         * 获取键列表
         */
        Map.prototype.getKeys = function () {
            var keys = [];
            for (var key in this.keyMap) {
                keys.push(this.keyMap[key]);
            }
            return keys;
        };
        /**
         * 清理字典
         */
        Map.prototype.clear = function () {
            this.keyMap = {};
            this.valueMap = {};
        };
        return Map;
    }());
    feng3d.Map = Map;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 数据序列化
     * @author feng 2017-03-11
     */
    var Serialization = (function () {
        function Serialization() {
        }
        /**
         * 由纯数据对象（无循环引用）转换为复杂类型（例如feng3d对象）
         */
        Serialization.prototype.readObject = function (data, object) {
            if (object === void 0) { object = null; }
            if (feng3d.ClassUtils.isBaseType(data)) {
                return data;
            }
            if (data instanceof Array) {
                object = object || [];
                for (var i = 0; i < data.length; i++) {
                    object[i] = this.readObject(data[i], object[i]);
                }
                return object;
            }
            if (!object) {
                var cls = feng3d.ClassUtils.getDefinitionByName(data.__className__);
                if (cls == null)
                    return undefined;
                object = new cls();
            }
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var ishandle = this.handle(object, key, data[key]);
                if (ishandle)
                    continue;
                object[key] = this.readObject(data[key], object[key]);
            }
            return object;
        };
        Serialization.prototype.handle = function (object, key, data) {
            if (feng3d.ClassUtils.is(object, feng3d.Object3D) && key == "children_") {
                var children = this.readObject(data);
                var object3D = object;
                for (var i = 0; i < children.length; i++) {
                    children[i] && object3D.setChildAt(children[i], i);
                }
                return true;
            }
            if (feng3d.ClassUtils.is(object, feng3d.Component) && key == "components_") {
                var components = this.readObject(data);
                var component = object;
                for (var i = 0; i < components.length; i++) {
                    component.setComponentAt(components[i], i);
                }
                return true;
            }
            if (feng3d.ClassUtils.is(object, feng3d.SegmentGeometry) && key == "segments_") {
                var segments = this.readObject(data);
                var segmentGeometry = object;
                for (var i = 0; i < segments.length; i++) {
                    segmentGeometry.setSegmentAt(segments[i], i);
                }
                return true;
            }
            return false;
        };
        /**
         * 由复杂类型（例如feng3d对象）转换为纯数据对象（无循环引用）
         */
        Serialization.prototype.writeObject = function (object) {
            //排除指定对象
            if (feng3d.serializationConfig.excludeObject.indexOf(object) != -1) {
                return undefined;
            }
            if (feng3d.ClassUtils.isBaseType(object)) {
                return object;
            }
            if (object instanceof Array) {
                var arr = [];
                for (var i = 0; i < object.length; i++) {
                    var item = this.writeObject(object[i]);
                    if (item !== undefined) {
                        arr.push(item);
                    }
                }
                if (arr.length == 0)
                    return undefined;
                return arr;
            }
            var className = feng3d.ClassUtils.getQualifiedClassName(object);
            var toJson = feng3d.serializationConfig.classConfig[className] && feng3d.serializationConfig.classConfig[className].toJson;
            if (toJson) {
                return toJson(object);
            }
            var attributeNames = this.getAttributes(object);
            attributeNames = attributeNames.sort();
            //没有属性时不保存该对象
            if (attributeNames.length == 0)
                return undefined;
            var json = {};
            json.__className__ = className;
            for (var i = 0; i < attributeNames.length; i++) {
                var attributeName = attributeNames[i];
                var value = this.writeObject(object[attributeName]);
                if (value !== undefined) {
                    json[attributeName] = value;
                }
            }
            return json;
        };
        Serialization.prototype.getAttributes = function (object) {
            var className = feng3d.ClassUtils.getQualifiedClassName(object);
            //保存以字母开头或者纯数字的所有属性
            var filterReg = /([a-zA-Z](\w*)|(\d+))/;
            if (className == "Array" || className == "Object") {
                var attributeNames = Object.keys(object);
            }
            else {
                //
                var attributeNames = Object.keys(this.getNewObject(className));
                attributeNames = attributeNames.filter(function (value, index, array) {
                    var result = filterReg.exec(value);
                    return result[0] == value;
                });
            }
            return attributeNames;
        };
        /**
         * 获取新对象来判断存储的属性
         */
        Serialization.prototype.getNewObject = function (className) {
            if (tempObjectMap[className]) {
                return tempObjectMap[className];
            }
            var cls = feng3d.ClassUtils.getDefinitionByName(className);
            tempObjectMap[className] = new cls();
            return tempObjectMap[className];
        };
        return Serialization;
    }());
    feng3d.Serialization = Serialization;
    var tempObjectMap = {};
    feng3d.serializationConfig = {
        // export var serializationConfig = {
        excludeObject: [],
        excludeClass: [], classConfig: {}
    };
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 事件
     * @author feng 2014-5-7
     */
    var Event = (function () {
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param data 携带数据
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         */
        function Event(type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            this._type = type;
            this._bubbles = bubbles;
            this.data = data;
        }
        Object.defineProperty(Event.prototype, "isStop", {
            /**
             * 是否停止处理事件监听器
             */
            get: function () {
                return this._isStop;
            },
            set: function (value) {
                this._isStopBubbles = this._isStop = this._isStopBubbles || value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "isStopBubbles", {
            /**
             * 是否停止冒泡
             */
            get: function () {
                return this._isStopBubbles;
            },
            set: function (value) {
                this._isStopBubbles = this._isStopBubbles || value;
            },
            enumerable: true,
            configurable: true
        });
        Event.prototype.tostring = function () {
            return "[" + (typeof this) + " type=\"" + this._type + "\" bubbles=" + this._bubbles + "]";
        };
        Object.defineProperty(Event.prototype, "bubbles", {
            /**
             * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
             */
            get: function () {
                return this._bubbles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "type", {
            /**
             * 事件的类型。类型区分大小写。
             */
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "target", {
            /**
             * 事件目标。
             */
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._currentTarget = value;
                if (this._target == null) {
                    this._target = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "currentTarget", {
            /**
             * 当前正在使用某个事件侦听器处理 Event 对象的对象。
             */
            get: function () {
                return this._currentTarget;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         */
        Event.ENTER_FRAME = "enterFrame";
        return Event;
    }());
    feng3d.Event = Event;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 为了实现非flash原生显示列表的冒泡事件，自定义事件适配器
     * @author feng 2016-3-22
     */
    var EventDispatcher = (function () {
        /**
         * 构建事件适配器
         * @param target		事件适配主体
         */
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            this._listenermap = {};
            /**
             * 冒泡属性名称为“parent”
             */
            this._bubbleAttribute = "parent";
            /**
             * 延迟计数，当计数大于0时事件将会被收集，等到计数等于0时派发
             */
            this._delaycount = 0;
            /**
             * 被延迟的事件列表
             */
            this._delayEvents = [];
            this._target = target;
            if (this._target == null)
                this._target = this;
        }
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        EventDispatcher.prototype.once = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            if (listener == null)
                return;
            this._addEventListener(type, listener, thisObject, priority, true);
        };
        /**
         * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        EventDispatcher.prototype.addEventListener = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            if (listener == null)
                return;
            this._addEventListener(type, listener, thisObject, priority);
        };
        /**
         * 从 EventDispatcher 对象中删除侦听器. 如果没有向 IEventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
         *
         * @param type						事件的类型。
         * @param listener					要删除的侦听器对象。
         * @param thisObject                listener函数作用域
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener, thisObject) {
            this._removeEventListener(type, listener, thisObject);
        };
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEventDispatcher 对象。
         * @param event						调度到事件流中的 Event 对象。
         * @returns                         被延迟返回false，否则返回true
         */
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._delaycount > 0) {
                if (this._delayEvents.indexOf(event) == -1)
                    this._delayEvents.push(event);
                return false;
            }
            //设置目标
            event.target = this._target;
            var listeners = this._listenermap[event.type];
            if (listeners && listeners.length > 0) {
                var onceElements = [];
                //遍历调用事件回调函数
                for (var i = 0; i < listeners.length && !event.isStop; i++) {
                    var element = listeners[i];
                    element.listener.call(element.thisObject, event);
                    if (element.once) {
                        onceElements.push(i);
                    }
                }
                while (onceElements.length > 0) {
                    listeners.splice(onceElements.pop(), 1);
                }
            }
            //事件冒泡(冒泡阶段)
            if (event.bubbles && !event.isStopBubbles) {
                this.dispatchBubbleEvent(event);
            }
            return true;
        };
        /**
         * 锁住事件
         * 当派发事件时先收集下来，调用unlockEvent派发被延迟的事件
         * 每调用一次lockEvent计数加1、调用unlockEvent一次计数减1，当计数为0时派发所有被收集事件
         * 与unlockEvent配合使用
         */
        EventDispatcher.prototype.lockEvent = function () {
            this._delaycount = this._delaycount + 1;
        };
        /**
         * 解锁事件，派发被锁住的事件
         * 每调用一次lockEvent计数加1、调用unlockEvent一次计数减1，当计数为0时派发所有被收集事件
         * 与delay配合使用
         */
        EventDispatcher.prototype.unlockEvent = function () {
            this._delaycount = this._delaycount - 1;
            if (this._delaycount == 0) {
                for (var i = 0; i < this._delayEvents.length; i++) {
                    this.dispatchEvent(this._delayEvents[i]);
                }
                this._delayEvents.length = 0;
            }
        };
        Object.defineProperty(EventDispatcher.prototype, "isLockEvent", {
            /**
             * 事件是否被锁住
             */
            get: function () {
                return this._delaycount > 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器.
         *
         * @param type		事件的类型。
         * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         */
        EventDispatcher.prototype.hasEventListener = function (type) {
            return !!(this._listenermap[type] && this._listenermap[type].length);
        };
        /**
         * 派发冒泡事件
         * @param event						调度到事件流中的 Event 对象。
         */
        EventDispatcher.prototype.dispatchBubbleEvent = function (event) {
            var bubbleTargets = this.getBubbleTargets(event);
            bubbleTargets && bubbleTargets.forEach(function (element) {
                element && element.dispatchEvent(event);
            });
        };
        /**
         * 获取冒泡对象
         * @param event						调度到事件流中的 Event 对象。
         */
        EventDispatcher.prototype.getBubbleTargets = function (event) {
            return [this._target[this._bubbleAttribute]];
        };
        /**
         * 添加监听
         * @param dispatcher 派发器
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        EventDispatcher.prototype._addEventListener = function (type, listener, thisObject, priority, once) {
            if (thisObject === void 0) { thisObject = null; }
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            this._removeEventListener(type, listener, thisObject);
            var listeners = this._listenermap[type] = this._listenermap[type] || [];
            for (var i = 0; i < listeners.length; i++) {
                var element = listeners[i];
                if (priority > element.priority) {
                    break;
                }
            }
            listeners.splice(i, 0, { listener: listener, thisObject: thisObject, priority: priority, once: once });
        };
        /**
         * 移除监听
         * @param dispatcher 派发器
         * @param type						事件的类型。
         * @param listener					要删除的侦听器对象。
         * @param thisObject                listener函数作用域
         */
        EventDispatcher.prototype._removeEventListener = function (type, listener, thisObject) {
            if (thisObject === void 0) { thisObject = null; }
            var listeners = this._listenermap[type];
            if (listeners) {
                for (var i = listeners.length - 1; i >= 0; i--) {
                    var element = listeners[i];
                    if (element.listener == listener && element.thisObject == thisObject) {
                        listeners.splice(i, 1);
                    }
                }
                if (listeners.length == 0) {
                    delete this._listenermap[type];
                }
            }
        };
        return EventDispatcher;
    }());
    feng3d.EventDispatcher = EventDispatcher;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 心跳计时器
     */
    var SystemTicker = (function (_super) {
        __extends(SystemTicker, _super);
        /**
         * @private
         */
        function SystemTicker() {
            feng3d.feng3dStartTime = Date.now();
            _super.call(this);
            if (feng3d.ticker) {
                throw "心跳计时器为单例";
            }
            this.init();
        }
        SystemTicker.prototype.init = function () {
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame.call(window, onTick);
            function onTick() {
                feng3d.ticker.update();
                requestAnimationFrame.call(window, onTick);
            }
        };
        /**
         * @private
         * 执行一次刷新
         */
        SystemTicker.prototype.update = function () {
            this.dispatchEvent(new feng3d.Event(feng3d.Event.ENTER_FRAME));
        };
        return SystemTicker;
    }(feng3d.EventDispatcher));
    feng3d.SystemTicker = SystemTicker;
    /**
     * 心跳计时器单例
     */
    feng3d.ticker = new SystemTicker();
    feng3d.feng3dStartTime = -1;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 鼠标键盘输入，处理js事件中this关键字问题
     * @author feng 2016-12-19
     */
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input() {
            _super.call(this);
            this.clientX = 0;
            this.clientY = 0;
            var mouseKeyType = [
                "click", "dblclick",
                "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel",
                "keydown", "keypress", "keyup"];
            for (var i = 0; i < mouseKeyType.length; i++) {
                window.addEventListener(mouseKeyType[i], this.onMouseKey.bind(this));
            }
        }
        /**
         * 键盘按下事件
         */
        Input.prototype.onMouseKey = function (event) {
            if (event["clientX"] != undefined) {
                event = event;
                this.clientX = event.clientX;
                this.clientY = event.clientY;
            }
            this.dispatchEvent(new InputEvent(event, this, true));
        };
        /**
         *
         */
        Input.prototype.addEventListener = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            _super.prototype.addEventListener.call(this, type, listener, thisObject, priority);
        };
        return Input;
    }(feng3d.EventDispatcher));
    feng3d.Input = Input;
    var InputEventType = (function () {
        function InputEventType() {
            /** 鼠标双击 */
            this.DOUBLE_CLICK = "dblclick";
            /** 鼠标单击 */
            this.CLICK = "click";
            /** 鼠标按下 */
            this.MOUSE_DOWN = "mousedown";
            /** 鼠标弹起 */
            this.MOUSE_UP = "mouseup";
            /** 鼠标中键单击 */
            this.MIDDLE_CLICK = "middleclick";
            /** 鼠标中键按下 */
            this.MIDDLE_MOUSE_DOWN = "middlemousedown";
            /** 鼠标中键弹起 */
            this.MIDDLE_MOUSE_UP = "middlemouseup";
            /** 鼠标右键单击 */
            this.RIGHT_CLICK = "rightclick";
            /** 鼠标右键按下 */
            this.RIGHT_MOUSE_DOWN = "rightmousedown";
            /** 鼠标右键弹起 */
            this.RIGHT_MOUSE_UP = "rightmouseup";
            /** 鼠标移动 */
            this.MOUSE_MOVE = "mousemove";
            /** 鼠标移出 */
            this.MOUSE_OUT = "mouseout";
            /** 鼠标移入 */
            this.MOUSE_OVER = "mouseover";
            /** 鼠标滚动滚轮 */
            this.MOUSE_WHEEL = "mousewheel";
            /** 键盘按下 */
            this.KEY_DOWN = "keydown";
            /** 键盘按着 */
            this.KEY_PRESS = "keypress";
            /** 键盘弹起 */
            this.KEY_UP = "keyup";
        }
        return InputEventType;
    }());
    feng3d.InputEventType = InputEventType;
    var InputEvent = (function (_super) {
        __extends(InputEvent, _super);
        function InputEvent(event, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = true; }
            _super.call(this, event.type, null, true);
            if (event["clientX"] != undefined) {
                var mouseEvent = event;
                this.clientX = mouseEvent.clientX;
                this.clientY = mouseEvent.clientY;
                if (["click", "mousedown", "mouseup"].indexOf(mouseEvent.type) != -1) {
                    this["_type"] = ["", "middle", "right"][mouseEvent.button] + mouseEvent.type;
                }
            }
            if (event["keyCode"] != undefined) {
                var keyboardEvent = event;
                this.keyCode = keyboardEvent.keyCode;
            }
            if (event["wheelDelta"] != undefined) {
                var wheelEvent = event;
                this.wheelDelta = wheelEvent.wheelDelta;
            }
        }
        return InputEvent;
    }(feng3d.Event));
    feng3d.InputEvent = InputEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 按键捕获
     * @author feng 2016-4-26
     */
    var KeyCapture = (function () {
        /**
         * 构建
         * @param stage		舞台
         */
        function KeyCapture(shortCut) {
            /**
             * 捕获的按键字典
             */
            this._mouseKeyDic = {};
            this._keyState = shortCut.keyState;
            //
            feng3d.input.addEventListener(feng3d.inputType.KEY_DOWN, this.onKeydown, this);
            feng3d.input.addEventListener(feng3d.inputType.KEY_UP, this.onKeyup, this);
            this._boardKeyDic = {};
            this.defaultSupportKeys();
            //监听鼠标事件
            var mouseEvents = [
                feng3d.inputType.DOUBLE_CLICK,
                feng3d.inputType.CLICK,
                feng3d.inputType.MOUSE_DOWN,
                feng3d.inputType.MOUSE_UP,
                feng3d.inputType.MIDDLE_CLICK,
                feng3d.inputType.MIDDLE_MOUSE_DOWN,
                feng3d.inputType.MIDDLE_MOUSE_UP,
                feng3d.inputType.RIGHT_CLICK,
                feng3d.inputType.RIGHT_MOUSE_DOWN,
                feng3d.inputType.RIGHT_MOUSE_UP,
                feng3d.inputType.MOUSE_MOVE,
                feng3d.inputType.MOUSE_OVER,
                feng3d.inputType.MOUSE_OUT,
            ];
            for (var i = 0; i < mouseEvents.length; i++) {
                feng3d.input.addEventListener(mouseEvents[i], this.onMouseOnce, this);
            }
            feng3d.input.addEventListener(feng3d.inputType.MOUSE_WHEEL, this.onMousewheel, this);
        }
        /**
         * 默认支持按键
         */
        KeyCapture.prototype.defaultSupportKeys = function () {
            this._boardKeyDic[17] = "ctrl";
            this._boardKeyDic[16] = "shift";
            this._boardKeyDic[32] = "escape";
            this._boardKeyDic[18] = "alt";
            this._boardKeyDic[46] = "del";
        };
        /**
         * 鼠标事件
         */
        KeyCapture.prototype.onMouseOnce = function (event) {
            var mouseKey = event.type;
            this._keyState.pressKey(mouseKey, event);
            this._keyState.releaseKey(mouseKey, event);
        };
        /**
         * 鼠标事件
         */
        KeyCapture.prototype.onMousewheel = function (event) {
            var mouseKey = event.type;
            this._keyState.pressKey(mouseKey, event);
            this._keyState.releaseKey(mouseKey, event);
        };
        /**
         * 键盘按下事件
         */
        KeyCapture.prototype.onKeydown = function (event) {
            var boardKey = this.getBoardKey(event.keyCode);
            if (boardKey != null)
                this._keyState.pressKey(boardKey, event);
        };
        /**
         * 键盘弹起事件
         */
        KeyCapture.prototype.onKeyup = function (event) {
            var boardKey = this.getBoardKey(event.keyCode);
            if (boardKey)
                this._keyState.releaseKey(boardKey, event);
        };
        /**
         * 获取键盘按键名称
         */
        KeyCapture.prototype.getBoardKey = function (keyCode) {
            var boardKey = this._boardKeyDic[keyCode];
            if (boardKey == null && 65 <= keyCode && keyCode <= 90) {
                boardKey = String.fromCharCode(keyCode).toLocaleLowerCase();
            }
            return boardKey;
        };
        return KeyCapture;
    }());
    feng3d.KeyCapture = KeyCapture;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 按键状态
     * @author feng 2016-4-26
     */
    var KeyState = (function (_super) {
        __extends(KeyState, _super);
        /**
         * 构建
         */
        function KeyState() {
            _super.call(this);
            this._keyStateDic = {};
        }
        /**
         * 按下键
         * @param key 	键名称
         * @param data	携带数据
         */
        KeyState.prototype.pressKey = function (key, data) {
            this._keyStateDic[key] = true;
            this.dispatchEvent(new feng3d.ShortCutEvent(key, data));
        };
        /**
         * 释放键
         * @param key	键名称
         * @param data	携带数据
         */
        KeyState.prototype.releaseKey = function (key, data) {
            this._keyStateDic[key] = false;
            this.dispatchEvent(new feng3d.ShortCutEvent(key, data));
        };
        /**
         * 获取按键状态
         * @param key 按键名称
         */
        KeyState.prototype.getKeyState = function (key) {
            return !!this._keyStateDic[key];
        };
        return KeyState;
    }(feng3d.EventDispatcher));
    feng3d.KeyState = KeyState;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 快捷键捕获
     * @author feng 2016-4-26
     */
    var ShortCutCapture = (function () {
        /**
         * 构建快捷键捕获
         * @param shortCut				快捷键环境
         * @param key					快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
         * @param command				要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
         * @param stateCommand			要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
         * @param when					快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。
         */
        function ShortCutCapture(shortCut, key, command, stateCommand, when) {
            if (command === void 0) { command = null; }
            if (stateCommand === void 0) { stateCommand = null; }
            if (when === void 0) { when = null; }
            this._shortCut = shortCut;
            this._keyState = shortCut.keyState;
            this._key = key;
            this._command = command;
            this._stateCommand = stateCommand;
            this._when = when;
            this._keys = this.getKeys(key);
            this._states = this.getStates(when);
            this._commands = this.getCommands(command);
            this._stateCommands = this.getStateCommand(stateCommand);
            this.init();
        }
        /**
         * 初始化
         */
        ShortCutCapture.prototype.init = function () {
            for (var i = 0; i < this._keys.length; i++) {
                this._keyState.addEventListener(this._keys[i].key, this.onCapture, this);
            }
        };
        /**
         * 处理捕获事件
         */
        ShortCutCapture.prototype.onCapture = function (event) {
            var inWhen = this.checkActivityStates(this._states);
            var pressKeys = this.checkActivityKeys(this._keys);
            if (pressKeys && inWhen) {
                this.dispatchCommands(this._commands, event.data);
                this.executeStateCommands(this._stateCommands);
            }
        };
        /**
         * 派发命令
         */
        ShortCutCapture.prototype.dispatchCommands = function (commands, data) {
            for (var i = 0; i < commands.length; i++) {
                this._shortCut.dispatchEvent(new feng3d.ShortCutEvent(commands[i], data));
            }
        };
        /**
         * 执行状态命令
         */
        ShortCutCapture.prototype.executeStateCommands = function (stateCommands) {
            for (var i = 0; i < stateCommands.length; i++) {
                var stateCommand = stateCommands[i];
                if (stateCommand.not)
                    this._shortCut.deactivityState(stateCommand.state);
                else
                    this._shortCut.activityState(stateCommand.state);
            }
        };
        /**
         * 检测快捷键是否处于活跃状态
         */
        ShortCutCapture.prototype.checkActivityStates = function (states) {
            for (var i = 0; i < states.length; i++) {
                if (!this.getState(states[i]))
                    return false;
            }
            return true;
        };
        /**
         * 获取是否处于指定状态中（支持一个！取反）
         * @param state 状态名称
         */
        ShortCutCapture.prototype.getState = function (state) {
            var result = this._shortCut.getState(state.state);
            if (state.not) {
                result = !result;
            }
            return result;
        };
        /**
         * 检测是否按下给出的键
         * @param keys 按键数组
         */
        ShortCutCapture.prototype.checkActivityKeys = function (keys) {
            for (var i = 0; i < keys.length; i++) {
                if (!this.getKeyValue(keys[i]))
                    return false;
            }
            return true;
        };
        /**
         * 获取按键状态（true：按下状态，false：弹起状态）
         */
        ShortCutCapture.prototype.getKeyValue = function (key) {
            var value = this._keyState.getKeyState(key.key);
            if (key.not) {
                value = !value;
            }
            return value;
        };
        /**
         * 获取状态列表
         * @param when		状态字符串
         */
        ShortCutCapture.prototype.getStates = function (when) {
            var states = [];
            if (when == null)
                return states;
            var state = when.trim();
            if (state.length == 0) {
                return states;
            }
            var stateStrs = state.split("+");
            for (var i = 0; i < stateStrs.length; i++) {
                states.push(new State(stateStrs[i]));
            }
            return states;
        };
        /**
         * 获取键列表
         * @param key		快捷键
         */
        ShortCutCapture.prototype.getKeys = function (key) {
            var keyStrs = key.split("+");
            var keys = [];
            for (var i = 0; i < keyStrs.length; i++) {
                keys.push(new Key(keyStrs[i]));
            }
            return keys;
        };
        /**
         * 获取命令列表
         * @param command	命令
         */
        ShortCutCapture.prototype.getCommands = function (command) {
            var commands = [];
            if (command == null)
                return commands;
            command = command.trim();
            var commandStrs = command.split(",");
            for (var i = 0; i < commandStrs.length; i++) {
                var commandStr = commandStrs[i].trim();
                if (commandStr.length > 0) {
                    commands.push(commandStr);
                }
            }
            return commands;
        };
        /**
         * 获取状态命令列表
         * @param stateCommand	状态命令
         */
        ShortCutCapture.prototype.getStateCommand = function (stateCommand) {
            var stateCommands = [];
            if (stateCommand == null)
                return stateCommands;
            stateCommand = stateCommand.trim();
            var stateCommandStrs = stateCommand.split(",");
            for (var i = 0; i < stateCommandStrs.length; i++) {
                var commandStr = stateCommandStrs[i].trim();
                if (commandStr.length > 0) {
                    stateCommands.push(new StateCommand(commandStr));
                }
            }
            return stateCommands;
        };
        /**
         * 销毁
         */
        ShortCutCapture.prototype.destroy = function () {
            for (var i = 0; i < this._keys.length; i++) {
                this._keyState.removeEventListener(this._keys[i].key, this.onCapture, this);
            }
            this._shortCut = null;
            this._keys = null;
            this._states = null;
        };
        return ShortCutCapture;
    }());
    feng3d.ShortCutCapture = ShortCutCapture;
})(feng3d || (feng3d = {}));
/**
 * 按键
 * @author feng 2016-6-6
 */
var Key = (function () {
    function Key(key) {
        key = key.trim();
        if (key.charAt(0) == "!") {
            this.not = true;
            key = key.substr(1).trim();
        }
        this.key = key;
    }
    return Key;
}());
/**
 * 状态
 * @author feng 2016-6-6
 */
var State = (function () {
    function State(state) {
        state = state.trim();
        if (state.charAt(0) == "!") {
            this.not = true;
            state = state.substr(1).trim();
        }
        this.state = state;
    }
    return State;
}());
/**
 * 状态命令
 * @author feng 2016-6-6
 */
var StateCommand = (function () {
    function StateCommand(state) {
        state = state.trim();
        if (state.charAt(0) == "!") {
            this.not = true;
            state = state.substr(1).trim();
        }
        this.state = state;
    }
    return StateCommand;
}());
var feng3d;
(function (feng3d) {
    /**
     * 快捷键命令事件
     * @author feng 2016-4-27
     */
    var ShortCutEvent = (function (_super) {
        __extends(ShortCutEvent, _super);
        /**
         * 构建
         * @param command		命令名称
         */
        function ShortCutEvent(command, data) {
            _super.call(this, command, data);
        }
        return ShortCutEvent;
    }(feng3d.Event));
    feng3d.ShortCutEvent = ShortCutEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 初始化快捷键模块
     * @author feng 2016-4-26
     *
     * <pre>
var shortcuts:Array = [ //
//在按下key1时触发命令command1
    {key: "key1", command: "command1", when: ""}, //
     //在按下key1时触发状态命令改变stateCommand1为激活状态
    {key: "key1", stateCommand: "stateCommand1", when: "state1"}, //
     //处于state1状态时按下key1触发命令command1
    {key: "key1", command: "command1", when: "state1"}, //
    //处于state1状态不处于state2时按下key1与没按下key2触发command1与command2，改变stateCommand1为激活状态，stateCommand2为非激活状态
    {key: "key1+ ! key2", command: "command1,command2", stateCommand: "stateCommand1,!stateCommand2", when: "state1+!state2"}, //
    ];
//添加快捷键
shortCut.addShortCuts(shortcuts);
//监听命令
shortCut.addEventListener("run", function(e:Event):void
{
    trace("接受到命令：" + e.type);
});
     * </pre>
     */
    var ShortCut = (function (_super) {
        __extends(ShortCut, _super);
        /**
         * 初始化快捷键模块
         */
        function ShortCut() {
            _super.call(this);
            this.keyState = new feng3d.KeyState();
            this.keyCapture = new feng3d.KeyCapture(this);
            this.captureDic = {};
            this.stateDic = {};
        }
        /**
         * 添加快捷键
         * @param shortcuts		快捷键列表
         */
        ShortCut.prototype.addShortCuts = function (shortcuts) {
            for (var i = 0; i < shortcuts.length; i++) {
                var shortcut = shortcuts[i];
                var shortcutUniqueKey = this.getShortcutUniqueKey(shortcut);
                this.captureDic[shortcutUniqueKey] = this.captureDic[shortcutUniqueKey] || new feng3d.ShortCutCapture(this, shortcut.key, shortcut.command, shortcut.stateCommand, shortcut.when);
            }
        };
        /**
         * 删除快捷键
         * @param shortcuts		快捷键列表
         */
        ShortCut.prototype.removeShortCuts = function (shortcuts) {
            for (var i = 0; i < shortcuts.length; i++) {
                var shortcutUniqueKey = this.getShortcutUniqueKey(shortcuts[i]);
                var shortCutCapture = this.captureDic[shortcutUniqueKey];
                if (feng3d.ShortCutCapture != null) {
                    shortCutCapture.destroy();
                }
                delete this.captureDic[shortcutUniqueKey];
            }
        };
        /**
         * 移除所有快捷键
         */
        ShortCut.prototype.removeAllShortCuts = function () {
            var _this = this;
            var keys = [];
            var key;
            for (key in this.captureDic) {
                keys.push(key);
            }
            keys.forEach(function (key) {
                var shortCutCapture = _this.captureDic[key];
                shortCutCapture.destroy();
                delete _this.captureDic[key];
            });
        };
        /**
         * 激活状态
         * @param state 状态名称
         */
        ShortCut.prototype.activityState = function (state) {
            this.stateDic[state] = true;
        };
        /**
         * 取消激活状态
         * @param state 状态名称
         */
        ShortCut.prototype.deactivityState = function (state) {
            delete this.stateDic[state];
        };
        /**
         * 获取状态
         * @param state 状态名称
         */
        ShortCut.prototype.getState = function (state) {
            return !!this.stateDic[state];
        };
        /**
         * 获取快捷键唯一字符串
         */
        ShortCut.prototype.getShortcutUniqueKey = function (shortcut) {
            return shortcut.key + "," + shortcut.command + "," + shortcut.when;
        };
        return ShortCut;
    }(feng3d.EventDispatcher));
    feng3d.ShortCut = ShortCut;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 组件事件
     * @author feng 2015-12-2
     */
    var ComponentEvent = (function (_super) {
        __extends(ComponentEvent, _super);
        function ComponentEvent() {
            _super.apply(this, arguments);
        }
        /**
         * 添加子组件事件
         */
        ComponentEvent.ADDED_COMPONENT = "addedComponent";
        /**
         * 移除子组件事件
         */
        ComponentEvent.REMOVED_COMPONENT = "removedComponent";
        return ComponentEvent;
    }(feng3d.Event));
    feng3d.ComponentEvent = ComponentEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 组件容器（集合）
     * @author feng 2015-5-6
     */
    var Component = (function (_super) {
        __extends(Component, _super);
        /**
         * 创建一个组件容器
         */
        function Component() {
            _super.call(this);
            /**
             * 组件列表
             */
            this.components_ = [];
            this._single = false;
            this.initComponent();
            this._type = this.constructor;
        }
        Object.defineProperty(Component.prototype, "single", {
            /**
             * 是否唯一，同类型3D对象组件只允许一个
             */
            get: function () { return this._single; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "type", {
            /**
             * 组件类型
             */
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化组件
         */
        Component.prototype.initComponent = function () {
            //以最高优先级监听组件被添加，设置父组件
            this.addEventListener(feng3d.ComponentEvent.ADDED_COMPONENT, this._onAddedComponent, this, Number.MAX_VALUE);
            //以最低优先级监听组件被删除，清空父组件
            this.addEventListener(feng3d.ComponentEvent.REMOVED_COMPONENT, this._onRemovedComponent, this, Number.MIN_VALUE);
        };
        Object.defineProperty(Component.prototype, "parentComponent", {
            /**
             * 父组件
             */
            get: function () {
                return this._parentComponent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "numComponents", {
            /**
             * 子组件个数
             */
            get: function () {
                return this.components_.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "components", {
            /**
             * 获取组件列表，无法通过返回数组对该组件进行子组件增删等操作
             */
            get: function () {
                return this.components_.concat();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加组件
         * @param component 被添加组件
         */
        Component.prototype.addComponent = function (component) {
            if (this.hasComponent(component)) {
                this.setComponentIndex(component, this.components_.length - 1);
                return;
            }
            this.addComponentAt(component, this.components_.length);
        };
        /**
         * 添加组件到指定位置
         * @param component		被添加的组件
         * @param index			插入的位置
         */
        Component.prototype.addComponentAt = function (component, index) {
            console.assert(component != this, "子项与父项不能相同");
            console.assert(index >= 0 && index <= this.numComponents, "给出索引超出范围");
            if (this.hasComponent(component)) {
                index = Math.min(index, this.components_.length - 1);
                this.setComponentIndex(component, index);
                return;
            }
            //组件唯一时移除同类型的组件
            if (component.single)
                this.removeComponentsByType(component.type);
            this.components_.splice(index, 0, component);
            //派发添加组件事件
            component.dispatchEvent(new feng3d.ComponentEvent(feng3d.ComponentEvent.ADDED_COMPONENT, { container: this, child: component }));
            this.dispatchEvent(new feng3d.ComponentEvent(feng3d.ComponentEvent.ADDED_COMPONENT, { container: this, child: component }));
        };
        /**
         * 设置组件到指定位置
         * @param component		被设置的组件
         * @param index			索引
         */
        Component.prototype.setComponentAt = function (component, index) {
            if (this.components_[index]) {
                this.removeComponentAt(index);
            }
            this.addComponentAt(component, index);
        };
        /**
         * 移除组件
         * @param component 被移除组件
         */
        Component.prototype.removeComponent = function (component) {
            console.assert(this.hasComponent(component), "只能移除在容器中的组件");
            var index = this.getComponentIndex(component);
            this.removeComponentAt(index);
        };
        /**
         * 移除组件
         * @param index		要删除的 Component 的子索引。
         */
        Component.prototype.removeComponentAt = function (index) {
            console.assert(index >= 0 && index < this.numComponents, "给出索引超出范围");
            var component = this.components_.splice(index, 1)[0];
            //派发移除组件事件
            component.dispatchEvent(new feng3d.ComponentEvent(feng3d.ComponentEvent.REMOVED_COMPONENT, { container: this, child: component }));
            this.dispatchEvent(new feng3d.ComponentEvent(feng3d.ComponentEvent.REMOVED_COMPONENT, { container: this, child: component }));
            return component;
        };
        /**
         * 获取组件在容器的索引位置
         * @param component			查询的组件
         * @return				    组件在容器的索引位置
         */
        Component.prototype.getComponentIndex = function (component) {
            console.assert(this.components_.indexOf(component) != -1, "组件不在容器中");
            var index = this.components_.indexOf(component);
            return index;
        };
        /**
         * 设置子组件的位置
         * @param component				子组件
         * @param index				位置索引
         */
        Component.prototype.setComponentIndex = function (component, index) {
            console.assert(index >= 0 && index < this.numComponents, "给出索引超出范围");
            var oldIndex = this.components_.indexOf(component);
            console.assert(oldIndex >= 0 && oldIndex < this.numComponents, "子组件不在容器内");
            this.components_.splice(oldIndex, 1);
            this.components_.splice(index, 0, component);
        };
        /**
         * 获取指定位置索引的子组件
         * @param index			位置索引
         * @return				子组件
         */
        Component.prototype.getComponentAt = function (index) {
            console.assert(index < this.numComponents, "给出索引超出范围");
            return this.components_[index];
        };
        /**
         * 根据类定义获取组件
         * <p>如果存在多个则返回第一个</p>
         * @param type				类定义
         * @return                  返回指定类型组件
         */
        Component.prototype.getComponentByType = function (type) {
            var component = this.getComponentsByType(type)[0];
            return component;
        };
        /**
         * 根据类定义查找组件
         * @param type		类定义
         * @return			返回与给出类定义一致的组件
         */
        Component.prototype.getComponentsByType = function (type) {
            var filterResult = this.components_.filter(function (value, index, array) {
                return value instanceof type;
            });
            return filterResult;
        };
        /**
         * 移除指定类型组件
         * @param type 组件类型
         */
        Component.prototype.removeComponentsByType = function (type) {
            var removeComponents = [];
            for (var i = this.components_.length - 1; i >= 0; i--) {
                if (this.components_[i]._type == type)
                    removeComponents.push(this.removeComponentAt(i));
            }
            return removeComponents;
        };
        /**
         * 根据类定义获取或创建组件
         * <p>当不存在该类型对象时创建一个该组件并且添加到容器中</p>
         * @param cls       类定义
         * @return          返回与给出类定义一致的组件
         */
        Component.prototype.getOrCreateComponentByClass = function (cls) {
            var component = this.getComponentByType(cls);
            if (component == null) {
                component = new cls();
                this.addComponent(component);
            }
            return component;
        };
        /**
         * 判断是否拥有组件
         * @param com	被检测的组件
         * @return		true：拥有该组件；false：不拥有该组件。
         */
        Component.prototype.hasComponent = function (com) {
            return this.components_.indexOf(com) != -1;
        };
        /**
         * 交换子组件位置
         * @param index1		第一个子组件的索引位置
         * @param index2		第二个子组件的索引位置
         */
        Component.prototype.swapComponentsAt = function (index1, index2) {
            console.assert(index1 >= 0 && index1 < this.numComponents, "第一个子组件的索引位置超出范围");
            console.assert(index2 >= 0 && index2 < this.numComponents, "第二个子组件的索引位置超出范围");
            var temp = this.components_[index1];
            this.components_[index1] = this.components_[index2];
            this.components_[index2] = temp;
        };
        /**
         * 交换子组件位置
         * @param a		第一个子组件
         * @param b		第二个子组件
         */
        Component.prototype.swapComponents = function (a, b) {
            console.assert(this.hasComponent(a), "第一个子组件不在容器中");
            console.assert(this.hasComponent(b), "第二个子组件不在容器中");
            this.swapComponentsAt(this.getComponentIndex(a), this.getComponentIndex(b));
        };
        /**
         * 派发子组件事件
         * <p>事件广播给子组件</p>
         * @param event     事件
         * @param depth     广播深度
         */
        Component.prototype.dispatchChildrenEvent = function (event, depth) {
            if (depth === void 0) { depth = 1; }
            if (depth == 0)
                return;
            this.components_.forEach(function (value, index, array) {
                value.dispatchEvent(event);
                value.dispatchChildrenEvent(event, depth - 1);
            });
        };
        //------------------------------------------
        //@protected
        //------------------------------------------
        /**
         * 处理被添加组件事件
         */
        Component.prototype.onBeAddedComponent = function (event) {
        };
        /**
         * 处理被移除组件事件
         */
        Component.prototype.onBeRemovedComponent = function (event) {
        };
        /**
         * 获取冒泡对象
         */
        Component.prototype.getBubbleTargets = function (event) {
            if (event === void 0) { event = null; }
            var bubbleTargets = _super.prototype.getBubbleTargets.call(this, event);
            bubbleTargets.push(this._parentComponent);
            return bubbleTargets;
        };
        //------------------------------------------
        //@private
        //------------------------------------------
        /**
         * 处理添加组件事件，此处为被添加，设置父组件
         */
        Component.prototype._onAddedComponent = function (event) {
            var data = event.data;
            if (data.child == this) {
                this._parentComponent = data.container;
                this.onBeAddedComponent(event);
            }
        };
        /**
         * 处理移除组件事件，此处为被移除，清空父组件
         */
        Component.prototype._onRemovedComponent = function (event) {
            var data = event.data;
            if (event.data.child == this) {
                this.onBeRemovedComponent(event);
                this._parentComponent = null;
            }
        };
        return Component;
    }(feng3d.EventDispatcher));
    feng3d.Component = Component;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 加载类
     * @author feng 2016-12-14
     */
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            _super.apply(this, arguments);
        }
        /**
         * 加载资源
         * @param url   路径
         */
        Loader.prototype.load = function (url) {
            this._url = url;
        };
        /**
         * 加载文本
         * @param url   路径
         */
        Loader.prototype.loadText = function (url) {
            this._url = url;
            this.dataFormat = feng3d.LoaderDataFormat.TEXT;
            this.xmlHttpRequestLoad();
        };
        /**
         * 加载二进制
         * @param url   路径
         */
        Loader.prototype.loadBinary = function (url) {
            this._url = url;
            this.dataFormat = feng3d.LoaderDataFormat.BINARY;
            this.xmlHttpRequestLoad();
        };
        /**
         * 加载图片
         * @param url   路径
         */
        Loader.prototype.loadImage = function (url) {
            this.dataFormat = feng3d.LoaderDataFormat.IMAGE;
            this._image = new Image();
            this._image.onload = this.onImageLoad.bind(this);
            this._image.onerror = this.onImageError.bind(this);
            this._image.src = url;
        };
        /**
         * 使用XMLHttpRequest加载
         */
        Loader.prototype.xmlHttpRequestLoad = function () {
            this._request = new XMLHttpRequest();
            this._request.open('Get', this._url, true);
            this._request.responseType = this.dataFormat == feng3d.LoaderDataFormat.BINARY ? "arraybuffer" : "";
            this._request.onreadystatechange = this.onRequestReadystatechange.bind(this);
            this._request.onprogress = this.onRequestProgress.bind(this);
            this._request.send();
        };
        /**
         * 请求进度回调
         */
        Loader.prototype.onRequestProgress = function (event) {
            this.bytesLoaded = event.loaded;
            this.bytesTotal = event.total;
            this.dispatchEvent(new feng3d.LoaderEvent(feng3d.LoaderEvent.PROGRESS, this));
        };
        /**
         * 请求状态变化回调
         */
        Loader.prototype.onRequestReadystatechange = function (ev) {
            if (this._request.readyState == 4) {
                this._request.onreadystatechange = null;
                if (this._request.status >= 200 && this._request.status < 300) {
                    this.content = this.dataFormat == feng3d.LoaderDataFormat.TEXT ? this._request.responseText : this._request.response;
                    this.dispatchEvent(new feng3d.LoaderEvent(feng3d.LoaderEvent.COMPLETE, this));
                }
                else {
                    if (!this.hasEventListener(feng3d.LoaderEvent.ERROR)) {
                        throw new Error("Error status: " + this._request + " - Unable to load " + this._url);
                    }
                    this.dispatchEvent(new feng3d.LoaderEvent(feng3d.LoaderEvent.ERROR, this));
                }
            }
        };
        /**
         * 加载图片完成回调
         */
        Loader.prototype.onImageLoad = function (event) {
            this.content = this._image;
            this.dispatchEvent(new feng3d.LoaderEvent(feng3d.LoaderEvent.COMPLETE, this));
        };
        /**
         * 加载图片出错回调
         */
        Loader.prototype.onImageError = function (event) {
            console.error("Error while trying to load texture: " + this._url);
            //
            this._image.src = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC41AP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APH6KKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76P//Z";
            //
            this.onImageLoad(null);
            this.dispatchEvent(new feng3d.LoaderEvent(feng3d.LoaderEvent.ERROR, this));
        };
        return Loader;
    }(feng3d.EventDispatcher));
    feng3d.Loader = Loader;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 加载事件
     * @author feng 2016-12-14
     */
    var LoaderEvent = (function (_super) {
        __extends(LoaderEvent, _super);
        function LoaderEvent() {
            _super.apply(this, arguments);
        }
        /**
         * 加载进度发生改变时调度。
         */
        LoaderEvent.PROGRESS = "progress";
        /**
         * 加载完成后调度。
         */
        LoaderEvent.COMPLETE = "complete";
        /**
         * 加载出错时调度。
         */
        LoaderEvent.ERROR = "error";
        return LoaderEvent;
    }(feng3d.Event));
    feng3d.LoaderEvent = LoaderEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 加载数据类型
     * @author feng 2016-12-14
     */
    var LoaderDataFormat = (function () {
        function LoaderDataFormat() {
        }
        /**
         * 以原始二进制数据形式接收下载的数据。
         */
        LoaderDataFormat.BINARY = "binary";
        /**
         * 以文本形式接收已下载的数据。
         */
        LoaderDataFormat.TEXT = "text";
        /**
         * 图片数据
         */
        LoaderDataFormat.IMAGE = "image";
        return LoaderDataFormat;
    }());
    feng3d.LoaderDataFormat = LoaderDataFormat;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染代码库
     * @author feng 2016-12-16
     */
    var ShaderLib = (function () {
        function ShaderLib() {
        }
        ShaderLib.getShaderContentByName = function (shaderName) {
            var shaderPath = "shaders/" + shaderName + ".glsl";
            return ShaderLib.shaderFileMap[shaderPath];
        };
        /**
         * 获取shaderCode
         */
        ShaderLib.getShaderCode = function (shaderName) {
            if (!_shaderMap[shaderName])
                _shaderMap[shaderName] = ShaderLoader.loadText(shaderName);
            return _shaderMap[shaderName];
        };
        /**
         * 获取ShaderMacro代码
         */
        ShaderLib.getMacroCode = function (macro) {
            var macroHeader = "";
            var macroNames = Object.keys(macro.valueMacros);
            macroNames = macroNames.sort();
            macroNames.forEach(function (macroName) {
                var value = macro.valueMacros[macroName];
                macroHeader += "#define " + macroName + " " + value + "\n";
            });
            macroNames = Object.keys(macro.boolMacros);
            macroNames = macroNames.sort();
            macroNames.forEach(function (macroName) {
                var value = macro.boolMacros[macroName];
                value && (macroHeader += "#define " + macroName + "\n");
            });
            macroNames = Object.keys(macro.addMacros);
            macroNames = macroNames.sort();
            macroNames.forEach(function (macroName) {
                var value = macro.addMacros[macroName];
                macroHeader += "#define " + macroName + " " + value + "\n";
            });
            return macroHeader;
        };
        ShaderLib.shaderFileMap = {};
        return ShaderLib;
    }());
    feng3d.ShaderLib = ShaderLib;
    /**
     * 渲染代码字典
     */
    var _shaderMap = {};
    /**
     * 渲染代码加载器字典
     */
    var _shaderLoaderMap = {};
    /**
     * 着色器加载器
     * @author feng 2016-12-15
     */
    var ShaderLoader = (function () {
        function ShaderLoader() {
        }
        /**
         * 加载shader
         * @param url   路径
         */
        ShaderLoader.loadText = function (shaderName) {
            var shaderCode = ShaderLib.getShaderContentByName(shaderName);
            //#include 正则表达式
            var includeRegExp = /#include<(.+)>/g;
            //
            var match = includeRegExp.exec(shaderCode);
            while (match != null) {
                var subShaderName = match[1];
                var subShaderCode = ShaderLib.getShaderCode(subShaderName);
                if (subShaderCode) {
                    shaderCode = shaderCode.replace(match[0], subShaderCode);
                }
                else {
                    var subShaderCode = ShaderLoader.loadText(subShaderName);
                    shaderCode = shaderCode.replace(match[0], subShaderCode);
                }
                match = includeRegExp.exec(shaderCode);
            }
            return shaderCode;
        };
        return ShaderLoader;
    }());
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 颜色
     * @author feng 2016-09-24
     */
    var Color = (function () {
        /**
         * 构建颜色
         * @param r     红[0,1]
         * @param g     绿[0,1]
         * @param b     蓝[0,1]
         * @param a     透明度[0,1]
         */
        function Color(r, g, b, a) {
            if (r === void 0) { r = 1; }
            if (g === void 0) { g = 1; }
            if (b === void 0) { b = 1; }
            if (a === void 0) { a = 1; }
            /**
             * 红[0,1]
             */
            this.r = 1;
            /**
             * 绿[0,1]
             */
            this.g = 1;
            /**
             * 蓝[0,1]
             */
            this.b = 1;
            /**
             * 透明度[0,1]
             */
            this.a = 1;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        /**
         * 从RGBA整型初始化颜色
         * @param r     红[0,255]
         * @param g     绿[0,255]
         * @param b     蓝[0,255]
         * @param a     透明度[0,255]
         */
        Color.prototype.fromInts = function (r, g, b, a) {
            this.r = r / 0xff;
            this.g = g / 0xff;
            this.b = b / 0xff;
            this.a = a / 0xff;
        };
        Color.prototype.fromUnit = function (color, hasAlpha) {
            if (hasAlpha === void 0) { hasAlpha = false; }
            this.a = (hasAlpha ? (color >> 24) & 0xff : 0xff) / 0xff;
            this.r = ((color >> 16) & 0xff) / 0xff;
            this.g = ((color >> 8) & 0xff) / 0xff;
            this.b = (color & 0xff) / 0xff;
        };
        /**
         * 转换为数组
         */
        Color.prototype.asArray = function () {
            var result = [];
            this.toArray(result);
            return result;
        };
        /**
         * 输出到数组
         * @param array     数组
         * @param index     存储在数组中的位置
         */
        Color.prototype.toArray = function (array, index) {
            if (index === void 0) { index = 0; }
            array[index] = this.r;
            array[index + 1] = this.g;
            array[index + 2] = this.b;
            array[index + 3] = this.a;
            return this;
        };
        /**
         * 输出为向量
         */
        Color.prototype.toVector3D = function () {
            return new feng3d.Vector3D(this.r, this.g, this.b, this.a);
        };
        Color.prototype.toInt = function () {
            var value = (this.a * 0xff) << 24 + (this.r * 0xff) << 16 + (this.g * 0xff) << 8 + (this.b * 0xff);
            return value;
        };
        /**
         * 输出16进制字符串
         */
        Color.prototype.toHexString = function () {
            var intR = (this.r * 0xff) | 0;
            var intG = (this.g * 0xff) | 0;
            var intB = (this.b * 0xff) | 0;
            var intA = (this.a * 0xff) | 0;
            return "#" + Color.ToHex(intA) + Color.ToHex(intR) + Color.ToHex(intG) + Color.ToHex(intB);
        };
        /**
         * 混合颜色
         * @param color 混入的颜色
         * @param rate  混入比例
         */
        Color.prototype.mix = function (color, rate) {
            if (rate === void 0) { rate = 0.5; }
            this.r = this.r * (1 - rate) + color.r * rate;
            this.g = this.g * (1 - rate) + color.g * rate;
            this.b = this.b * (1 - rate) + color.b * rate;
            this.a = this.a * (1 - rate) + color.a * rate;
            return this;
        };
        /**
         * 输出字符串
         */
        Color.prototype.toString = function () {
            return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
        };
        /**
         * [0,15]数值转为16进制字符串
         * param i  [0,15]数值
         */
        Color.ToHex = function (i) {
            var str = i.toString(16);
            if (i <= 0xf) {
                return ("0" + str).toUpperCase();
            }
            return str.toUpperCase();
        };
        return Color;
    }());
    feng3d.Color = Color;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 数学常量类
     */
    var MathConsts = (function () {
        function MathConsts() {
        }
        /**
         * 弧度转角度因子
         */
        MathConsts.RADIANS_TO_DEGREES = 180 / Math.PI;
        /**
         * 角度转弧度因子
         */
        MathConsts.DEGREES_TO_RADIANS = Math.PI / 180;
        return MathConsts;
    }());
    feng3d.MathConsts = MathConsts;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var DEG_TO_RAD = Math.PI / 180;
    /**
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     */
    var Point = (function () {
        /**
         * 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point.prototype, "length", {
            /**
             * 从 (0,0) 到此点的线段长度。
             */
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将 Point 的成员设置为指定值
         * @param x 该对象的x属性值
         * @param y 该对象的y属性值
         */
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /**
         * 克隆点对象
         */
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        /**
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @param toCompare 要比较的点。
         * @returns 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         */
        Point.prototype.equals = function (toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y;
        };
        /**
         * 返回 pt1 和 pt2 之间的距离。
         * @param p1 第一个点
         * @param p2 第二个点
         * @returns 第一个点和第二个点之间的距离。
         */
        Point.distance = function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        };
        /**
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @param sourcePoint 要从中复制数据的 Point 对象。
         */
        Point.prototype.copyFrom = function (sourcePoint) {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        };
        /**
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @param v 要添加的点。
         * @returns 新点。
         */
        Point.prototype.add = function (v) {
            return new Point(this.x + v.x, this.y + v.y);
        };
        /**
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @param pt1 第一个点。
         * @param pt2 第二个点。
         * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns 新的内插点。
         */
        Point.interpolate = function (pt1, pt2, f) {
            var f1 = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        };
        /**
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @param thickness 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         */
        Point.prototype.normalize = function (thickness) {
            if (this.x != 0 || this.y != 0) {
                var relativeThickness = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        };
        /**
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @param dx 水平坐标 x 的偏移量。
         * @param dy 水平坐标 y 的偏移量。
         */
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        /**
         * 将一对极坐标转换为笛卡尔点坐标。
         * @param len 极坐标对的长度。
         * @param angle 极坐标对的角度（以弧度表示）。
         */
        Point.polar = function (len, angle) {
            return new Point(len * Math.cos(angle / DEG_TO_RAD), len * Math.sin(angle / DEG_TO_RAD));
        };
        /**
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @param v 要减去的点。
         * @returns 新点。
         */
        Point.prototype.subtract = function (v) {
            return new Point(this.x - v.x, this.y - v.y);
        };
        /**
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @returns 坐标的字符串表示形式。
         */
        Point.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ")";
        };
        return Point;
    }());
    feng3d.Point = Point;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var rectanglePool = [];
    /**
     * 矩形
     *
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @author feng 2016-04-27
     */
    var Rectangle = (function () {
        /**
         * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rectangle.prototype, "right", {
            /**
             * x 和 width 属性的和。
             */
            get: function () {
                return this.x + this.width;
            },
            set: function (value) {
                this.width = value - this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            /**
             * y 和 height 属性的和。
             */
            get: function () {
                return this.y + this.height;
            },
            set: function (value) {
                this.height = value - this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            /**
             * 矩形左上角的 x 坐标。更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。
             * left 属性的值等于 x 属性的值。
             */
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.width += this.x - value;
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            /**
             * 矩形左上角的 y 坐标。更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。<br/>
             * top 属性的值等于 y 属性的值。
             */
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.height += this.y - value;
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "topLeft", {
            /**
             * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
             */
            get: function () {
                return new feng3d.Point(this.left, this.top);
            },
            set: function (value) {
                this.top = value.y;
                this.left = value.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottomRight", {
            /**
             * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
             */
            get: function () {
                return new feng3d.Point(this.right, this.bottom);
            },
            set: function (value) {
                this.bottom = value.y;
                this.right = value.x;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
         * @param sourceRect 要从中复制数据的 Rectangle 对象。
         */
        Rectangle.prototype.copyFrom = function (sourceRect) {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
            return this;
        };
        /**
         * 将 Rectangle 的成员设置为指定值
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        Rectangle.prototype.setTo = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @param x 检测点的x轴
         * @param y 检测点的y轴
         * @returns 如果检测点位于矩形内，返回true，否则，返回false
         */
        Rectangle.prototype.contains = function (x, y) {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        };
        /**
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，
         * 则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @param toIntersect 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
         * @returns 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和
         * height 属性均设置为 0 的矩形。
         */
        Rectangle.prototype.intersection = function (toIntersect) {
            return this.clone().$intersectInPlace(toIntersect);
        };
        /**
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @param dx Rectangle 对象横向增加的值。
         * @param dy Rectangle 对象纵向增加的值。
         */
        Rectangle.prototype.inflate = function (dx, dy) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        };
        /**
         * @private
         */
        Rectangle.prototype.$intersectInPlace = function (clipRect) {
            var x0 = this.x;
            var y0 = this.y;
            var x1 = clipRect.x;
            var y1 = clipRect.y;
            var l = Math.max(x0, x1);
            var r = Math.min(x0 + this.width, x1 + clipRect.width);
            if (l <= r) {
                var t = Math.max(y0, y1);
                var b = Math.min(y0 + this.height, y1 + clipRect.height);
                if (t <= b) {
                    this.setTo(l, t, r - l, b - t);
                    return this;
                }
            }
            this.setEmpty();
            return this;
        };
        /**
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle
         * 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns 如果两个矩形相交，返回true，否则返回false
         */
        Rectangle.prototype.intersects = function (toIntersect) {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        };
        /**
         * 确定此 Rectangle 对象是否为空。
         * @returns 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
         */
        Rectangle.prototype.isEmpty = function () {
            return this.width <= 0 || this.height <= 0;
        };
        /**
         * 将 Rectangle 对象的所有属性设置为 0。
         */
        Rectangle.prototype.setEmpty = function () {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        };
        /**
         * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @returns 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         */
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 包含点对象
         * @returns 如果包含，返回true，否则返回false
         */
        Rectangle.prototype.containsPoint = function (point) {
            if (this.x < point.x
                && this.x + this.width > point.x
                && this.y < point.y
                && this.y + this.height > point.y) {
                return true;
            }
            return false;
        };
        /**
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @param rect 所检查的 Rectangle 对象
         * @returns 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         */
        Rectangle.prototype.containsRect = function (rect) {
            var r1 = rect.x + rect.width;
            var b1 = rect.y + rect.height;
            var r2 = this.x + this.width;
            var b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        };
        /**
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @param toCompare 要与此 Rectangle 对象进行比较的矩形。
         * @returns 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         */
        Rectangle.prototype.equals = function (toCompare) {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        };
        /**
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         */
        Rectangle.prototype.inflatePoint = function (point) {
            this.inflate(point.x, point.y);
        };
        /**
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @param dx 将 Rectangle 对象的 x 值移动此数量。
         * @param dy 将 Rectangle 对象的 t 值移动此数量。
         */
        Rectangle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        /**
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 要用于偏移此 Rectangle 对象的 Point 对象。
         */
        Rectangle.prototype.offsetPoint = function (point) {
            this.offset(point.x, point.y);
        };
        /**
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @returns 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         */
        Rectangle.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        };
        /**
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @param toUnion 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns 充当两个矩形的联合的新 Rectangle 对象。
         */
        Rectangle.prototype.union = function (toUnion) {
            var result = this.clone();
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.copyFrom(toUnion);
                return result;
            }
            var l = Math.min(result.x, toUnion.x);
            var t = Math.min(result.y, toUnion.y);
            result.setTo(l, t, Math.max(result.right, toUnion.right) - l, Math.max(result.bottom, toUnion.bottom) - t);
            return result;
        };
        return Rectangle;
    }());
    feng3d.Rectangle = Rectangle;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Vector3D 类使用笛卡尔坐标 x、y 和 z 表示三维空间中的点或位置
     * @author feng 2016-3-21
     */
    var Vector3D = (function () {
        /**
         * 创建 Vector3D 对象的实例。如果未指定构造函数的参数，则将使用元素 (0,0,0,0) 创建 Vector3D 对象。
         * @param x 第一个元素，例如 x 坐标。
         * @param y 第二个元素，例如 y 坐标。
         * @param z 第三个元素，例如 z 坐标。
         * @param w 表示额外数据的可选元素，例如旋转角度
         */
        function Vector3D(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Object.defineProperty(Vector3D.prototype, "length", {
            /**
            * 当前 Vector3D 对象的长度（大小），即从原点 (0,0,0) 到该对象的 x、y 和 z 坐标的距离。w 属性将被忽略。单位矢量具有的长度或大小为一。
            */
            get: function () {
                return Math.sqrt(this.lengthSquared);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3D.prototype, "lengthSquared", {
            /**
            * 当前 Vector3D 对象长度的平方，它是使用 x、y 和 z 属性计算出来的。w 属性将被忽略。尽可能使用 lengthSquared() 方法，而不要使用 Vector3D.length() 方法的 Math.sqrt() 方法调用，后者速度较慢。
            */
            get: function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将当前 Vector3D 对象的 x、y 和 z 元素的值与另一个 Vector3D 对象的 x、y 和 z 元素的值相加。
         * @param a 要与当前 Vector3D 对象相加的 Vector3D 对象。
         * @return 一个 Vector3D 对象，它是将当前 Vector3D 对象与另一个 Vector3D 对象相加所产生的结果。
         */
        Vector3D.prototype.add = function (a) {
            return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
        };
        /**
         * 返回一个新 Vector3D 对象，它是与当前 Vector3D 对象完全相同的副本。
         * @return 一个新 Vector3D 对象，它是当前 Vector3D 对象的副本。
         */
        Vector3D.prototype.clone = function () {
            return new Vector3D(this.x, this.y, this.z, this.w);
        };
        /**
         * 将源 Vector3D 对象中的所有矢量数据复制到调用方 Vector3D 对象中。
         * @return 要从中复制数据的 Vector3D 对象。
         */
        Vector3D.prototype.copyFrom = function (sourceVector3D) {
            this.x = sourceVector3D.x;
            this.y = sourceVector3D.y;
            this.z = sourceVector3D.z;
            this.w = sourceVector3D.w;
        };
        /**
         * 返回一个新的 Vector3D 对象，它与当前 Vector3D 对象和另一个 Vector3D 对象垂直（成直角）。
         */
        Vector3D.prototype.crossProduct = function (a) {
            return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
        };
        /**
         * 按照指定的 Vector3D 对象的 x、y 和 z 元素的值递减当前 Vector3D 对象的 x、y 和 z 元素的值。
         */
        Vector3D.prototype.decrementBy = function (a) {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        };
        /**
         * 通过将当前 Vector3D 对象的 x、y 和 z 元素乘以指定的 Vector3D 对象的 x、y 和 z 元素得到新对象。
         */
        Vector3D.prototype.multiply = function (a) {
            return new Vector3D(this.x * a.x, this.y * a.y, this.z * a.z);
        };
        /**
         * 通过将当前 Vector3D 对象的 x、y 和 z 元素除以指定的 Vector3D 对象的 x、y 和 z 元素得到新对象。
         */
        Vector3D.prototype.divide = function (a) {
            return new Vector3D(this.x / a.x, this.y / a.y, this.z / a.z);
        };
        /**
         * 如果当前 Vector3D 对象和作为参数指定的 Vector3D 对象均为单位顶点，此方法将返回这两个顶点之间所成角的余弦值。
         */
        Vector3D.prototype.dotProduct = function (a) {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        };
        /**
         * 通过将当前 Vector3D 对象的 x、y 和 z 元素与指定的 Vector3D 对象的 x、y 和 z 元素进行比较，确定这两个对象是否相等。
         */
        Vector3D.prototype.equals = function (toCompare, allFour) {
            if (allFour === void 0) { allFour = false; }
            return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (!allFour || this.w == toCompare.w));
        };
        /**
         * 按照指定的 Vector3D 对象的 x、y 和 z 元素的值递增当前 Vector3D 对象的 x、y 和 z 元素的值。
         */
        Vector3D.prototype.incrementBy = function (a) {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        };
        /**
         * 将当前 Vector3D 对象设置为其逆对象。
         */
        Vector3D.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        /**
         * 通过将最前面的三个元素（x、y、z）除以矢量的长度可将 Vector3D 对象转换为单位矢量。
         */
        Vector3D.prototype.normalize = function (thickness) {
            if (thickness === void 0) { thickness = 1; }
            if (this.length != 0) {
                var invLength = thickness / this.length;
                this.x *= invLength;
                this.y *= invLength;
                this.z *= invLength;
                return;
            }
        };
        /**
         * 按标量（大小）缩放当前的 Vector3D 对象。
         */
        Vector3D.prototype.scaleBy = function (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        };
        /**
         * 将 Vector3D 的成员设置为指定值
         */
        Vector3D.prototype.setTo = function (xa, ya, za) {
            this.x = xa;
            this.y = ya;
            this.z = za;
        };
        /**
         * 从另一个 Vector3D 对象的 x、y 和 z 元素的值中减去当前 Vector3D 对象的 x、y 和 z 元素的值。
         */
        Vector3D.prototype.subtract = function (a) {
            return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
        };
        /**
         * 返回当前 Vector3D 对象的字符串表示形式。
         */
        Vector3D.prototype.toString = function () {
            return "<" + this.x + ", " + this.y + ", " + this.z + ">";
        };
        /**
        * 定义为 Vector3D 对象的 x 轴，坐标为 (1,0,0)。
        */
        Vector3D.X_AXIS = new Vector3D(1, 0, 0);
        /**
        * 定义为 Vector3D 对象的 y 轴，坐标为 (0,1,0)
        */
        Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
        /**
        * 定义为 Vector3D 对象的 z 轴，坐标为 (0,0,1)
        */
        Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
        return Vector3D;
    }());
    feng3d.Vector3D = Vector3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Matrix3D 类表示一个转换矩阵，该矩阵确定三维 (3D) 显示对象的位置和方向。
     * 该矩阵可以执行转换功能，包括平移（沿 x、y 和 z 轴重新定位）、旋转和缩放（调整大小）。
     * Matrix3D 类还可以执行透视投影，这会将 3D 坐标空间中的点映射到二维 (2D) 视图。
     *
     *  ---            方向              平移 ---
     *  |   scaleX      0         0       tx    |
     *  |     0       scaleY      0       ty    |
     *  |     0         0       scaleZ    tz    |
     *  |     0         0         0       tw    |
     *  ---  x轴        y轴      z轴          ---
     *
     *  ---            方向              平移 ---
     *  |     0         4         8       12    |
     *  |     1         5         9       13    |
     *  |     2         6        10       14    |
     *  |     3         7        11       15    |
     *  ---  x轴        y轴      z轴          ---
     */
    var Matrix3D = (function () {
        /**
         * 创建 Matrix3D 对象。
         * @param   datas    一个由 16 个数字组成的矢量，其中，每四个元素可以是 4x4 矩阵的一列。
         */
        function Matrix3D(datas) {
            if (datas === void 0) { datas = null; }
            datas = datas || [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1 //
            ];
            if (datas instanceof Float32Array)
                this.rawData = datas;
            else {
                this.rawData = new Float32Array(datas);
            }
        }
        Object.defineProperty(Matrix3D.prototype, "position", {
            /**
             * 一个保存显示对象在转换参照帧中的 3D 坐标 (x,y,z) 位置的 Vector3D 对象。
             */
            get: function () {
                return new feng3d.Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
            },
            set: function (value) {
                this.rawData[12] = value.x;
                this.rawData[13] = value.y;
                this.rawData[14] = value.z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3D.prototype, "determinant", {
            /**
             * 一个用于确定矩阵是否可逆的数字。
             */
            get: function () {
                return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) //
                    - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) //
                    + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) //
                    + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) //
                    - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) //
                    + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]) //
                );
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3D.prototype, "forward", {
            /**
             * 前方（+Z轴方向）
             */
            get: function () {
                var v = new feng3d.Vector3D(0.0, 0.0, 0.0);
                this.copyColumnTo(2, v);
                v.normalize();
                return v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3D.prototype, "up", {
            /**
             * 上方（+y轴方向）
             */
            get: function () {
                var v = new feng3d.Vector3D();
                this.copyColumnTo(1, v);
                v.normalize();
                return v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3D.prototype, "right", {
            /**
             * 右方（+x轴方向）
             */
            get: function () {
                var v = new feng3d.Vector3D();
                this.copyColumnTo(0, v);
                v.normalize();
                return v;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 创建旋转矩阵
         * @param   degrees         角度
         * @param   axis            旋转轴
         * @param   pivotPoint      旋转中心点
         */
        Matrix3D.createRotationMatrix3D = function (degrees, axis) {
            var n = axis.clone();
            n.normalize();
            var q = degrees * Math.PI / 180;
            var sinq = Math.sin(q);
            var cosq = Math.cos(q);
            var lcosq = 1 - cosq;
            var rotationMat = new Matrix3D([
                n.x * n.x * lcosq + cosq, n.x * n.y * lcosq + n.z * sinq, n.x * n.z * lcosq - n.y * sinq, 0,
                n.x * n.y * lcosq - n.z * sinq, n.y * n.y * lcosq + cosq, n.y * n.z * lcosq + n.x * sinq, 0,
                n.x * n.z * lcosq + n.y * sinq, n.y * n.z * lcosq - n.x * sinq, n.z * n.z * lcosq + cosq, 0,
                0, 0, 0, 1 //
            ]);
            return rotationMat;
        };
        /**
         * 创建缩放矩阵
         * @param   xScale      用于沿 x 轴缩放对象的乘数。
         * @param   yScale      用于沿 y 轴缩放对象的乘数。
         * @param   zScale      用于沿 z 轴缩放对象的乘数。
         */
        Matrix3D.createScaleMatrix3D = function (xScale, yScale, zScale) {
            var rotationMat = new Matrix3D([
                xScale, 0.0000, 0.0000, 0,
                0.0000, yScale, 0.0000, 0,
                0.0000, 0.0000, zScale, 0,
                0.0000, 0.0000, 0.0000, 1 //
            ]);
            return rotationMat;
        };
        /**
         * 创建位移矩阵
         * @param   x   沿 x 轴的增量平移。
         * @param   y   沿 y 轴的增量平移。
         * @param   z   沿 z 轴的增量平移。
         */
        Matrix3D.createTranslationMatrix3D = function (x, y, z) {
            var rotationMat = new Matrix3D([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1 //
            ]);
            return rotationMat;
        };
        /**
         * 通过将另一个 Matrix3D 对象与当前 Matrix3D 对象相乘来后置一个矩阵。
         */
        Matrix3D.prototype.append = function (lhs) {
            var //
            m111 = this.rawData[0], m121 = this.rawData[4], m131 = this.rawData[8], m141 = this.rawData[12], //
            m112 = this.rawData[1], m122 = this.rawData[5], m132 = this.rawData[9], m142 = this.rawData[13], //
            m113 = this.rawData[2], m123 = this.rawData[6], m133 = this.rawData[10], m143 = this.rawData[14], //
            m114 = this.rawData[3], m124 = this.rawData[7], m134 = this.rawData[11], m144 = this.rawData[15], //
            m211 = lhs.rawData[0], m221 = lhs.rawData[4], m231 = lhs.rawData[8], m241 = lhs.rawData[12], //
            m212 = lhs.rawData[1], m222 = lhs.rawData[5], m232 = lhs.rawData[9], m242 = lhs.rawData[13], //
            m213 = lhs.rawData[2], m223 = lhs.rawData[6], m233 = lhs.rawData[10], m243 = lhs.rawData[14], //
            m214 = lhs.rawData[3], m224 = lhs.rawData[7], m234 = lhs.rawData[11], m244 = lhs.rawData[15];
            this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
            this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
            this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
            this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
            this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
            this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
            this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
            this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
            this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
            this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
            this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
            this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
            this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
            this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
            this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
            this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
            feng3d.debuger && feng3d.assert(this.rawData[0] !== NaN && this.rawData[4] !== NaN && this.rawData[8] !== NaN && this.rawData[12] !== NaN);
            return this;
        };
        /**
         * 在 Matrix3D 对象上后置一个增量旋转。
         * @param   degrees         角度
         * @param   axis            旋转轴
         * @param   pivotPoint      旋转中心点
         */
        Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
            if (pivotPoint === void 0) { pivotPoint = new feng3d.Vector3D(); }
            var rotationMat = Matrix3D.createRotationMatrix3D(degrees, axis);
            if (pivotPoint != null) {
                this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
            }
            this.append(rotationMat);
            if (pivotPoint != null) {
                this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
            }
            return this;
        };
        /**
         * 在 Matrix3D 对象上后置一个增量缩放，沿 x、y 和 z 轴改变位置。
         * @param   xScale      用于沿 x 轴缩放对象的乘数。
         * @param   yScale      用于沿 y 轴缩放对象的乘数。
         * @param   zScale      用于沿 z 轴缩放对象的乘数。
         */
        Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
            var scaleMat = Matrix3D.createScaleMatrix3D(xScale, yScale, zScale);
            this.append(scaleMat);
            return this;
        };
        /**
         * 在 Matrix3D 对象上后置一个增量平移，沿 x、y 和 z 轴重新定位。
         * @param   x   沿 x 轴的增量平移。
         * @param   y   沿 y 轴的增量平移。
         * @param   z   沿 z 轴的增量平移。
         */
        Matrix3D.prototype.appendTranslation = function (x, y, z) {
            this.rawData[12] += x;
            this.rawData[13] += y;
            this.rawData[14] += z;
            return this;
        };
        /**
         * 返回一个新 Matrix3D 对象，它是与当前 Matrix3D 对象完全相同的副本。
         */
        Matrix3D.prototype.clone = function () {
            var ret = new Matrix3D();
            ret.copyFrom(this);
            return ret;
        };
        /**
         * 将 Vector3D 对象复制到调用方 Matrix3D 对象的特定列中。
         * @param   column      副本的目标列。
         * @param   vector3D    要从中复制数据的 Vector3D 对象。
         */
        Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
            this.rawData[column * 4 + 0] = vector3D.x;
            this.rawData[column * 4 + 1] = vector3D.y;
            this.rawData[column * 4 + 2] = vector3D.z;
            this.rawData[column * 4 + 3] = vector3D.w;
            return this;
        };
        /**
         * 将调用方 Matrix3D 对象的特定列复制到 Vector3D 对象中。
         * @param   column       要从中复制数据的列。
         * @param   vector3D     副本的目标 Vector3D 对象。
         */
        Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
            vector3D.x = this.rawData[column * 4 + 0];
            vector3D.y = this.rawData[column * 4 + 1];
            vector3D.z = this.rawData[column * 4 + 2];
            vector3D.w = this.rawData[column * 4 + 3];
            return this;
        };
        /**
         * 将源 Matrix3D 对象中的所有矩阵数据复制到调用方 Matrix3D 对象中。
         * @param   sourceMatrix3D      要从中复制数据的 Matrix3D 对象。
         */
        Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
            this.rawData.set(sourceMatrix3D.rawData);
            return this;
        };
        /**
         * 将源 Vector 对象中的所有矢量数据复制到调用方 Matrix3D 对象中。利用可选索引参数，您可以选择矢量中的任何起始文字插槽。
         * @param   vector      要从中复制数据的 Vector 对象。
         * @param   index       vector中的起始位置
         * @param   transpose   是否转置当前矩阵
         */
        Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
            if (index === void 0) { index = 0; }
            if (transpose === void 0) { transpose = false; }
            if (vector.length - index < 16) {
                throw new Error("vector参数数据长度不够！");
            }
            if (transpose) {
                this.transpose();
            }
            for (var i = 0; i < 16; i++) {
                this.rawData[i] = vector[index + i];
            }
            if (transpose) {
                this.transpose();
            }
            return this;
        };
        /**
         * 将调用方 Matrix3D 对象中的所有矩阵数据复制到提供的矢量中。
         * @param   vector      要将数据复制到的 Vector 对象。
         * @param   index       vector中的起始位置
         * @param   transpose   是否转置当前矩阵
         */
        Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
            if (index === void 0) { index = 0; }
            if (transpose === void 0) { transpose = false; }
            if (transpose) {
                this.transpose();
            }
            for (var i = 0; i < 16; i++) {
                vector[i + index] = this.rawData[i];
            }
            if (transpose) {
                this.transpose();
            }
            return this;
        };
        /**
         * 将 Vector3D 对象复制到调用方 Matrix3D 对象的特定行中。
         * @param   row         要将数据复制到的行。
         * @param   vector3D    要从中复制数据的 Vector3D 对象。
         */
        Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
            this.rawData[row + 4 * 0] = vector3D.x;
            this.rawData[row + 4 * 1] = vector3D.y;
            this.rawData[row + 4 * 2] = vector3D.z;
            this.rawData[row + 4 * 3] = vector3D.w;
            return this;
        };
        /**
         * 将调用方 Matrix3D 对象的特定行复制到 Vector3D 对象中。
         * @param   row         要从中复制数据的行。
         * @param   vector3D    将作为数据复制目的地的 Vector3D 对象。
         */
        Matrix3D.prototype.copyRowTo = function (row, vector3D) {
            vector3D.x = this.rawData[row + 4 * 0];
            vector3D.y = this.rawData[row + 4 * 1];
            vector3D.z = this.rawData[row + 4 * 2];
            vector3D.w = this.rawData[row + 4 * 3];
            return this;
        };
        /**
         * 拷贝当前矩阵
         * @param   dest    目标矩阵
         */
        Matrix3D.prototype.copyToMatrix3D = function (dest) {
            dest.rawData.set(this.rawData);
            return this;
        };
        /**
         * 将转换矩阵的平移、旋转和缩放设置作为由三个 Vector3D 对象组成的矢量返回。
         * @return      一个由三个 Vector3D 对象组成的矢量，其中，每个对象分别容纳平移、旋转和缩放设置。
         */
        Matrix3D.prototype.decompose = function () {
            var vec = [];
            var m = this.clone();
            var mr = m.rawData;
            var pos = new feng3d.Vector3D(mr[12], mr[13], mr[14]);
            mr[12] = 0;
            mr[13] = 0;
            mr[14] = 0;
            var scale = new feng3d.Vector3D();
            scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
            scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
            scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
            if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0)
                scale.z = -scale.z;
            mr[0] /= scale.x;
            mr[1] /= scale.x;
            mr[2] /= scale.x;
            mr[4] /= scale.y;
            mr[5] /= scale.y;
            mr[6] /= scale.y;
            mr[8] /= scale.z;
            mr[9] /= scale.z;
            mr[10] /= scale.z;
            var rot = new feng3d.Vector3D();
            rot.y = Math.asin(-mr[2]);
            if (mr[2] != 1 && mr[2] != -1) {
                rot.x = Math.atan2(mr[6], mr[10]);
                rot.z = Math.atan2(mr[1], mr[0]);
            }
            else {
                rot.z = 0;
                rot.x = Math.atan2(mr[4], mr[5]);
            }
            vec.push(pos);
            vec.push(rot);
            vec.push(scale);
            return vec;
        };
        /**
         * 使用不含平移元素的转换矩阵将 Vector3D 对象从一个空间坐标转换到另一个空间坐标。
         * @param   v   一个容纳要转换的坐标的 Vector3D 对象。
         * @return  一个包含转换后的坐标的 Vector3D 对象。
         */
        Matrix3D.prototype.deltaTransformVector = function (v) {
            var tempx = this.rawData[12];
            var tempy = this.rawData[13];
            var tempz = this.rawData[14];
            this.rawData[12] = 0;
            this.rawData[13] = 0;
            this.rawData[14] = 0;
            var result = this.transformVector(v);
            this.rawData[12] = tempx;
            this.rawData[13] = tempy;
            this.rawData[14] = tempz;
            return result;
        };
        /**
         * 将当前矩阵转换为恒等或单位矩阵。
         */
        Matrix3D.prototype.identity = function () {
            this.rawData[1] = 0;
            this.rawData[2] = 0;
            this.rawData[3] = 0;
            this.rawData[4] = 0;
            this.rawData[6] = 0;
            this.rawData[7] = 0;
            this.rawData[8] = 0;
            this.rawData[9] = 0;
            this.rawData[11] = 0;
            this.rawData[12] = 0;
            this.rawData[13] = 0;
            this.rawData[14] = 0;
            this.rawData[0] = 1;
            this.rawData[5] = 1;
            this.rawData[10] = 1;
            this.rawData[15] = 1;
            return this;
        };
        /**
         * 反转当前矩阵。逆矩阵
         * @return      如果成功反转矩阵，则返回 该矩阵。
         */
        Matrix3D.prototype.invert = function () {
            var d = this.determinant;
            var invertable = Math.abs(d) > 0.00000000001;
            if (invertable) {
                d = 1 / d;
                var m11 = this.rawData[0];
                var m21 = this.rawData[4];
                var m31 = this.rawData[8];
                var m41 = this.rawData[12];
                var m12 = this.rawData[1];
                var m22 = this.rawData[5];
                var m32 = this.rawData[9];
                var m42 = this.rawData[13];
                var m13 = this.rawData[2];
                var m23 = this.rawData[6];
                var m33 = this.rawData[10];
                var m43 = this.rawData[14];
                var m14 = this.rawData[3];
                var m24 = this.rawData[7];
                var m34 = this.rawData[11];
                var m44 = this.rawData[15];
                this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
                this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
                this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
                this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
                this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
                this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
                this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
                this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
                this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
                this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
                this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
                this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
                this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
                this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
                this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
                this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
            }
            if (invertable)
                return this;
            return null;
        };
        /**
         * 通过将当前 Matrix3D 对象与另一个 Matrix3D 对象相乘来前置一个矩阵。得到的结果将合并两个矩阵转换。
         * @param   rhs     个右侧矩阵，它与当前 Matrix3D 对象相乘。
         */
        Matrix3D.prototype.prepend = function (rhs) {
            var mat = this.clone();
            this.copyFrom(rhs);
            this.append(mat);
            return this;
        };
        /**
         * 在 Matrix3D 对象上前置一个增量旋转。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行旋转，然后再执行其他转换。
         * @param   degrees     旋转的角度。
         * @param   axis        旋转的轴或方向。常见的轴为 X_AXIS (Vector3D(1,0,0))、Y_AXIS (Vector3D(0,1,0)) 和 Z_AXIS (Vector3D(0,0,1))。此矢量的长度应为 1。
         * @param   pivotPoint  一个用于确定旋转中心的点。对象的默认轴点为该对象的注册点。
         */
        Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
            if (pivotPoint === void 0) { pivotPoint = new feng3d.Vector3D(); }
            var rotationMat = Matrix3D.createRotationMatrix3D(degrees, axis);
            this.prepend(rotationMat);
            return this;
        };
        /**
         * 在 Matrix3D 对象上前置一个增量缩放，沿 x、y 和 z 轴改变位置。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行缩放更改，然后再执行其他转换。
         * @param   xScale      用于沿 x 轴缩放对象的乘数。
         * @param   yScale      用于沿 y 轴缩放对象的乘数。
         * @param   zScale      用于沿 z 轴缩放对象的乘数。
         */
        Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
            var scaleMat = Matrix3D.createScaleMatrix3D(xScale, yScale, zScale);
            this.prepend(scaleMat);
            return this;
        };
        /**
         * 在 Matrix3D 对象上前置一个增量平移，沿 x、y 和 z 轴重新定位。在将 Matrix3D 对象应用于显示对象时，矩阵会在 Matrix3D 对象中先执行平移更改，然后再执行其他转换。
         * @param   x   沿 x 轴的增量平移。
         * @param   y   沿 y 轴的增量平移。
         * @param   z   沿 z 轴的增量平移。
         */
        Matrix3D.prototype.prependTranslation = function (x, y, z) {
            var translationMat = Matrix3D.createTranslationMatrix3D(x, y, z);
            this.prepend(translationMat);
            return this;
        };
        /**
         * X轴方向移动
         * @param distance  移动距离
         */
        Matrix3D.prototype.moveRight = function (distance) {
            var direction = this.right;
            direction.scaleBy(distance);
            this.position = this.position.add(direction);
            return this;
        };
        /**
         * Y轴方向移动
         * @param distance  移动距离
         */
        Matrix3D.prototype.moveUp = function (distance) {
            var direction = this.up;
            direction.scaleBy(distance);
            this.position = this.position.add(direction);
            return this;
        };
        /**
         * Z轴方向移动
         * @param distance  移动距离
         */
        Matrix3D.prototype.moveForward = function (distance) {
            var direction = this.forward;
            direction.scaleBy(distance);
            this.position = this.position.add(direction);
            return this;
        };
        /**
         * 设置转换矩阵的平移、旋转和缩放设置。
         * @param   components      一个由三个 Vector3D 对象组成的矢量，这些对象将替代 Matrix3D 对象的平移、旋转和缩放元素。
         */
        Matrix3D.prototype.recompose = function (components) {
            this.identity();
            this.appendScale(components[2].x, components[2].y, components[2].z);
            this.appendRotation(components[1].x * feng3d.MathConsts.RADIANS_TO_DEGREES, feng3d.Vector3D.X_AXIS);
            this.appendRotation(components[1].y * feng3d.MathConsts.RADIANS_TO_DEGREES, feng3d.Vector3D.Y_AXIS);
            this.appendRotation(components[1].z * feng3d.MathConsts.RADIANS_TO_DEGREES, feng3d.Vector3D.Z_AXIS);
            this.appendTranslation(components[0].x, components[0].y, components[0].z);
            return this;
        };
        /**
         * 使用转换矩阵将 Vector3D 对象从一个空间坐标转换到另一个空间坐标。
         * @param   vin   一个容纳要转换的坐标的 Vector3D 对象。
         * @return  一个包含转换后的坐标的 Vector3D 对象。
         */
        Matrix3D.prototype.transformVector = function (vin, vout) {
            var x = vin.x;
            var y = vin.y;
            var z = vin.z;
            vout = vout || new feng3d.Vector3D();
            vout.x = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
            vout.y = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
            vout.z = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
            vout.w = x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15];
            return vout;
        };
        /**
         * 使用转换矩阵将由数字构成的矢量从一个空间坐标转换到另一个空间坐标。
         * @param   vin     一个由多个数字组成的矢量，其中每三个数字构成一个要转换的 3D 坐标 (x,y,z)。
         * @param   vout    一个由多个数字组成的矢量，其中每三个数字构成一个已转换的 3D 坐标 (x,y,z)。
         */
        Matrix3D.prototype.transformVectors = function (vin, vout) {
            var vec = new feng3d.Vector3D();
            for (var i = 0; i < vin.length; i += 3) {
                vec.setTo(vin[i], vin[i + 1], vin[i + 2]);
                vec = this.transformVector(vec);
                vout[i] = vec.x;
                vout[i + 1] = vec.y;
                vout[i + 2] = vec.z;
            }
        };
        /**
         * 将当前 Matrix3D 对象转换为一个矩阵，并将互换其中的行和列。
         */
        Matrix3D.prototype.transpose = function () {
            var swap;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (i > j) {
                        swap = this.rawData[i * 4 + j];
                        this.rawData[i * 4 + j] = this.rawData[j * 4 + i];
                        this.rawData[j * 4 + i] = swap;
                    }
                }
            }
        };
        /**
         * 比较矩阵是否相等
         */
        Matrix3D.prototype.compare = function (matrix3D, precision) {
            if (precision === void 0) { precision = 0.0001; }
            var r2 = matrix3D.rawData;
            for (var i = 0; i < 16; ++i) {
                if (Math.abs(this.rawData[i] - r2[i]) > precision)
                    return false;
            }
            return true;
        };
        /**
         * 看向目标位置
         * @param target    目标位置
         * @param upAxis    向上朝向
         */
        Matrix3D.prototype.lookAt = function (target, upAxis) {
            if (upAxis === void 0) { upAxis = null; }
            //获取位移，缩放，在变换过程位移与缩放不变
            var vec = this.decompose();
            var position = vec[0];
            var scale = vec[2];
            //
            var xAxis = new feng3d.Vector3D();
            var yAxis = new feng3d.Vector3D();
            var zAxis = new feng3d.Vector3D();
            upAxis = upAxis || feng3d.Vector3D.Y_AXIS;
            zAxis.x = target.x - this.position.x;
            zAxis.y = target.y - this.position.y;
            zAxis.z = target.z - this.position.z;
            zAxis.normalize();
            xAxis.x = upAxis.y * zAxis.z - upAxis.z * zAxis.y;
            xAxis.y = upAxis.z * zAxis.x - upAxis.x * zAxis.z;
            xAxis.z = upAxis.x * zAxis.y - upAxis.y * zAxis.x;
            xAxis.normalize();
            if (xAxis.length < .05) {
                xAxis.x = upAxis.y;
                xAxis.y = upAxis.x;
                xAxis.z = 0;
                xAxis.normalize();
            }
            yAxis.x = zAxis.y * xAxis.z - zAxis.z * xAxis.y;
            yAxis.y = zAxis.z * xAxis.x - zAxis.x * xAxis.z;
            yAxis.z = zAxis.x * xAxis.y - zAxis.y * xAxis.x;
            this.rawData[0] = scale.x * xAxis.x;
            this.rawData[1] = scale.x * xAxis.y;
            this.rawData[2] = scale.x * xAxis.z;
            this.rawData[3] = 0;
            this.rawData[4] = scale.y * yAxis.x;
            this.rawData[5] = scale.y * yAxis.y;
            this.rawData[6] = scale.y * yAxis.z;
            this.rawData[7] = 0;
            this.rawData[8] = scale.z * zAxis.x;
            this.rawData[9] = scale.z * zAxis.y;
            this.rawData[10] = scale.z * zAxis.z;
            this.rawData[11] = 0;
            this.rawData[12] = position.x;
            this.rawData[13] = position.y;
            this.rawData[14] = position.z;
            this.rawData[15] = 1;
        };
        /**
         * 以字符串返回矩阵的值
         */
        Matrix3D.prototype.toString = function () {
            var str = "";
            var showLen = 5;
            var precision = Math.pow(10, showLen - 1);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    str += feng3d.StringUtils.getString(Math.round(this.rawData[i * 4 + j] * precision) / precision, showLen, " ");
                }
                if (i != 3)
                    str += "\n";
            }
            return str;
        };
        return Matrix3D;
    }());
    feng3d.Matrix3D = Matrix3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * A Quaternion object which can be used to represent rotations.
     */
    var Quaternion = (function () {
        /**
         * Creates a new Quaternion object.
         * @param x The x value of the quaternion.
         * @param y The y value of the quaternion.
         * @param z The z value of the quaternion.
         * @param w The w value of the quaternion.
         */
        function Quaternion(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 1; }
            /**
             * The x value of the quaternion.
             */
            this.x = 0;
            /**
             * The y value of the quaternion.
             */
            this.y = 0;
            /**
             * The z value of the quaternion.
             */
            this.z = 0;
            /**
             * The w value of the quaternion.
             */
            this.w = 1;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Object.defineProperty(Quaternion.prototype, "magnitude", {
            /**
             * Returns the magnitude of the quaternion object.
             */
            get: function () {
                return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Fills the quaternion object with the result from a multiplication of two quaternion objects.
         *
         * @param    qa    The first quaternion in the multiplication.
         * @param    qb    The second quaternion in the multiplication.
         */
        Quaternion.prototype.multiply = function (qa, qb) {
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
            this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
            this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
            this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
            this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
        };
        Quaternion.prototype.multiplyVector = function (vector, target) {
            if (target === void 0) { target = null; }
            target = target || new Quaternion();
            var x2 = vector.x;
            var y2 = vector.y;
            var z2 = vector.z;
            target.w = -this.x * x2 - this.y * y2 - this.z * z2;
            target.x = this.w * x2 + this.y * z2 - this.z * y2;
            target.y = this.w * y2 - this.x * z2 + this.z * x2;
            target.z = this.w * z2 + this.x * y2 - this.y * x2;
            return target;
        };
        /**
         * Fills the quaternion object with values representing the given rotation around a vector.
         *
         * @param    axis    The axis around which to rotate
         * @param    angle    The angle in radians of the rotation.
         */
        Quaternion.prototype.fromAxisAngle = function (axis, angle) {
            var sin_a = Math.sin(angle / 2);
            var cos_a = Math.cos(angle / 2);
            this.x = axis.x * sin_a;
            this.y = axis.y * sin_a;
            this.z = axis.z * sin_a;
            this.w = cos_a;
            this.normalize();
        };
        /**
         * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
         * @param qa The first quaternion to interpolate.
         * @param qb The second quaternion to interpolate.
         * @param t The interpolation weight, a value between 0 and 1.
         */
        Quaternion.prototype.slerp = function (qa, qb, t) {
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
            var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;
            // shortest direction
            if (dot < 0) {
                dot = -dot;
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }
            if (dot < 0.95) {
                // interpolate angle linearly
                var angle = Math.acos(dot);
                var s = 1 / Math.sin(angle);
                var s1 = Math.sin(angle * (1 - t)) * s;
                var s2 = Math.sin(angle * t) * s;
                this.w = w1 * s1 + w2 * s2;
                this.x = x1 * s1 + x2 * s2;
                this.y = y1 * s1 + y2 * s2;
                this.z = z1 * s1 + z2 * s2;
            }
            else {
                // nearly identical angle, interpolate linearly
                this.w = w1 + t * (w2 - w1);
                this.x = x1 + t * (x2 - x1);
                this.y = y1 + t * (y2 - y1);
                this.z = z1 + t * (z2 - z1);
                var len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                this.w *= len;
                this.x *= len;
                this.y *= len;
                this.z *= len;
            }
        };
        /**
         * 线性求插值
         * @param qa 第一个四元素
         * @param qb 第二个四元素
         * @param t 权重
         */
        Quaternion.prototype.lerp = function (qa, qb, t) {
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
            var len;
            // shortest direction
            if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }
            this.w = w1 + t * (w2 - w1);
            this.x = x1 + t * (x2 - x1);
            this.y = y1 + t * (y2 - y1);
            this.z = z1 + t * (z2 - z1);
            len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
            this.w *= len;
            this.x *= len;
            this.y *= len;
            this.z *= len;
        };
        /**
         * Fills the quaternion object with values representing the given euler rotation.
         *
         * @param    ax        The angle in radians of the rotation around the ax axis.
         * @param    ay        The angle in radians of the rotation around the ay axis.
         * @param    az        The angle in radians of the rotation around the az axis.
         */
        Quaternion.prototype.fromEulerAngles = function (ax, ay, az) {
            var halfX = ax * .5, halfY = ay * .5, halfZ = az * .5;
            var cosX = Math.cos(halfX), sinX = Math.sin(halfX);
            var cosY = Math.cos(halfY), sinY = Math.sin(halfY);
            var cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);
            this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
            this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
            this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
            this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
        };
        /**
         * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
         * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
         * @return The Vector3D containing the Euler angles.
         */
        Quaternion.prototype.toEulerAngles = function (target) {
            if (target === void 0) { target = null; }
            target = target || new feng3d.Vector3D();
            target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
            target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
            target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
            return target;
        };
        /**
         * Normalises the quaternion object.
         */
        Quaternion.prototype.normalize = function (val) {
            if (val === void 0) { val = 1; }
            var mag = val / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            this.x *= mag;
            this.y *= mag;
            this.z *= mag;
            this.w *= mag;
        };
        /**
         * Used to trace the values of a quaternion.
         *
         * @return A string representation of the quaternion object.
         */
        Quaternion.prototype.toString = function () {
            return "{this.x:" + this.x + " this.y:" + this.y + " this.z:" + this.z + " this.w:" + this.w + "}";
        };
        /**
         * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
         * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
         * @return A Matrix3D object representing an equivalent rotation.
         */
        Quaternion.prototype.toMatrix3D = function (target) {
            if (target === void 0) { target = null; }
            if (!target)
                target = new feng3d.Matrix3D();
            var rawData = target.rawData;
            var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
            var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
            var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;
            rawData[0] = xx - yy - zz + ww;
            rawData[4] = xy2 - zw2;
            rawData[8] = xz2 + yw2;
            rawData[12] = 0;
            rawData[1] = xy2 + zw2;
            rawData[5] = -xx + yy - zz + ww;
            rawData[9] = yz2 - xw2;
            rawData[13] = 0;
            rawData[2] = xz2 - yw2;
            rawData[6] = yz2 + xw2;
            rawData[10] = -xx - yy + zz + ww;
            rawData[14] = 0;
            rawData[3] = 0.0;
            rawData[7] = 0.0;
            rawData[11] = 0;
            rawData[15] = 1;
            target.copyRawDataFrom(rawData);
            return target;
        };
        /**
         * Extracts a quaternion rotation matrix out of a given Matrix3D object.
         * @param matrix The Matrix3D out of which the rotation will be extracted.
         */
        Quaternion.prototype.fromMatrix = function (matrix) {
            var v = matrix.decompose()[1];
            this.fromEulerAngles(v.x, v.y, v.z);
        };
        /**
         * Converts the quaternion to a Vector.&lt;number&gt; matrix representation of a rotation equivalent to this quaternion.
         * @param target The Vector.&lt;number&gt; to contain the raw matrix data.
         * @param exclude4thRow If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
         */
        Quaternion.prototype.toRawData = function (target, exclude4thRow) {
            if (exclude4thRow === void 0) { exclude4thRow = false; }
            var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
            var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
            var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;
            target[0] = xx - yy - zz + ww;
            target[1] = xy2 - zw2;
            target[2] = xz2 + yw2;
            target[4] = xy2 + zw2;
            target[5] = -xx + yy - zz + ww;
            target[6] = yz2 - xw2;
            target[8] = xz2 - yw2;
            target[9] = yz2 + xw2;
            target[10] = -xx - yy + zz + ww;
            target[3] = target[7] = target[11] = 0;
            if (!exclude4thRow) {
                target[12] = target[13] = target[14] = 0;
                target[15] = 1;
            }
        };
        /**
         * Clones the quaternion.
         * @return An exact duplicate of the current Quaternion.
         */
        Quaternion.prototype.clone = function () {
            return new Quaternion(this.x, this.y, this.z, this.w);
        };
        /**
         * Rotates a point.
         * @param vector The Vector3D object to be rotated.
         * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
         * @return A Vector3D object containing the rotated point.
         */
        Quaternion.prototype.rotatePoint = function (vector, target) {
            if (target === void 0) { target = null; }
            var x1, y1, z1, w1;
            var x2 = vector.x, y2 = vector.y, z2 = vector.z;
            target = target || new feng3d.Vector3D();
            // p*q'
            w1 = -this.x * x2 - this.y * y2 - this.z * z2;
            x1 = this.w * x2 + this.y * z2 - this.z * y2;
            y1 = this.w * y2 - this.x * z2 + this.z * x2;
            z1 = this.w * z2 + this.x * y2 - this.y * x2;
            target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
            target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
            target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;
            return target;
        };
        /**
         * Copies the data from a quaternion into this instance.
         * @param q The quaternion to copy from.
         */
        Quaternion.prototype.copyFrom = function (q) {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        };
        return Quaternion;
    }());
    feng3d.Quaternion = Quaternion;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3d直线
     * @author feng 2013-6-13
     */
    var Line3D = (function () {
        /**
         * 根据直线某点与方向创建直线
         * @param position 直线上某点
         * @param direction 直线的方向
         */
        function Line3D(position, direction) {
            if (position === void 0) { position = null; }
            if (direction === void 0) { direction = null; }
            this.position = position ? position : new feng3d.Vector3D();
            this.direction = direction ? direction : new feng3d.Vector3D(0, 0, 1);
        }
        /**
         * 根据直线上两点初始化直线
         * @param p0 Vector3D
         * @param p1 Vector3D
         */
        Line3D.prototype.fromPoints = function (p0, p1) {
            this.position = p0;
            this.direction = p1.subtract(p0);
        };
        /**
         * 根据直线某点与方向初始化直线
         * @param position 直线上某点
         * @param direction 直线的方向
         */
        Line3D.prototype.fromPosAndDir = function (position, direction) {
            this.position = position;
            this.direction = direction;
        };
        /**
         * 获取直线上的一个点
         * @param length 与原点距离
         */
        Line3D.prototype.getPoint = function (length) {
            if (length === void 0) { length = 0; }
            var lengthDir = this.direction.clone();
            lengthDir.scaleBy(length);
            var newPoint = this.position.add(lengthDir);
            return newPoint;
        };
        return Line3D;
    }());
    feng3d.Line3D = Line3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D射线
     * @author feng 2013-6-13
     */
    var Ray3D = (function (_super) {
        __extends(Ray3D, _super);
        function Ray3D(position, direction) {
            if (position === void 0) { position = null; }
            if (direction === void 0) { direction = null; }
            _super.call(this, position, direction);
        }
        return Ray3D;
    }(feng3d.Line3D));
    feng3d.Ray3D = Ray3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3d面
     */
    var Plane3D = (function () {
        /**
         * 创建一个平面
         * @param a		A系数
         * @param b		B系数
         * @param c		C系数
         * @param d		D系数
         */
        function Plane3D(a, b, c, d) {
            if (a === void 0) { a = 0; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            if (a == 0 && b == 0)
                this._alignment = Plane3D.ALIGN_XY_AXIS;
            else if (b == 0 && c == 0)
                this._alignment = Plane3D.ALIGN_YZ_AXIS;
            else if (a == 0 && c == 0)
                this._alignment = Plane3D.ALIGN_XZ_AXIS;
            else
                this._alignment = Plane3D.ALIGN_ANY;
        }
        Object.defineProperty(Plane3D.prototype, "normal", {
            /**
             * 法线
             */
            get: function () {
                return new feng3d.Vector3D(this.a, this.b, this.c);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 通过3顶点定义一个平面
         * @param p0		点0
         * @param p1		点1
         * @param p2		点2
         */
        Plane3D.prototype.fromPoints = function (p0, p1, p2) {
            //计算向量1
            var d1x = p1.x - p0.x;
            var d1y = p1.y - p0.y;
            var d1z = p1.z - p0.z;
            //计算向量2
            var d2x = p2.x - p0.x;
            var d2y = p2.y - p0.y;
            var d2z = p2.z - p0.z;
            //叉乘计算法线
            this.a = d1y * d2z - d1z * d2y;
            this.b = d1z * d2x - d1x * d2z;
            this.c = d1x * d2y - d1y * d2x;
            //平面上点与法线点乘计算D值
            this.d = this.a * p0.x + this.b * p0.y + this.c * p0.z;
            //法线平行z轴
            if (this.a == 0 && this.b == 0)
                this._alignment = Plane3D.ALIGN_XY_AXIS;
            else if (this.b == 0 && this.c == 0)
                this._alignment = Plane3D.ALIGN_YZ_AXIS;
            else if (this.a == 0 && this.c == 0)
                this._alignment = Plane3D.ALIGN_XZ_AXIS;
            else
                this._alignment = Plane3D.ALIGN_ANY;
        };
        /**
         * 根据法线与点定义平面
         * @param normal		平面法线
         * @param point			平面上任意一点
         */
        Plane3D.prototype.fromNormalAndPoint = function (normal, point) {
            this.a = normal.x;
            this.b = normal.y;
            this.c = normal.z;
            this.d = this.a * point.x + this.b * point.y + this.c * point.z;
            if (this.a == 0 && this.b == 0)
                this._alignment = Plane3D.ALIGN_XY_AXIS;
            else if (this.b == 0 && this.c == 0)
                this._alignment = Plane3D.ALIGN_YZ_AXIS;
            else if (this.a == 0 && this.c == 0)
                this._alignment = Plane3D.ALIGN_XZ_AXIS;
            else
                this._alignment = Plane3D.ALIGN_ANY;
        };
        /**
         * 标准化平面
         * @return		标准化后的平面
         */
        Plane3D.prototype.normalize = function () {
            var len = 1 / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
            this.a *= len;
            this.b *= len;
            this.c *= len;
            this.d *= len;
            return this;
        };
        /**
         * 计算点与平面的距离
         * @param p		点
         * @returns		距离
         */
        Plane3D.prototype.distance = function (p) {
            if (this._alignment == Plane3D.ALIGN_YZ_AXIS)
                return this.a * p.x - this.d;
            else if (this._alignment == Plane3D.ALIGN_XZ_AXIS)
                return this.b * p.y - this.d;
            else if (this._alignment == Plane3D.ALIGN_XY_AXIS)
                return this.c * p.z - this.d;
            else
                return this.a * p.x + this.b * p.y + this.c * p.z - this.d;
        };
        /**
         * 顶点分类
         * <p>把顶点分为后面、前面、相交三类</p>
         * @param p			顶点
         * @return			顶点类型 PlaneClassification.BACK,PlaneClassification.FRONT,PlaneClassification.INTERSECT
         * @see				feng3d.core.math.PlaneClassification
         */
        Plane3D.prototype.classifyPoint = function (p, epsilon) {
            if (epsilon === void 0) { epsilon = 0.01; }
            // check NaN
            if (this.d != this.d)
                return feng3d.PlaneClassification.FRONT;
            var len;
            if (this._alignment == Plane3D.ALIGN_YZ_AXIS)
                len = this.a * p.x - this.d;
            else if (this._alignment == Plane3D.ALIGN_XZ_AXIS)
                len = this.b * p.y - this.d;
            else if (this._alignment == Plane3D.ALIGN_XY_AXIS)
                len = this.c * p.z - this.d;
            else
                len = this.a * p.x + this.b * p.y + this.c * p.z - this.d;
            if (len < -epsilon)
                return feng3d.PlaneClassification.BACK;
            else if (len > epsilon)
                return feng3d.PlaneClassification.FRONT;
            else
                return feng3d.PlaneClassification.INTERSECT;
        };
        /**
         * 获取与直线交点
         */
        Plane3D.prototype.lineCross = function (line3D) {
            var lineDir = line3D.direction.clone();
            lineDir.normalize();
            var cosAngle = lineDir.dotProduct(this.normal);
            var distance = this.distance(line3D.position);
            var addVec = lineDir.clone();
            addVec.scaleBy(-distance / cosAngle);
            var crossPos = line3D.position.add(addVec);
            return crossPos;
        };
        /**
         * 输出字符串
         */
        Plane3D.prototype.toString = function () {
            return "Plane3D [this.a:" + this.a + ", this.b:" + this.b + ", this.c:" + this.c + ", this.d:" + this.d + "]";
        };
        /**
         * 普通平面
         * <p>不与对称轴平行或垂直</p>
         */
        Plane3D.ALIGN_ANY = 0;
        /**
         * XY方向平面
         * <p>法线与Z轴平行</p>
         */
        Plane3D.ALIGN_XY_AXIS = 1;
        /**
         * YZ方向平面
         * <p>法线与X轴平行</p>
         */
        Plane3D.ALIGN_YZ_AXIS = 2;
        /**
         * XZ方向平面
         * <p>法线与Y轴平行</p>
         */
        Plane3D.ALIGN_XZ_AXIS = 3;
        return Plane3D;
    }());
    feng3d.Plane3D = Plane3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 点与面的相对位置
     * @author feng
     */
    var PlaneClassification = (function () {
        function PlaneClassification() {
        }
        /**
         * 在平面后面
         * <p>等价于平面内</p>
         * @see #IN
         */
        PlaneClassification.BACK = 0;
        /**
         * 在平面前面
         * <p>等价于平面外</p>
         * @see #OUT
         */
        PlaneClassification.FRONT = 1;
        /**
         * 在平面内
         * <p>等价于在平面后</p>
         * @see #BACK
         */
        PlaneClassification.IN = 0;
        /**
         * 在平面外
         * <p>等价于平面前面</p>
         * @see #FRONT
         */
        PlaneClassification.OUT = 1;
        /**
         * 与平面相交
         */
        PlaneClassification.INTERSECT = 2;
        return PlaneClassification;
    }());
    feng3d.PlaneClassification = PlaneClassification;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染模式
     * @author feng 2016-09-28
     */
    (function (RenderMode) {
        RenderMode[RenderMode["DEFAULT"] = feng3d.Context3D.TRIANGLES] = "DEFAULT";
        /**
         * 点渲染
         */
        RenderMode[RenderMode["POINTS"] = feng3d.Context3D.POINTS] = "POINTS";
        RenderMode[RenderMode["LINE_LOOP"] = feng3d.Context3D.LINE_LOOP] = "LINE_LOOP";
        RenderMode[RenderMode["LINE_STRIP"] = feng3d.Context3D.LINE_STRIP] = "LINE_STRIP";
        RenderMode[RenderMode["LINES"] = feng3d.Context3D.LINES] = "LINES";
        RenderMode[RenderMode["TRIANGLES"] = feng3d.Context3D.TRIANGLES] = "TRIANGLES";
        RenderMode[RenderMode["TRIANGLE_STRIP"] = feng3d.Context3D.TRIANGLE_STRIP] = "TRIANGLE_STRIP";
        RenderMode[RenderMode["TRIANGLE_FAN"] = feng3d.Context3D.TRIANGLE_FAN] = "TRIANGLE_FAN";
    })(feng3d.RenderMode || (feng3d.RenderMode = {}));
    var RenderMode = feng3d.RenderMode;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染数据拥有者
     * @author feng 2016-6-7
     */
    var RenderDataHolder = (function (_super) {
        __extends(RenderDataHolder, _super);
        /**
         * 创建Context3D数据缓冲
         */
        function RenderDataHolder() {
            _super.call(this);
            this._renderData = new feng3d.RenderData();
            //
            this._subRenderDataHolders = [];
        }
        /**
         * 更新渲染数据
         */
        RenderDataHolder.prototype.updateRenderData = function (renderContext) {
            this._subRenderDataHolders.forEach(function (element) {
                element.updateRenderData(renderContext);
            });
        };
        /**
         * 激活
         * @param renderData	渲染数据
         */
        RenderDataHolder.prototype.activate = function (renderData) {
            feng3d.RenderDataUtil.active(renderData, this._renderData);
            this._subRenderDataHolders.forEach(function (element) {
                element.activate(renderData);
            });
        };
        /**
         * 释放
         * @param renderData	渲染数据
         */
        RenderDataHolder.prototype.deactivate = function (renderData) {
            feng3d.RenderDataUtil.deactivate(renderData, this._renderData);
            this._subRenderDataHolders.forEach(function (element) {
                element.deactivate(renderData);
            });
        };
        /**
         * 添加组件到指定位置
         * @param component		被添加的组件
         * @param index			插入的位置
         */
        RenderDataHolder.prototype.addComponentAt = function (component, index) {
            _super.prototype.addComponentAt.call(this, component, index);
            if (component != null && feng3d.ClassUtils.is(component, RenderDataHolder)) {
                var renderDataHolder = feng3d.ClassUtils.as(component, RenderDataHolder);
                var index1 = this._subRenderDataHolders.indexOf(renderDataHolder);
                if (index1 == -1) {
                    this._subRenderDataHolders.splice(index, 0, renderDataHolder);
                }
            }
        };
        /**
         * 移除组件
         * @param index		要删除的 Component 的子索引。
         */
        RenderDataHolder.prototype.removeComponentAt = function (index) {
            var component = this.components_[index];
            if (component != null && feng3d.ClassUtils.is(component, RenderDataHolder)) {
                var renderDataHolder = feng3d.ClassUtils.as(component, RenderDataHolder);
                var index1 = this._subRenderDataHolders.indexOf(renderDataHolder);
                if (index1 != -1) {
                    this._subRenderDataHolders.splice(index1, 1);
                }
            }
            return _super.prototype.removeComponentAt.call(this, index);
        };
        return RenderDataHolder;
    }(feng3d.Component));
    feng3d.RenderDataHolder = RenderDataHolder;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染原子（该对象会收集一切渲染所需数据以及参数）
     * @author feng 2016-06-20
     */
    var RenderAtomic = (function () {
        function RenderAtomic() {
            /**
             * 属性数据列表
             */
            this.attributes = {};
            /**
             * 常量数据（包含纹理）列表
             */
            this.uniforms = {};
            /**
             * 渲染参数
             */
            this.shaderParams = {};
            /**
             * 着色器宏定义
             */
            this.shaderMacro = new feng3d.ShaderMacro();
        }
        return RenderAtomic;
    }());
    feng3d.RenderAtomic = RenderAtomic;
    /**
     * 渲染所需数据
     * @author feng 2016-12-28
     */
    var RenderData = (function (_super) {
        __extends(RenderData, _super);
        function RenderData() {
            _super.apply(this, arguments);
        }
        return RenderData;
    }(RenderAtomic));
    feng3d.RenderData = RenderData;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 索引渲染数据
     * @author feng 2017-01-04
     */
    var IndexRenderData = (function () {
        function IndexRenderData() {
            /**
             * 数据绑定目标，gl.ARRAY_BUFFER、gl.ELEMENT_ARRAY_BUFFER
             */
            this.target = feng3d.Context3D.ELEMENT_ARRAY_BUFFER;
            /**
             * 数据类型，gl.UNSIGNED_BYTE、gl.UNSIGNED_SHORT
             */
            this.type = feng3d.Context3D.UNSIGNED_SHORT;
            /**
             * 索引偏移
             */
            this.offset = 0;
        }
        return IndexRenderData;
    }());
    feng3d.IndexRenderData = IndexRenderData;
    /**
     * 属性渲染数据
     * @author feng 2014-8-14
     */
    var AttributeRenderData = (function () {
        function AttributeRenderData(data, stride, divisor) {
            if (data === void 0) { data = null; }
            if (stride === void 0) { stride = 3; }
            if (divisor === void 0) { divisor = 0; }
            this.data = data;
            this.stride = stride;
            this.divisor = divisor;
        }
        /**
         * 获取或创建数据
         * @param num   数据数量
         */
        AttributeRenderData.prototype.getOrCreateData = function (num) {
            if (this.data == null || this.data.length != num * this.stride) {
                this.data = new Float32Array(num * this.stride);
            }
            return this.data;
        };
        return AttributeRenderData;
    }());
    feng3d.AttributeRenderData = AttributeRenderData;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 对象池
     * @author feng 2016-04-26
     */
    var RenderBufferPool = (function () {
        function RenderBufferPool() {
            /**
             * 3D环境缓冲池
             */
            this.context3DBufferPools = {};
        }
        /**
         * @param context3D     3D环境
         */
        RenderBufferPool.prototype.getContext3DBufferPool = function (context3D) {
            //获取3D环境唯一标识符
            var context3DUID = feng3d.UIDUtils.getUID(context3D);
            return this.context3DBufferPools[context3DUID] = this.context3DBufferPools[context3DUID] || new Context3DBufferPool(context3D);
        };
        /**
         * 获取渲染程序
         * @param context3D     3D环境
         * @param vertexCode    顶点着色器代码
         * @param fragmentCode  片段着色器代码
         * @return  渲染程序
         */
        RenderBufferPool.prototype.getWebGLProgram = function (context3D, vertexCode, fragmentCode) {
            return this.getContext3DBufferPool(context3D).getWebGLProgram(vertexCode, fragmentCode);
        };
        /**
         * 获取顶点渲染程序
         * @param context3D         3D环境
         * @param vertexCode        顶点渲染代码
         * @return                  顶点渲染程序
         */
        RenderBufferPool.prototype.getVertexShader = function (context3D, vertexCode) {
            return this.getContext3DBufferPool(context3D).getVertexShader(vertexCode);
        };
        /**
         * 获取顶点渲染程序
         * @param context3D         3D环境
         * @param fragmentCode      顶点渲染代码
         * @return                  顶点渲染程序
         */
        RenderBufferPool.prototype.getFragmentShader = function (context3D, fragmentCode) {
            return this.getContext3DBufferPool(context3D).getFragmentShader(fragmentCode);
        };
        /**
         * 获取索引缓冲
         */
        RenderBufferPool.prototype.getIndexBuffer = function (context3D, indices) {
            return this.getContext3DBufferPool(context3D).getIndexBuffer(indices);
        };
        /**
         * 获取顶点属性缓冲
         * @param data  数据
         */
        RenderBufferPool.prototype.getVABuffer = function (context3D, data) {
            return this.getContext3DBufferPool(context3D).getVABuffer(data);
        };
        /**
         * 获取顶点属性缓冲
         * @param data  数据
         */
        RenderBufferPool.prototype.getTexture = function (context3D, data) {
            return this.getContext3DBufferPool(context3D).getTexture(data);
        };
        return RenderBufferPool;
    }());
    feng3d.RenderBufferPool = RenderBufferPool;
    /**
     * 3D环境缓冲池
     */
    var Context3DBufferPool = (function () {
        /**
         * 构建3D环境缓冲池
         * @param context3D         3D环境
         */
        function Context3DBufferPool(context3D) {
            /**
             * 纹理缓冲
             */
            this._textureBuffer = new feng3d.Map();
            /** 渲染程序对象池 */
            this._webGLProgramPool = {};
            /** 顶点渲染程序对象池 */
            this._vertexShaderPool = {};
            /** 顶点渲染程序对象池 */
            this._fragmentShaderPool = {};
            /**
             * 缓冲字典
             */
            this._bufferMap = {};
            this.context3D = context3D;
        }
        /**
         * 获取渲染程序
         * @param vertexCode    顶点着色器代码
         * @param fragmentCode  片段着色器代码
         * @return  渲染程序
         */
        Context3DBufferPool.prototype.getWebGLProgram = function (vertexCode, fragmentCode) {
            //获取3D环境唯一标识符
            var shaderCode = [vertexCode, fragmentCode].join("\n--- shaderCode ---\n");
            //获取3D环境中的渲染程序对象池
            return this._webGLProgramPool[shaderCode] = this._webGLProgramPool[shaderCode] || getWebGLProgram(this.context3D, vertexCode, fragmentCode);
        };
        /**
         * 获取顶点渲染程序
         * @param vertexCode        顶点渲染代码
         * @return                  顶点渲染程序
         */
        Context3DBufferPool.prototype.getVertexShader = function (vertexCode) {
            return this._vertexShaderPool[vertexCode] = this._vertexShaderPool[vertexCode] || getVertexShader(this.context3D, vertexCode);
        };
        /**
         * 获取顶点渲染程序
         * @param fragmentCode      顶点渲染代码
         * @return                  顶点渲染程序
         */
        Context3DBufferPool.prototype.getFragmentShader = function (fragmentCode) {
            return this._fragmentShaderPool[fragmentCode] = this._fragmentShaderPool[fragmentCode] || getFragmentShader(this.context3D, fragmentCode);
        };
        /**
         * 获取索引缓冲
         */
        Context3DBufferPool.prototype.getIndexBuffer = function (indices) {
            var indexBuffer = this.getBuffer(indices, feng3d.Context3D.ELEMENT_ARRAY_BUFFER);
            return indexBuffer;
        };
        /**
         * 获取顶点属性缓冲
         * @param data  数据
         */
        Context3DBufferPool.prototype.getVABuffer = function (data) {
            var buffer = this.getBuffer(data, feng3d.Context3D.ARRAY_BUFFER);
            return buffer;
        };
        /**
         * 获取顶点属性缓冲
         * @param data  数据
         */
        Context3DBufferPool.prototype.getTexture = function (textureInfo) {
            var buffer = this._textureBuffer.get(textureInfo.pixels);
            if (buffer != null) {
                return buffer;
            }
            var context3D = this.context3D;
            var texture = context3D.createTexture(); // Create a texture object
            //绑定纹理
            context3D.bindTexture(textureInfo.textureType, texture);
            if (textureInfo.textureType == feng3d.Context3D.TEXTURE_2D) {
                //设置纹理图片
                context3D.texImage2D(textureInfo.textureType, 0, textureInfo.internalformat, textureInfo.format, textureInfo.type, textureInfo.pixels);
            }
            else if (textureInfo.textureType == feng3d.Context3D.TEXTURE_CUBE_MAP) {
                var faces = [
                    feng3d.Context3D.TEXTURE_CUBE_MAP_POSITIVE_X, feng3d.Context3D.TEXTURE_CUBE_MAP_POSITIVE_Y, feng3d.Context3D.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    feng3d.Context3D.TEXTURE_CUBE_MAP_NEGATIVE_X, feng3d.Context3D.TEXTURE_CUBE_MAP_NEGATIVE_Y, feng3d.Context3D.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                for (var i = 0; i < faces.length; i++) {
                    context3D.texImage2D(faces[i], 0, textureInfo.internalformat, textureInfo.format, textureInfo.type, textureInfo.pixels[i]);
                }
            }
            if (textureInfo.generateMipmap) {
                context3D.generateMipmap(textureInfo.textureType);
            }
            this._textureBuffer.push(textureInfo.pixels, texture);
            return texture;
        };
        /**
         * 获取缓冲
         * @param data  数据
         */
        Context3DBufferPool.prototype.getBuffer = function (data, target) {
            var context3D = this.context3D;
            var dataUID = feng3d.UIDUtils.getUID(data);
            var buffer = this._bufferMap[dataUID] = this._bufferMap[dataUID] || context3D.createBuffer();
            if (!feng3d.VersionUtils.equal(data, buffer)) {
                context3D.bindBuffer(target, buffer);
                context3D.bufferData(target, data, feng3d.Context3D.STATIC_DRAW);
                feng3d.VersionUtils.setVersion(buffer, feng3d.VersionUtils.getVersion(data));
                //升级buffer和数据版本号一致
                var dataVersion = Math.max(0, feng3d.VersionUtils.getVersion(data));
                feng3d.VersionUtils.setVersion(data, dataVersion);
                feng3d.VersionUtils.setVersion(buffer, dataVersion);
            }
            return buffer;
        };
        return Context3DBufferPool;
    }());
    /**
     * 获取WebGLProgram
     * @param context3D     3D环境上下文
     * @param vertexCode    顶点着色器代码
     * @param fragmentCode  片段着色器代码
     * @return  WebGL程序
     */
    function getWebGLProgram(context3D, vertexCode, fragmentCode) {
        var vertexShader = feng3d.context3DPool.getVertexShader(context3D, vertexCode);
        var fragmentShader = feng3d.context3DPool.getFragmentShader(context3D, fragmentCode);
        // 创建渲染程序
        var shaderProgram = context3D.createProgram();
        context3D.attachShader(shaderProgram, vertexShader);
        context3D.attachShader(shaderProgram, fragmentShader);
        context3D.linkProgram(shaderProgram);
        // 渲染程序创建失败时给出弹框
        if (!context3D.getProgramParameter(shaderProgram, context3D.LINK_STATUS)) {
            alert("\u65E0\u6CD5\u521D\u59CB\u5316\u6E32\u67D3\u7A0B\u5E8F\u3002\n" + vertexCode + "\n" + fragmentCode);
        }
        return shaderProgram;
    }
    /**
     * 获取顶点渲染程序
     * @param context3D         3D环境上下文
     * @param vertexCode        顶点渲染代码
     * @return                  顶点渲染程序
     */
    function getVertexShader(context3D, vertexCode) {
        var shader = context3D.createShader(feng3d.Context3D.VERTEX_SHADER);
        shader = compileShader(context3D, shader, vertexCode);
        return shader;
    }
    /**
     * 获取片段渲染程序
     * @param context3D         3D环境上下文
     * @param fragmentCode      片段渲染代码
     * @return                  片段渲染程序
     */
    function getFragmentShader(context3D, fragmentCode) {
        var shader = context3D.createShader(feng3d.Context3D.FRAGMENT_SHADER);
        shader = compileShader(context3D, shader, fragmentCode);
        return shader;
    }
    /**
     * 编译渲染程序
     * @param context3D         3D环境上下文
     * @param shader            渲染程序
     * @param shaderCode        渲染代码
     * @return                  完成编译的渲染程序
     */
    function compileShader(context3D, shader, shaderCode) {
        context3D.shaderSource(shader, shaderCode);
        context3D.compileShader(shader);
        if (!context3D.getShaderParameter(shader, context3D.COMPILE_STATUS)) {
            alert("\u7F16\u8BD1\u6E32\u67D3\u7A0B\u5E8F\u65F6\u53D1\u751F\u9519\u8BEF: " + context3D.getShaderInfoLog(shader) + "\n" + shaderCode);
        }
        return shader;
    }
    /**
     * 3D环境对象池
     */
    feng3d.context3DPool = new RenderBufferPool();
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染数据工具
     * @author feng 2016-05-02
     */
    var RenderDataUtil = (function () {
        function RenderDataUtil() {
        }
        /**
         * 激活渲染数据
         * @param renderAtomic  渲染原子
         * @param renderData    包含渲染数据的对象
         */
        RenderDataUtil.active = function (renderAtomic, renderData) {
            renderData.vertexCode && (renderAtomic.vertexCode = renderData.vertexCode);
            renderData.fragmentCode && (renderAtomic.fragmentCode = renderData.fragmentCode);
            renderData.indexBuffer && (renderAtomic.indexBuffer = renderData.indexBuffer);
            renderData.instanceCount && (renderAtomic.instanceCount = renderData.instanceCount);
            for (var attributeName in renderData.attributes) {
                renderAtomic.attributes[attributeName] = renderData.attributes[attributeName];
            }
            for (var uniformName in renderData.uniforms) {
                renderAtomic.uniforms[uniformName] = renderData.uniforms[uniformName];
            }
            for (var shaderParamName in renderData.shaderParams) {
                renderAtomic.shaderParams[shaderParamName] = renderData.shaderParams[shaderParamName];
            }
            //ShaderMacro
            for (var boolMacroName in renderData.shaderMacro.boolMacros) {
                renderAtomic.shaderMacro.boolMacros[boolMacroName] = renderAtomic.shaderMacro.boolMacros[boolMacroName] || renderData.shaderMacro.boolMacros[boolMacroName];
            }
            for (var valueMacroName in renderData.shaderMacro.valueMacros) {
                renderAtomic.shaderMacro.valueMacros[valueMacroName] = renderData.shaderMacro.valueMacros[valueMacroName];
            }
            for (var addMacroName in renderData.shaderMacro.addMacros) {
                renderAtomic.shaderMacro.addMacros[addMacroName] = renderAtomic.shaderMacro.addMacros[addMacroName] + renderData.shaderMacro.addMacros[addMacroName];
            }
        };
        /**
         * 释放渲染数据
         * @param renderAtomic  渲染原子
         * @param renderData    包含渲染数据的对象
         */
        RenderDataUtil.deactivate = function (renderAtomic, renderData) {
            renderData.vertexCode && (renderAtomic.vertexCode = null);
            renderData.fragmentCode && (renderAtomic.fragmentCode = null);
            renderData.indexBuffer && (renderAtomic.indexBuffer = null);
            renderData.instanceCount && (delete renderAtomic.instanceCount);
            for (var attributeName in renderData.attributes) {
                delete renderAtomic.attributes[attributeName];
            }
            for (var uniformName in renderData.uniforms) {
                delete renderAtomic.uniforms[uniformName];
            }
            for (var shaderParamName in renderData.shaderParams) {
                delete renderAtomic.shaderParams[shaderParamName];
            }
            //ShaderMacro
            for (var boolMacroName in renderData.shaderMacro.boolMacros) {
                delete renderAtomic.shaderMacro.boolMacros[boolMacroName];
            }
            for (var valueMacroName in renderData.shaderMacro.valueMacros) {
                delete renderAtomic.shaderMacro.valueMacros[valueMacroName];
            }
            for (var addMacroName in renderData.shaderMacro.addMacros) {
                renderAtomic.shaderMacro.addMacros[addMacroName] = renderAtomic.shaderMacro.addMacros[addMacroName] - renderData.shaderMacro.addMacros[addMacroName];
            }
        };
        return RenderDataUtil;
    }());
    feng3d.RenderDataUtil = RenderDataUtil;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染数据编号
     * @author feng 2016-06-20
     */
    var RenderDataID = (function () {
        function RenderDataID() {
        }
        /**
         * 顶点索引
         */
        RenderDataID.index = "index";
        /**
         * 模型矩阵
         */
        RenderDataID.u_modelMatrix = "u_modelMatrix";
        /**
         * 世界投影矩阵
         */
        RenderDataID.u_viewProjection = "u_viewProjection";
        RenderDataID.u_diffuseInput = "u_diffuseInput";
        /**
         * 漫反射贴图
         */
        RenderDataID.s_texture = "s_texture";
        /**
         * 天空盒纹理
         */
        RenderDataID.s_skyboxTexture = "s_skyboxTexture";
        /**
         * 摄像机矩阵
         */
        RenderDataID.u_cameraMatrix = "u_cameraMatrix";
        /**
         * 天空盒尺寸
         */
        RenderDataID.u_skyBoxSize = "u_skyBoxSize";
        /**
         * 地形混合贴图
         */
        RenderDataID.s_blendTexture = "s_blendTexture";
        /**
         * 地形块贴图1
         */
        RenderDataID.s_splatTexture1 = "s_splatTexture1";
        /**
         * 地形块贴图2
         */
        RenderDataID.s_splatTexture2 = "s_splatTexture2";
        /**
         * 地形块贴图3
         */
        RenderDataID.s_splatTexture3 = "s_splatTexture3";
        /**
         * 地形块重复次数
         */
        RenderDataID.u_splatRepeats = "u_splatRepeats";
        /**
         * 点光源位置数组
         */
        RenderDataID.u_pointLightPositions = "u_pointLightPositions";
        /**
         * 点光源颜色数组
         */
        RenderDataID.u_pointLightColors = "u_pointLightColors";
        /**
         * 点光源光照强度数组
         */
        RenderDataID.u_pointLightIntensitys = "u_pointLightIntensitys";
        /**
         * 基本颜色
         */
        RenderDataID.u_baseColor = "u_baseColor";
        /**
         * 反射率
         */
        RenderDataID.u_reflectance = "u_reflectance";
        /**
         * 粗糙度
         */
        RenderDataID.u_roughness = "u_roughness";
        /**
         * 金属度
         */
        RenderDataID.u_metalic = "u_metalic";
        /**
         * 粒子时间
         */
        RenderDataID.u_particleTime = "u_particleTime";
        /**
         * 点大小
         */
        RenderDataID.u_PointSize = "u_PointSize";
        /**
         * 骨骼全局矩阵
         */
        RenderDataID.u_skeletonGlobalMatriices = "u_skeletonGlobalMatriices";
        /**
         * 3D对象编号
         */
        RenderDataID.u_objectID = "u_objectID";
        return RenderDataID;
    }());
    feng3d.RenderDataID = RenderDataID;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染参数编号
     * @author feng 2016-10-15
     */
    (function (ShaderParamID) {
        /**
         * 渲染模式
         */
        ShaderParamID[ShaderParamID["renderMode"] = 0] = "renderMode";
    })(feng3d.ShaderParamID || (feng3d.ShaderParamID = {}));
    var ShaderParamID = feng3d.ShaderParamID;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 着色器宏定义
     * @author feng 2016-12-17
     */
    var ShaderMacro = (function () {
        function ShaderMacro() {
            /**
             * 值类型宏
             */
            this.valueMacros = new ValueMacros();
            /**
             * Boolean类型宏
             */
            this.boolMacros = new BoolMacros();
            /**
             * 递增类型宏
             */
            this.addMacros = new IAddMacros();
        }
        return ShaderMacro;
    }());
    feng3d.ShaderMacro = ShaderMacro;
    /**
     * 值类型宏
     * 没有默认值
     */
    var ValueMacros = (function () {
        function ValueMacros() {
        }
        return ValueMacros;
    }());
    feng3d.ValueMacros = ValueMacros;
    /**
     * Boolean类型宏
     * 没有默认值
     */
    var BoolMacros = (function () {
        function BoolMacros() {
        }
        return BoolMacros;
    }());
    feng3d.BoolMacros = BoolMacros;
    /**
     * 递增类型宏
     * 所有默认值为0
     */
    var IAddMacros = (function () {
        function IAddMacros() {
            /**
             * 是否需要属性uv
             */
            this.A_UV_NEED = 0;
            /**
             * 是否需要变量uv
             */
            this.V_UV_NEED = 0;
            /**
             * 是否需要变量全局坐标
             */
            this.V_GLOBAL_POSITION_NEED = 0;
            /**
             * 是否需要属性法线
             */
            this.A_NORMAL_NEED = 0;
            /**
             * 是否需要变量法线
             */
            this.V_NORMAL_NEED = 0;
            /**
             * 是否需要摄像机矩阵
             */
            this.U_CAMERAmATRIX_NEED = 0;
        }
        return IAddMacros;
    }());
    feng3d.IAddMacros = IAddMacros;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染环境
     * @author feng 2017-01-04
     */
    var RenderContext = (function () {
        function RenderContext() {
            this._renderData = new feng3d.RenderData();
            /**
             * 灯光
             */
            this.lights = [];
        }
        /**
         * 更新渲染数据
         */
        RenderContext.prototype.updateRenderData = function (object3D) {
            var pointLights = [];
            this.camera.updateRenderData(this);
            var light;
            for (var i = 0; i < this.lights.length; i++) {
                light = this.lights[i];
                light.updateRenderData(this);
                if (light.lightType == feng3d.LightType.Point)
                    pointLights.push(light);
            }
            //收集点光源数据
            var pointLightPositions = [];
            var pointLightDiffuses = [];
            var pointLightIntensitys = [];
            for (var i = 0; i < pointLights.length; i++) {
                light = pointLights[i];
                pointLightPositions.push(light.position);
                pointLightDiffuses.push(light.color.toVector3D());
                pointLightIntensitys.push(light.intensity);
            }
            //设置点光源数据
            this._renderData.shaderMacro.valueMacros.NUM_POINTLIGHT = pointLights.length;
            if (pointLights.length > 0) {
                this._renderData.shaderMacro.addMacros.A_NORMAL_NEED = 1;
                this._renderData.shaderMacro.addMacros.V_NORMAL_NEED = 1;
                this._renderData.shaderMacro.addMacros.V_GLOBAL_POSITION_NEED = 1;
                this._renderData.shaderMacro.addMacros.U_CAMERAmATRIX_NEED = 1;
                //
                this._renderData.uniforms[feng3d.RenderDataID.u_pointLightPositions] = pointLightPositions;
                this._renderData.uniforms[feng3d.RenderDataID.u_pointLightColors] = pointLightDiffuses;
                this._renderData.uniforms[feng3d.RenderDataID.u_pointLightIntensitys] = pointLightIntensitys;
            }
        };
        /**
         * 激活
         * @param renderData	渲染数据
         */
        RenderContext.prototype.activate = function (renderData) {
            feng3d.RenderDataUtil.active(renderData, this._renderData);
            this.camera.activate(renderData);
        };
        /**
         * 释放
         * @param renderData	渲染数据
         */
        RenderContext.prototype.deactivate = function (renderData) {
            feng3d.RenderDataUtil.deactivate(renderData, this._renderData);
            this.camera.deactivate(renderData);
        };
        /**
         * 清理
         */
        RenderContext.prototype.clear = function () {
            this.camera = null;
            this.lights = [];
        };
        return RenderContext;
    }());
    feng3d.RenderContext = RenderContext;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 渲染器
     * @author feng 2016-05-01
     */
    var Renderer = (function () {
        function Renderer() {
            /** 渲染原子 */
            this._renderAtomic = new feng3d.RenderAtomic();
        }
        /**
         * 渲染
         */
        Renderer.prototype.draw = function (context3D, scene3D, camera) {
            var _this = this;
            var renderContext = new feng3d.RenderContext();
            //初始化渲染环境
            renderContext.clear();
            renderContext.camera = camera;
            renderContext.lights = scene3D.lights;
            scene3D.renderers.forEach(function (element) {
                _this.drawRenderables(context3D, renderContext, element);
            });
        };
        Renderer.prototype.drawRenderables = function (context3D, renderContext, meshRenderer) {
            var object3D = meshRenderer.parentComponent;
            //更新数据
            renderContext.updateRenderData(object3D);
            object3D.updateRenderData(renderContext);
            //收集数据
            renderContext.activate(this._renderAtomic);
            object3D.activate(this._renderAtomic);
            //绘制
            this.drawObject3D(context3D); //
            //释放数据
            object3D.deactivate(this._renderAtomic);
            renderContext.deactivate(this._renderAtomic);
        };
        /**
         * 绘制3D对象
         */
        Renderer.prototype.drawObject3D = function (context3D) {
            var shaderProgram = this.activeShaderProgram(context3D, this._renderAtomic.vertexCode, this._renderAtomic.fragmentCode);
            if (!shaderProgram)
                return;
            _samplerIndex = 0;
            //
            activeAttributes(context3D, shaderProgram, this._renderAtomic.attributes);
            activeUniforms(context3D, shaderProgram, this._renderAtomic.uniforms);
            dodraw(context3D, this._renderAtomic.shaderParams, this._renderAtomic.indexBuffer, this._renderAtomic.instanceCount);
        };
        /**
         * 激活渲染程序
         */
        Renderer.prototype.activeShaderProgram = function (context3D, vertexCode, fragmentCode) {
            if (!vertexCode || !fragmentCode)
                return null;
            //应用宏
            var shaderMacro = feng3d.ShaderLib.getMacroCode(this._renderAtomic.shaderMacro);
            vertexCode = vertexCode.replace(/#define\s+macros/, shaderMacro);
            fragmentCode = fragmentCode.replace(/#define\s+macros/, shaderMacro);
            //渲染程序
            var shaderProgram = feng3d.context3DPool.getWebGLProgram(context3D, vertexCode, fragmentCode);
            context3D.useProgram(shaderProgram);
            return shaderProgram;
        };
        return Renderer;
    }());
    feng3d.Renderer = Renderer;
    var _samplerIndex = 0;
    /**
     * 激活属性
     */
    function activeAttributes(context3D, shaderProgram, attributes) {
        var numAttributes = context3D.getProgramParameter(shaderProgram, context3D.ACTIVE_ATTRIBUTES);
        var i = 0;
        while (i < numAttributes) {
            var activeInfo = context3D.getActiveAttrib(shaderProgram, i++);
            setContext3DAttribute(context3D, shaderProgram, activeInfo, attributes[activeInfo.name]);
        }
    }
    /**
     * 激活常量
     */
    function activeUniforms(context3D, shaderProgram, uniforms) {
        var numUniforms = context3D.getProgramParameter(shaderProgram, context3D.ACTIVE_UNIFORMS);
        var i = 0;
        while (i < numUniforms) {
            var activeInfo = context3D.getActiveUniform(shaderProgram, i++);
            if (activeInfo.name.indexOf("[") != -1) {
                //处理数组
                var baseName = activeInfo.name.substring(0, activeInfo.name.indexOf("["));
                for (var j = 0; j < activeInfo.size; j++) {
                    setContext3DUniform(context3D, shaderProgram, { name: baseName + ("[" + j + "]"), type: activeInfo.type }, uniforms[baseName][j]);
                }
            }
            else {
                setContext3DUniform(context3D, shaderProgram, activeInfo, uniforms[activeInfo.name]);
            }
        }
    }
    /**
     */
    function dodraw(context3D, shaderParams, indexBuffer, instanceCount) {
        if (instanceCount === void 0) { instanceCount = 1; }
        instanceCount = ~~instanceCount;
        var buffer = feng3d.context3DPool.getIndexBuffer(context3D, indexBuffer.indices);
        context3D.bindBuffer(indexBuffer.target, buffer);
        if (instanceCount > 1) {
            _ext = _ext || context3D.getExtension('ANGLE_instanced_arrays');
            _ext.drawArraysInstancedANGLE(shaderParams.renderMode, 0, indexBuffer.count, instanceCount);
        }
        else {
            context3D.drawElements(shaderParams.renderMode, indexBuffer.count, indexBuffer.type, indexBuffer.offset);
        }
    }
    /**
     * 设置环境属性数据
     */
    function setContext3DAttribute(context3D, shaderProgram, activeInfo, buffer) {
        var location = context3D.getAttribLocation(shaderProgram, activeInfo.name);
        context3D.enableVertexAttribArray(location);
        //
        var squareVerticesBuffer = feng3d.context3DPool.getVABuffer(context3D, buffer.data);
        context3D.bindBuffer(feng3d.Context3D.ARRAY_BUFFER, squareVerticesBuffer);
        switch (activeInfo.type) {
            case feng3d.Context3D.FLOAT:
                context3D.vertexAttribPointer(location, 1, feng3d.Context3D.FLOAT, false, 0, 0);
                break;
            case feng3d.Context3D.FLOAT_VEC2:
                context3D.vertexAttribPointer(location, 2, feng3d.Context3D.FLOAT, false, 0, 0);
                break;
            case feng3d.Context3D.FLOAT_VEC3:
                context3D.vertexAttribPointer(location, 3, feng3d.Context3D.FLOAT, false, 0, 0);
                break;
            case feng3d.Context3D.FLOAT_VEC4:
                context3D.vertexAttribPointer(location, 4, feng3d.Context3D.FLOAT, false, 0, 0);
                break;
            default:
                throw "\u65E0\u6CD5\u8BC6\u522B\u7684attribute\u7C7B\u578B " + activeInfo.name + " " + buffer.data;
        }
        if (buffer.divisor > 0) {
            _ext = _ext || context3D.getExtension('ANGLE_instanced_arrays');
            _ext.vertexAttribDivisorANGLE(location, buffer.divisor);
        }
    }
    /**
     * 设置环境Uniform数据
     */
    function setContext3DUniform(context3D, shaderProgram, activeInfo, data) {
        var location = context3D.getUniformLocation(shaderProgram, activeInfo.name);
        switch (activeInfo.type) {
            case feng3d.Context3D.INT:
                context3D.uniform1i(location, data);
                break;
            case feng3d.Context3D.FLOAT_MAT4:
                context3D.uniformMatrix4fv(location, false, data.rawData);
                break;
            case feng3d.Context3D.FLOAT:
                context3D.uniform1f(location, data);
                break;
            case feng3d.Context3D.FLOAT_VEC3:
                context3D.uniform3f(location, data.x, data.y, data.z);
                break;
            case feng3d.Context3D.FLOAT_VEC4:
                context3D.uniform4f(location, data.x, data.y, data.z, data.w);
                break;
            case feng3d.Context3D.SAMPLER_2D:
            case feng3d.Context3D.SAMPLER_CUBE:
                var textureInfo = data;
                var texture = feng3d.context3DPool.getTexture(context3D, textureInfo);
                //激活纹理编号
                context3D.activeTexture(feng3d.Context3D["TEXTURE" + _samplerIndex]);
                //绑定纹理
                context3D.bindTexture(textureInfo.textureType, texture);
                //设置图片y轴方向
                context3D.pixelStorei(feng3d.Context3D.UNPACK_FLIP_Y_WEBGL, textureInfo.flipY);
                //设置纹理参数
                context3D.texParameteri(textureInfo.textureType, feng3d.Context3D.TEXTURE_MIN_FILTER, textureInfo.minFilter);
                context3D.texParameteri(textureInfo.textureType, feng3d.Context3D.TEXTURE_MAG_FILTER, textureInfo.magFilter);
                context3D.texParameteri(textureInfo.textureType, feng3d.Context3D.TEXTURE_WRAP_S, textureInfo.wrapS);
                context3D.texParameteri(textureInfo.textureType, feng3d.Context3D.TEXTURE_WRAP_T, textureInfo.wrapT);
                //设置纹理所在采样编号
                context3D.uniform1i(location, _samplerIndex);
                _samplerIndex++;
                break;
            default:
                throw "\u65E0\u6CD5\u8BC6\u522B\u7684uniform\u7C7B\u578B " + activeInfo.name + " " + data;
        }
    }
    var _ext;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 前向渲染器
     * @author feng 2017-02-20
     */
    var ForwardRenderer = (function (_super) {
        __extends(ForwardRenderer, _super);
        function ForwardRenderer() {
            _super.call(this);
        }
        ForwardRenderer.prototype.drawRenderables = function (context3D, renderContext, meshRenderer) {
            if (meshRenderer.parentComponent.realVisible)
                _super.prototype.drawRenderables.call(this, context3D, renderContext, meshRenderer);
        };
        return ForwardRenderer;
    }(feng3d.Renderer));
    feng3d.ForwardRenderer = ForwardRenderer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 鼠标拾取渲染器
     * @author feng 2017-02-06
     */
    var MouseRenderer = (function (_super) {
        __extends(MouseRenderer, _super);
        function MouseRenderer() {
            _super.call(this);
            this._shaderName = "mouse";
        }
        /**
         * 渲染
         */
        MouseRenderer.prototype.draw = function (context3D, scene3D, camera) {
            // this.frameBufferObject.activate(context3D,
            //     context3D.drawingBufferWidth,
            //     context3D.drawingBufferHeight);
            //启动裁剪，只绘制一个像素
            context3D.enable(feng3d.Context3D.SCISSOR_TEST);
            context3D.scissor(0, 0, 1, 1);
            _super.prototype.draw.call(this, context3D, scene3D, camera);
            context3D.disable(feng3d.Context3D.SCISSOR_TEST);
            //读取鼠标拾取索引
            // this.frameBufferObject.readBuffer(context3D, "objectID");
            var data = new Uint8Array(4);
            context3D.readPixels(0, 0, 1, 1, feng3d.Context3D.RGBA, feng3d.Context3D.UNSIGNED_BYTE, data);
            var id = data[0] + data[1] * 255 + data[2] * 255 * 255 + data[3] * 255 * 255 * 255 - data[3]; //最后（- data[3]）表示很奇怪，不过data[3]一般情况下为0
            // console.log(`选中索引3D对象${id}`, data.toString());
            this.selectedObject3D = feng3d.Object3D.getObject3D(id);
            // this.frameBufferObject.deactivate(context3D);
        };
        MouseRenderer.prototype.drawRenderables = function (context3D, renderContext, meshRenderer) {
            if (meshRenderer.parentComponent.realMouseEnable)
                _super.prototype.drawRenderables.call(this, context3D, renderContext, meshRenderer);
        };
        /**
         * 激活渲染程序
         */
        MouseRenderer.prototype.activeShaderProgram = function (context3D, vertexCode, fragmentCode) {
            vertexCode = feng3d.ShaderLib.getShaderCode(this._shaderName + ".vertex");
            fragmentCode = feng3d.ShaderLib.getShaderCode(this._shaderName + ".fragment");
            return _super.prototype.activeShaderProgram.call(this, context3D, vertexCode, fragmentCode);
        };
        return MouseRenderer;
    }(feng3d.Renderer));
    feng3d.MouseRenderer = MouseRenderer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 后处理渲染器
     * @author feng 2017-02-20
     */
    var PostProcessRenderer = (function (_super) {
        __extends(PostProcessRenderer, _super);
        function PostProcessRenderer() {
            _super.apply(this, arguments);
        }
        return PostProcessRenderer;
    }(feng3d.Renderer));
    feng3d.PostProcessRenderer = PostProcessRenderer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 后处理效果
     * @author feng 2017-02-20
     */
    var PostEffect = (function () {
        function PostEffect() {
        }
        return PostEffect;
    }());
    feng3d.PostEffect = PostEffect;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 快速近似抗锯齿（Fast Approximate Anti-Aliasing）后处理效果
     * @author feng 2017-02-20
     *
     * @see
     * https://github.com/BabylonJS/Babylon.js/blob/master/src/Shaders/fxaa.fragment.fx
     * https://github.com/playcanvas/engine/blob/master/extras/posteffects/posteffect-fxaa.js
     */
    var FXAAEffect = (function () {
        function FXAAEffect() {
        }
        return FXAAEffect;
    }());
    feng3d.FXAAEffect = FXAAEffect;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D对象
     * @author feng 2016-04-26
     */
    var Object3D = (function (_super) {
        __extends(Object3D, _super);
        /**
         * 构建3D对象
         */
        function Object3D(name) {
            if (name === void 0) { name = "object"; }
            _super.call(this);
            //-序列化
            this.mouseEnabled_ = true;
            this.visible_ = true;
            /**
             * 组件列表
             */
            this.components_ = [];
            /**
             * 子对象列表
             */
            this.children_ = [];
            /**
             * 父对象
             */
            this._parent = null;
            this._object3DID = object3DAutoID++;
            object3DMap[this._object3DID] = this;
            this.name = name;
            //
            this.transform = new feng3d.Transform();
            //
            this._renderData.uniforms[feng3d.RenderDataID.u_objectID] = this._object3DID;
            //
            this.addEventListener(feng3d.Object3DEvent.ADDED, this.onAdded, this);
            this.addEventListener(feng3d.Object3DEvent.REMOVED, this.onRemoved, this);
            this.addEventListener(feng3d.ComponentEvent.ADDED_COMPONENT, this.onAddedComponent, this);
            this.addEventListener(feng3d.ComponentEvent.REMOVED_COMPONENT, this.onRemovedComponent, this);
        }
        /**
         * 保存为数据
         */
        Object3D.prototype.saveToData = function () {
            // var data = {};
            // data.className = ClassUtils.getQualifiedClassName(this);
            // data.name = this.name;
            // data.visible = this.visible;
            // var children = data.children = [];
            // this.children_.forEach(element =>
            // {
            //     children.push(element.saveToData());
            // });
            // var components = data.components = [];
            // this.components_.forEach(element =>
            // {
            //     components
            // });
            // return data;
        };
        /**
         * 从数据初始化
         */
        Object3D.prototype.initFromData = function () {
        };
        Object.defineProperty(Object3D.prototype, "object3DID", {
            get: function () {
                return this._object3DID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "transform", {
            /**
             * 变换
             */
            get: function () {
                return this._transform;
            },
            set: function (value) {
                feng3d.assert(value != null, "3D空间不能为null");
                this._transform && this.removeComponent(this._transform);
                this._transform = value;
                this._transform && this.addComponentAt(this._transform, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "parent", {
            /**
             * 父对象
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object3D.prototype._setParent = function (value) {
            if (this._parent == value)
                return;
            this._parent = value;
            if (this._parent == null)
                this._setScene(null);
            else if (feng3d.ClassUtils.is(this.parent, feng3d.Scene3D))
                this._setScene(this.parent);
            else
                this._setScene(this.parent.scene);
        };
        Object.defineProperty(Object3D.prototype, "scene", {
            /**
             * 场景
             */
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        Object3D.prototype._setScene = function (value) {
            var _this = this;
            if (this._scene == value)
                return;
            if (this._scene) {
                this.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, { object3d: this, scene: this._scene }));
                this._scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, { object3d: this, scene: this._scene }));
            }
            this._scene = value;
            if (this._scene) {
                this.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_TO_SCENE, { object3d: this, scene: this._scene }));
                this._scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_TO_SCENE, { object3d: this, scene: this._scene }));
            }
            this.children_.forEach(function (child) {
                child._setScene(_this._scene);
            });
        };
        Object.defineProperty(Object3D.prototype, "mouseEnabled", {
            /**
             * 是否开启鼠标事件
             */
            get: function () {
                return this.mouseEnabled_;
            },
            set: function (value) {
                this.mouseEnabled_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "realMouseEnable", {
            /**
             * 真实是否支持鼠标事件
             */
            get: function () {
                return this.mouseEnabled_ && (this.parent ? this.parent.realMouseEnable : true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "visible", {
            /**
             * 是否可见
             */
            get: function () {
                return this.visible_;
            },
            set: function (value) {
                this.visible_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "realVisible", {
            /**
             * 真实是否可见
             */
            get: function () {
                return this.visible_ && (this.parent ? this.parent.realVisible : true);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加子对象
         * @param child		子对象
         * @return			新增的子对象
         */
        Object3D.prototype.addChild = function (child) {
            this.addChildAt(child, this.children_.length);
        };
        /**
         * 添加子对象到指定位置
         * @param   child   子对象
         * @param   index   添加到的位置
         */
        Object3D.prototype.addChildAt = function (child, index) {
            feng3d.debuger && console.assert(index >= 0 && index <= this.children_.length);
            var childIndex = this.children_.indexOf(child);
            if (childIndex != -1) {
                this.children_.splice(childIndex, 1);
                this.children_.splice(index, 0, child);
            }
            else {
                this.children_.splice(index, 0, child);
                child.dispatchEvent(new feng3d.Object3DEvent(feng3d.Object3DEvent.ADDED, { parent: this, child: child }, true));
            }
        };
        /**
         * 设置子对象在指定位置
         * @param child 子对象
         * @param index 索引
         */
        Object3D.prototype.setChildAt = function (child, index) {
            if (-1 < index && index < this.children_.length) {
                this.removeChildAt(index);
            }
            this.addChildAt(child, index);
        };
        /**
         * 移除子对象
         * @param   child   子对象
         * @return			被移除子对象索引
         */
        Object3D.prototype.removeChild = function (child) {
            var childIndex = this.children_.indexOf(child);
            this.removeChildAt(childIndex);
            return childIndex;
        };
        /**
         * 获取子对象索引
         * @param   child   子对象
         * @return  子对象位置
         */
        Object3D.prototype.getChildIndex = function (child) {
            return this.children_.indexOf(child);
        };
        /**
         * 移出指定索引的子对象
         * @param index         子对象索引
         * @return				被移除对象
         */
        Object3D.prototype.removeChildAt = function (index) {
            feng3d.debuger && console.assert(-1 < index && index < this.children_.length);
            var child = this.children_[index];
            this.children_.splice(index, 1);
            child.dispatchEvent(new feng3d.Object3DEvent(feng3d.Object3DEvent.REMOVED, { parent: this, child: child }, true));
            return child;
        };
        /**
         * 获取子对象
         * @param index         子对象索引
         * @return              指定索引的子对象
         */
        Object3D.prototype.getChildAt = function (index) {
            feng3d.debuger && console.assert(-1 < index && index < this.children_.length);
            return this.children_[index];
        };
        Object.defineProperty(Object3D.prototype, "numChildren", {
            /**
             * 获取子对象数量
             */
            get: function () {
                return this.children_.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理添加子对象事件
         */
        Object3D.prototype.onAdded = function (event) {
            if (event.data.child == this) {
                this._setParent(event.data.parent);
            }
        };
        /**
         * 处理删除子对象事件
         */
        Object3D.prototype.onRemoved = function (event) {
            if (event.data.child == this) {
                this._setParent(null);
            }
        };
        /**
         * 处理新增组件事件
         */
        Object3D.prototype.onAddedComponent = function (event) {
            if (event.data.container == this) {
                if (event.data.child instanceof feng3d.Transform) {
                    this._transform = event.data.child;
                }
            }
        };
        /**
         * 处理移除组件事件
         */
        Object3D.prototype.onRemovedComponent = function (event) {
            if (event.data.container == this) {
                if (event.data.child instanceof feng3d.Transform) {
                    this._transform = null;
                }
            }
        };
        Object3D.getObject3D = function (id) {
            return object3DMap[id];
        };
        return Object3D;
    }(feng3d.RenderDataHolder));
    feng3d.Object3D = Object3D;
    var object3DAutoID = 1; //索引从1开始，因为索引拾取中默认值为0
    var object3DMap = {};
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D视图
     * @author feng 2016-05-01
     */
    var View3D = (function () {
        /**
         * 构建3D视图
         * @param canvas    画布
         * @param scene     3D场景
         * @param camera    摄像机
         */
        function View3D(canvas, scene, camera) {
            if (scene === void 0) { scene = null; }
            if (camera === void 0) { camera = null; }
            /**
             * 背景颜色
             */
            this.background = new feng3d.Color(0, 0, 0);
            feng3d.assert(canvas instanceof HTMLCanvasElement, "canvas\u53C2\u6570\u5FC5\u987B\u4E3A HTMLCanvasElement \u7C7B\u578B\uFF01");
            this._canvas = canvas;
            this._context3D = this._canvas.getContext(feng3d.contextId, { antialias: false });
            this._context3D.getContextAttributes();
            this.initGL();
            this.scene = scene || new feng3d.Scene3D();
            this.camera = camera || new feng3d.CameraObject3D();
            this.defaultRenderer = new feng3d.ForwardRenderer();
            this.mouse3DManager = new feng3d.Mouse3DManager();
            feng3d.ticker.addEventListener(feng3d.Event.ENTER_FRAME, this.drawScene, this);
        }
        /**
         * 初始化GL
         */
        View3D.prototype.initGL = function () {
            this._context3D.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
            this._context3D.clearDepth(1.0); // Clear everything
            this._context3D.enable(feng3d.Context3D.DEPTH_TEST); // Enable depth testing
            this._context3D.depthFunc(feng3d.Context3D.LEQUAL); // Near things obscure far things
        };
        Object.defineProperty(View3D.prototype, "scene", {
            /** 3d场景 */
            get: function () {
                return this._scene;
            },
            set: function (value) {
                this._scene = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 绘制场景
         */
        View3D.prototype.drawScene = function (event) {
            var viewRect = this.viewRect;
            this.camera.camera.aspectRatio = viewRect.width / viewRect.height;
            //鼠标拾取渲染
            this.mouse3DManager.viewRect.copyFrom(viewRect);
            this.mouse3DManager.draw(this._context3D, this._scene, this._camera.camera);
            // 默认渲染
            this._context3D.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
            this._context3D.clear(feng3d.Context3D.COLOR_BUFFER_BIT | feng3d.Context3D.DEPTH_BUFFER_BIT);
            this._context3D.viewport(0, 0, viewRect.width, viewRect.height);
            // Enable alpha blending
            this._context3D.enable(feng3d.Context3D.BLEND);
            // Set blending function
            this._context3D.blendFunc(feng3d.Context3D.SRC_ALPHA, feng3d.Context3D.ONE_MINUS_SRC_ALPHA);
            this.defaultRenderer.draw(this._context3D, this._scene, this._camera.camera);
            this._context3D.disable(feng3d.Context3D.BLEND);
        };
        Object.defineProperty(View3D.prototype, "viewRect", {
            /**
             * 更新视窗区域
             */
            get: function () {
                var viewRect = new feng3d.Rectangle();
                this._canvas.width = this._canvas.clientWidth;
                this._canvas.height = this._canvas.clientHeight;
                var viewWidth = this._canvas.width;
                var viewHeight = this._canvas.height;
                var x = 0;
                var y = 0;
                var obj = this._canvas;
                do {
                    x += obj.offsetLeft;
                    y += obj.offsetTop;
                    obj = obj.parentElement;
                } while (obj);
                viewRect.setTo(x, y, viewWidth, viewHeight);
                return viewRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "camera", {
            /**
             * 摄像机
             */
            get: function () {
                return this._camera;
            },
            set: function (value) {
                this._camera = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "mousePos", {
            /**
             * 鼠标在3D视图中的位置
             */
            get: function () {
                var viewRect = this.viewRect;
                var pos = new feng3d.Point(this.mouse3DManager.mouseX - viewRect.x, this.mouse3DManager.mouseY - viewRect.y);
                return pos;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取鼠标射线（与鼠标重叠的摄像机射线）
         */
        View3D.prototype.getMouseRay3D = function () {
            var pos = this.mousePos;
            return this.getRay3D(pos.x, pos.y);
        };
        /**
         * 获取与坐标重叠的射线
         * @param x view3D上的X坐标
         * @param y view3D上的X坐标
         * @return
         */
        View3D.prototype.getRay3D = function (x, y) {
            //摄像机坐标
            var rayPosition = this.unproject(x, y, 0, View3D.tempRayPosition);
            //摄像机前方1处坐标
            var rayDirection = this.unproject(x, y, 1, View3D.tempRayDirection);
            //射线方向
            rayDirection.x = rayDirection.x - rayPosition.x;
            rayDirection.y = rayDirection.y - rayPosition.y;
            rayDirection.z = rayDirection.z - rayPosition.z;
            rayDirection.normalize();
            //定义射线
            var ray3D = new feng3d.Ray3D(rayPosition, rayDirection);
            return ray3D;
        };
        /**
         * 屏幕坐标投影到场景坐标
         * @param nX 屏幕坐标X ([0-width])
         * @param nY 屏幕坐标Y ([0-height])
         * @param sZ 到屏幕的距离
         * @param v 场景坐标（输出）
         * @return 场景坐标
         */
        View3D.prototype.unproject = function (sX, sY, sZ, v) {
            if (v === void 0) { v = null; }
            var gpuPos = this.screenToGpuPosition(new feng3d.Point(sX, sY));
            return this._camera.camera.unproject(gpuPos.x, gpuPos.y, sZ, v);
        };
        /**
         * 屏幕坐标转GPU坐标
         * @param screenPos 屏幕坐标 (x:[0-width],y:[0-height])
         * @return GPU坐标 (x:[-1,1],y:[-1-1])
         */
        View3D.prototype.screenToGpuPosition = function (screenPos) {
            var gpuPos = new feng3d.Point();
            gpuPos.x = (screenPos.x * 2 - this._canvas.width) / this._canvas.width;
            gpuPos.y = (screenPos.y * 2 - this._canvas.height) / this._canvas.height;
            return gpuPos;
        };
        /**
         * 获取单位像素在指定深度映射的大小
         * @param   depth   深度
         */
        View3D.prototype.getScaleByDepth = function (depth) {
            var centerX = this.viewRect.width / 2;
            var centerY = this.viewRect.height / 2;
            var lt = this.unproject(centerX - 0.5, centerY - 0.5, depth);
            var rb = this.unproject(centerX + 0.5, centerY + 0.5, depth);
            var scale = lt.subtract(rb).length;
            return scale;
        };
        /**
         * 射线坐标临时变量
         */
        View3D.tempRayPosition = new feng3d.Vector3D();
        /**
         * 射线方向临时变量
         */
        View3D.tempRayDirection = new feng3d.Vector3D();
        return View3D;
    }());
    feng3d.View3D = View3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D对象组件
     * @author feng 2016-09-02
     */
    var Object3DComponent = (function (_super) {
        __extends(Object3DComponent, _super);
        /**
         * 构建3D对象组件
         */
        function Object3DComponent() {
            _super.call(this);
        }
        /**
         * 派发事件，该事件将会强制冒泡到3D对象中
         * @param event						调度到事件流中的 Event 对象。
         */
        Object3DComponent.prototype.dispatchEvent = function (event) {
            var result = _super.prototype.dispatchEvent.call(this, event);
            if (result) {
                this.parentComponent && this.parentComponent.dispatchEvent(event);
            }
            return result;
        };
        return Object3DComponent;
    }(feng3d.RenderDataHolder));
    feng3d.Object3DComponent = Object3DComponent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 变换
     * @author feng 2016-04-26
     */
    var Transform = (function (_super) {
        __extends(Transform, _super);
        /**
         * 构建变换
         * @param x X坐标
         * @param y Y坐标
         * @param z Z坐标
         * @param rx X旋转
         * @param ry Y旋转
         * @param rz Z旋转
         * @param sx X缩放
         * @param sy Y缩放
         * @param sz Z缩放
         */
        function Transform(x, y, z, rx, ry, rz, sx, sy, sz) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (rx === void 0) { rx = 0; }
            if (ry === void 0) { ry = 0; }
            if (rz === void 0) { rz = 0; }
            if (sx === void 0) { sx = 1; }
            if (sy === void 0) { sy = 1; }
            if (sz === void 0) { sz = 1; }
            _super.call(this);
            this._transformChanged = new TransformEvent(TransformEvent.TRANSFORM_CHANGED, this);
            this._sceneTransformChanged = new TransformEvent(TransformEvent.SCENETRANSFORM_CHANGED, this);
            /**
             * 位移
             */
            this.position = new feng3d.Vector3D();
            /**
             * 旋转
             */
            this.rotation = new feng3d.Vector3D();
            /**
             * 缩放
             */
            this.scale = new feng3d.Vector3D(1, 1, 1);
            //
            this._matrix3D = new feng3d.Matrix3D();
            this._inverseMatrix3D = new feng3d.Matrix3D();
            /**
             * 全局矩阵
             */
            this._globalMatrix3D = new feng3d.Matrix3D();
            this._inverseGlobalMatrix3D = new feng3d.Matrix3D();
            //
            this._matrix3DDirty = true;
            this._inverseMatrix3DDirty = true;
            /**
             * 全局矩阵是否变脏
             */
            this._globalMatrix3DDirty = true;
            this._inverseGlobalMatrix3DDirty = true;
            //
            this._positionWatchers = [];
            this._rotationWatchers = [];
            this._scaleWatchers = [];
            this._single = true;
            //矫正值
            this.position.setTo(x, y, z);
            this.rotation.setTo(rx, ry, rz);
            this.scale.setTo(sx, sy, sz);
            //
            this._positionWatchers.push(feng3d.Watcher.watch(this.position, ["y"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.position, ["z"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.position, ["x"], this.invalidateMatrix3D, this));
            this._rotationWatchers.push(feng3d.Watcher.watch(this.rotation, ["x"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.rotation, ["y"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.rotation, ["z"], this.invalidateMatrix3D, this));
            this._scaleWatchers.push(feng3d.Watcher.watch(this.scale, ["x"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.scale, ["y"], this.invalidateMatrix3D, this), feng3d.Watcher.watch(this.scale, ["z"], this.invalidateMatrix3D, this));
            feng3d.Watcher.watch(this, ["position"], this.invalidateComp, this);
            feng3d.Watcher.watch(this, ["rotation"], this.invalidateComp, this);
            feng3d.Watcher.watch(this, ["scale"], this.invalidateComp, this);
            //
            feng3d.Binding.bindProperty(this, ["_parentComponent", "_parent", "_transform"], this, "parentTransform");
        }
        Object.defineProperty(Transform.prototype, "parentTransform", {
            /**
             * 只写，提供给Binding.bindProperty使用
             */
            set: function (value) {
                if (this._parentTransform == value)
                    return;
                if (this._parentTransform) {
                    this._parentTransform.removeEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.invalidateGlobalMatrix3D, this);
                }
                this._parentTransform = value;
                if (this._parentTransform) {
                    this._parentTransform.addEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.invalidateGlobalMatrix3D, this);
                }
                this.invalidateGlobalMatrix3D();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 位移旋转缩放组件失效
         */
        Transform.prototype.invalidateComp = function () {
            var _this = this;
            //延迟事件
            this.lockEvent();
            //
            this.position || (this.position = new feng3d.Vector3D());
            this.rotation || (this.rotation = new feng3d.Vector3D());
            this.scale || (this.scale = new feng3d.Vector3D(1, 1, 1));
            //
            this._positionWatchers.forEach(function (element) {
                element.reset(_this.position);
            });
            this._rotationWatchers.forEach(function (element) {
                element.reset(_this.rotation);
            });
            this._scaleWatchers.forEach(function (element) {
                element.reset(_this.scale);
            });
            //
            this.invalidateMatrix3D();
            this.unlockEvent();
        };
        Object.defineProperty(Transform.prototype, "globalPosition", {
            /**
             * 全局坐标
             */
            get: function () {
                return this.globalMatrix3D.position;
            },
            set: function (value) {
                var globalMatrix3D = this.globalMatrix3D.clone();
                globalMatrix3D.position = value;
                this.globalMatrix3D = globalMatrix3D;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "matrix3d", {
            /**
             * 变换矩阵
             */
            get: function () {
                if (this._matrix3DDirty)
                    this.updateMatrix3D();
                return this._matrix3D;
            },
            set: function (value) {
                //延迟事件
                this.lockEvent();
                this._matrix3DDirty = false;
                this._matrix3D.rawData.set(value.rawData);
                var vecs = this._matrix3D.decompose();
                this.position.copyFrom(vecs[0]);
                this.rotation.copyFrom(vecs[1]);
                this.rotation.scaleBy(feng3d.MathConsts.RADIANS_TO_DEGREES);
                this.scale.copyFrom(vecs[2]);
                feng3d.debuger && this._debug();
                this.notifyMatrix3DChanged();
                this.invalidateGlobalMatrix3D();
                //释放事件
                this.unlockEvent();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "inverseMatrix3D", {
            /**
             * 逆变换矩阵
             */
            get: function () {
                if (this._inverseMatrix3DDirty) {
                    this._inverseMatrix3D.copyFrom(this.matrix3d);
                    this._inverseMatrix3D.invert();
                    this._inverseMatrix3DDirty = false;
                }
                return this._inverseMatrix3D;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 看向目标位置
         * @param target    目标位置
         * @param upAxis    向上朝向
         */
        Transform.prototype.lookAt = function (target, upAxis) {
            if (upAxis === void 0) { upAxis = null; }
            this.matrix3d.lookAt(target, upAxis);
            this.matrix3d = this.matrix3d;
        };
        Object.defineProperty(Transform.prototype, "globalMatrix3D", {
            /**
             * 全局矩阵
             */
            get: function () {
                this._globalMatrix3DDirty && this.updateGlobalMatrix3D();
                return this._globalMatrix3D;
            },
            set: function (value) {
                value = value.clone();
                this._parentTransform && value.append(this._parentTransform.inverseGlobalMatrix3D);
                this.matrix3d = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "inverseGlobalMatrix3D", {
            /**
             * 逆全局矩阵
             */
            get: function () {
                this._inverseGlobalMatrix3DDirty && this.updateInverseGlobalMatrix3D();
                return this._inverseGlobalMatrix3D;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 变换矩阵
         */
        Transform.prototype.updateMatrix3D = function () {
            //矫正值
            feng3d.debuger && this._debug();
            //
            var rotation = this.rotation.clone();
            rotation.scaleBy(feng3d.MathConsts.DEGREES_TO_RADIANS);
            this._matrix3D.recompose([
                this.position,
                rotation,
                this.scale
            ]);
            this._matrix3DDirty = false;
        };
        /**
         * 使变换矩阵无效
         */
        Transform.prototype.invalidateMatrix3D = function () {
            this._matrix3DDirty = true;
            this._inverseMatrix3DDirty = true;
            this.notifyMatrix3DChanged();
            //
            this.invalidateGlobalMatrix3D();
        };
        /**
         * 验证数值是否正确
         */
        Transform.prototype._debug = function () {
            feng3d.assert(this.position.length !== NaN);
            feng3d.assert(this.position.length !== NaN);
            feng3d.assert(!!this.scale.length);
        };
        /**
         * 发出状态改变消息
         */
        Transform.prototype.notifyMatrix3DChanged = function () {
            this.dispatchEvent(this._transformChanged);
        };
        /**
         * 更新全局矩阵
         */
        Transform.prototype.updateGlobalMatrix3D = function () {
            this._globalMatrix3DDirty = false;
            this._globalMatrix3D.copyFrom(this.matrix3d);
            this._parentTransform && this._globalMatrix3D.append(this._parentTransform.globalMatrix3D);
        };
        /**
         * 更新逆全局矩阵
         */
        Transform.prototype.updateInverseGlobalMatrix3D = function () {
            this._inverseGlobalMatrix3DDirty = false;
            this._inverseGlobalMatrix3D.copyFrom(this.globalMatrix3D);
            this._inverseGlobalMatrix3D.invert();
        };
        /**
         * 通知全局变换改变
         */
        Transform.prototype.notifySceneTransformChange = function () {
            this.dispatchEvent(this._sceneTransformChanged);
        };
        /**
         * 全局变换矩阵失效
         * @private
         */
        Transform.prototype.invalidateGlobalMatrix3D = function () {
            this._globalMatrix3DDirty = true;
            this._inverseGlobalMatrix3DDirty = true;
            this.notifySceneTransformChange();
        };
        /**
         * 更新渲染数据
         */
        Transform.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.u_modelMatrix] = this.globalMatrix3D;
        };
        return Transform;
    }(feng3d.Object3DComponent));
    feng3d.Transform = Transform;
    /**
     * 变换事件(3D状态发生改变、位置、旋转、缩放)
     * @author feng 2014-3-31
     */
    var TransformEvent = (function (_super) {
        __extends(TransformEvent, _super);
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param data 携带数据
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         */
        function TransformEvent(type, data, bubbles) {
            if (bubbles === void 0) { bubbles = false; }
            _super.call(this, type, data, bubbles);
        }
        /**
         * 变换
         */
        TransformEvent.TRANSFORM_CHANGED = "transformChanged";
        /**
         * 场景变换矩阵发生变化
         */
        TransformEvent.SCENETRANSFORM_CHANGED = "scenetransformChanged";
        return TransformEvent;
    }(feng3d.Event));
    feng3d.TransformEvent = TransformEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D对象事件
     */
    var Object3DEvent = (function (_super) {
        __extends(Object3DEvent, _super);
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param data 携带数据
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         */
        function Object3DEvent(type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            _super.call(this, type, data, bubbles);
        }
        /**
         * 添加了子对象，当child被添加到parent中时派发冒泡事件
         */
        Object3DEvent.ADDED = "added";
        /**
         * 删除了子对象，当child被parent移除时派发冒泡事件
         */
        Object3DEvent.REMOVED = "removed";
        return Object3DEvent;
    }(feng3d.Event));
    feng3d.Object3DEvent = Object3DEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 网格
     * @author feng 2016-12-12
     */
    var MeshFilter = (function (_super) {
        __extends(MeshFilter, _super);
        function MeshFilter() {
            _super.call(this);
            this._single = true;
        }
        Object.defineProperty(MeshFilter.prototype, "geometry", {
            /**
             * 几何体
             */
            get: function () {
                return this._geometry;
            },
            set: function (value) {
                this._geometry && this.removeComponent(this._geometry);
                this._geometry = value;
                this._geometry && this.addComponent(this._geometry);
            },
            enumerable: true,
            configurable: true
        });
        return MeshFilter;
    }(feng3d.Object3DComponent));
    feng3d.MeshFilter = MeshFilter;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 网格渲染器
     * @author feng 2016-12-12
     */
    var MeshRenderer = (function (_super) {
        __extends(MeshRenderer, _super);
        function MeshRenderer() {
            _super.call(this);
            this._single = true;
            this.material = new feng3d.ColorMaterial();
        }
        Object.defineProperty(MeshRenderer.prototype, "material", {
            /**
             * 材质
             */
            get: function () {
                return this._material;
            },
            set: function (value) {
                this._material && this.removeComponent(this._material);
                this._material = value;
                this._material && this.addComponent(this._material);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理被添加组件事件
         */
        MeshRenderer.prototype.onBeAddedComponent = function (event) {
            this.parentComponent.addEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            this.parentComponent.addEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
            if (this.parentComponent.scene) {
                this.parentComponent.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_RENDERER_TO_SCENE, { renderer: this }));
            }
        };
        /**
         * 处理被移除组件事件
         */
        MeshRenderer.prototype.onBeRemovedComponent = function (event) {
            this.parentComponent.removeEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            this.parentComponent.removeEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
            if (this.parentComponent.scene) {
                this.parentComponent.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_RENDERER_FROM_SCENE, { renderer: this }));
            }
        };
        /**
         * 处理添加到场景事件
         */
        MeshRenderer.prototype.onAddedToScene = function (event) {
            event.data.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_RENDERER_TO_SCENE, { renderer: this }));
        };
        /**
         * 处理从场景移除事件
         */
        MeshRenderer.prototype.onRemovedFromScene = function (event) {
            event.data.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_RENDERER_FROM_SCENE, { renderer: this }));
        };
        return MeshRenderer;
    }(feng3d.Object3DComponent));
    feng3d.MeshRenderer = MeshRenderer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3d对象脚本
     * @author feng 2017-03-11
     */
    var Object3dScript = (function (_super) {
        __extends(Object3dScript, _super);
        function Object3dScript() {
            _super.apply(this, arguments);
            /**
             * 脚本路径
             */
            this.script = "";
        }
        return Object3dScript;
    }(feng3d.Object3DComponent));
    feng3d.Object3dScript = Object3dScript;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D场景
     * @author feng 2016-05-01
     */
    var Scene3D = (function (_super) {
        __extends(Scene3D, _super);
        /**
         * 构造3D场景
         */
        function Scene3D() {
            _super.call(this, "root");
            this._object3Ds = [];
            this._renderers = [];
            this._lights = [];
            // Object.seal(this);
            //
            this.addEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            this.addEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
            this.addEventListener(feng3d.Scene3DEvent.ADDED_RENDERER_TO_SCENE, this.onAddedRendererToScene, this);
            this.addEventListener(feng3d.Scene3DEvent.REMOVED_RENDERER_FROM_SCENE, this.onRemovedRendererFromScene, this);
            this.addEventListener(feng3d.Scene3DEvent.ADDED_LIGHT_TO_SCENE, this.onAddedLightToScene, this);
            this.addEventListener(feng3d.Scene3DEvent.REMOVED_LIGHT_FROM_SCENE, this.onRemovedLightFromScene, this);
        }
        Object.defineProperty(Scene3D.prototype, "renderers", {
            /**
             * 渲染列表
             */
            get: function () {
                return this._renderers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene3D.prototype, "lights", {
            /**
             * 灯光列表
             */
            get: function () {
                return this._lights;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理添加对象事件
         */
        Scene3D.prototype.onAddedToScene = function (event) {
            this._object3Ds.push(event.data.object3d);
        };
        /**
         * 处理移除对象事件
         */
        Scene3D.prototype.onRemovedFromScene = function (event) {
            feng3d.ArrayUtils.removeItem(this._object3Ds, event.data.object3d);
        };
        /**
         * 处理添加对象事件
         */
        Scene3D.prototype.onAddedRendererToScene = function (event) {
            this._renderers.push(event.data.renderer);
        };
        /**
         * 处理移除对象事件
         */
        Scene3D.prototype.onRemovedRendererFromScene = function (event) {
            feng3d.ArrayUtils.removeItem(this._renderers, event.data.renderer);
        };
        /**
         * 处理添加灯光事件
         */
        Scene3D.prototype.onAddedLightToScene = function (event) {
            this._lights.push(event.data.light);
        };
        /**
         * 处理移除灯光事件
         */
        Scene3D.prototype.onRemovedLightFromScene = function (event) {
            feng3d.ArrayUtils.removeItem(this._lights, event.data.light);
        };
        return Scene3D;
    }(feng3d.Object3D));
    feng3d.Scene3D = Scene3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D场景事件
     * @author feng 2016-01-03
     */
    var Scene3DEvent = (function (_super) {
        __extends(Scene3DEvent, _super);
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param data 携带数据
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         */
        function Scene3DEvent(type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            _super.call(this, type, data, bubbles);
        }
        /**
         * 当Object3D的scene属性被设置是由Object3D与Scene3D分别派发不冒泡事件
         */
        Scene3DEvent.ADDED_TO_SCENE = "addedToScene";
        /**
         * 当Object3D的scene属性被清空时由Object3D与Scene3D分别派发不冒泡事件
         */
        Scene3DEvent.REMOVED_FROM_SCENE = "removedFromScene";
        /**
         * 当拥有Light的Object3D添加到Scene3D或者Light添加到场景中的Object3D时派发不冒泡事件
         */
        Scene3DEvent.ADDED_LIGHT_TO_SCENE = "addedLightToScene";
        /**
         * 当拥有Light的Object3D从Scene3D中移除或者Light从场景中的Object3D移除时派发不冒泡事件
         */
        Scene3DEvent.REMOVED_LIGHT_FROM_SCENE = "removedLightFromScene";
        /**
         * 当拥有Renderer的Object3D添加到Scene3D或者Renderer添加到场景中的Object3D时派发不冒泡事件
         */
        Scene3DEvent.ADDED_RENDERER_TO_SCENE = "addedRendererToScene";
        /**
         * 当拥有Renderer的Object3D从Scene3D中移除或者Renderer从场景中的Object3D移除时派发不冒泡事件
         */
        Scene3DEvent.REMOVED_RENDERER_FROM_SCENE = "removedRendererFromScene";
        return Scene3DEvent;
    }(feng3d.Event));
    feng3d.Scene3DEvent = Scene3DEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * opengl顶点属性名称
     */
    var GLAttribute = (function () {
        function GLAttribute() {
        }
        /**
         * 坐标
         */
        GLAttribute.a_position = "a_position";
        /**
         * 颜色
         */
        GLAttribute.a_color = "a_color";
        /**
         * 法线
         */
        GLAttribute.a_normal = "a_normal";
        /**
         * 切线
         */
        GLAttribute.a_tangent = "a_tangent";
        /**
         * uv（纹理坐标）
         */
        GLAttribute.a_uv = "a_uv";
        /**
         * 关节索引
         */
        GLAttribute.a_jointindex0 = "a_jointindex0";
        /**
         * 关节权重
         */
        GLAttribute.a_jointweight0 = "a_jointweight0";
        /**
         * 关节索引
         */
        GLAttribute.a_jointindex1 = "a_jointindex1";
        /**
         * 关节权重
         */
        GLAttribute.a_jointweight1 = "a_jointweight1";
        return GLAttribute;
    }());
    feng3d.GLAttribute = GLAttribute;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 几何体
     * @author feng 2016-04-28
     */
    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        /**
         * 创建一个几何体
         */
        function Geometry() {
            _super.call(this);
            this._isDirty = true;
            this._single = true;
        }
        /**
         * 更新渲染数据
         */
        Geometry.prototype.updateRenderData = function (renderContext) {
            if (this._isDirty) {
                this.buildGeometry();
                this._isDirty = false;
            }
            _super.prototype.updateRenderData.call(this, renderContext);
        };
        /**
         * 几何体变脏
         */
        Geometry.prototype.invalidate = function () {
            this._isDirty = true;
        };
        /**
         * 构建几何体
         */
        Geometry.prototype.buildGeometry = function () {
        };
        /**
         * 更新顶点索引数据
         */
        Geometry.prototype.setIndices = function (indices) {
            this._renderData.indexBuffer = new feng3d.IndexRenderData();
            this._renderData.indexBuffer.indices = indices;
            this._renderData.indexBuffer.count = indices.length;
            this.dispatchEvent(new feng3d.GeometryEvent(feng3d.GeometryEvent.CHANGED_INDEX_DATA));
        };
        /**
         * 设置顶点属性数据
         * @param vaId          顶点属性编号
         * @param data          顶点属性数据
         * @param stride        顶点数据步长
         */
        Geometry.prototype.setVAData = function (vaId, data, stride) {
            this._renderData.attributes[vaId] = new feng3d.AttributeRenderData(data, stride);
            this.dispatchEvent(new feng3d.GeometryEvent(feng3d.GeometryEvent.CHANGED_VA_DATA, vaId));
        };
        /**
         * 获取顶点属性数据
         * @param vaId 数据类型编号
         * @return 顶点属性数据
         */
        Geometry.prototype.getVAData = function (vaId) {
            this.dispatchEvent(new feng3d.GeometryEvent(feng3d.GeometryEvent.GET_VA_DATA, vaId));
            return this._renderData.attributes[vaId];
        };
        Object.defineProperty(Geometry.prototype, "numVertex", {
            /**
             * 顶点数量
             */
            get: function () {
                var numVertex = 0;
                for (var attributeName in this._renderData.attributes) {
                    var attributeRenderData = this._renderData.attributes[attributeName];
                    numVertex = attributeRenderData.data.length / attributeRenderData.stride;
                    break;
                }
                return numVertex;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 附加几何体
         */
        Geometry.prototype.addGeometry = function (geometry) {
            var attributes = this._renderData.attributes;
            var addAttributes = geometry._renderData.attributes;
            //当前顶点数量
            var oldNumVertex = this.numVertex;
            //合并索引
            var indices = this._renderData.indexBuffer.indices;
            var targetIndices = geometry._renderData.indexBuffer.indices;
            var totalIndices = new Uint16Array(indices.length + targetIndices.length);
            totalIndices.set(indices, 0);
            for (var i = 0; i < targetIndices.length; i++) {
                totalIndices[indices.length + i] = targetIndices[i] + oldNumVertex;
            }
            this.setIndices(totalIndices);
            //合并后顶点数量
            var totalVertex = oldNumVertex + geometry.numVertex;
            //合并属性数据
            for (var attributeName in attributes) {
                var stride = attributes[attributeName].stride;
                var data = new Float32Array(totalVertex * stride);
                data.set(attributes[attributeName].data, 0);
                data.set(addAttributes[attributeName].data, oldNumVertex * stride);
                this.setVAData(attributeName, data, stride);
            }
        };
        /**
         * 克隆一个几何体
         */
        Geometry.prototype.clone = function () {
            var geometry = new Geometry();
            geometry._renderData.indexBuffer = this._renderData.indexBuffer;
            geometry._renderData.attributes = this._renderData.attributes;
            return geometry;
        };
        /**
         * 从一个几何体中克隆数据
         */
        Geometry.prototype.cloneFrom = function (geometry) {
            this._renderData.indexBuffer = geometry._renderData.indexBuffer;
            this._renderData.attributes = geometry._renderData.attributes;
        };
        return Geometry;
    }(feng3d.RenderDataHolder));
    feng3d.Geometry = Geometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 几何体事件
     * @author feng 2015-12-8
     */
    var GeometryEvent = (function (_super) {
        __extends(GeometryEvent, _super);
        /**
         * 构建几何体事件
         */
        function GeometryEvent(type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            _super.call(this, type, data, bubbles);
        }
        /**
         * 获取几何体顶点数据
         */
        GeometryEvent.GET_VA_DATA = "getVAData";
        /**
         * 改变几何体顶点数据事件
         */
        GeometryEvent.CHANGED_VA_DATA = "changedVAData";
        /**
         * 改变顶点索引数据事件
         */
        GeometryEvent.CHANGED_INDEX_DATA = "changedIndexData";
        return GeometryEvent;
    }(feng3d.Event));
    feng3d.GeometryEvent = GeometryEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 点几何体
     * @author feng 2017-01-11
     */
    var PointGeometry = (function (_super) {
        __extends(PointGeometry, _super);
        function PointGeometry() {
            _super.call(this);
            /**
             * 几何体是否变脏
             */
            this.geometryDirty = false;
            this._points = [];
            this.addPoint(new PointInfo(new feng3d.Vector3D(0, 0, 0)));
        }
        /**
         * 添加点
         * @param point		点数据
         */
        PointGeometry.prototype.addPoint = function (point, needUpdateGeometry) {
            if (needUpdateGeometry === void 0) { needUpdateGeometry = true; }
            this._points.push(point);
            this.geometryDirty = true;
            this.updateGeometry();
        };
        /**
         * 更新几何体
         */
        PointGeometry.prototype.updateGeometry = function () {
            this.geometryDirty = false;
            var positionStep = 3;
            var numPoints = this._points.length;
            var indices = new Uint16Array(numPoints);
            var positionData = new Float32Array(numPoints * positionStep);
            for (var i = 0; i < numPoints; i++) {
                var element = this._points[i];
                indices[i] = i;
                positionData.set(element.positionData, i * positionStep);
            }
            this.setVAData(feng3d.GLAttribute.a_position, positionData, positionStep);
            this.setIndices(indices);
        };
        /**
         * 获取线段数据
         * @param index 		线段索引
         * @return				线段数据
         */
        PointGeometry.prototype.getPoint = function (index) {
            if (index < this._points.length)
                return this._points[index];
            return null;
        };
        /**
         * 移除所有线段
         */
        PointGeometry.prototype.removeAllPoints = function () {
            this.points.length = 0;
            this.geometryDirty = true;
        };
        Object.defineProperty(PointGeometry.prototype, "points", {
            /**
             * 线段列表
             */
            get: function () {
                return this._points;
            },
            enumerable: true,
            configurable: true
        });
        return PointGeometry;
    }(feng3d.Geometry));
    feng3d.PointGeometry = PointGeometry;
    /**
     * 点信息
     * @author feng 2016-10-16
     */
    var PointInfo = (function () {
        /**
         * 创建点
         * @param position 坐标
         */
        function PointInfo(position) {
            this.position = position;
        }
        Object.defineProperty(PointInfo.prototype, "positionData", {
            /**
             * 坐标
             */
            get: function () {
                return [this.position.x, this.position.y, this.position.z];
            },
            enumerable: true,
            configurable: true
        });
        return PointInfo;
    }());
    feng3d.PointInfo = PointInfo;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子几何体
     * @author feng 2016-04-28
     */
    var ParticleGeometry = (function (_super) {
        __extends(ParticleGeometry, _super);
        function ParticleGeometry() {
            _super.call(this);
            /**
             * 粒子数量
             */
            this._numParticle = 1;
            this.isDirty = true;
            this.elementGeometry = new feng3d.PlaneGeometry(10, 10, 1, 1, false);
        }
        Object.defineProperty(ParticleGeometry.prototype, "numParticle", {
            /**
             * 粒子数量
             */
            get: function () {
                return this._numParticle;
            },
            set: function (value) {
                if (this._numParticle != value) {
                    this._numParticle = value;
                    this.isDirty = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新渲染数据
         */
        ParticleGeometry.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            if (this.isDirty) {
                this.cloneFrom(new feng3d.PlaneGeometry(10, 10, 1, 1, false));
                for (var i = 1; i < this.numParticle; i++) {
                    this.addGeometry(this.elementGeometry);
                }
                this.isDirty = false;
            }
        };
        return ParticleGeometry;
    }(feng3d.Geometry));
    feng3d.ParticleGeometry = ParticleGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 线段组件
     * @author feng 2016-10-16
     */
    var SegmentGeometry = (function (_super) {
        __extends(SegmentGeometry, _super);
        function SegmentGeometry() {
            _super.call(this);
            this.segments_ = [];
            this._type = feng3d.Geometry;
        }
        /**
         * 添加线段
         * @param segment		            线段数据
         */
        SegmentGeometry.prototype.addSegment = function (segment) {
            this.segments_.push(segment);
            this.invalidate();
        };
        /**
         * 设置线段
         * @param segment		            线段数据
         * @param index		                线段索引
         */
        SegmentGeometry.prototype.setSegmentAt = function (segment, index) {
            this.segments_[index] = segment;
            this.invalidate();
        };
        /**
         * 更新几何体
         */
        SegmentGeometry.prototype.buildGeometry = function () {
            var segmentPositionStep = 6;
            var segmentColorStep = 8;
            var numSegments = this.segments_.length;
            var indices = new Uint16Array(numSegments * 2);
            var positionData = new Float32Array(numSegments * segmentPositionStep);
            var colorData = new Float32Array(numSegments * segmentColorStep);
            for (var i = 0; i < numSegments; i++) {
                var element = this.segments_[i];
                indices.set([i * 2, i * 2 + 1], i * 2);
                positionData.set(element.positionData, i * segmentPositionStep);
                colorData.set(element.colorData, i * segmentColorStep);
            }
            this.setVAData(feng3d.GLAttribute.a_position, positionData, 3);
            this.setVAData(feng3d.GLAttribute.a_color, colorData, 4);
            this.setIndices(indices);
        };
        /**
         * 获取线段数据
         * @param index 		线段索引
         * @return				线段数据
         */
        SegmentGeometry.prototype.getSegment = function (index) {
            if (index < this.segments_.length)
                return this.segments_[index];
            return null;
        };
        /**
         * 移除所有线段
         */
        SegmentGeometry.prototype.removeAllSegments = function () {
            this.segments.length = 0;
            this.invalidate();
        };
        Object.defineProperty(SegmentGeometry.prototype, "segments", {
            /**
             * 线段列表
             */
            get: function () {
                return this.segments_;
            },
            enumerable: true,
            configurable: true
        });
        return SegmentGeometry;
    }(feng3d.Geometry));
    feng3d.SegmentGeometry = SegmentGeometry;
    /**
     * 线段
     * @author feng 2016-10-16
     */
    var Segment = (function () {
        /**
         * 创建线段
         * @param start 起点坐标
         * @param end 终点坐标
         * @param colorStart 起点颜色
         * @param colorEnd 终点颜色
         * @param thickness 线段厚度
         */
        function Segment(start, end, colorStart, colorEnd, thickness) {
            if (colorStart === void 0) { colorStart = 0x333333; }
            if (colorEnd === void 0) { colorEnd = 0x333333; }
            if (thickness === void 0) { thickness = 1; }
            this.thickness = thickness * .5;
            this.start = start;
            this.end = end;
            this.startColor = new feng3d.Color();
            this.startColor.fromUnit(colorStart, colorStart > 1 << 24);
            this.endColor = new feng3d.Color();
            this.endColor.fromUnit(colorEnd, colorEnd > 1 << 24);
        }
        Object.defineProperty(Segment.prototype, "positionData", {
            /**
             * 坐标数据
             */
            get: function () {
                return [this.start.x, this.start.y, this.start.z, this.end.x, this.end.y, this.end.z];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "colorData", {
            /**
             * 颜色数据
             */
            get: function () {
                return this.startColor.asArray().concat(this.endColor.asArray());
            },
            enumerable: true,
            configurable: true
        });
        return Segment;
    }());
    feng3d.Segment = Segment;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 几何体组件
     * @author feng 2016-10-16
     */
    var GeometryComponent = (function (_super) {
        __extends(GeometryComponent, _super);
        /**
         * 构建几何体组件
         */
        function GeometryComponent() {
            _super.call(this);
        }
        Object.defineProperty(GeometryComponent.prototype, "geometry", {
            /**
             * 所属对象
             */
            get: function () { return this._parentComponent; },
            enumerable: true,
            configurable: true
        });
        return GeometryComponent;
    }(feng3d.Component));
    feng3d.GeometryComponent = GeometryComponent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 坐标系统类型
     * @author feng 2014-10-14
     */
    var CoordinateSystem = (function () {
        function CoordinateSystem() {
        }
        /**
         * 默认坐标系统，左手坐标系统
         */
        CoordinateSystem.LEFT_HANDED = 0;
        /**
         * 右手坐标系统
         */
        CoordinateSystem.RIGHT_HANDED = 1;
        return CoordinateSystem;
    }());
    feng3d.CoordinateSystem = CoordinateSystem;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 摄像机
     * @author feng 2016-08-16
     */
    var Camera = (function (_super) {
        __extends(Camera, _super);
        /**
         * 创建一个摄像机
         * @param lens 摄像机镜头
         */
        function Camera() {
            _super.call(this);
            this._scissorRect = new feng3d.Rectangle();
            this._viewPort = new feng3d.Rectangle();
            this._near = 0.1;
            this._far = 10000;
            this._aspectRatio = 1;
            this._matrixInvalid = true;
            this._unprojectionInvalid = true;
            this._viewProjection = new feng3d.Matrix3D();
            this._viewProjectionDirty = true;
            this._single = true;
            this._matrix = new feng3d.Matrix3D();
        }
        Object.defineProperty(Camera.prototype, "matrix", {
            /**
             * 投影矩阵
             */
            get: function () {
                if (this._matrixInvalid) {
                    this.updateMatrix();
                    this._matrixInvalid = false;
                }
                return this._matrix;
            },
            set: function (value) {
                this._matrix = value;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "near", {
            /**
             * 最近距离
             */
            get: function () {
                return this._near;
            },
            set: function (value) {
                if (value == this._near)
                    return;
                this._near = value;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "far", {
            /**
             * 最远距离
             */
            get: function () {
                return this._far;
            },
            set: function (value) {
                if (value == this._far)
                    return;
                this._far = value;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "aspectRatio", {
            /**
             * 视窗缩放比例(width/height)，在渲染器中设置
             */
            get: function () {
                return this._aspectRatio;
            },
            set: function (value) {
                if (this._aspectRatio == value || (value * 0) != 0)
                    return;
                this._aspectRatio = value;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 场景坐标投影到屏幕坐标
         * @param point3d 场景坐标
         * @param v 屏幕坐标（输出）
         * @return 屏幕坐标
         */
        Camera.prototype.project = function (point3d, v) {
            if (v === void 0) { v = null; }
            if (!v)
                v = new feng3d.Vector3D();
            this.matrix.transformVector(point3d, v);
            v.x = v.x / v.w;
            v.y = -v.y / v.w;
            v.z = point3d.z;
            return v;
        };
        Object.defineProperty(Camera.prototype, "unprojectionMatrix", {
            /**
             * 投影逆矩阵
             */
            get: function () {
                if (this._unprojectionInvalid) {
                    if (this._unprojection == null)
                        this._unprojection = new feng3d.Matrix3D();
                    this._unprojection.copyFrom(this.matrix);
                    this._unprojection.invert();
                    this._unprojectionInvalid = false;
                }
                return this._unprojection;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 投影矩阵失效
         */
        Camera.prototype.invalidateMatrix = function () {
            this._matrixInvalid = true;
            this._unprojectionInvalid = true;
        };
        Object.defineProperty(Camera.prototype, "viewProjection", {
            /**
             * 场景投影矩阵，世界空间转投影空间
             */
            get: function () {
                if (this._viewProjectionDirty) {
                    //场景空间转摄像机空间
                    this._viewProjection.copyFrom(this.inverseSceneTransform);
                    //+摄像机空间转投影空间 = 场景空间转投影空间
                    this._viewProjection.append(this.matrix);
                    this._viewProjectionDirty = false;
                }
                return this._viewProjection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "inverseSceneTransform", {
            get: function () {
                return this.parentComponent ? this.parentComponent.transform.inverseGlobalMatrix3D : new feng3d.Matrix3D();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "globalMatrix3D", {
            get: function () {
                return this.parentComponent ? this.parentComponent.transform.globalMatrix3D : new feng3d.Matrix3D();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 屏幕坐标投影到场景坐标
         * @param nX 屏幕坐标X -1（左） -> 1（右）
         * @param nY 屏幕坐标Y -1（上） -> 1（下）
         * @param sZ 到屏幕的距离
         * @param v 场景坐标（输出）
         * @return 场景坐标
         */
        Camera.prototype.unproject = function (nX, nY, sZ, v) {
            if (v === void 0) { v = null; }
            return this.globalMatrix3D.transformVector(this.unproject(nX, nY, sZ, v), v);
        };
        /**
         * 处理被添加组件事件
         */
        Camera.prototype.onBeAddedComponent = function (event) {
            this.parentComponent.addEventListener(feng3d.TransformEvent.SCENETRANSFORM_CHANGED, this.onSpaceTransformChanged, this);
        };
        /**
         * 处理被移除组件事件
         */
        Camera.prototype.onBeRemovedComponent = function (event) {
            this.parentComponent.removeEventListener(feng3d.TransformEvent.SCENETRANSFORM_CHANGED, this.onSpaceTransformChanged, this);
        };
        Camera.prototype.onSpaceTransformChanged = function (event) {
            this._viewProjectionDirty = true;
        };
        /**
         * 更新渲染数据
         */
        Camera.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            //
            this._renderData.uniforms[feng3d.RenderDataID.u_viewProjection] = this.viewProjection;
            var globalMatrix3d = this.parentComponent ? this.parentComponent.transform.globalMatrix3D : new feng3d.Matrix3D();
            this._renderData.uniforms[feng3d.RenderDataID.u_cameraMatrix] = globalMatrix3d;
        };
        return Camera;
    }(feng3d.Object3DComponent));
    feng3d.Camera = Camera;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 透视摄像机
     * @author feng 2014-10-14
     */
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        /**
         * 创建一个透视摄像机
         * @param fieldOfView 视野
         * @param coordinateSystem 坐标系统类型
         */
        function PerspectiveCamera(fieldOfView, coordinateSystem) {
            if (fieldOfView === void 0) { fieldOfView = 60; }
            if (coordinateSystem === void 0) { coordinateSystem = feng3d.CoordinateSystem.LEFT_HANDED; }
            _super.call(this);
            this.fieldOfView = fieldOfView;
            this.coordinateSystem = coordinateSystem;
        }
        Object.defineProperty(PerspectiveCamera.prototype, "fieldOfView", {
            /**
             * 视野
             */
            get: function () {
                return this._fieldOfView;
            },
            set: function (value) {
                if (value == this._fieldOfView)
                    return;
                this._fieldOfView = value;
                this._focalLengthInv = Math.tan(this._fieldOfView * Math.PI / 360);
                this._focalLength = 1 / this._focalLengthInv;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "focalLength", {
            /**
             * 焦距
             */
            get: function () {
                return this._focalLength;
            },
            set: function (value) {
                if (value == this._focalLength)
                    return;
                this._focalLength = value;
                this._focalLengthInv = 1 / this._focalLength;
                this._fieldOfView = Math.atan(this._focalLengthInv) * 360 / Math.PI;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.unproject = function (nX, nY, sZ, v) {
            if (v === void 0) { v = null; }
            if (!v)
                v = new feng3d.Vector3D();
            v.x = nX;
            v.y = -nY;
            v.z = sZ;
            v.w = 1;
            v.x *= sZ;
            v.y *= sZ;
            this.unprojectionMatrix.transformVector(v, v);
            v.z = sZ;
            return v;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "coordinateSystem", {
            /**
             * 坐标系类型
             */
            get: function () {
                return this._coordinateSystem;
            },
            set: function (value) {
                if (value == this._coordinateSystem)
                    return;
                this._coordinateSystem = value;
                this.invalidateMatrix();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新投影矩阵
         */
        PerspectiveCamera.prototype.updateMatrix = function () {
            var raw = tempRawData;
            this._yMax = this._near * this._focalLengthInv;
            this._xMax = this._yMax * this._aspectRatio;
            var left, right, top, bottom;
            if (this._scissorRect.x == 0 && this._scissorRect.y == 0 && this._scissorRect.width == this._viewPort.width && this._scissorRect.height == this._viewPort.height) {
                // assume unscissored frustum
                left = -this._xMax;
                right = this._xMax;
                top = -this._yMax;
                bottom = this._yMax;
                // assume unscissored frustum
                raw[0] = this._near / this._xMax;
                raw[5] = this._near / this._yMax;
                raw[10] = this._far / (this._far - this._near);
                raw[11] = 1;
                raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[12] = raw[13] = raw[15] = 0;
                raw[14] = -this._near * raw[10];
            }
            else {
                // assume scissored frustum
                var xWidth = this._xMax * (this._viewPort.width / this._scissorRect.width);
                var yHgt = this._yMax * (this._viewPort.height / this._scissorRect.height);
                var center = this._xMax * (this._scissorRect.x * 2 - this._viewPort.width) / this._scissorRect.width + this._xMax;
                var middle = -this._yMax * (this._scissorRect.y * 2 - this._viewPort.height) / this._scissorRect.height - this._yMax;
                left = center - xWidth;
                right = center + xWidth;
                top = middle - yHgt;
                bottom = middle + yHgt;
                raw[0] = 2 * this._near / (right - left);
                raw[5] = 2 * this._near / (bottom - top);
                raw[8] = (right + left) / (right - left);
                raw[9] = (bottom + top) / (bottom - top);
                raw[10] = (this._far + this._near) / (this._far - this._near);
                raw[11] = 1;
                raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
                raw[14] = -2 * this._far * this._near / (this._far - this._near);
            }
            // Switch projection transform from left to right handed.
            if (this._coordinateSystem == feng3d.CoordinateSystem.RIGHT_HANDED)
                raw[5] = -raw[5];
            this._matrix.copyRawDataFrom(raw);
            this._matrixInvalid = false;
        };
        return PerspectiveCamera;
    }(feng3d.Camera));
    feng3d.PerspectiveCamera = PerspectiveCamera;
    /**
     * 临时矩阵数据
     */
    var tempRawData = new Float32Array(16);
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 3D基元类型
     * @author feng 2016-05-01
     */
    (function (PrimitiveType) {
        /**
         * 平面
         */
        PrimitiveType[PrimitiveType["Plane"] = 0] = "Plane";
        /**
         * 立方体
         */
        PrimitiveType[PrimitiveType["Cube"] = 1] = "Cube";
        /**
         * 球体
         */
        PrimitiveType[PrimitiveType["Sphere"] = 2] = "Sphere";
        /**
         * 胶囊
         */
        PrimitiveType[PrimitiveType["Capsule"] = 3] = "Capsule";
        /**
         * 圆柱体
         */
        PrimitiveType[PrimitiveType["Cylinder"] = 4] = "Cylinder";
    })(feng3d.PrimitiveType || (feng3d.PrimitiveType = {}));
    var PrimitiveType = feng3d.PrimitiveType;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 立方体几何体
     * @author feng 2016-09-12
     */
    var PlaneGeometry = (function (_super) {
        __extends(PlaneGeometry, _super);
        /**
         * 创建平面几何体
         * @param width 宽度
         * @param height 高度
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        function PlaneGeometry(width, height, segmentsW, segmentsH, yUp) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            if (segmentsW === void 0) { segmentsW = 1; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this);
            this.width = width;
            this.height = height;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.yUp = yUp;
            feng3d.Watcher.watch(this, ["width"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["height"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["yUp"], this.invalidate, this);
        }
        /**
         * 构建几何体数据
         */
        PlaneGeometry.prototype.buildGeometry = function () {
            var vertexPositionData = this.buildPosition();
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            var vertexNormalData = this.buildNormal();
            this.setVAData(feng3d.GLAttribute.a_normal, vertexNormalData, 3);
            var vertexTangentData = this.buildTangent();
            this.setVAData(feng3d.GLAttribute.a_tangent, vertexTangentData, 3);
            var uvData = this.buildUVs();
            this.setVAData(feng3d.GLAttribute.a_uv, uvData, 2);
            var indices = this.buildIndices();
            this.setIndices(indices);
        };
        /**
         * 构建顶点坐标
         * @param this.width 宽度
         * @param this.height 高度
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        PlaneGeometry.prototype.buildPosition = function () {
            var vertexPositionData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var x, y;
            var positionIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    x = (xi / this.segmentsW - .5) * this.width;
                    y = (yi / this.segmentsH - .5) * this.height;
                    //设置坐标数据
                    vertexPositionData[positionIndex++] = x;
                    if (this.yUp) {
                        vertexPositionData[positionIndex++] = 0;
                        vertexPositionData[positionIndex++] = y;
                    }
                    else {
                        vertexPositionData[positionIndex++] = y;
                        vertexPositionData[positionIndex++] = 0;
                    }
                }
            }
            return vertexPositionData;
        };
        /**
         * 构建顶点法线
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        PlaneGeometry.prototype.buildNormal = function () {
            var vertexNormalData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var normalIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    //设置法线数据
                    vertexNormalData[normalIndex++] = 0;
                    if (this.yUp) {
                        vertexNormalData[normalIndex++] = 1;
                        vertexNormalData[normalIndex++] = 0;
                    }
                    else {
                        vertexNormalData[normalIndex++] = 0;
                        vertexNormalData[normalIndex++] = -1;
                    }
                }
            }
            return vertexNormalData;
        };
        /**
         * 构建顶点切线
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        PlaneGeometry.prototype.buildTangent = function () {
            var vertexTangentData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var tangentIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                }
            }
            return vertexTangentData;
        };
        /**
         * 构建顶点索引
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        PlaneGeometry.prototype.buildIndices = function () {
            var indices = new Uint16Array(this.segmentsH * this.segmentsW * 6);
            var tw = this.segmentsW + 1;
            var numIndices = 0;
            var base;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    //生成索引数据
                    if (xi != this.segmentsW && yi != this.segmentsH) {
                        base = xi + yi * tw;
                        indices[numIndices++] = base;
                        indices[numIndices++] = base + tw;
                        indices[numIndices++] = base + tw + 1;
                        indices[numIndices++] = base;
                        indices[numIndices++] = base + tw + 1;
                        indices[numIndices++] = base + 1;
                    }
                }
            }
            return indices;
        };
        /**
         * 构建uv
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         */
        PlaneGeometry.prototype.buildUVs = function () {
            var data = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 2);
            var index = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    data[index++] = xi / this.segmentsW;
                    data[index++] = 1 - yi / this.segmentsH;
                }
            }
            return data;
        };
        return PlaneGeometry;
    }(feng3d.Geometry));
    feng3d.PlaneGeometry = PlaneGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 立方体几何体
     * @author feng 2016-09-12
     */
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        /**
         * 创建立方几何体
         * @param   width           宽度
         * @param   height          高度
         * @param   depth           深度
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         * @param   tile6           是否为6块贴图
         */
        function CubeGeometry(width, height, depth, segmentsW, segmentsH, segmentsD, tile6) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            if (depth === void 0) { depth = 100; }
            if (segmentsW === void 0) { segmentsW = 1; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (segmentsD === void 0) { segmentsD = 1; }
            if (tile6 === void 0) { tile6 = true; }
            _super.call(this);
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.segmentsD = segmentsD;
            this.tile6 = tile6;
            feng3d.Watcher.watch(this, ["width"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["height"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["depth"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsD"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["tile6"], this.invalidate, this);
        }
        CubeGeometry.prototype.buildGeometry = function () {
            var vertexPositionData = this.buildPosition();
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            var vertexNormalData = this.buildNormal();
            this.setVAData(feng3d.GLAttribute.a_normal, vertexNormalData, 3);
            var vertexTangentData = this.buildTangent();
            this.setVAData(feng3d.GLAttribute.a_tangent, vertexTangentData, 3);
            var uvData = this.buildUVs();
            this.setVAData(feng3d.GLAttribute.a_uv, uvData, 2);
            var indices = this.buildIndices();
            this.setIndices(indices);
        };
        /**
         * 构建坐标
         * @param   width           宽度
         * @param   height          高度
         * @param   depth           深度
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         */
        CubeGeometry.prototype.buildPosition = function () {
            var vertexPositionData = new Float32Array(((this.segmentsW + 1) * (this.segmentsH + 1) + (this.segmentsW + 1) * (this.segmentsD + 1) + (this.segmentsH + 1) * (this.segmentsD + 1)) * 2 * 3);
            var i, j;
            var hw, hh, hd; // halves
            var dw, dh, dd; // deltas
            var outer_pos;
            // Indices
            var positionIndex = 0;
            // half cube dimensions
            hw = this.width / 2;
            hh = this.height / 2;
            hd = this.depth / 2;
            // Segment dimensions
            dw = this.width / this.segmentsW;
            dh = this.height / this.segmentsH;
            dd = this.depth / this.segmentsD;
            for (i = 0; i <= this.segmentsW; i++) {
                outer_pos = -hw + i * dw;
                for (j = 0; j <= this.segmentsH; j++) {
                    // front
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = -hd;
                    // back
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = hd;
                }
            }
            for (i = 0; i <= this.segmentsW; i++) {
                outer_pos = -hw + i * dw;
                for (j = 0; j <= this.segmentsD; j++) {
                    // top
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = hh;
                    vertexPositionData[positionIndex++] = -hd + j * dd;
                    // bottom
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh;
                    vertexPositionData[positionIndex++] = -hd + j * dd;
                }
            }
            for (i = 0; i <= this.segmentsD; i++) {
                outer_pos = hd - i * dd;
                for (j = 0; j <= this.segmentsH; j++) {
                    // left
                    vertexPositionData[positionIndex++] = -hw;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = outer_pos;
                    // right
                    vertexPositionData[positionIndex++] = hw;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = outer_pos;
                }
            }
            return vertexPositionData;
        };
        /**
         * 构建法线
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         */
        CubeGeometry.prototype.buildNormal = function () {
            var vertexNormalData = new Float32Array(((this.segmentsW + 1) * (this.segmentsH + 1) + (this.segmentsW + 1) * (this.segmentsD + 1) + (this.segmentsH + 1) * (this.segmentsD + 1)) * 2 * 3);
            var i, j;
            // Indices
            var normalIndex = 0;
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // front
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = -1;
                    // back
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 1;
                }
            }
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsD; j++) {
                    // top
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 1;
                    vertexNormalData[normalIndex++] = 0;
                    // bottom
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = -1;
                    vertexNormalData[normalIndex++] = 0;
                }
            }
            for (i = 0; i <= this.segmentsD; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // left
                    vertexNormalData[normalIndex++] = -1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    // right
                    vertexNormalData[normalIndex++] = 1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                }
            }
            return new Float32Array(vertexNormalData);
        };
        /**
         * 构建切线
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         */
        CubeGeometry.prototype.buildTangent = function () {
            var vertexTangentData = new Float32Array(((this.segmentsW + 1) * (this.segmentsH + 1) + (this.segmentsW + 1) * (this.segmentsD + 1) + (this.segmentsH + 1) * (this.segmentsD + 1)) * 2 * 3);
            var i, j;
            // Indices
            var tangentIndex = 0;
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // front
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    // back
                    vertexTangentData[tangentIndex++] = -1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                }
            }
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsD; j++) {
                    // top
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    // bottom
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                }
            }
            for (i = 0; i <= this.segmentsD; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // left
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = -1;
                    // right
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 1;
                }
            }
            return vertexTangentData;
        };
        /**
         * 构建索引
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         */
        CubeGeometry.prototype.buildIndices = function () {
            var indices = new Uint16Array((this.segmentsW * this.segmentsH + this.segmentsW * this.segmentsD + this.segmentsH * this.segmentsD) * 12);
            var tl, tr, bl, br;
            var i, j, inc = 0;
            var fidx = 0;
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // front
                    // back
                    if (i && j) {
                        tl = 2 * ((i - 1) * (this.segmentsH + 1) + (j - 1));
                        tr = 2 * (i * (this.segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            inc += 2 * (this.segmentsW + 1) * (this.segmentsH + 1);
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsD; j++) {
                    // top
                    // bottom
                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this.segmentsD + 1) + (j - 1));
                        tr = inc + 2 * (i * (this.segmentsD + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            inc += 2 * (this.segmentsW + 1) * (this.segmentsD + 1);
            for (i = 0; i <= this.segmentsD; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    // left
                    // right
                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this.segmentsH + 1) + (j - 1));
                        tr = inc + 2 * (i * (this.segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            return indices;
        };
        /**
         * 构建uv
         * @param   segmentsW       宽度方向分割
         * @param   segmentsH       高度方向分割
         * @param   segmentsD       深度方向分割
         * @param   tile6           是否为6块贴图
         */
        CubeGeometry.prototype.buildUVs = function () {
            var i, j, uidx;
            var data = new Float32Array(((this.segmentsW + 1) * (this.segmentsH + 1) + (this.segmentsW + 1) * (this.segmentsD + 1) + (this.segmentsH + 1) * (this.segmentsD + 1)) * 2 * 2);
            var u_tile_dim, v_tile_dim;
            var u_tile_step, v_tile_step;
            var tl0u, tl0v;
            var tl1u, tl1v;
            var du, dv;
            if (this.tile6) {
                u_tile_dim = u_tile_step = 1 / 3;
                v_tile_dim = v_tile_step = 1 / 2;
            }
            else {
                u_tile_dim = v_tile_dim = 1;
                u_tile_step = v_tile_step = 0;
            }
            // Create planes two and two, the same way that they were
            // constructed in the this.buildGeometry() function. First calculate
            // the top-left UV coordinate for both planes, and then loop
            // over the points, calculating the UVs from these numbers.
            // When this.tile6 is true, the layout is as follows:
            //       .-----.-----.-----. (1,1)
            //       | Bot |  T  | Bak |
            //       |-----+-----+-----|
            //       |  L  |  F  |  R  |
            // (0,0)'-----'-----'-----'
            uidx = 0;
            // FRONT / BACK
            tl0u = 1 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this.segmentsW;
            dv = v_tile_dim / this.segmentsH;
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    data[uidx++] = tl1u + (u_tile_dim - i * du);
                    data[uidx++] = tl1v + (v_tile_dim - j * dv);
                }
            }
            // TOP / BOTTOM
            tl0u = 1 * u_tile_step;
            tl0v = 0 * v_tile_step;
            tl1u = 0 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this.segmentsW;
            dv = v_tile_dim / this.segmentsD;
            for (i = 0; i <= this.segmentsW; i++) {
                for (j = 0; j <= this.segmentsD; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    data[uidx++] = tl1u + i * du;
                    data[uidx++] = tl1v + j * dv;
                }
            }
            // LEFT / RIGHT
            tl0u = 0 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 1 * v_tile_step;
            du = u_tile_dim / this.segmentsD;
            dv = v_tile_dim / this.segmentsH;
            for (i = 0; i <= this.segmentsD; i++) {
                for (j = 0; j <= this.segmentsH; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    data[uidx++] = tl1u + (u_tile_dim - i * du);
                    data[uidx++] = tl1v + (v_tile_dim - j * dv);
                }
            }
            return data;
        };
        return CubeGeometry;
    }(feng3d.Geometry));
    feng3d.CubeGeometry = CubeGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 球体几何体
     * @author DawnKing 2016-09-12
     */
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        /**
         * 创建球形几何体
         * @param radius 球体半径
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        function SphereGeometry(radius, segmentsW, segmentsH, yUp) {
            if (radius === void 0) { radius = 50; }
            if (segmentsW === void 0) { segmentsW = 16; }
            if (segmentsH === void 0) { segmentsH = 12; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this);
            this.radius = radius;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.yUp = yUp;
            feng3d.Watcher.watch(this, ["radius"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["yUp"], this.invalidate, this);
        }
        /**
         * 构建几何体数据
         * @param this.radius 球体半径
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        SphereGeometry.prototype.buildGeometry = function () {
            var vertexPositionData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var vertexNormalData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var vertexTangentData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var startIndex;
            var index = 0;
            var comp1, comp2, t1, t2;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                startIndex = index;
                var horangle = Math.PI * yi / this.segmentsH;
                var z = -this.radius * Math.cos(horangle);
                var ringradius = this.radius * Math.sin(horangle);
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    var verangle = 2 * Math.PI * xi / this.segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var y = ringradius * Math.sin(verangle);
                    var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen = Math.sqrt(y * y + x * x);
                    if (this.yUp) {
                        t1 = 0;
                        t2 = tanLen > .007 ? x / tanLen : 0;
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        t1 = tanLen > .007 ? x / tanLen : 0;
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (xi == this.segmentsW) {
                        vertexPositionData[index] = vertexPositionData[startIndex];
                        vertexPositionData[index + 1] = vertexPositionData[startIndex + 1];
                        vertexPositionData[index + 2] = vertexPositionData[startIndex + 2];
                        vertexNormalData[index] = vertexNormalData[startIndex] + x * normLen * 0.5;
                        vertexNormalData[index + 1] = vertexNormalData[startIndex + 1] + comp1 * normLen * 0.5;
                        vertexNormalData[index + 2] = vertexNormalData[startIndex + 2] + comp2 * normLen * 0.5;
                        vertexTangentData[index] = tanLen > .007 ? -y / tanLen : 1;
                        vertexTangentData[index + 1] = t1;
                        vertexTangentData[index + 2] = t2;
                    }
                    else {
                        vertexPositionData[index] = x;
                        vertexPositionData[index + 1] = comp1;
                        vertexPositionData[index + 2] = comp2;
                        vertexNormalData[index] = x * normLen;
                        vertexNormalData[index + 1] = comp1 * normLen;
                        vertexNormalData[index + 2] = comp2 * normLen;
                        vertexTangentData[index] = tanLen > .007 ? -y / tanLen : 1;
                        vertexTangentData[index + 1] = t1;
                        vertexTangentData[index + 2] = t2;
                    }
                    if (xi > 0 && yi > 0) {
                        if (yi == this.segmentsH) {
                            vertexPositionData[index] = vertexPositionData[startIndex];
                            vertexPositionData[index + 1] = vertexPositionData[startIndex + 1];
                            vertexPositionData[index + 2] = vertexPositionData[startIndex + 2];
                        }
                    }
                    index += 3;
                }
            }
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            this.setVAData(feng3d.GLAttribute.a_normal, vertexNormalData, 3);
            this.setVAData(feng3d.GLAttribute.a_tangent, vertexTangentData, 3);
            var uvData = this.buildUVs();
            this.setVAData(feng3d.GLAttribute.a_uv, uvData, 2);
            var indices = this.buildIndices();
            this.setIndices(indices);
        };
        /**
         * 构建顶点索引
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        SphereGeometry.prototype.buildIndices = function () {
            var indices = new Uint16Array(this.segmentsH * this.segmentsW * 6);
            var numIndices = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    if (xi > 0 && yi > 0) {
                        var a = (this.segmentsW + 1) * yi + xi;
                        var b = (this.segmentsW + 1) * yi + xi - 1;
                        var c = (this.segmentsW + 1) * (yi - 1) + xi - 1;
                        var d = (this.segmentsW + 1) * (yi - 1) + xi;
                        if (yi == this.segmentsH) {
                            indices[numIndices++] = a;
                            indices[numIndices++] = c;
                            indices[numIndices++] = d;
                        }
                        else if (yi == 1) {
                            indices[numIndices++] = a;
                            indices[numIndices++] = b;
                            indices[numIndices++] = c;
                        }
                        else {
                            indices[numIndices++] = a;
                            indices[numIndices++] = b;
                            indices[numIndices++] = c;
                            indices[numIndices++] = a;
                            indices[numIndices++] = c;
                            indices[numIndices++] = d;
                        }
                    }
                }
            }
            return indices;
        };
        /**
         * 构建uv
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         */
        SphereGeometry.prototype.buildUVs = function () {
            var data = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 2);
            var index = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    data[index++] = xi / this.segmentsW;
                    data[index++] = yi / this.segmentsH;
                }
            }
            return data;
        };
        return SphereGeometry;
    }(feng3d.Geometry));
    feng3d.SphereGeometry = SphereGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 胶囊体几何体
     * @author DawnKing 2016-09-12
     */
    var CapsuleGeometry = (function (_super) {
        __extends(CapsuleGeometry, _super);
        /**
         * 创建胶囊几何体
         * @param radius 胶囊体半径
         * @param height 胶囊体高度
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        function CapsuleGeometry(radius, height, segmentsW, segmentsH, yUp) {
            if (radius === void 0) { radius = 50; }
            if (height === void 0) { height = 100; }
            if (segmentsW === void 0) { segmentsW = 16; }
            if (segmentsH === void 0) { segmentsH = 15; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this);
            this.radius = radius;
            this.height = height;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.yUp = yUp;
            feng3d.Watcher.watch(this, ["radius"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["height"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["yUp"], this.invalidate, this);
        }
        /**
         * 构建几何体数据
         * @param radius 胶囊体半径
         * @param height 胶囊体高度
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        CapsuleGeometry.prototype.buildGeometry = function () {
            var vertexPositionData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var vertexNormalData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var vertexTangentData = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 3);
            var startIndex;
            var index = 0;
            var comp1, comp2, t1, t2;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                startIndex = index;
                var horangle = Math.PI * yi / this.segmentsH;
                var z = -this.radius * Math.cos(horangle);
                var ringradius = this.radius * Math.sin(horangle);
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    var verangle = 2 * Math.PI * xi / this.segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var y = ringradius * Math.sin(verangle);
                    var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen = Math.sqrt(y * y + x * x);
                    var offset = yi > this.segmentsH / 2 ? this.height / 2 : -this.height / 2;
                    if (this.yUp) {
                        t1 = 0;
                        t2 = tanLen > .007 ? x / tanLen : 0;
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        t1 = tanLen > .007 ? x / tanLen : 0;
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (xi == this.segmentsW) {
                        vertexPositionData[index] = vertexPositionData[startIndex];
                        vertexPositionData[index + 1] = vertexPositionData[startIndex + 1];
                        vertexPositionData[index + 2] = vertexPositionData[startIndex + 2];
                        vertexNormalData[index] = (vertexNormalData[startIndex] + x * normLen) * 0.5;
                        vertexNormalData[index + 1] = (vertexNormalData[startIndex + 1] + comp1 * normLen) * 0.5;
                        vertexNormalData[index + 2] = (vertexNormalData[startIndex + 2] + comp2 * normLen) * 0.5;
                        vertexTangentData[index] = (vertexTangentData[startIndex] + tanLen > .007 ? -y / tanLen : 1) * 0.5;
                        vertexTangentData[index + 1] = (vertexTangentData[startIndex + 1] + t1) * 0.5;
                        vertexTangentData[index + 2] = (vertexTangentData[startIndex + 2] + t2) * 0.5;
                    }
                    else {
                        vertexPositionData[index] = x;
                        vertexPositionData[index + 1] = this.yUp ? comp1 - offset : comp1;
                        vertexPositionData[index + 2] = this.yUp ? comp2 : comp2 + offset;
                        vertexNormalData[index] = x * normLen;
                        vertexNormalData[index + 1] = comp1 * normLen;
                        vertexNormalData[index + 2] = comp2 * normLen;
                        vertexTangentData[index] = tanLen > .007 ? -y / tanLen : 1;
                        vertexTangentData[index + 1] = t1;
                        vertexTangentData[index + 2] = t2;
                    }
                    if (xi > 0 && yi > 0) {
                        if (yi == this.segmentsH) {
                            vertexPositionData[index] = vertexPositionData[startIndex];
                            vertexPositionData[index + 1] = vertexPositionData[startIndex + 1];
                            vertexPositionData[index + 2] = vertexPositionData[startIndex + 2];
                        }
                    }
                    index += 3;
                }
            }
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            this.setVAData(feng3d.GLAttribute.a_normal, vertexNormalData, 3);
            this.setVAData(feng3d.GLAttribute.a_tangent, vertexTangentData, 3);
            var uvData = this.buildUVs();
            this.setVAData(feng3d.GLAttribute.a_uv, uvData, 2);
            this.buildIndices();
        };
        /**
         * 构建顶点索引
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        CapsuleGeometry.prototype.buildIndices = function () {
            var indices = new Uint16Array(this.segmentsH * this.segmentsW * 6);
            var numIndices = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    if (xi > 0 && yi > 0) {
                        var a = (this.segmentsW + 1) * yi + xi;
                        var b = (this.segmentsW + 1) * yi + xi - 1;
                        var c = (this.segmentsW + 1) * (yi - 1) + xi - 1;
                        var d = (this.segmentsW + 1) * (yi - 1) + xi;
                        if (yi == this.segmentsH) {
                            indices[numIndices++] = a;
                            indices[numIndices++] = c;
                            indices[numIndices++] = d;
                        }
                        else if (yi == 1) {
                            indices[numIndices++] = a;
                            indices[numIndices++] = b;
                            indices[numIndices++] = c;
                        }
                        else {
                            indices[numIndices++] = a;
                            indices[numIndices++] = b;
                            indices[numIndices++] = c;
                            indices[numIndices++] = a;
                            indices[numIndices++] = c;
                            indices[numIndices++] = d;
                        }
                    }
                }
            }
            this.setIndices(indices);
        };
        /**
         * 构建uv
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         */
        CapsuleGeometry.prototype.buildUVs = function () {
            var data = new Float32Array((this.segmentsH + 1) * (this.segmentsW + 1) * 2);
            var index = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    data[index++] = xi / this.segmentsW;
                    data[index++] = yi / this.segmentsH;
                }
            }
            return data;
        };
        return CapsuleGeometry;
    }(feng3d.Geometry));
    feng3d.CapsuleGeometry = CapsuleGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆柱体几何体
     * @author DawnKing 2016-09-12
     */
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        /**
         * 创建圆柱体
         */
        function CylinderGeometry(topRadius, bottomRadius, height, segmentsW, segmentsH, topClosed, bottomClosed, surfaceClosed, yUp) {
            if (topRadius === void 0) { topRadius = 50; }
            if (bottomRadius === void 0) { bottomRadius = 50; }
            if (height === void 0) { height = 100; }
            if (segmentsW === void 0) { segmentsW = 16; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (topClosed === void 0) { topClosed = true; }
            if (bottomClosed === void 0) { bottomClosed = true; }
            if (surfaceClosed === void 0) { surfaceClosed = true; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this);
            this.topRadius = topRadius;
            this.bottomRadius = bottomRadius;
            this.height = height;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.topClosed = topClosed;
            this.bottomClosed = bottomClosed;
            this.surfaceClosed = surfaceClosed;
            this.yUp = yUp;
            feng3d.Watcher.watch(this, ["topRadius"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["bottomRadius"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["height"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["topClosed"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["bottomClosed"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["surfaceClosed"], this.invalidate, this);
            feng3d.Watcher.watch(this, ["yUp"], this.invalidate, this);
        }
        /**
         * 计算几何体顶点数
         */
        CylinderGeometry.prototype.getNumVertices = function () {
            var numVertices = 0;
            if (this.surfaceClosed)
                numVertices += (this.segmentsH + 1) * (this.segmentsW + 1);
            if (this.topClosed)
                numVertices += 2 * (this.segmentsW + 1);
            if (this.bottomClosed)
                numVertices += 2 * (this.segmentsW + 1);
            return numVertices;
        };
        /**
         * 计算几何体三角形数量
         */
        CylinderGeometry.prototype.getNumTriangles = function () {
            var numTriangles = 0;
            if (this.surfaceClosed)
                numTriangles += this.segmentsH * this.segmentsW * 2;
            if (this.topClosed)
                numTriangles += this.segmentsW;
            if (this.bottomClosed)
                numTriangles += this.segmentsW;
            return numTriangles;
        };
        /**
         * 构建几何体数据
         */
        CylinderGeometry.prototype.buildGeometry = function () {
            var i, j, index = 0;
            var x, y, z, radius, revolutionAngle;
            var dr, latNormElev, latNormBase;
            var comp1, comp2;
            var startIndex = 0;
            var t1, t2;
            var numVertices = this.getNumVertices();
            var vertexPositionData = new Float32Array(numVertices * 3);
            var vertexNormalData = new Float32Array(numVertices * 3);
            var vertexTangentData = new Float32Array(numVertices * 3);
            var revolutionAngleDelta = 2 * Math.PI / this.segmentsW;
            // 顶部
            if (this.topClosed && this.topRadius > 0) {
                z = -0.5 * this.height;
                for (i = 0; i <= this.segmentsW; ++i) {
                    // 中心顶点
                    if (this.yUp) {
                        t1 = 1;
                        t2 = 0;
                        comp1 = -z;
                        comp2 = 0;
                    }
                    else {
                        t1 = 0;
                        t2 = -1;
                        comp1 = 0;
                        comp2 = z;
                    }
                    addVertex(0, comp1, comp2, 0, t1, t2, 1, 0, 0);
                    // 旋转顶点
                    revolutionAngle = i * revolutionAngleDelta;
                    x = this.topRadius * Math.cos(revolutionAngle);
                    y = this.topRadius * Math.sin(revolutionAngle);
                    if (this.yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this.segmentsW) {
                        addVertex(vertexPositionData[startIndex + 3], vertexPositionData[startIndex + 4], vertexPositionData[startIndex + 5], 0, t1, t2, 1, 0, 0);
                    }
                    else {
                        addVertex(x, comp1, comp2, 0, t1, t2, 1, 0, 0);
                    }
                }
            }
            // 底部
            if (this.bottomClosed && this.bottomRadius > 0) {
                z = 0.5 * this.height;
                startIndex = index;
                for (i = 0; i <= this.segmentsW; ++i) {
                    // 中心顶点
                    if (this.yUp) {
                        t1 = -1;
                        t2 = 0;
                        comp1 = -z;
                        comp2 = 0;
                    }
                    else {
                        t1 = 0;
                        t2 = 1;
                        comp1 = 0;
                        comp2 = z;
                    }
                    addVertex(0, comp1, comp2, 0, t1, t2, 1, 0, 0);
                    // 旋转顶点
                    revolutionAngle = i * revolutionAngle;
                    x = this.bottomRadius * Math.cos(revolutionAngle);
                    y = this.bottomRadius * Math.sin(revolutionAngle);
                    if (this.yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this.segmentsW) {
                        addVertex(x, vertexPositionData[startIndex + 1], vertexPositionData[startIndex + 2], 0, t1, t2, 1, 0, 0);
                    }
                    else {
                        addVertex(x, comp1, comp2, 0, t1, t2, 1, 0, 0);
                    }
                }
            }
            // 侧面
            dr = this.bottomRadius - this.topRadius;
            latNormElev = dr / this.height;
            latNormBase = (latNormElev == 0) ? 1 : this.height / dr;
            if (this.surfaceClosed) {
                var a, b, c, d;
                var na0, na1, naComp1, naComp2;
                for (j = 0; j <= this.segmentsH; ++j) {
                    radius = this.topRadius - ((j / this.segmentsH) * (this.topRadius - this.bottomRadius));
                    z = -(this.height / 2) + (j / this.segmentsH * this.height);
                    startIndex = index;
                    for (i = 0; i <= this.segmentsW; ++i) {
                        revolutionAngle = i * revolutionAngleDelta;
                        x = radius * Math.cos(revolutionAngle);
                        y = radius * Math.sin(revolutionAngle);
                        na0 = latNormBase * Math.cos(revolutionAngle);
                        na1 = latNormBase * Math.sin(revolutionAngle);
                        if (this.yUp) {
                            t1 = 0;
                            t2 = -na0;
                            comp1 = -z;
                            comp2 = y;
                            naComp1 = latNormElev;
                            naComp2 = na1;
                        }
                        else {
                            t1 = -na0;
                            t2 = 0;
                            comp1 = y;
                            comp2 = z;
                            naComp1 = na1;
                            naComp2 = latNormElev;
                        }
                        if (i == this.segmentsW) {
                            addVertex(vertexPositionData[startIndex], vertexPositionData[startIndex + 1], vertexPositionData[startIndex + 2], na0, latNormElev, na1, na1, t1, t2);
                        }
                        else {
                            addVertex(x, comp1, comp2, na0, naComp1, naComp2, -na1, t1, t2);
                        }
                    }
                }
            }
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            this.setVAData(feng3d.GLAttribute.a_normal, vertexNormalData, 3);
            this.setVAData(feng3d.GLAttribute.a_tangent, vertexTangentData, 3);
            function addVertex(px, py, pz, nx, ny, nz, tx, ty, tz) {
                vertexPositionData[index] = px;
                vertexPositionData[index + 1] = py;
                vertexPositionData[index + 2] = pz;
                vertexNormalData[index] = nx;
                vertexNormalData[index + 1] = ny;
                vertexNormalData[index + 2] = nz;
                vertexTangentData[index] = tx;
                vertexTangentData[index + 1] = ty;
                vertexTangentData[index + 2] = tz;
                index += 3;
            }
            //
            var uvData = this.buildUVs();
            this.setVAData(feng3d.GLAttribute.a_uv, uvData, 2);
            var indices = this.buildIndices();
            this.setIndices(indices);
        };
        /**
         * 构建顶点索引
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         * @param yUp 正面朝向 true:Y+ false:Z+
         */
        CylinderGeometry.prototype.buildIndices = function () {
            var i, j, index = 0;
            var numTriangles = this.getNumTriangles();
            var indices = new Uint16Array(numTriangles * 3);
            var numIndices = 0;
            // 顶部
            if (this.topClosed && this.topRadius > 0) {
                for (i = 0; i <= this.segmentsW; ++i) {
                    index += 2;
                    if (i > 0)
                        addTriangleClockWise(index - 1, index - 3, index - 2);
                }
            }
            // 底部
            if (this.bottomClosed && this.bottomRadius > 0) {
                for (i = 0; i <= this.segmentsW; ++i) {
                    index += 2;
                    if (i > 0)
                        addTriangleClockWise(index - 2, index - 3, index - 1);
                }
            }
            // 侧面
            if (this.surfaceClosed) {
                var a, b, c, d;
                for (j = 0; j <= this.segmentsH; ++j) {
                    for (i = 0; i <= this.segmentsW; ++i) {
                        index++;
                        if (i > 0 && j > 0) {
                            a = index - 1;
                            b = index - 2;
                            c = b - this.segmentsW - 1;
                            d = a - this.segmentsW - 1;
                            addTriangleClockWise(a, b, c);
                            addTriangleClockWise(a, c, d);
                        }
                    }
                }
            }
            return indices;
            function addTriangleClockWise(cwVertexIndex0, cwVertexIndex1, cwVertexIndex2) {
                indices[numIndices++] = cwVertexIndex0;
                indices[numIndices++] = cwVertexIndex1;
                indices[numIndices++] = cwVertexIndex2;
            }
        };
        /**
         * 构建uv
         * @param segmentsW 横向分割数
         * @param segmentsH 纵向分割数
         */
        CylinderGeometry.prototype.buildUVs = function () {
            var i, j;
            var x, y, revolutionAngle;
            var numVertices = this.getNumVertices();
            var data = new Float32Array(numVertices * 2);
            var revolutionAngleDelta = 2 * Math.PI / this.segmentsW;
            var index = 0;
            // 顶部
            if (this.topClosed) {
                for (i = 0; i <= this.segmentsW; ++i) {
                    revolutionAngle = i * revolutionAngleDelta;
                    x = 0.5 + 0.5 * -Math.cos(revolutionAngle);
                    y = 0.5 + 0.5 * Math.sin(revolutionAngle);
                    // 中心顶点
                    data[index++] = 0.5;
                    data[index++] = 0.5;
                    // 旋转顶点
                    data[index++] = x;
                    data[index++] = y;
                }
            }
            // 底部
            if (this.bottomClosed) {
                for (i = 0; i <= this.segmentsW; ++i) {
                    revolutionAngle = i * revolutionAngleDelta;
                    x = 0.5 + 0.5 * Math.cos(revolutionAngle);
                    y = 0.5 + 0.5 * Math.sin(revolutionAngle);
                    // 中心顶点
                    data[index++] = 0.5;
                    data[index++] = 0.5;
                    // 旋转顶点
                    data[index++] = x;
                    data[index++] = y;
                }
            }
            // 侧面
            if (this.surfaceClosed) {
                for (j = 0; j <= this.segmentsH; ++j) {
                    for (i = 0; i <= this.segmentsW; ++i) {
                        // 旋转顶点
                        data[index++] = (i / this.segmentsW);
                        data[index++] = (j / this.segmentsH);
                    }
                }
            }
            return data;
        };
        return CylinderGeometry;
    }(feng3d.Geometry));
    feng3d.CylinderGeometry = CylinderGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆锥体
     * @author feng 2017-02-07
     */
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        /**
         * 创建圆锥体
         * @param radius 底部半径
         * @param height 高度
         * @param segmentsW
         * @param segmentsH
         * @param yUp
         */
        function ConeGeometry(radius, height, segmentsW, segmentsH, closed, yUp) {
            if (radius === void 0) { radius = 50; }
            if (height === void 0) { height = 100; }
            if (segmentsW === void 0) { segmentsW = 16; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (closed === void 0) { closed = true; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this, 0, radius, height, segmentsW, segmentsH, false, closed, true, yUp);
        }
        return ConeGeometry;
    }(feng3d.CylinderGeometry));
    feng3d.ConeGeometry = ConeGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆环几何体
     */
    var TorusGeometry = (function (_super) {
        __extends(TorusGeometry, _super);
        /**
         * 创建<code>Torus</code>实例
         * @param radius						圆环半径
         * @param tubeRadius					管道半径
         * @param segmentsR						横向段数
         * @param segmentsT						纵向段数
         * @param yUp							Y轴是否朝上
         */
        function TorusGeometry(radius, tubeRadius, segmentsR, segmentsT, yUp) {
            if (radius === void 0) { radius = 50; }
            if (tubeRadius === void 0) { tubeRadius = 50; }
            if (segmentsR === void 0) { segmentsR = 16; }
            if (segmentsT === void 0) { segmentsT = 8; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this);
            this.radius = radius;
            this.tubeRadius = tubeRadius;
            this.segmentsR = segmentsR;
            this.segmentsT = segmentsT;
            this.yUp = yUp;
            this._vertexPositionStride = 3;
            this._vertexNormalStride = 3;
            this._vertexTangentStride = 3;
            feng3d.Watcher.watch(this, ["radius"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["tubeRadius"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["segmentsR"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["segmentsT"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["yUp"], this.buildGeometry, this);
        }
        /**
         * 添加顶点数据
         */
        TorusGeometry.prototype.addVertex = function (vertexIndex, px, py, pz, nx, ny, nz, tx, ty, tz) {
            this._vertexPositionData[vertexIndex * this._vertexPositionStride] = px;
            this._vertexPositionData[vertexIndex * this._vertexPositionStride + 1] = py;
            this._vertexPositionData[vertexIndex * this._vertexPositionStride + 2] = pz;
            this._vertexNormalData[vertexIndex * this._vertexNormalStride] = nx;
            this._vertexNormalData[vertexIndex * this._vertexNormalStride + 1] = ny;
            this._vertexNormalData[vertexIndex * this._vertexNormalStride + 2] = nz;
            this._vertexTangentData[vertexIndex * this._vertexTangentStride] = tx;
            this._vertexTangentData[vertexIndex * this._vertexTangentStride + 1] = ty;
            this._vertexTangentData[vertexIndex * this._vertexTangentStride + 2] = tz;
        };
        /**
         * 添加三角形索引数据
         * @param currentTriangleIndex		当前三角形索引
         * @param cwVertexIndex0			索引0
         * @param cwVertexIndex1			索引1
         * @param cwVertexIndex2			索引2
         */
        TorusGeometry.prototype.addTriangleClockWise = function (currentTriangleIndex, cwVertexIndex0, cwVertexIndex1, cwVertexIndex2) {
            this._rawIndices[currentTriangleIndex * 3] = cwVertexIndex0;
            this._rawIndices[currentTriangleIndex * 3 + 1] = cwVertexIndex1;
            this._rawIndices[currentTriangleIndex * 3 + 2] = cwVertexIndex2;
        };
        /**
         * @inheritDoc
         */
        TorusGeometry.prototype.buildGeometry = function () {
            var i, j;
            var x, y, z, nx, ny, nz, revolutionAngleR, revolutionAngleT;
            var numTriangles;
            // reset utility variables
            this._numVertices = 0;
            this._vertexIndex = 0;
            this._currentTriangleIndex = 0;
            // evaluate target number of vertices, triangles and indices
            this._numVertices = (this.segmentsT + 1) * (this.segmentsR + 1); // this.segmentsT + 1 because of closure, this.segmentsR + 1 because of closure
            numTriangles = this.segmentsT * this.segmentsR * 2; // each level has segmentR quads, each of 2 triangles
            this._vertexPositionData = new Float32Array(this._numVertices * this._vertexPositionStride);
            this._vertexNormalData = new Float32Array(this._numVertices * this._vertexNormalStride);
            this._vertexTangentData = new Float32Array(this._numVertices * this._vertexTangentStride);
            this._rawIndices = new Uint16Array(numTriangles * 3);
            this.buildUVs();
            // evaluate revolution steps
            var revolutionAngleDeltaR = 2 * Math.PI / this.segmentsR;
            var revolutionAngleDeltaT = 2 * Math.PI / this.segmentsT;
            var comp1, comp2;
            var t1, t2, n1, n2;
            var startPositionIndex;
            // surface
            var a, b, c, d, length;
            for (j = 0; j <= this.segmentsT; ++j) {
                startPositionIndex = j * (this.segmentsR + 1) * this._vertexPositionStride;
                for (i = 0; i <= this.segmentsR; ++i) {
                    this._vertexIndex = j * (this.segmentsR + 1) + i;
                    // revolution vertex
                    revolutionAngleR = i * revolutionAngleDeltaR;
                    revolutionAngleT = j * revolutionAngleDeltaT;
                    length = Math.cos(revolutionAngleT);
                    nx = length * Math.cos(revolutionAngleR);
                    ny = length * Math.sin(revolutionAngleR);
                    nz = Math.sin(revolutionAngleT);
                    x = this.radius * Math.cos(revolutionAngleR) + this.tubeRadius * nx;
                    y = this.radius * Math.sin(revolutionAngleR) + this.tubeRadius * ny;
                    z = (j == this.segmentsT) ? 0 : this.tubeRadius * nz;
                    if (this.yUp) {
                        n1 = -nz;
                        n2 = ny;
                        t1 = 0;
                        t2 = (length ? nx / length : x / this.radius);
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        n1 = ny;
                        n2 = nz;
                        t1 = (length ? nx / length : x / this.radius);
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this.segmentsR) {
                        this.addVertex(this._vertexIndex, x, this._vertexPositionData[startPositionIndex + 1], this._vertexPositionData[startPositionIndex + 2], nx, n1, n2, -(length ? ny / length : y / this.radius), t1, t2);
                    }
                    else {
                        this.addVertex(this._vertexIndex, x, comp1, comp2, nx, n1, n2, -(length ? ny / length : y / this.radius), t1, t2);
                    }
                    // close triangle
                    if (i > 0 && j > 0) {
                        a = this._vertexIndex; // current
                        b = this._vertexIndex - 1; // previous
                        c = b - this.segmentsR - 1; // previous of last level
                        d = a - this.segmentsR - 1; // current of last level
                        this.addTriangleClockWise(this._currentTriangleIndex++, a, b, c);
                        this.addTriangleClockWise(this._currentTriangleIndex++, a, c, d);
                    }
                }
            }
            this.setVAData(feng3d.GLAttribute.a_position, this._vertexPositionData, 3);
            this.setVAData(feng3d.GLAttribute.a_normal, this._vertexNormalData, 3);
            this.setVAData(feng3d.GLAttribute.a_tangent, this._vertexTangentData, 3);
            this.setIndices(this._rawIndices);
        };
        /**
         * @inheritDoc
         */
        TorusGeometry.prototype.buildUVs = function () {
            var i, j;
            var stride = 2;
            var data = new Float32Array(this._numVertices * stride);
            // evaluate num uvs
            var numUvs = this._numVertices * stride;
            // current uv component index
            var currentUvCompIndex = 0;
            var index = 0;
            // surface
            for (j = 0; j <= this.segmentsT; ++j) {
                for (i = 0; i <= this.segmentsR; ++i) {
                    index = j * (this.segmentsR + 1) + i;
                    // revolution vertex
                    data[index * stride] = i / this.segmentsR;
                    data[index * stride + 1] = j / this.segmentsT;
                }
            }
            // build real data from raw data
            this.setVAData(feng3d.GLAttribute.a_uv, data, 2);
        };
        return TorusGeometry;
    }(feng3d.Geometry));
    feng3d.TorusGeometry = TorusGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 天空盒几何体
     * @author feng 2016-09-12
     */
    var SkyBoxGeometry = (function (_super) {
        __extends(SkyBoxGeometry, _super);
        /**
         * 创建天空盒
         */
        function SkyBoxGeometry() {
            _super.call(this);
            //八个顶点，32个number
            var vertexPositionData = new Float32Array([
                -1, 1, -1,
                1, 1, -1,
                1, 1, 1,
                -1, 1, 1,
                -1, -1, -1,
                1, -1, -1,
                1, -1, 1,
                -1, -1, 1 //
            ]);
            this.setVAData(feng3d.GLAttribute.a_position, vertexPositionData, 3);
            //6个面，12个三角形，36个顶点索引
            var indices = new Uint16Array([
                0, 1, 2, 2, 3, 0,
                6, 5, 4, 4, 7, 6,
                2, 6, 7, 7, 3, 2,
                4, 5, 1, 1, 0, 4,
                4, 0, 3, 3, 7, 4,
                2, 1, 5, 5, 6, 2 //
            ]);
            this.setIndices(indices);
        }
        return SkyBoxGeometry;
    }(feng3d.Geometry));
    feng3d.SkyBoxGeometry = SkyBoxGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 纹理信息
     * @author feng 2016-12-20
     */
    var TextureInfo = (function () {
        function TextureInfo() {
            /**
             * 内部格式
             */
            this.internalformat = feng3d.Context3D.RGB;
            /**
             * 格式
             */
            this.format = feng3d.Context3D.RGB;
            /**
             * 数据类型
             */
            this.type = feng3d.Context3D.UNSIGNED_BYTE;
            /**
             * 是否生成mipmap
             */
            this.generateMipmap = true;
            /**
             * 图片y轴向
             */
            this.flipY = 1;
            this.minFilter = feng3d.Context3D.LINEAR;
            this.magFilter = feng3d.Context3D.NEAREST;
            this.wrapS = feng3d.Context3D.CLAMP_TO_EDGE;
            this.wrapT = feng3d.Context3D.CLAMP_TO_EDGE;
        }
        return TextureInfo;
    }());
    feng3d.TextureInfo = TextureInfo;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 2D纹理
     * @author feng 2016-12-20
     */
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(pixels) {
            _super.call(this);
            this.textureType = feng3d.Context3D.TEXTURE_2D;
            this.pixels = pixels;
        }
        return Texture2D;
    }(feng3d.TextureInfo));
    feng3d.Texture2D = Texture2D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 立方体纹理
     * @author feng 2016-12-28
     */
    var TextureCube = (function (_super) {
        __extends(TextureCube, _super);
        function TextureCube(images) {
            _super.call(this);
            this.textureType = feng3d.Context3D.TEXTURE_CUBE_MAP;
            this.pixels = images;
        }
        return TextureCube;
    }(feng3d.TextureInfo));
    feng3d.TextureCube = TextureCube;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 材质
     * @author feng 2016-05-02
     */
    var Material = (function (_super) {
        __extends(Material, _super);
        /**
         * 构建材质
         */
        function Material() {
            _super.call(this);
            /**
            * 渲染模式
            */
            this.renderMode = feng3d.RenderMode.TRIANGLES;
            this._single = true;
            this._type = Material;
        }
        /**
         * 更新渲染数据
         */
        Material.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            //
            this._renderData.shaderParams.renderMode = this.renderMode;
            //
            if (this.shaderName) {
                this._renderData.vertexCode = feng3d.ShaderLib.getShaderCode(this.shaderName + ".vertex");
                this._renderData.fragmentCode = feng3d.ShaderLib.getShaderCode(this.shaderName + ".fragment");
            }
        };
        return Material;
    }(feng3d.RenderDataHolder));
    feng3d.Material = Material;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 颜色材质
     * @author feng 2017-01-11
     */
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        /**
         * 构建颜色材质
         */
        function PointMaterial() {
            _super.call(this);
            this.pointSize = 1;
            this.shaderName = "point";
            this.renderMode = feng3d.RenderMode.POINTS;
        }
        /**
         * 更新渲染数据
         */
        PointMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.u_PointSize] = this.pointSize;
        };
        return PointMaterial;
    }(feng3d.Material));
    feng3d.PointMaterial = PointMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 颜色材质
     * @author feng 2016-05-02
     */
    var ColorMaterial = (function (_super) {
        __extends(ColorMaterial, _super);
        /**
         * 构建颜色材质
         * @param color 颜色
         * @param alpha 透明的
         */
        function ColorMaterial(color) {
            if (color === void 0) { color = null; }
            _super.call(this);
            this.shaderName = "color";
            this.color = color || new feng3d.Color();
        }
        /**
         * 更新渲染数据
         */
        ColorMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.u_diffuseInput] = new feng3d.Vector3D(this.color.r, this.color.g, this.color.b, this.color.a);
        };
        return ColorMaterial;
    }(feng3d.Material));
    feng3d.ColorMaterial = ColorMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 线段材质
     * 目前webgl不支持修改线条宽度，参考：https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/lineWidth
     * @author feng 2016-10-15
     */
    var SegmentMaterial = (function (_super) {
        __extends(SegmentMaterial, _super);
        /**
         * 构建线段材质
         */
        function SegmentMaterial() {
            _super.call(this);
            this.shaderName = "segment";
            this.renderMode = feng3d.RenderMode.LINES;
        }
        return SegmentMaterial;
    }(feng3d.Material));
    feng3d.SegmentMaterial = SegmentMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 材质组件
     * @author feng 2016-11-01
     */
    var MaterialComponent = (function (_super) {
        __extends(MaterialComponent, _super);
        /**
         * 构建材质组件
         */
        function MaterialComponent() {
            _super.call(this);
        }
        Object.defineProperty(MaterialComponent.prototype, "material", {
            /**
             * 所属对象
             */
            get: function () { return this._parentComponent; },
            enumerable: true,
            configurable: true
        });
        return MaterialComponent;
    }(feng3d.Component));
    feng3d.MaterialComponent = MaterialComponent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 纹理材质
     * @author feng 2016-12-23
     */
    var TextureMaterial = (function (_super) {
        __extends(TextureMaterial, _super);
        function TextureMaterial() {
            _super.call(this);
            this.shaderName = "texture";
        }
        /**
         * 更新渲染数据
         */
        TextureMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.s_texture] = this.texture;
        };
        return TextureMaterial;
    }(feng3d.Material));
    feng3d.TextureMaterial = TextureMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 天空盒材质
     * @author feng 2016-12-20
     */
    var SkyBoxMaterial = (function (_super) {
        __extends(SkyBoxMaterial, _super);
        function SkyBoxMaterial(images) {
            _super.call(this);
            this.shaderName = "skybox";
            this.skyBoxSize = new feng3d.Vector3D();
            this.skyBoxTextureCube = new feng3d.TextureCube(images);
        }
        /**
         * 更新渲染数据
         */
        SkyBoxMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            //
            this.skyBoxSize.x = this.skyBoxSize.y = this.skyBoxSize.z = renderContext.camera.far / Math.sqrt(3);
            //
            this._renderData.uniforms[feng3d.RenderDataID.s_skyboxTexture] = this.skyBoxTextureCube;
            this._renderData.uniforms[feng3d.RenderDataID.u_skyBoxSize] = this.skyBoxSize;
        };
        return SkyBoxMaterial;
    }(feng3d.Material));
    feng3d.SkyBoxMaterial = SkyBoxMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 标准材质
     * @author feng 2016-05-02
     * @see 物理渲染-基于物理的光照模型 http://blog.csdn.net/leonwei/article/details/44539217
     */
    var StandardMaterial = (function (_super) {
        __extends(StandardMaterial, _super);
        /**
         * 构建
         */
        function StandardMaterial() {
            _super.call(this);
            /**
             * 基本颜色
             */
            this.baseColor = new feng3d.Color(1, 1, 1, 1);
            /**
             * 环境颜色
             */
            this.ambientColor = new feng3d.Color(0, 0, 0, 1);
            /**
             * 反射率
             */
            this.reflectance = 1.0;
            /**
             * 粗糙度
             */
            this.roughness = 1.0;
            /**
             * 金属度
             */
            this.metalic = 1.0;
            this.shaderName = "standard";
        }
        /**
         * 更新渲染数据
         */
        StandardMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.u_baseColor] = this.baseColor.toVector3D();
            this._renderData.uniforms[feng3d.RenderDataID.u_reflectance] = this.reflectance;
            this._renderData.uniforms[feng3d.RenderDataID.u_roughness] = this.roughness;
            this._renderData.uniforms[feng3d.RenderDataID.u_metalic] = this.metalic;
        };
        return StandardMaterial;
    }(feng3d.Material));
    feng3d.StandardMaterial = StandardMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子材质（为了使用独立的着色器，暂时设置粒子材质）
     * @author feng 2017-01-09
     */
    var ParticleMaterial = (function (_super) {
        __extends(ParticleMaterial, _super);
        function ParticleMaterial() {
            _super.call(this);
            this.shaderName = "particle";
            this.renderMode = feng3d.RenderMode.POINTS;
        }
        return ParticleMaterial;
    }(feng3d.Material));
    feng3d.ParticleMaterial = ParticleMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子材质（为了使用独立的着色器，暂时设置粒子材质）
     * @author feng 2017-01-09
     */
    var SkeletonAnimatorMaterial = (function (_super) {
        __extends(SkeletonAnimatorMaterial, _super);
        function SkeletonAnimatorMaterial() {
            _super.call(this);
            this.shaderName = "skeleton";
        }
        /**
         * 更新渲染数据
         */
        SkeletonAnimatorMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.s_texture] = this.texture;
        };
        return SkeletonAnimatorMaterial;
    }(feng3d.Material));
    feng3d.SkeletonAnimatorMaterial = SkeletonAnimatorMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 灯光类型
     * @author feng 2016-12-12
     */
    (function (LightType) {
        /**
         * 点光
         */
        LightType[LightType["Point"] = 0] = "Point";
        /**
         * 方向光
         */
        LightType[LightType["Directional"] = 1] = "Directional";
        /**
         * 聚光灯
         */
        LightType[LightType["Spot"] = 2] = "Spot";
    })(feng3d.LightType || (feng3d.LightType = {}));
    var LightType = feng3d.LightType;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 灯光
     * @author feng 2016-12-12
     */
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.apply(this, arguments);
            /**
             * 颜色
             */
            this.color = new feng3d.Color();
            /**
             * 光照强度
             */
            this.intensity = 1;
        }
        Object.defineProperty(Light.prototype, "position", {
            /**
             * 灯光位置
             */
            get: function () {
                return this.parentComponent.transform.globalPosition;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理被添加组件事件
         */
        Light.prototype.onBeAddedComponent = function (event) {
            this.parentComponent.addEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            this.parentComponent.addEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
            if (this.parentComponent.scene) {
                this.parentComponent.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_LIGHT_TO_SCENE, { light: this }));
            }
        };
        /**
         * 处理被移除组件事件
         */
        Light.prototype.onBeRemovedComponent = function (event) {
            this.parentComponent.removeEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            this.parentComponent.removeEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
            if (this.parentComponent.scene) {
                this.parentComponent.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_LIGHT_FROM_SCENE, { light: this }));
            }
        };
        /**
         * 处理添加到场景事件
         */
        Light.prototype.onAddedToScene = function (event) {
            event.data.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.ADDED_LIGHT_TO_SCENE, { light: this }));
        };
        /**
         * 处理从场景移除事件
         */
        Light.prototype.onRemovedFromScene = function (event) {
            event.data.scene.dispatchEvent(new feng3d.Scene3DEvent(feng3d.Scene3DEvent.REMOVED_LIGHT_FROM_SCENE, { light: this }));
        };
        return Light;
    }(feng3d.Object3DComponent));
    feng3d.Light = Light;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 方向光源
     * @author feng 2016-12-13
     */
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        /**
         * 构建
         */
        function DirectionalLight() {
            _super.call(this);
            this.lightType = feng3d.LightType.Directional;
        }
        return DirectionalLight;
    }(feng3d.Light));
    feng3d.DirectionalLight = DirectionalLight;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 点光源
     * @author feng 2016-12-13
     */
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        /**
         * 构建
         */
        function PointLight() {
            _super.call(this);
            /**
             * 最小半径
             */
            this.radius = 0;
            /**
             * 可照射最大距离
             */
            this.fallOff = 0;
            this.lightType = feng3d.LightType.Point;
        }
        return PointLight;
    }(feng3d.Light));
    feng3d.PointLight = PointLight;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var ControllerBase = (function () {
        /**
         * 控制器基类，用于动态调整3D对象的属性
         */
        function ControllerBase(target) {
            this.target = target;
        }
        /**
         * 手动应用更新到目标3D对象
         */
        ControllerBase.prototype.update = function (interpolate) {
            if (interpolate === void 0) { interpolate = true; }
            throw new Error("Abstract method");
        };
        Object.defineProperty(ControllerBase.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (val) {
                this._target = val;
            },
            enumerable: true,
            configurable: true
        });
        return ControllerBase;
    }());
    feng3d.ControllerBase = ControllerBase;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var LookAtController = (function (_super) {
        __extends(LookAtController, _super);
        function LookAtController(target, lookAtObject) {
            if (target === void 0) { target = null; }
            if (lookAtObject === void 0) { lookAtObject = null; }
            _super.call(this, target);
            this._origin = new feng3d.Vector3D(0.0, 0.0, 0.0);
            this._upAxis = feng3d.Vector3D.Y_AXIS;
            this._pos = new feng3d.Vector3D();
            if (lookAtObject)
                this.lookAtObject = lookAtObject;
            else
                this.lookAtPosition = new feng3d.Vector3D();
        }
        Object.defineProperty(LookAtController.prototype, "upAxis", {
            get: function () {
                return this._upAxis;
            },
            set: function (upAxis) {
                this._upAxis = upAxis;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LookAtController.prototype, "lookAtPosition", {
            get: function () {
                return this._lookAtPosition;
            },
            set: function (val) {
                this._lookAtPosition = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LookAtController.prototype, "lookAtObject", {
            get: function () {
                return this._lookAtObject;
            },
            set: function (value) {
                if (this._lookAtObject == value)
                    return;
                this._lookAtObject = value;
            },
            enumerable: true,
            configurable: true
        });
        LookAtController.prototype.update = function (interpolate) {
            if (interpolate === void 0) { interpolate = true; }
            if (this._target) {
                if (this._lookAtPosition) {
                    this._target.lookAt(this.lookAtPosition, this._upAxis);
                }
                else if (this._lookAtObject) {
                    this._pos.copyFrom(this._lookAtObject.position);
                    this._target.lookAt(this._pos, this._upAxis);
                }
            }
        };
        return LookAtController;
    }(feng3d.ControllerBase));
    feng3d.LookAtController = LookAtController;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * FPS模式控制器
     * @author feng 2016-12-19
     */
    var FPSController = (function (_super) {
        __extends(FPSController, _super);
        function FPSController(transform) {
            if (transform === void 0) { transform = null; }
            _super.call(this, transform);
            /**
             * 按键记录
             */
            this.keyDownDic = {};
            /**
             * 按键方向字典
             */
            this.keyDirectionDic = {};
            /**
             * 加速度
             */
            this.acceleration = 0.2;
            this.init();
        }
        Object.defineProperty(FPSController.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                if (this._target != null) {
                    feng3d.input.removeEventListener(feng3d.inputType.KEY_DOWN, this.onKeydown, this);
                    feng3d.input.removeEventListener(feng3d.inputType.KEY_UP, this.onKeyup, this);
                    feng3d.input.removeEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
                }
                this._target = value;
                if (this._target != null) {
                    feng3d.input.addEventListener(feng3d.inputType.KEY_DOWN, this.onKeydown, this);
                    feng3d.input.addEventListener(feng3d.inputType.KEY_UP, this.onKeyup, this);
                    feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
                    this.preMousePoint = null;
                    this.velocity = new feng3d.Vector3D();
                    this.keyDownDic = {};
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化
         */
        FPSController.prototype.init = function () {
            this.keyDirectionDic["a"] = new feng3d.Vector3D(-1, 0, 0); //左
            this.keyDirectionDic["d"] = new feng3d.Vector3D(1, 0, 0); //右
            this.keyDirectionDic["w"] = new feng3d.Vector3D(0, 0, 1); //前
            this.keyDirectionDic["s"] = new feng3d.Vector3D(0, 0, -1); //后
            this.keyDirectionDic["e"] = new feng3d.Vector3D(0, 1, 0); //上
            this.keyDirectionDic["q"] = new feng3d.Vector3D(0, -1, 0); //下
        };
        /**
         * 手动应用更新到目标3D对象
         */
        FPSController.prototype.update = function (interpolate) {
            if (interpolate === void 0) { interpolate = true; }
            if (this.target == null)
                return;
            //计算加速度
            var accelerationVec = new feng3d.Vector3D();
            for (var key in this.keyDirectionDic) {
                if (this.keyDownDic[key] == true) {
                    var element = this.keyDirectionDic[key];
                    accelerationVec.incrementBy(element);
                }
            }
            accelerationVec.scaleBy(this.acceleration);
            //计算速度
            this.velocity.incrementBy(accelerationVec);
            var right = this.target.matrix3d.right;
            var up = this.target.matrix3d.up;
            var forward = this.target.matrix3d.forward;
            right.scaleBy(this.velocity.x);
            up.scaleBy(this.velocity.y);
            forward.scaleBy(this.velocity.z);
            //计算位移
            var displacement = right.clone();
            displacement.incrementBy(up);
            displacement.incrementBy(forward);
            this.target.position.x += displacement.x;
            this.target.position.y += displacement.y;
            this.target.position.z += displacement.z;
        };
        /**
         * 处理鼠标移动事件
         */
        FPSController.prototype.onMouseMove = function (event) {
            if (this.target == null)
                return;
            var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
            if (this.preMousePoint == null) {
                this.preMousePoint = mousePoint;
                return;
            }
            //计算旋转
            var offsetPoint = mousePoint.subtract(this.preMousePoint);
            offsetPoint.x *= 0.15;
            offsetPoint.y *= 0.15;
            var matrix3d = this.target.matrix3d;
            var right = matrix3d.right;
            var position = matrix3d.position;
            matrix3d.appendRotation(offsetPoint.y, right, position);
            matrix3d.appendRotation(offsetPoint.x, feng3d.Vector3D.Y_AXIS, position);
            this.target.matrix3d = matrix3d;
            //
            this.preMousePoint = mousePoint;
        };
        /**
         * 键盘按下事件
         */
        FPSController.prototype.onKeydown = function (event) {
            var boardKey = String.fromCharCode(event.keyCode).toLocaleLowerCase();
            if (this.keyDirectionDic[boardKey] == null)
                return;
            if (!this.keyDownDic[boardKey])
                this.stopDirectionVelocity(this.keyDirectionDic[boardKey]);
            this.keyDownDic[boardKey] = true;
        };
        /**
         * 键盘弹起事件
         */
        FPSController.prototype.onKeyup = function (event) {
            var boardKey = String.fromCharCode(event.keyCode).toLocaleLowerCase();
            if (this.keyDirectionDic[boardKey] == null)
                return;
            this.keyDownDic[boardKey] = false;
            this.stopDirectionVelocity(this.keyDirectionDic[boardKey]);
        };
        /**
         * 停止xyz方向运动
         * @param direction     停止运动的方向
         */
        FPSController.prototype.stopDirectionVelocity = function (direction) {
            if (direction == null)
                return;
            if (direction.x != 0) {
                this.velocity.x = 0;
            }
            if (direction.y != 0) {
                this.velocity.y = 0;
            }
            if (direction.z != 0) {
                this.velocity.z = 0;
            }
        };
        return FPSController;
    }(feng3d.ControllerBase));
    feng3d.FPSController = FPSController;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 地形几何体
     * @author feng 2016-04-28
     */
    var TerrainGeometry = (function (_super) {
        __extends(TerrainGeometry, _super);
        /**
         * 创建高度地形 拥有segmentsW*segmentsH个顶点
         * @param    heightMap	高度图
         * @param    width	地形宽度
         * @param    height	地形高度
         * @param    depth	地形深度
         * @param    segmentsW	x轴上网格段数
         * @param    segmentsH	y轴上网格段数
         * @param    maxElevation	最大地形高度
         * @param    minElevation	最小地形高度
         */
        function TerrainGeometry(heightMap, width, height, depth, segmentsW, segmentsH, maxElevation, minElevation) {
            if (width === void 0) { width = 1000; }
            if (height === void 0) { height = 100; }
            if (depth === void 0) { depth = 1000; }
            if (segmentsW === void 0) { segmentsW = 30; }
            if (segmentsH === void 0) { segmentsH = 30; }
            if (maxElevation === void 0) { maxElevation = 255; }
            if (minElevation === void 0) { minElevation = 0; }
            _super.call(this);
            this.heightMap = heightMap;
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.segmentsW = segmentsW;
            this.segmentsH = segmentsH;
            this.maxElevation = maxElevation;
            this.minElevation = minElevation;
            feng3d.Watcher.watch(this, ["heightMap"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["width"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["height"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["depth"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["segmentsW"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["segmentsH"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["maxElevation"], this.buildGeometry, this);
            feng3d.Watcher.watch(this, ["minElevation"], this.buildGeometry, this);
        }
        /**
         * 创建顶点坐标
         */
        TerrainGeometry.prototype.buildGeometry = function () {
            var x, z;
            var numInds = 0;
            var base = 0;
            //一排顶点数据
            var tw = this.segmentsW + 1;
            //总顶点数量
            var numVerts = (this.segmentsH + 1) * tw;
            //一个格子所占高度图X轴像素数
            var uDiv = (this.heightMap.width - 1) / this.segmentsW;
            //一个格子所占高度图Y轴像素数
            var vDiv = (this.heightMap.height - 1) / this.segmentsH;
            var u, v;
            var y;
            var vertices = new Float32Array(numVerts * 3);
            var indices = new Uint16Array(this.segmentsH * this.segmentsW * 6);
            numVerts = 0;
            var col;
            for (var zi = 0; zi <= this.segmentsH; ++zi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    //顶点坐标
                    x = (xi / this.segmentsW - .5) * this.width;
                    z = (zi / this.segmentsH - .5) * this.depth;
                    //格子对应高度图uv坐标
                    u = xi * uDiv;
                    v = (this.segmentsH - zi) * vDiv;
                    //获取颜色值
                    col = this.getPixel(this.heightMap, u, v) & 0xff;
                    //计算高度值
                    y = (col > this.maxElevation) ? (this.maxElevation / 0xff) * this.height : ((col < this.minElevation) ? (this.minElevation / 0xff) * this.height : (col / 0xff) * this.height);
                    //保存顶点坐标
                    vertices[numVerts++] = x;
                    vertices[numVerts++] = y;
                    vertices[numVerts++] = z;
                    if (xi != this.segmentsW && zi != this.segmentsH) {
                        //增加 一个顶点同时 生成一个格子或两个三角形
                        base = xi + zi * tw;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base + 1;
                    }
                }
            }
            this.setVAData(feng3d.GLAttribute.a_position, vertices, 3);
            this.buildUVs();
            this.setIndices(indices);
        };
        /**
         * 创建uv坐标
         */
        TerrainGeometry.prototype.buildUVs = function () {
            var numUvs = (this.segmentsH + 1) * (this.segmentsW + 1) * 2;
            var uvs = new Float32Array(numUvs);
            numUvs = 0;
            //计算每个顶点的uv坐标
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    uvs[numUvs++] = xi / this.segmentsW;
                    uvs[numUvs++] = 1 - yi / this.segmentsH;
                }
            }
            this.setVAData(feng3d.GLAttribute.a_uv, uvs, 2);
        };
        /**
         * 获取位置在（x，z）处的高度y值
         * @param x x坐标
         * @param z z坐标
         * @return 高度
         */
        TerrainGeometry.prototype.getHeightAt = function (x, z) {
            //得到高度图中的值
            var u = (x / this.width + .5) * (this.heightMap.width - 1);
            var v = (-z / this.depth + .5) * (this.heightMap.height - 1);
            var col = this.getPixel(this.heightMap, u, v) & 0xff;
            var h;
            if (col > this.maxElevation) {
                h = (this.maxElevation / 0xff) * this.height;
            }
            else if (col < this.minElevation) {
                h = (this.minElevation / 0xff) * this.height;
            }
            else {
                h = (col / 0xff) * this.height;
            }
            return h;
        };
        /**
         * 获取像素值
         */
        TerrainGeometry.prototype.getPixel = function (imageData, u, v) {
            //取整
            u = ~~u;
            v = ~~v;
            var index = (v * imageData.width + u) * 4;
            var data = imageData.data;
            var red = data[index]; //红色色深
            var green = data[index + 1]; //绿色色深
            var blue = data[index + 2]; //蓝色色深
            var alpha = data[index + 3]; //透明度
            return blue;
        };
        return TerrainGeometry;
    }(feng3d.Geometry));
    feng3d.TerrainGeometry = TerrainGeometry;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 地形材质
     * @author feng 2016-04-28
     */
    var TerrainMaterial = (function (_super) {
        __extends(TerrainMaterial, _super);
        /**
         * 构建材质
         */
        function TerrainMaterial() {
            _super.call(this);
            this.shaderName = "terrain";
        }
        /**
         * 更新渲染数据
         */
        TerrainMaterial.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.uniforms[feng3d.RenderDataID.s_texture] = this.diffuseTexture;
            this._renderData.uniforms[feng3d.RenderDataID.s_blendTexture] = this.blendTexture;
            this._renderData.uniforms[feng3d.RenderDataID.s_splatTexture1] = this.splatTexture1;
            this._renderData.uniforms[feng3d.RenderDataID.s_splatTexture2] = this.splatTexture2;
            this._renderData.uniforms[feng3d.RenderDataID.s_splatTexture3] = this.splatTexture3;
            this._renderData.uniforms[feng3d.RenderDataID.u_splatRepeats] = this.splatRepeats;
        };
        return TerrainMaterial;
    }(feng3d.Material));
    feng3d.TerrainMaterial = TerrainMaterial;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画状态基类
     * @author feng 2015-9-18
     */
    var AnimationStateBase = (function () {
        /**
         * 创建动画状态基类
         * @param animator				动画
         * @param animationNode			动画节点
         */
        function AnimationStateBase(animator, animationNode) {
            this._rootDelta = new feng3d.Vector3D();
            this._positionDeltaDirty = true;
            this._time = 0;
            this._startTime = 0;
            this._animator = animator;
            this._animationNode = animationNode;
        }
        Object.defineProperty(AnimationStateBase.prototype, "positionDelta", {
            /**
             * @inheritDoc
             */
            get: function () {
                if (this._positionDeltaDirty)
                    this.updatePositionDelta();
                return this._rootDelta;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         */
        AnimationStateBase.prototype.offset = function (startTime) {
            this._startTime = startTime;
            this._positionDeltaDirty = true;
        };
        /**
         * @inheritDoc
         */
        AnimationStateBase.prototype.update = function (time) {
            if (this._time == time - this._startTime)
                return;
            this.updateTime(time);
        };
        /**
         * @inheritDoc
         */
        AnimationStateBase.prototype.phase = function (value) {
        };
        /**
         * 更新时间
         * @param time		当前时间
         */
        AnimationStateBase.prototype.updateTime = function (time) {
            this._time = time - this._startTime;
            this._positionDeltaDirty = true;
        };
        /**
         * 位置偏移
         */
        AnimationStateBase.prototype.updatePositionDelta = function () {
        };
        return AnimationStateBase;
    }());
    feng3d.AnimationStateBase = AnimationStateBase;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画剪辑状态
     * @author feng 2015-9-18
     */
    var AnimationClipState = (function (_super) {
        __extends(AnimationClipState, _super);
        /**
         * 创建一个帧动画状态
         * @param animator				动画
         * @param animationClipNode		帧动画节点
         */
        function AnimationClipState(animator, animationClipNode) {
            _super.call(this, animator, animationClipNode);
            this._currentFrame = 0;
            this._framesDirty = true;
            this._animationClipNode = animationClipNode;
        }
        Object.defineProperty(AnimationClipState.prototype, "blendWeight", {
            /**
             * 混合权重	(0[当前帧],1[下一帧])
             * @see #currentFrame
             * @see #nextFrame
             */
            get: function () {
                if (this._framesDirty)
                    this.updateFrames();
                return this._blendWeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipState.prototype, "currentFrame", {
            /**
             * 当前帧
             */
            get: function () {
                if (this._framesDirty)
                    this.updateFrames();
                return this._currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipState.prototype, "nextFrame", {
            /**
             * 下一帧
             */
            get: function () {
                if (this._framesDirty)
                    this.updateFrames();
                return this._nextFrame;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         */
        AnimationClipState.prototype.update = function (time) {
            if (!this._animationClipNode.looping) {
                if (time > this._startTime + this._animationClipNode.totalDuration)
                    time = this._startTime + this._animationClipNode.totalDuration;
                else if (time < this._startTime)
                    time = this._startTime;
            }
            if (this._time == time - this._startTime)
                return;
            this.updateTime(time);
        };
        /**
         * @inheritDoc
         */
        AnimationClipState.prototype.phase = function (value) {
            var time = value * this._animationClipNode.totalDuration + this._startTime;
            if (this._time == time - this._startTime)
                return;
            this.updateTime(time);
        };
        /**
         * @inheritDoc
         */
        AnimationClipState.prototype.updateTime = function (time) {
            this._framesDirty = true;
            this._timeDir = (time - this._startTime > this._time) ? 1 : -1;
            _super.prototype.updateTime.call(this, time);
        };
        /**
         * 更新帧，计算当前帧、下一帧与混合权重
         *
         * @see #currentFrame
         * @see #nextFrame
         * @see #blendWeight
         */
        AnimationClipState.prototype.updateFrames = function () {
            this._framesDirty = false;
            var looping = this._animationClipNode.looping;
            var totalDuration = this._animationClipNode.totalDuration;
            var lastFrame = this._animationClipNode.lastFrame;
            var time = this._time;
            //trace("time", time, totalDuration)
            if (looping && (time >= totalDuration || time < 0)) {
                time %= totalDuration;
                if (time < 0)
                    time += totalDuration;
            }
            if (!looping && time >= totalDuration) {
                this.notifyPlaybackComplete();
                this._currentFrame = lastFrame;
                this._nextFrame = lastFrame;
                this._blendWeight = 0;
            }
            else if (!looping && time <= 0) {
                this._currentFrame = 0;
                this._nextFrame = 0;
                this._blendWeight = 0;
            }
            else if (this._animationClipNode.fixedFrameRate) {
                var t = time / totalDuration * lastFrame;
                this._currentFrame = ~~t;
                this._blendWeight = t - this._currentFrame;
                this._nextFrame = this._currentFrame + 1;
            }
            else {
                this._currentFrame = 0;
                this._nextFrame = 0;
                var dur = 0, frameTime;
                var durations = this._animationClipNode.durations;
                do {
                    frameTime = dur;
                    dur += durations[this.nextFrame];
                    this._currentFrame = this._nextFrame++;
                } while (time > dur);
                if (this._currentFrame == lastFrame) {
                    this._currentFrame = 0;
                    this._nextFrame = 1;
                }
                this._blendWeight = (time - frameTime) / durations[this._currentFrame];
            }
        };
        /**
         * 通知播放完成
         */
        AnimationClipState.prototype.notifyPlaybackComplete = function () {
            this._animationClipNode.dispatchEvent(new feng3d.AnimationStateEvent(feng3d.AnimationStateEvent.PLAYBACK_COMPLETE, this._animator, this, this._animationClipNode));
        };
        return AnimationClipState;
    }(feng3d.AnimationStateBase));
    feng3d.AnimationClipState = AnimationClipState;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子动画
     * @author feng 2017-01-09
     */
    var ParticleAnimator = (function (_super) {
        __extends(ParticleAnimator, _super);
        function ParticleAnimator() {
            _super.call(this);
            /**
             * 粒子时间
             */
            this.time = 0;
            /**
             * 起始时间
             */
            this.startTime = 0;
            /**
             * 播放速度
             */
            this.playbackSpeed = 1;
            /**
             * 粒子数量
             */
            this.numParticles = 1000;
            /**
             * 周期
             */
            this.cycle = 10000;
            this._isDirty = true;
            /**
             * 生成粒子函数列表，优先级越高先执行
             */
            this.generateFunctions = [];
            /**
             * 粒子全局属性，作用于所有粒子元素
             */
            this.particleGlobal = {};
            this._single = true;
            this.addComponent(new ParticleRenderDataHolder());
        }
        /**
         * 生成粒子
         */
        ParticleAnimator.prototype.generateParticles = function () {
            var generateFunctions = this.generateFunctions.concat();
            var components = this.getComponentsByType(feng3d.ParticleComponent);
            components.forEach(function (element) {
                generateFunctions.push({ generate: element.generateParticle.bind(element), priority: element.priority });
            });
            //按优先级排序，优先级越高先执行
            generateFunctions.sort(function (a, b) { return b.priority - a.priority; });
            //
            var autoRenderDataHolder = this.getComponentByType(ParticleRenderDataHolder);
            for (var i = 0; i < this.numParticles; i++) {
                var particle = {};
                particle.index = i;
                particle.total = this.numParticles;
                generateFunctions.forEach(function (element) {
                    element.generate(particle);
                });
                autoRenderDataHolder.collectionParticle(particle);
            }
        };
        /**
         * 更新渲染数据
         */
        ParticleAnimator.prototype.updateRenderData = function (renderContext) {
            if (this._isDirty) {
                this.startTime = feng3d.getTimer();
                this.generateParticles();
                this._isDirty = false;
            }
            this.time = ((feng3d.getTimer() - this.startTime) / 1000) % this.cycle;
            this._renderData.uniforms[feng3d.RenderDataID.u_particleTime] = this.time;
            this._renderData.instanceCount = this.numParticles;
            var autoRenderDataHolder = this.getComponentByType(ParticleRenderDataHolder);
            autoRenderDataHolder.update(this.particleGlobal);
            _super.prototype.updateRenderData.call(this, renderContext);
        };
        return ParticleAnimator;
    }(feng3d.Object3DComponent));
    feng3d.ParticleAnimator = ParticleAnimator;
    var ParticleRenderDataHolder = (function (_super) {
        __extends(ParticleRenderDataHolder, _super);
        function ParticleRenderDataHolder() {
            _super.apply(this, arguments);
        }
        /**
         * 收集粒子数据
         * @param particle      粒子
         */
        ParticleRenderDataHolder.prototype.collectionParticle = function (particle) {
            for (var attribute in particle) {
                this.collectionParticleAttribute(attribute, particle);
            }
        };
        ParticleRenderDataHolder.prototype.update = function (particleGlobal) {
            this._renderData.uniforms = {};
            //更新常量数据
            for (var uniform in particleGlobal) {
                this._renderData.uniforms["u_particle_" + uniform] = particleGlobal[uniform];
            }
            //更新宏定义
            var boolMacros = this._renderData.shaderMacro.boolMacros = {};
            for (var attribute in this._renderData.attributes) {
                boolMacros["D_" + attribute] = true;
            }
            for (var uniform in particleGlobal) {
                boolMacros["D_u_particle_" + uniform] = true;
            }
        };
        /**
         * 收集粒子属性数据
         * @param attributeID       属性编号
         * @param index             粒子编号
         * @param data              属性数据
         */
        ParticleRenderDataHolder.prototype.collectionParticleAttribute = function (attribute, particle) {
            var attributeID = "a_particle_" + attribute;
            var data = particle[attribute];
            var index = particle.index;
            var numParticles = particle.total;
            //
            var attributes = this._renderData.attributes;
            var attributeRenderData = attributes[attributeID];
            var vector3DData;
            if (typeof data == "number") {
                if (!attributeRenderData) {
                    attributeRenderData = attributes[attributeID] = new feng3d.AttributeRenderData(new Float32Array(numParticles), 1, 1);
                }
                vector3DData = attributeRenderData.data;
                vector3DData[index] = data;
            }
            else if (data instanceof feng3d.Vector3D) {
                if (!attributeRenderData) {
                    attributeRenderData = attributes[attributeID] = new feng3d.AttributeRenderData(new Float32Array(numParticles * 3), 3, 1);
                }
                vector3DData = attributeRenderData.data;
                vector3DData[index * 3] = data.x;
                vector3DData[index * 3 + 1] = data.y;
                vector3DData[index * 3 + 2] = data.z;
            }
            else if (data instanceof feng3d.Color) {
                if (!attributeRenderData) {
                    attributeRenderData = attributes[attributeID] = new feng3d.AttributeRenderData(new Float32Array(numParticles * 4), 4, 1);
                }
                vector3DData = attributeRenderData.data;
                vector3DData[index * 4] = data.r;
                vector3DData[index * 4 + 1] = data.g;
                vector3DData[index * 4 + 2] = data.b;
                vector3DData[index * 4 + 3] = data.a;
            }
            else {
                throw new Error("\u65E0\u6CD5\u5904\u7406" + feng3d.ClassUtils.getQualifiedClassName(data) + "\u7C92\u5B50\u5C5E\u6027");
            }
        };
        return ParticleRenderDataHolder;
    }(feng3d.RenderDataHolder));
    feng3d.ParticleRenderDataHolder = ParticleRenderDataHolder;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子动画组件
     * @author feng 2017-01-09
     */
    var ParticleComponent = (function (_super) {
        __extends(ParticleComponent, _super);
        function ParticleComponent() {
            _super.apply(this, arguments);
            /**
             * 优先级
             */
            this.priority = 0;
        }
        /**
         * 创建粒子属性
         * @param particle                  粒子
         */
        ParticleComponent.prototype.generateParticle = function (particle) {
        };
        return ParticleComponent;
    }(feng3d.RenderDataHolder));
    feng3d.ParticleComponent = ParticleComponent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子发射器
     * @author feng 2017-01-09
     */
    var ParticleEmission = (function (_super) {
        __extends(ParticleEmission, _super);
        function ParticleEmission() {
            _super.call(this);
            /**
             * 发射率，每秒发射粒子数量
             */
            this.rate = 10;
            /**
             * 爆发，在time时刻额外喷射particles粒子
             */
            this.bursts = [];
            this.isDirty = true;
            this.priority = Number.MAX_VALUE;
        }
        /**
         * 创建粒子属性
         * @param particle                  粒子
         */
        ParticleEmission.prototype.generateParticle = function (particle) {
            if (this._numParticles != particle.total)
                this.isDirty = true;
            this._numParticles = particle.total;
            particle.birthTime = this.getBirthTimeArray(particle.total)[particle.index];
        };
        /**
         * 获取出生时间数组
         */
        ParticleEmission.prototype.getBirthTimeArray = function (numParticles) {
            if (this.isDirty) {
                this.isDirty = false;
                var birthTimes = [];
                var bursts = this.bursts.concat();
                //按时间降序排列
                bursts.sort(function (a, b) { return b.time - a.time; });
                var index = 0;
                var time = 0; //以秒为单位
                var i = 0;
                var timeStep = 1 / this.rate;
                while (index < numParticles) {
                    while (bursts.length > 0 && bursts[bursts.length - 1].time <= time) {
                        var burst = bursts.pop();
                        for (i = 0; i < burst.particles; i++) {
                            birthTimes[index++] = burst.time;
                        }
                    }
                    birthTimes[index++] = time;
                    time += timeStep;
                }
                this._birthTimes = birthTimes;
            }
            return this._birthTimes;
        };
        return ParticleEmission;
    }(feng3d.ParticleComponent));
    feng3d.ParticleEmission = ParticleEmission;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子速度组件
     * @author feng 2017-01-09
     */
    var ParticlePosition = (function (_super) {
        __extends(ParticlePosition, _super);
        function ParticlePosition() {
            _super.apply(this, arguments);
        }
        /**
         * 创建粒子属性
         * @param particle                  粒子
         */
        ParticlePosition.prototype.generateParticle = function (particle) {
            var baseRange = 100;
            var x = (Math.random() - 0.5) * baseRange;
            var y = (Math.random() - 0.5) * baseRange;
            var z = (Math.random() - 0.5) * baseRange;
            particle.position = new feng3d.Vector3D(x, y, z);
            particle.position = new feng3d.Vector3D();
        };
        return ParticlePosition;
    }(feng3d.ParticleComponent));
    feng3d.ParticlePosition = ParticlePosition;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子速度组件
     * @author feng 2017-01-09
     */
    var ParticleVelocity = (function (_super) {
        __extends(ParticleVelocity, _super);
        function ParticleVelocity() {
            _super.apply(this, arguments);
        }
        /**
         * 创建粒子属性
         * @param particle                  粒子
         */
        ParticleVelocity.prototype.generateParticle = function (particle) {
            var baseVelocity = 100;
            var x = (Math.random() - 0.5) * baseVelocity;
            var y = baseVelocity;
            var z = (Math.random() - 0.5) * baseVelocity;
            particle.velocity = new feng3d.Vector3D(x, y, z);
        };
        return ParticleVelocity;
    }(feng3d.ParticleComponent));
    feng3d.ParticleVelocity = ParticleVelocity;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 粒子颜色组件
     * @author feng 2017-03-14
     */
    var ParticleColor = (function (_super) {
        __extends(ParticleColor, _super);
        function ParticleColor() {
            _super.apply(this, arguments);
        }
        /**
         * 创建粒子属性
         * @param particle                  粒子
         */
        ParticleColor.prototype.generateParticle = function (particle) {
            particle.color = new feng3d.Color(1, 0, 0, 1).mix(new feng3d.Color(0, 1, 0, 1), particle.index / particle.total);
        };
        return ParticleColor;
    }(feng3d.ParticleComponent));
    feng3d.ParticleColor = ParticleColor;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Dispatched to notify changes in an animation state's state.
     */
    var AnimationStateEvent = (function (_super) {
        __extends(AnimationStateEvent, _super);
        /**
         * Create a new <code>AnimatonStateEvent</code>
         *
         * @param type The event type.
         * @param animator The animation state object that is the subject of this event.
         * @param animationNode The animation node inside the animation state from which the event originated.
         */
        function AnimationStateEvent(type, animator, animationState, animationNode) {
            _super.call(this, type, false, false);
            this._animator = animator;
            this._animationState = animationState;
            this._animationNode = animationNode;
        }
        Object.defineProperty(AnimationStateEvent.prototype, "animator", {
            /**
             * The animator object that is the subject of this event.
             */
            get: function () {
                return this._animator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationStateEvent.prototype, "animationState", {
            /**
             * The animation state object that is the subject of this event.
             */
            get: function () {
                return this._animationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationStateEvent.prototype, "animationNode", {
            /**
             * The animation node inside the animation state from which the event originated.
             */
            get: function () {
                return this._animationNode;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Clones the event.
         *
         * @return An exact duplicate of the current object.
         */
        AnimationStateEvent.prototype.clone = function () {
            return new AnimationStateEvent(this.type, this._animator, this._animationState, this._animationNode);
        };
        /**
         * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
         */
        AnimationStateEvent.PLAYBACK_COMPLETE = "playbackComplete";
        AnimationStateEvent.TRANSITION_COMPLETE = "transitionComplete";
        return AnimationStateEvent;
    }(feng3d.Event));
    feng3d.AnimationStateEvent = AnimationStateEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画事件
     * @author feng 2014-5-27
     */
    var AnimatorEvent = (function (_super) {
        __extends(AnimatorEvent, _super);
        /**
         * 创建一个动画时间
         * @param type			事件类型
         * @param data			事件数据
         * @param bubbles		是否冒泡
         */
        function AnimatorEvent(type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            _super.call(this, type, data, bubbles);
        }
        /** 开始播放动画 */
        AnimatorEvent.START = "start";
        /** 继续播放动画 */
        AnimatorEvent.PLAY = "play";
        /** 停止播放动画 */
        AnimatorEvent.STOP = "stop";
        return AnimatorEvent;
    }(feng3d.Event));
    feng3d.AnimatorEvent = AnimatorEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画节点基类
     * @author feng 2014-5-20
     */
    var AnimationNodeBase = (function (_super) {
        __extends(AnimationNodeBase, _super);
        /**
         * 创建一个动画节点基类
         */
        function AnimationNodeBase() {
            _super.call(this);
        }
        Object.defineProperty(AnimationNodeBase.prototype, "stateClass", {
            /**
             * 状态类
             */
            get: function () {
                return this._stateClass;
            },
            enumerable: true,
            configurable: true
        });
        return AnimationNodeBase;
    }(feng3d.Component));
    feng3d.AnimationNodeBase = AnimationNodeBase;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画基类
     * @author feng 2014-5-27
     */
    var AnimatorBase = (function (_super) {
        __extends(AnimatorBase, _super);
        /**
         * 创建一个动画基类
         */
        function AnimatorBase() {
            _super.call(this);
            this._autoUpdate = true;
            this._time = 0;
            /** 播放速度 */
            this._playbackSpeed = 1;
            /** 当前动画时间 */
            this._absoluteTime = 0;
            this._animationStates = {};
            /**
             * 是否更新位置
             */
            this.updatePosition = true;
        }
        /**
         * 获取动画状态
         * @param node		动画节点
         * @return			动画状态
         */
        AnimatorBase.prototype.getAnimationState = function (node) {
            var cls = node.stateClass;
            var className = feng3d.ClassUtils.getQualifiedClassName(cls);
            if (this._animationStates[className] == null)
                this._animationStates[className] = new cls(this, node);
            return this._animationStates[className];
        };
        Object.defineProperty(AnimatorBase.prototype, "time", {
            /**
             * 动画时间
             */
            get: function () {
                return this._time;
            },
            set: function (value) {
                if (this._time == value)
                    return;
                this.update(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimatorBase.prototype, "playbackSpeed", {
            /**
             * 播放速度
             * <p>默认为1，表示正常速度</p>
             */
            get: function () {
                return this._playbackSpeed;
            },
            set: function (value) {
                this._playbackSpeed = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 开始动画，当自动更新为true时有效
         */
        AnimatorBase.prototype.start = function () {
            if (this._isPlaying || !this._autoUpdate)
                return;
            this._time = this._absoluteTime = feng3d.getTimer();
            this._isPlaying = true;
            feng3d.ticker.addEventListener(feng3d.Event.ENTER_FRAME, this.onEnterFrame, this);
            if (!this.hasEventListener(feng3d.AnimatorEvent.START))
                return;
            this.dispatchEvent(new feng3d.AnimatorEvent(feng3d.AnimatorEvent.START, this));
        };
        /**
         * 暂停播放动画
         * @see #time
         * @see #update()
         */
        AnimatorBase.prototype.stop = function () {
            if (!this._isPlaying)
                return;
            this._isPlaying = false;
            if (feng3d.ticker.hasEventListener(feng3d.Event.ENTER_FRAME))
                feng3d.ticker.removeEventListener(feng3d.Event.ENTER_FRAME, this.onEnterFrame, this);
            if (!this.hasEventListener(feng3d.AnimatorEvent.STOP))
                return;
            this.dispatchEvent(new feng3d.AnimatorEvent(feng3d.AnimatorEvent.STOP, this));
        };
        /**
         * 更新动画
         * @param time			动画时间
         */
        AnimatorBase.prototype.update = function (time) {
            var dt = (time - this._time) * this.playbackSpeed;
            this.updateDeltaTime(dt);
            this._time = time;
        };
        /**
         * 更新偏移时间
         * @private
         */
        AnimatorBase.prototype.updateDeltaTime = function (dt) {
            this._absoluteTime += dt;
            this._activeState.update(this._absoluteTime);
            if (this.updatePosition)
                this.applyPositionDelta();
        };
        /**
         * 自动更新动画时帧更新事件
         */
        AnimatorBase.prototype.onEnterFrame = function (event) {
            if (event === void 0) { event = null; }
            this.update(feng3d.getTimer());
        };
        /**
         * 应用位置偏移量
         */
        AnimatorBase.prototype.applyPositionDelta = function () {
            var delta = this._activeState.positionDelta;
            var dist = delta.length;
            var len;
            if (dist > 0) {
            }
        };
        return AnimatorBase;
    }(feng3d.RenderDataHolder));
    feng3d.AnimatorBase = AnimatorBase;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画播放器
     * @author feng 2017-01-04
     */
    var AnimationPlayer = (function () {
        function AnimationPlayer() {
            this._time = 0;
            this.preTime = 0;
            this._isPlaying = false;
            /**
             * 播放速度
             */
            this.playbackSpeed = 1;
        }
        Object.defineProperty(AnimationPlayer.prototype, "time", {
            /**
             * 动画时间
             */
            get: function () {
                return this._time;
            },
            set: function (value) {
                this._time = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 开始
         */
        AnimationPlayer.prototype.start = function () {
            this.time = 0;
            this.continue();
        };
        /**
         * 停止
         */
        AnimationPlayer.prototype.stop = function () {
            this.pause();
        };
        /**
         * 继续
         */
        AnimationPlayer.prototype.continue = function () {
            this._isPlaying;
            this.preTime = feng3d.getTimer();
            feng3d.ticker.addEventListener(feng3d.Event.ENTER_FRAME, this.onEnterFrame, this);
        };
        /**
         * 暂停
         */
        AnimationPlayer.prototype.pause = function () {
            feng3d.ticker.removeEventListener(feng3d.Event.ENTER_FRAME, this.onEnterFrame, this);
        };
        /**
         * 自动更新动画时帧更新事件
         */
        AnimationPlayer.prototype.onEnterFrame = function (event) {
            var currentTime = feng3d.getTimer();
            this.time = this.time + (currentTime - this.preTime) * this.playbackSpeed;
            this.preTime = feng3d.getTimer();
        };
        return AnimationPlayer;
    }());
    feng3d.AnimationPlayer = AnimationPlayer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 帧动画播放器
     * @author feng 2017-01-04
     */
    var AnimationClipPlayer = (function (_super) {
        __extends(AnimationClipPlayer, _super);
        function AnimationClipPlayer() {
            _super.apply(this, arguments);
        }
        return AnimationClipPlayer;
    }(feng3d.AnimationPlayer));
    feng3d.AnimationClipPlayer = AnimationClipPlayer;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼关节数据
     * @author feng 2014-5-20
     */
    var SkeletonJoint = (function () {
        function SkeletonJoint() {
            /** 父关节索引 （-1说明本身是总父节点，这个序号其实就是行号了，譬如上面”origin“节点的序号就是0，无父节点； "body"节点序号是1，父节点序号是0，也就是说父节点是”origin“）*/
            this.parentIndex = -1;
        }
        Object.defineProperty(SkeletonJoint.prototype, "matrix3D", {
            get: function () {
                if (!this._matrix3D) {
                    this._matrix3D = this.orientation.toMatrix3D();
                    this._matrix3D.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
                }
                return this._matrix3D;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonJoint.prototype, "invertMatrix3D", {
            get: function () {
                if (!this._invertMatrix3D) {
                    this._invertMatrix3D = this.matrix3D.clone();
                    this._invertMatrix3D.invert();
                }
                return this._invertMatrix3D;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonJoint.prototype, "inverseBindPose", {
            get: function () {
                return this.invertMatrix3D.rawData;
            },
            enumerable: true,
            configurable: true
        });
        SkeletonJoint.prototype.invalid = function () {
            this._matrix3D = null;
            this._invertMatrix3D = null;
        };
        return SkeletonJoint;
    }());
    feng3d.SkeletonJoint = SkeletonJoint;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼数据
     * @author feng 2014-5-20
     */
    var Skeleton = (function (_super) {
        __extends(Skeleton, _super);
        function Skeleton() {
            _super.call(this);
            this.joints = [];
        }
        Object.defineProperty(Skeleton.prototype, "numJoints", {
            get: function () {
                return this.joints.length;
            },
            enumerable: true,
            configurable: true
        });
        return Skeleton;
    }(feng3d.Component));
    feng3d.Skeleton = Skeleton;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼动画
     * @author feng 2014-5-27
     */
    var SkeletonAnimator = (function (_super) {
        __extends(SkeletonAnimator, _super);
        /**
         * 创建一个骨骼动画类
         */
        function SkeletonAnimator(skeleton) {
            _super.call(this);
            /** 动画节点列表 */
            this.animations = [];
            this._globalMatrices = [];
            this._globalPropertiesDirty = true;
            this.skeleton = skeleton;
        }
        Object.defineProperty(SkeletonAnimator.prototype, "globalMatrices", {
            /**
             * 当前骨骼姿势的全局矩阵
             * @see #globalPose
             */
            get: function () {
                if (this._globalPropertiesDirty)
                    this.updateGlobalProperties();
                return this._globalMatrices;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 播放动画
         * @param name 动作名称
         */
        SkeletonAnimator.prototype.play = function () {
            if (!this._activeNode)
                this._activeNode = this.animations[0];
            this._activeState = this.getAnimationState(this._activeNode);
            if (this.updatePosition) {
                //this.update straight away to this.reset position deltas
                this._activeState.update(this._absoluteTime);
                this._activeState.positionDelta;
            }
            this._activeSkeletonState = this._activeState;
            this.start();
        };
        /**
         * 更新渲染数据
         */
        SkeletonAnimator.prototype.updateRenderData = function (renderContext) {
            _super.prototype.updateRenderData.call(this, renderContext);
            this._renderData.shaderMacro.valueMacros.NUM_SKELETONJOINT = this.skeleton.numJoints;
            this._renderData.uniforms[feng3d.RenderDataID.u_skeletonGlobalMatriices] = this.globalMatrices;
        };
        /**
         * @inheritDoc
         */
        SkeletonAnimator.prototype.updateDeltaTime = function (dt) {
            _super.prototype.updateDeltaTime.call(this, dt);
            this._globalPropertiesDirty = true;
        };
        /**
         * 更新骨骼全局变换矩阵
         */
        SkeletonAnimator.prototype.updateGlobalProperties = function () {
            this._globalPropertiesDirty = false;
            //获取全局骨骼姿势
            var currentSkeletonPose = this._activeSkeletonState.getSkeletonPose();
            var globalMatrix3Ds = currentSkeletonPose.globalMatrix3Ds;
            //姿势变换矩阵
            var joints = this.skeleton.joints;
            //遍历每个关节
            for (var i = 0; i < this.skeleton.numJoints; ++i) {
                var inverseMatrix3D = joints[i].invertMatrix3D;
                var matrix3D = globalMatrix3Ds[i].clone();
                matrix3D.prepend(inverseMatrix3D);
                this._globalMatrices[i] = matrix3D;
            }
        };
        return SkeletonAnimator;
    }(feng3d.AnimatorBase));
    feng3d.SkeletonAnimator = SkeletonAnimator;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 关节pose
     * @author feng 2014-5-20
     */
    var JointPose = (function () {
        function JointPose() {
            /** 旋转信息 */
            this.orientation = new feng3d.Quaternion();
            /** 位移信息 */
            this.translation = new feng3d.Vector3D();
        }
        Object.defineProperty(JointPose.prototype, "matrix3D", {
            get: function () {
                if (!this._matrix3D) {
                    this._matrix3D = this.orientation.toMatrix3D();
                    this._matrix3D.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
                }
                return this._matrix3D;
            },
            set: function (value) {
                this._matrix3D = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JointPose.prototype, "invertMatrix3D", {
            get: function () {
                if (!this._invertMatrix3D) {
                    this._invertMatrix3D = this.matrix3D.clone();
                    this._invertMatrix3D.invert();
                }
                return this._invertMatrix3D;
            },
            enumerable: true,
            configurable: true
        });
        JointPose.prototype.invalid = function () {
            this._matrix3D = null;
            this._invertMatrix3D = null;
        };
        return JointPose;
    }());
    feng3d.JointPose = JointPose;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼pose
     * @author feng 2014-5-20
     */
    var SkeletonPose = (function () {
        function SkeletonPose() {
            this.jointPoses = [];
        }
        Object.defineProperty(SkeletonPose.prototype, "numJointPoses", {
            get: function () {
                return this.jointPoses.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonPose.prototype, "globalMatrix3Ds", {
            get: function () {
                if (!this._globalMatrix3Ds) {
                    var matrix3Ds = this._globalMatrix3Ds = [];
                    for (var i = 0; i < this.jointPoses.length; i++) {
                        var jointPose = this.jointPoses[i];
                        matrix3Ds[i] = jointPose.matrix3D.clone();
                        if (jointPose.parentIndex >= 0) {
                            matrix3Ds[i].append(matrix3Ds[jointPose.parentIndex]);
                        }
                    }
                }
                return this._globalMatrix3Ds;
            },
            enumerable: true,
            configurable: true
        });
        SkeletonPose.prototype.invalid = function () {
            this._globalMatrix3Ds = null;
        };
        return SkeletonPose;
    }());
    feng3d.SkeletonPose = SkeletonPose;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 动画剪辑节点基类(用于控制动画播放，包含每帧持续时间，是否循环播放等)
     * @author feng 2014-5-20
     */
    var AnimationClipNodeBase = (function (_super) {
        __extends(AnimationClipNodeBase, _super);
        function AnimationClipNodeBase() {
            _super.apply(this, arguments);
            this._looping = true;
            this._totalDuration = 0;
            this._stitchDirty = true;
            this._stitchFinalFrame = false;
            this._numFrames = 0;
            this._durations = [];
            this._totalDelta = new feng3d.Vector3D();
            /** 是否稳定帧率 */
            this.fixedFrameRate = true;
        }
        Object.defineProperty(AnimationClipNodeBase.prototype, "durations", {
            /**
             * 持续时间列表（ms）
             */
            get: function () {
                return this._durations;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipNodeBase.prototype, "totalDelta", {
            /**
             * 总坐标偏移量
             */
            get: function () {
                if (this._stitchDirty)
                    this.updateStitch();
                return this._totalDelta;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipNodeBase.prototype, "looping", {
            /**
             * 是否循环播放
             */
            get: function () {
                return this._looping;
            },
            set: function (value) {
                if (this._looping == value)
                    return;
                this._looping = value;
                this._stitchDirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipNodeBase.prototype, "stitchFinalFrame", {
            /**
             * 是否过渡结束帧
             */
            get: function () {
                return this._stitchFinalFrame;
            },
            set: function (value) {
                if (this._stitchFinalFrame == value)
                    return;
                this._stitchFinalFrame = value;
                this._stitchDirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipNodeBase.prototype, "totalDuration", {
            /**
             * 总持续时间
             */
            get: function () {
                if (this._stitchDirty)
                    this.updateStitch();
                return this._totalDuration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationClipNodeBase.prototype, "lastFrame", {
            /**
             * 最后帧数
             */
            get: function () {
                if (this._stitchDirty)
                    this.updateStitch();
                return this._lastFrame;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新动画播放控制状态
         */
        AnimationClipNodeBase.prototype.updateStitch = function () {
            this._stitchDirty = false;
            this._lastFrame = (this._looping && this._stitchFinalFrame) ? this._numFrames : this._numFrames - 1;
            this._totalDuration = 0;
            this._totalDelta.x = 0;
            this._totalDelta.y = 0;
            this._totalDelta.z = 0;
        };
        return AnimationClipNodeBase;
    }(feng3d.AnimationNodeBase));
    feng3d.AnimationClipNodeBase = AnimationClipNodeBase;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼动画节点（一般用于一个动画的帧列表）
     * 包含基于时间的动画数据作为单独的骨架构成。
     * @author feng 2014-5-20
     */
    var SkeletonClipNode = (function (_super) {
        __extends(SkeletonClipNode, _super);
        /**
         * 创建骨骼动画节点
         */
        function SkeletonClipNode() {
            _super.call(this);
            this._frames = [];
            this._stateClass = feng3d.SkeletonClipState;
        }
        Object.defineProperty(SkeletonClipNode.prototype, "frames", {
            /**
             * 骨骼姿势动画帧列表
             */
            get: function () {
                return this._frames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加帧到动画
         * @param skeletonPose 骨骼姿势
         * @param duration 持续时间
         */
        SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration) {
            this._frames.push(skeletonPose);
            this._durations.push(duration);
            this._totalDuration += duration;
            this._numFrames = this._durations.length;
            this._stitchDirty = true;
        };
        /**
         * @inheritDoc
         */
        SkeletonClipNode.prototype.updateStitch = function () {
            _super.prototype.updateStitch.call(this);
            var i = this._numFrames - 1;
            var p1, p2, delta;
            while (i--) {
                this._totalDuration += this._durations[i];
                p1 = this._frames[i].jointPoses[0].translation;
                p2 = this._frames[i + 1].jointPoses[0].translation;
                delta = p2.subtract(p1);
                this._totalDelta.x += delta.x;
                this._totalDelta.y += delta.y;
                this._totalDelta.z += delta.z;
            }
            if (this._stitchFinalFrame && this._looping) {
                this._totalDuration += this._durations[this._numFrames - 1];
                if (this._numFrames > 1) {
                    p1 = this._frames[0].jointPoses[0].translation;
                    p2 = this._frames[1].jointPoses[0].translation;
                    delta = p2.subtract(p1);
                    this._totalDelta.x += delta.x;
                    this._totalDelta.y += delta.y;
                    this._totalDelta.z += delta.z;
                }
            }
        };
        return SkeletonClipNode;
    }(feng3d.AnimationClipNodeBase));
    feng3d.SkeletonClipNode = SkeletonClipNode;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 骨骼剪辑状态
     * @author feng 2015-9-18
     */
    var SkeletonClipState = (function (_super) {
        __extends(SkeletonClipState, _super);
        /**
         * 创建骨骼剪辑状态实例
         * @param animator				动画
         * @param skeletonClipNode		骨骼剪辑节点
         */
        function SkeletonClipState(animator, skeletonClipNode) {
            _super.call(this, animator, skeletonClipNode);
            this._rootPos = new feng3d.Vector3D();
            this._skeletonPose = new feng3d.SkeletonPose();
            this._skeletonPoseDirty = true;
            this._skeletonClipNode = skeletonClipNode;
            this._frames = this._skeletonClipNode.frames;
        }
        Object.defineProperty(SkeletonClipState.prototype, "currentPose", {
            /**
             * 当前骨骼姿势
             */
            get: function () {
                if (this._framesDirty)
                    this.updateFrames();
                return this._currentPose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonClipState.prototype, "nextPose", {
            /**
             * 下个姿势
             */
            get: function () {
                if (this._framesDirty)
                    this.updateFrames();
                return this._nextPose;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         */
        SkeletonClipState.prototype.getSkeletonPose = function () {
            if (this._skeletonPoseDirty)
                this.updateSkeletonPose();
            return this._skeletonPose;
        };
        /**
         * @inheritDoc
         */
        SkeletonClipState.prototype.updateTime = function (time) {
            this._skeletonPoseDirty = true;
            _super.prototype.updateTime.call(this, time);
        };
        /**
         * @inheritDoc
         */
        SkeletonClipState.prototype.updateFrames = function () {
            _super.prototype.updateFrames.call(this);
            this._currentPose = this._frames[this._currentFrame];
            if (this._skeletonClipNode.looping && this._nextFrame >= this._skeletonClipNode.lastFrame) {
                this._nextPose = this._frames[0];
            }
            else
                this._nextPose = this._frames[this._nextFrame];
        };
        /**
         * 更新骨骼姿势
         * @param skeleton 骨骼
         */
        SkeletonClipState.prototype.updateSkeletonPose = function () {
            this._skeletonPoseDirty = false;
            if (!this._skeletonClipNode.totalDuration)
                return;
            if (this._framesDirty)
                this.updateFrames();
            var currentPose = this._currentPose.jointPoses;
            var nextPose = this._nextPose.jointPoses;
            var numJoints = this._currentPose.numJointPoses;
            var p1, p2;
            var pose1, pose2;
            var showPoses = this._skeletonPose.jointPoses;
            var showPose;
            var tr;
            for (var i = 0; i < numJoints; ++i) {
                pose1 = currentPose[i];
                pose2 = nextPose[i];
                //
                showPose = showPoses[i];
                if (showPose == null) {
                    showPose = showPoses[i] = new feng3d.JointPose();
                    showPose.name = pose1.name;
                    showPose.parentIndex = pose1.parentIndex;
                }
                p1 = pose1.translation;
                p2 = pose2.translation;
                //根据前后两个关节姿势计算出当前显示关节姿势
                showPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);
                //计算显示的关节位置
                if (i > 0) {
                    tr = showPose.translation;
                    tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
                    tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
                    tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
                }
                showPose.invalid();
            }
            this._skeletonPose.invalid();
        };
        /**
         * @inheritDoc
         */
        SkeletonClipState.prototype.updatePositionDelta = function () {
            this._positionDeltaDirty = false;
            if (this._framesDirty)
                this.updateFrames();
            var p1, p2, p3;
            var totalDelta = this._skeletonClipNode.totalDelta;
            //跳过最后，重置位置
            if ((this._timeDir > 0 && this._nextFrame < this._oldFrame) || (this._timeDir < 0 && this._nextFrame > this._oldFrame)) {
                this._rootPos.x -= totalDelta.x * this._timeDir;
                this._rootPos.y -= totalDelta.y * this._timeDir;
                this._rootPos.z -= totalDelta.z * this._timeDir;
            }
            /** 保存骨骼根节点原位置 */
            var dx = this._rootPos.x;
            var dy = this._rootPos.y;
            var dz = this._rootPos.z;
            //计算骨骼根节点位置
            if (this._skeletonClipNode.stitchFinalFrame && this._nextFrame == this._skeletonClipNode.lastFrame) {
                p1 = this._frames[0].jointPoses[0].translation;
                p2 = this._frames[1].jointPoses[0].translation;
                p3 = this._currentPose.jointPoses[0].translation;
                this._rootPos.x = p3.x + p1.x + this._blendWeight * (p2.x - p1.x);
                this._rootPos.y = p3.y + p1.y + this._blendWeight * (p2.y - p1.y);
                this._rootPos.z = p3.z + p1.z + this._blendWeight * (p2.z - p1.z);
            }
            else {
                p1 = this._currentPose.jointPoses[0].translation;
                p2 = this._frames[this._nextFrame].jointPoses[0].translation; //cover the instances where we wrap the pose but still want the final frame translation values
                this._rootPos.x = p1.x + this._blendWeight * (p2.x - p1.x);
                this._rootPos.y = p1.y + this._blendWeight * (p2.y - p1.y);
                this._rootPos.z = p1.z + this._blendWeight * (p2.z - p1.z);
            }
            //计算骨骼根节点偏移量
            this._rootDelta.x = this._rootPos.x - dx;
            this._rootDelta.y = this._rootPos.y - dy;
            this._rootDelta.z = this._rootPos.z - dz;
            //保存旧帧编号
            this._oldFrame = this._nextFrame;
        };
        return SkeletonClipState;
    }(feng3d.AnimationClipState));
    feng3d.SkeletonClipState = SkeletonClipState;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Obj模型解析器
     * @author feng 2017-01-13
     */
    var OBJParser = (function () {
        function OBJParser() {
        }
        OBJParser.parser = function (context) {
            var objData = { mtl: null, objs: [] };
            var lines = context.split("\n").reverse();
            do {
                var line = lines.pop();
                parserLine(line, objData);
            } while (line);
            currentObj = null;
            currentSubObj = null;
            return objData;
        };
        return OBJParser;
    }());
    feng3d.OBJParser = OBJParser;
    /** mtl正则 */
    var mtlReg = /mtllib\s+([\w.]+)/;
    /** 对象名称正则 */
    var objReg = /o\s+([\w]+)/;
    /** 顶点坐标正则 */
    var vertexReg = /v\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/;
    /** 顶点法线正则 */
    var vnReg = /vn\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/;
    /** 顶点uv正则 */
    var vtReg = /vt\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/;
    /** 使用材质正则 */
    var usemtlReg = /usemtl\s+([\w.]+)/;
    /** 面正则 vertex */
    var faceVReg = /f\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
    /** 面正则 vertex/uv/normal */
    var faceVUNReg = /f\s+(\d+)\/(\d+)\/(\d+)\s+(\d+)\/(\d+)\/(\d+)\s+(\d+)\/(\d+)\/(\d+)/;
    var gReg = /g\s+(\w+)/;
    var sReg = /s\s+(\w+)/;
    //
    var currentObj;
    var currentSubObj;
    function parserLine(line, objData) {
        if (!line)
            return;
        line = line.trim();
        if (!line.length)
            return;
        if (line.charAt(0) == "#")
            return;
        var result;
        if ((result = mtlReg.exec(line)) && result[0] == line) {
            objData.mtl = result[1];
        }
        else if ((result = objReg.exec(line)) && result[0] == line) {
            currentObj = { name: result[1], vertex: [], subObjs: [], vn: [], vt: [] };
            objData.objs.push(currentObj);
        }
        else if ((result = vertexReg.exec(line)) && result[0] == line) {
            if (currentObj == null) {
                currentObj = { name: "", vertex: [], subObjs: [], vn: [], vt: [] };
                objData.objs.push(currentObj);
            }
            currentObj.vertex.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        }
        else if ((result = vnReg.exec(line)) && result[0] == line) {
            currentObj.vn.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        }
        else if ((result = vtReg.exec(line)) && result[0] == line) {
            currentObj.vt.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        }
        else if ((result = gReg.exec(line)) && result[0] == line) {
            if (currentSubObj == null) {
                currentSubObj = { faces: [] };
                currentObj.subObjs.push(currentSubObj);
            }
            currentSubObj.g = result[1];
        }
        else if ((result = sReg.exec(line)) && result[0] == line) {
        }
        else if ((result = usemtlReg.exec(line)) && result[0] == line) {
            currentSubObj = { faces: [] };
            currentObj.subObjs.push(currentSubObj);
            currentSubObj.material = result[1];
        }
        else if ((result = faceVReg.exec(line)) && result[0] == line) {
            currentSubObj.faces.push({
                vertexIndices: [parseInt(result[1]), parseInt(result[2]), parseInt(result[3]), parseInt(result[4])]
            });
        }
        else if ((result = faceVUNReg.exec(line)) && result[0] == line) {
            currentSubObj.faces.push({
                vertexIndices: [parseInt(result[1]), parseInt(result[4]), parseInt(result[7])],
                uvIndices: [parseInt(result[2]), parseInt(result[5]), parseInt(result[8])],
                normalIndices: [parseInt(result[3]), parseInt(result[6]), parseInt(result[9])]
            });
        }
        else {
            throw new Error("\u65E0\u6CD5\u89E3\u6790" + line);
        }
    }
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Obj模型Mtl解析器
     * @author feng 2017-01-13
     */
    var MtlParser = (function () {
        function MtlParser() {
        }
        MtlParser.parser = function (context) {
            var mtl = {};
            var lines = context.split("\n").reverse();
            do {
                var line = lines.pop();
                parserLine(line, mtl);
            } while (line);
            return mtl;
        };
        return MtlParser;
    }());
    feng3d.MtlParser = MtlParser;
    var newmtlReg = /newmtl\s+([\w.]+)/;
    var kaReg = /Ka\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/;
    var kdReg = /Kd\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/;
    var ksReg = /Ks\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/;
    var nsReg = /Ns\s+([\d.]+)/;
    var niReg = /Ni\s+([\d.]+)/;
    var dReg = /d\s+([\d.]+)/;
    var illumReg = /illum\s+([\d]+)/;
    var currentMaterial;
    function parserLine(line, mtl) {
        if (!line)
            return;
        line = line.trim();
        if (!line.length)
            return;
        if (line.charAt(0) == "#")
            return;
        var result;
        if ((result = newmtlReg.exec(line)) && result[0] == line) {
            currentMaterial = { name: result[1], ka: [], kd: [], ks: [], ns: 0, ni: 0, d: 0, illum: 0 };
            mtl[currentMaterial.name] = currentMaterial;
        }
        else if ((result = kaReg.exec(line)) && result[0] == line) {
            currentMaterial.ka = [parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])];
        }
        else if ((result = kdReg.exec(line)) && result[0] == line) {
            currentMaterial.kd = [parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])];
        }
        else if ((result = ksReg.exec(line)) && result[0] == line) {
            currentMaterial.ks = [parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])];
        }
        else if ((result = nsReg.exec(line)) && result[0] == line) {
            currentMaterial.ns = parseFloat(result[1]);
        }
        else if ((result = niReg.exec(line)) && result[0] == line) {
            currentMaterial.ni = parseFloat(result[1]);
        }
        else if ((result = dReg.exec(line)) && result[0] == line) {
            currentMaterial.d = parseFloat(result[1]);
        }
        else if ((result = illumReg.exec(line)) && result[0] == line) {
            currentMaterial.illum = parseFloat(result[1]);
        }
        else {
            throw new Error("\u65E0\u6CD5\u89E3\u6790" + line);
        }
    }
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var MD5MeshParser = (function () {
        function MD5MeshParser() {
        }
        MD5MeshParser.parse = function (context) {
            //
            var md5MeshData = {};
            var lines = context.split("\n").reverse();
            do {
                var line = lines.pop();
                parserLine(line, md5MeshData);
            } while (line);
            return md5MeshData;
        };
        return MD5MeshParser;
    }());
    feng3d.MD5MeshParser = MD5MeshParser;
    var MD5VersionReg = /MD5Version\s+(\d+)/;
    var commandlineReg = /commandline\s+"([\w\s/.-]+)"/;
    var numJointsReg = /numJoints\s+(\d+)/;
    var numMeshesReg = /numMeshes\s+(\d+)/;
    var jointsStartReg = /joints\s+{/;
    var jointsReg = /"(\w+)"\s+([-\d]+)\s+\(\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+\)\s+\(\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+\)(\s+\/\/(\s+\w+)?)?/;
    var endBlockReg = /}/;
    var meshStartReg = /mesh\s+{/;
    var annotationReg = /\/\/[\s\w:]+/;
    var shaderReg = /shader\s+"([\w\/]+)"/;
    var numvertsReg = /numverts\s+(\d+)/;
    var vertReg = /vert\s+(\d+)\s+\(\s+([\d.]+)\s+([\d.]+)\s+\)\s+(\d+)\s+(\d+)/;
    var numtrisReg = /numtris\s+(\d+)/;
    var triReg = /tri\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
    var numweightsReg = /numweights\s+(\d+)/;
    var weightReg = /weight\s+(\d+)\s+(\d+)\s+([\d.]+)\s+\(\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+\)/;
    /**
     * 状态
     */
    var State;
    (function (State) {
        /** 读取关节 */
        State[State["joints"] = 0] = "joints";
        State[State["mesh"] = 1] = "mesh";
    })(State || (State = {}));
    /** 当前处于状态 */
    var states = [];
    var currentMesh;
    function parserLine(line, md5MeshData) {
        if (!line)
            return;
        line = line.trim();
        if (!line.length)
            return;
        var result;
        if ((result = MD5VersionReg.exec(line)) && result[0] == line) {
            md5MeshData.MD5Version = parseInt(result[1]);
        }
        else if ((result = commandlineReg.exec(line)) && result[0] == line) {
            md5MeshData.commandline = result[1];
        }
        else if ((result = numJointsReg.exec(line)) && result[0] == line) {
            md5MeshData.numJoints = parseInt(result[1]);
        }
        else if ((result = numMeshesReg.exec(line)) && result[0] == line) {
            md5MeshData.numMeshes = parseInt(result[1]);
        }
        else if ((result = jointsStartReg.exec(line)) && result[0] == line) {
            states.push(State.joints);
            md5MeshData.joints = [];
        }
        else if ((result = jointsReg.exec(line)) && result[0] == line) {
            md5MeshData.joints.push({
                name: result[1], parentIndex: parseInt(result[2]),
                position: [parseFloat(result[3]), parseFloat(result[4]), parseFloat(result[5])],
                rotation: [parseFloat(result[6]), parseFloat(result[7]), parseFloat(result[8])]
            });
        }
        else if ((result = endBlockReg.exec(line)) && result[0] == line) {
            var exitState = states.pop();
            if (exitState == State.mesh) {
                currentMesh = null;
            }
        }
        else if ((result = meshStartReg.exec(line)) && result[0] == line) {
            states.push(State.mesh);
            if (!md5MeshData.meshs) {
                md5MeshData.meshs = [];
            }
            currentMesh = {};
            md5MeshData.meshs.push(currentMesh);
        }
        else if ((result = annotationReg.exec(line)) && result[0] == line) {
        }
        else if ((result = shaderReg.exec(line)) && result[0] == line) {
            currentMesh.shader = result[1];
        }
        else if ((result = numvertsReg.exec(line)) && result[0] == line) {
            currentMesh.numverts = parseInt(result[1]);
            currentMesh.verts = [];
        }
        else if ((result = vertReg.exec(line)) && result[0] == line) {
            currentMesh.verts.push({
                index: parseFloat(result[1]), u: parseFloat(result[2]), v: parseFloat(result[3]),
                startWeight: parseFloat(result[4]), countWeight: parseFloat(result[5])
            });
        }
        else if ((result = numtrisReg.exec(line)) && result[0] == line) {
            currentMesh.numtris = parseInt(result[1]);
            currentMesh.tris = [];
        }
        else if ((result = triReg.exec(line)) && result[0] == line) {
            var index = parseInt(result[1]) * 3;
            currentMesh.tris[index] = parseInt(result[2]);
            currentMesh.tris[index + 1] = parseInt(result[3]);
            currentMesh.tris[index + 2] = parseInt(result[4]);
        }
        else if ((result = numweightsReg.exec(line)) && result[0] == line) {
            currentMesh.numweights = parseInt(result[1]);
            currentMesh.weights = [];
        }
        else if ((result = weightReg.exec(line)) && result[0] == line) {
            currentMesh.weights.push({
                index: parseInt(result[1]), joint: parseInt(result[2]), bias: parseFloat(result[3]),
                pos: [parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6])]
            });
        }
        else {
            throw new Error("\u65E0\u6CD5\u89E3\u6790" + line);
        }
    }
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var MD5AnimParser = (function () {
        function MD5AnimParser() {
        }
        MD5AnimParser.parse = function (context) {
            var md5AnimData = {};
            var lines = context.split("\n").reverse();
            do {
                var line = lines.pop();
                parserLine(line, md5AnimData);
            } while (line);
            return md5AnimData;
        };
        return MD5AnimParser;
    }());
    feng3d.MD5AnimParser = MD5AnimParser;
    var MD5VersionReg = /MD5Version\s+(\d+)/;
    var commandlineReg = /commandline\s+"([\w\s/.-]+)"/;
    var numFramesReg = /numFrames\s+(\d+)/;
    var numJointsReg = /numJoints\s+(\d+)/;
    var frameRateReg = /frameRate\s+(\d+)/;
    var numAnimatedComponentsReg = /numAnimatedComponents\s+(\d+)/;
    var hierarchyStartReg = /hierarchy\s+{/;
    var hierarchyReg = /"(\w+)"\s+([\d-]+)\s+(\d+)\s+(\d+)(\s+\/\/(\s+\w+)?(\s+\([\s\w]+\))?)?/;
    var endBlockReg = /}/;
    var boundsStartReg = /bounds\s+{/;
    //2组3个number
    var number32Reg = /\(\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+\)\s+\(\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+\)/;
    var baseframeStartReg = /baseframe\s+{/;
    var frameStartReg = /frame\s+(\d+)\s+{/;
    var numbersReg = /(-?[\d.]+)(\s+-?[\d.]+){0,}/;
    /**
     * 状态
     */
    var State;
    (function (State) {
        State[State["hierarchy"] = 0] = "hierarchy";
        State[State["bounds"] = 1] = "bounds";
        State[State["baseframe"] = 2] = "baseframe";
        State[State["frame"] = 3] = "frame";
    })(State || (State = {}));
    /** 当前处于状态 */
    var states = [];
    var currentFrame;
    function parserLine(line, md5AnimData) {
        if (!line)
            return;
        line = line.trim();
        if (!line.length)
            return;
        var result;
        if ((result = MD5VersionReg.exec(line)) && result[0] == line) {
            md5AnimData.MD5Version = parseInt(result[1]);
        }
        else if ((result = commandlineReg.exec(line)) && result[0] == line) {
            md5AnimData.commandline = result[1];
        }
        else if ((result = numFramesReg.exec(line)) && result[0] == line) {
            md5AnimData.numFrames = parseInt(result[1]);
        }
        else if ((result = numJointsReg.exec(line)) && result[0] == line) {
            md5AnimData.numJoints = parseInt(result[1]);
        }
        else if ((result = frameRateReg.exec(line)) && result[0] == line) {
            md5AnimData.frameRate = parseInt(result[1]);
        }
        else if ((result = numAnimatedComponentsReg.exec(line)) && result[0] == line) {
            md5AnimData.numAnimatedComponents = parseInt(result[1]);
        }
        else if ((result = hierarchyStartReg.exec(line)) && result[0] == line) {
            md5AnimData.hierarchy = [];
            states.push(State.hierarchy);
        }
        else if ((result = hierarchyReg.exec(line)) && result[0] == line) {
            switch (states[states.length - 1]) {
                case State.hierarchy:
                    md5AnimData.hierarchy.push({
                        name: result[1], parentIndex: parseInt(result[2]),
                        flags: parseInt(result[3]), startIndex: parseInt(result[4])
                    });
                    break;
                default:
                    throw new Error("没有对应的数据处理");
            }
        }
        else if ((result = endBlockReg.exec(line)) && result[0] == line) {
            var state = states.pop();
            if (state == State.frame) {
                if (currentFrame.components.length != md5AnimData.numAnimatedComponents) {
                    throw new Error("frame中数据不对");
                }
                currentFrame = null;
            }
        }
        else if ((result = boundsStartReg.exec(line)) && result[0] == line) {
            md5AnimData.bounds = [];
            states.push(State.bounds);
        }
        else if ((result = baseframeStartReg.exec(line)) && result[0] == line) {
            md5AnimData.baseframe = [];
            states.push(State.baseframe);
        }
        else if ((result = number32Reg.exec(line)) && result[0] == line) {
            switch (states[states.length - 1]) {
                case State.bounds:
                    md5AnimData.bounds.push({ min: [parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])], max: [parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6])] });
                    break;
                case State.baseframe:
                    md5AnimData.baseframe.push({ position: [parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])], orientation: [parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6])] });
                    break;
                default:
                    throw new Error("没有对应的数据处理");
            }
        }
        else if ((result = frameStartReg.exec(line)) && result[0] == line) {
            if (!md5AnimData.frame) {
                md5AnimData.frame = [];
            }
            currentFrame = { index: parseInt(result[1]), components: [] };
            md5AnimData.frame.push(currentFrame);
            states.push(State.frame);
        }
        else if ((result = numbersReg.exec(line)) && result[0] == line) {
            switch (states[states.length - 1]) {
                case State.frame:
                    var numbers = line.split(" ");
                    while (numbers.length > 0) {
                        currentFrame.components.push(parseFloat(numbers.shift()));
                    }
                    break;
                default:
                    throw new Error("没有对应的数据处理");
            }
        }
        else {
            throw new Error("\u65E0\u6CD5\u89E3\u6790" + line);
        }
    }
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * Obj模型加载类
     * @author feng 2017-01-18
     */
    var ObjLoader = (function (_super) {
        __extends(ObjLoader, _super);
        function ObjLoader() {
            _super.apply(this, arguments);
        }
        /**
         * 加载资源
         * @param url   路径
         */
        ObjLoader.prototype.load = function (url, completed) {
            if (completed === void 0) { completed = null; }
            this._url = url;
            this._completed = completed;
            var loader = new feng3d.Loader();
            loader.addEventListener(feng3d.LoaderEvent.COMPLETE, function (e) {
                var objData = this._objData = feng3d.OBJParser.parser(e.data.content);
                var mtl = objData.mtl;
                if (mtl) {
                    var mtlRoot = url.substring(0, url.lastIndexOf("/") + 1);
                    var mtlLoader = new feng3d.Loader();
                    mtlLoader.loadText(mtlRoot + mtl);
                    mtlLoader.addEventListener(feng3d.LoaderEvent.COMPLETE, function (e) {
                        var mtlData = this._mtlData = feng3d.MtlParser.parser(e.data.content);
                        this.createObj();
                    }, this);
                }
                else {
                    this.createObj();
                }
            }, this);
            loader.loadText(url);
        };
        ObjLoader.prototype.createObj = function () {
            var object = new feng3d.Object3D();
            var objData = this._objData;
            var objs = objData.objs;
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                var object3D = this.createSubObj(obj);
                object.addChild(object3D);
            }
            if (this._completed) {
                this._completed(object);
            }
        };
        ObjLoader.prototype.createSubObj = function (obj) {
            var object3D = new feng3d.Object3D(obj.name);
            var vertex = new Float32Array(obj.vertex);
            var subObjs = obj.subObjs;
            for (var i = 0; i < subObjs.length; i++) {
                var materialObj = this.createMaterialObj(vertex, subObjs[i]);
                object3D.addChild(materialObj);
            }
            return object3D;
        };
        ObjLoader.prototype.createMaterialObj = function (vertex, subObj) {
            var object3D = new feng3d.Object3D();
            var mesh = object3D.getOrCreateComponentByClass(feng3d.MeshFilter);
            var geometry = mesh.geometry = new feng3d.Geometry();
            geometry.setVAData(feng3d.GLAttribute.a_position, vertex, 3);
            var faces = subObj.faces;
            var indices = [];
            for (var i = 0; i < faces.length; i++) {
                var vertexIndices = faces[i].vertexIndices;
                indices.push(vertexIndices[0] - 1, vertexIndices[1] - 1, vertexIndices[2] - 1);
                if (vertexIndices.length == 4) {
                    indices.push(vertexIndices[2] - 1, vertexIndices[3] - 1, vertexIndices[0] - 1);
                }
            }
            geometry.setIndices(new Uint16Array(indices));
            var material = object3D.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
            if (this._mtlData && this._mtlData[subObj.material]) {
                var materialInfo = this._mtlData[subObj.material];
                var kd = materialInfo.kd;
                material.color.r = kd[0];
                material.color.g = kd[1];
                material.color.b = kd[2];
            }
            return object3D;
        };
        return ObjLoader;
    }(feng3d.Loader));
    feng3d.ObjLoader = ObjLoader;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * MD5模型加载类
     * @author feng 2017-01-18
     */
    var MD5Loader = (function (_super) {
        __extends(MD5Loader, _super);
        function MD5Loader() {
            _super.apply(this, arguments);
        }
        /**
         * 加载资源
         * @param url   路径
         */
        MD5Loader.prototype.load = function (url, completed) {
            if (completed === void 0) { completed = null; }
            this._url = url;
            this._completed = completed;
            var loader = new feng3d.Loader();
            loader.addEventListener(feng3d.LoaderEvent.COMPLETE, function (e) {
                var objData = feng3d.MD5MeshParser.parse(e.data.content);
                this.createMD5Mesh(objData);
            }, this);
            loader.loadText(url);
        };
        MD5Loader.prototype.loadAnim = function (url, completed) {
            if (completed === void 0) { completed = null; }
            this._url = url;
            this._animCompleted = completed;
            var loader = new feng3d.Loader();
            loader.addEventListener(feng3d.LoaderEvent.COMPLETE, function (e) {
                var objData = feng3d.MD5AnimParser.parse(e.data.content);
                this.createAnimator(objData);
            }, this);
            loader.loadText(url);
        };
        MD5Loader.prototype.createMD5Mesh = function (md5MeshData) {
            var object3D = new feng3d.Object3D();
            //顶点最大关节关联数
            var _maxJointCount = this.calculateMaxJointCount(md5MeshData);
            feng3d.assert(_maxJointCount <= 8, "顶点最大关节关联数最多支持8个");
            this._skeleton = this.createSkeleton(md5MeshData.joints);
            var skeletonAnimator = new feng3d.SkeletonAnimator(this._skeleton);
            for (var i = 0; i < md5MeshData.meshs.length; i++) {
                var geometry = this.createGeometry(md5MeshData.meshs[i]);
                var skeletonObject3D = new feng3d.Object3D();
                skeletonObject3D.getOrCreateComponentByClass(feng3d.MeshFilter).geometry = geometry;
                skeletonObject3D.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SkeletonAnimatorMaterial();
                skeletonObject3D.addComponent(skeletonAnimator);
                object3D.addChild(skeletonObject3D);
            }
            if (this._completed) {
                this._completed(object3D, skeletonAnimator);
            }
        };
        /**
         * 计算最大关节数量
         */
        MD5Loader.prototype.calculateMaxJointCount = function (md5MeshData) {
            var _maxJointCount = 0;
            //遍历所有的网格数据
            var numMeshData = md5MeshData.meshs.length;
            for (var i = 0; i < numMeshData; ++i) {
                var meshData = md5MeshData.meshs[i];
                var vertexData = meshData.verts;
                var numVerts = vertexData.length;
                //遍历每个顶点 寻找关节关联最大数量
                for (var j = 0; j < numVerts; ++j) {
                    var zeroWeights = this.countZeroWeightJoints(vertexData[j], meshData.weights);
                    var totalJoints = vertexData[j].countWeight - zeroWeights;
                    if (totalJoints > _maxJointCount)
                        _maxJointCount = totalJoints;
                }
            }
            return _maxJointCount;
        };
        /**
         * 计算0权重关节数量
         * @param vertex 顶点数据
         * @param weights 关节权重数组
         * @return
         */
        MD5Loader.prototype.countZeroWeightJoints = function (vertex, weights) {
            var start = vertex.startWeight;
            var end = vertex.startWeight + vertex.countWeight;
            var count = 0;
            var weight;
            for (var i = start; i < end; ++i) {
                weight = weights[i].bias;
                if (weight == 0)
                    ++count;
            }
            return count;
        };
        MD5Loader.prototype.createSkeleton = function (joints) {
            var skeleton = new feng3d.Skeleton();
            for (var i = 0; i < joints.length; i++) {
                var skeletonJoint = this.createSkeletonJoint(joints[i]);
                skeleton.joints.push(skeletonJoint);
            }
            return skeleton;
        };
        MD5Loader.prototype.createSkeletonJoint = function (joint) {
            var skeletonJoint = new feng3d.SkeletonJoint();
            skeletonJoint.name = joint.name;
            skeletonJoint.parentIndex = joint.parentIndex;
            var position = joint.position;
            var rotation = joint.rotation;
            var quat = new feng3d.Quaternion(rotation[0], -rotation[1], -rotation[2]);
            // quat supposed to be unit length
            var t = 1 - quat.x * quat.x - quat.y * quat.y - quat.z * quat.z;
            quat.w = t < 0 ? 0 : -Math.sqrt(t);
            //
            skeletonJoint.translation = new feng3d.Vector3D(-position[0], position[1], position[2]);
            skeletonJoint.translation = skeletonJoint.translation;
            //
            skeletonJoint.orientation = quat;
            return skeletonJoint;
        };
        MD5Loader.prototype.createGeometry = function (md5Mesh) {
            var vertexData = md5Mesh.verts;
            var weights = md5Mesh.weights;
            var indices = md5Mesh.tris;
            var geometry = new feng3d.Geometry();
            var len = vertexData.length;
            var vertex;
            var weight;
            var bindPose;
            var pos;
            //uv数据
            var uvs = [];
            uvs.length = len * 2;
            //顶点位置数据
            var vertices = [];
            vertices.length = len * 3;
            //关节索引数据
            var jointIndices0 = [];
            jointIndices0.length = len * 4;
            var jointIndices1 = [];
            jointIndices1.length = len * 4;
            //关节权重数据
            var jointWeights0 = [];
            jointWeights0.length = len * 4;
            var jointWeights1 = [];
            jointWeights1.length = len * 4;
            for (var i = 0; i < len; ++i) {
                vertex = vertexData[i];
                vertices[i * 3] = vertices[i * 3 + 1] = vertices[i * 3 + 2] = 0;
                /**
                 * 参考 http://blog.csdn.net/summerhust/article/details/17421213
                 * VertexPos = (MJ-0 * weight[index0].pos * weight[index0].bias) + ... + (MJ-N * weight[indexN].pos * weight[indexN].bias)
                 * 变量对应  MJ-N -> bindPose; 第J个关节的变换矩阵
                 * weight[indexN].pos -> weight.pos;
                 * weight[indexN].bias -> weight.bias;
                 */
                var weightJoints = [];
                var weightBiass = [];
                for (var j = 0; j < 8; ++j) {
                    weightJoints[j] = 0;
                    weightBiass[j] = 0;
                    if (j < vertex.countWeight) {
                        weight = weights[vertex.startWeight + j];
                        if (weight.bias > 0) {
                            bindPose = this._skeleton.joints[weight.joint].matrix3D;
                            pos = bindPose.transformVector(new feng3d.Vector3D(-weight.pos[0], weight.pos[1], weight.pos[2]));
                            vertices[i * 3] += pos.x * weight.bias;
                            vertices[i * 3 + 1] += pos.y * weight.bias;
                            vertices[i * 3 + 2] += pos.z * weight.bias;
                            weightJoints[j] = weight.joint;
                            weightBiass[j] = weight.bias;
                        }
                    }
                }
                jointIndices0[i * 4] = weightJoints[0];
                jointIndices0[i * 4 + 1] = weightJoints[1];
                jointIndices0[i * 4 + 2] = weightJoints[2];
                jointIndices0[i * 4 + 3] = weightJoints[3];
                jointIndices1[i * 4] = weightJoints[4];
                jointIndices1[i * 4 + 1] = weightJoints[5];
                jointIndices1[i * 4 + 2] = weightJoints[6];
                jointIndices1[i * 4 + 3] = weightJoints[7];
                //
                jointWeights0[i * 4] = weightBiass[0];
                jointWeights0[i * 4 + 1] = weightBiass[1];
                jointWeights0[i * 4 + 2] = weightBiass[2];
                jointWeights0[i * 4 + 3] = weightBiass[3];
                jointWeights1[i * 4] = weightBiass[4];
                jointWeights1[i * 4 + 1] = weightBiass[5];
                jointWeights1[i * 4 + 2] = weightBiass[6];
                jointWeights1[i * 4 + 3] = weightBiass[7];
                uvs[vertex.index * 2] = vertex.u;
                uvs[vertex.index * 2 + 1] = vertex.v;
            }
            //更新索引数据
            geometry.setIndices(new Uint16Array(indices));
            //更新顶点坐标与uv数据
            geometry.setVAData(feng3d.GLAttribute.a_position, new Float32Array(vertices), 3);
            geometry.setVAData(feng3d.GLAttribute.a_uv, new Float32Array(uvs), 2);
            //更新关节索引与权重索引
            geometry.setVAData(feng3d.GLAttribute.a_jointindex0, new Float32Array(jointIndices0), 4);
            geometry.setVAData(feng3d.GLAttribute.a_jointweight0, new Float32Array(jointWeights0), 4);
            geometry.setVAData(feng3d.GLAttribute.a_jointindex1, new Float32Array(jointIndices1), 4);
            geometry.setVAData(feng3d.GLAttribute.a_jointweight1, new Float32Array(jointWeights1), 4);
            return geometry;
        };
        MD5Loader.prototype.createAnimator = function (md5AnimData) {
            var object = new feng3d.Object3D();
            var _clip = new feng3d.SkeletonClipNode();
            for (var i = 0; i < md5AnimData.numFrames; ++i)
                _clip.addFrame(this.translatePose(md5AnimData, md5AnimData.frame[i]), 1000 / md5AnimData.frameRate);
            if (this._animCompleted) {
                this._animCompleted(_clip);
            }
        };
        /**
         * 将一个关键帧数据转换为SkeletonPose
         * @param frameData 帧数据
         * @return 包含帧数据的SkeletonPose对象
         */
        MD5Loader.prototype.translatePose = function (md5AnimData, frameData) {
            var hierarchy;
            var pose;
            var base;
            var flags;
            var j;
            //偏移量
            var translate = new feng3d.Vector3D();
            //旋转四元素
            var orientation = new feng3d.Quaternion();
            var components = frameData.components;
            //骨骼pose数据
            var skelPose = new feng3d.SkeletonPose();
            //骨骼pose列表
            var jointPoses = skelPose.jointPoses;
            for (var i = 0; i < md5AnimData.numJoints; ++i) {
                //通过原始帧数据与层级数据计算出当前骨骼pose数据
                j = 0;
                //层级数据
                hierarchy = md5AnimData.hierarchy[i];
                //基础帧数据
                base = md5AnimData.baseframe[i];
                //层级标记
                flags = hierarchy.flags;
                translate.x = base.position[0];
                translate.y = base.position[1];
                translate.z = base.position[2];
                orientation.x = base.orientation[0];
                orientation.y = base.orientation[1];
                orientation.z = base.orientation[2];
                //调整位移与角度数据
                if (flags & 1)
                    translate.x = components[hierarchy.startIndex + (j++)];
                if (flags & 2)
                    translate.y = components[hierarchy.startIndex + (j++)];
                if (flags & 4)
                    translate.z = components[hierarchy.startIndex + (j++)];
                if (flags & 8)
                    orientation.x = components[hierarchy.startIndex + (j++)];
                if (flags & 16)
                    orientation.y = components[hierarchy.startIndex + (j++)];
                if (flags & 32)
                    orientation.z = components[hierarchy.startIndex + (j++)];
                //计算四元素w值
                var w = 1 - orientation.x * orientation.x - orientation.y * orientation.y - orientation.z * orientation.z;
                orientation.w = w < 0 ? 0 : -Math.sqrt(w);
                //创建关节pose数据
                pose = new feng3d.JointPose();
                pose.name = hierarchy.name;
                pose.parentIndex = hierarchy.parentIndex;
                pose.orientation.copyFrom(orientation);
                pose.translation.x = translate.x;
                pose.translation.y = translate.y;
                pose.translation.z = translate.z;
                pose.orientation.y = -pose.orientation.y;
                pose.orientation.z = -pose.orientation.z;
                pose.translation.x = -pose.translation.x;
                jointPoses[i] = pose;
            }
            return skelPose;
        };
        return MD5Loader;
    }(feng3d.Loader));
    feng3d.MD5Loader = MD5Loader;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 坐标系，三叉戟
     * @author feng 2017-02-06
     */
    var Trident = (function (_super) {
        __extends(Trident, _super);
        function Trident(length) {
            if (length === void 0) { length = 100; }
            _super.call(this);
            this.buildTrident(Math.abs((length == 0) ? 10 : length));
        }
        Trident.prototype.buildTrident = function (length) {
            this._xLine = new feng3d.Object3D();
            var segmentGeometry = this._xLine.getOrCreateComponentByClass(feng3d.SegmentGeometry);
            segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(length, 0, 0), 0xff0000, 0xff0000));
            this._xLine.addComponent(segmentGeometry);
            this._xLine.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
            this.addChild(this._xLine);
            //
            this._yLine = new feng3d.Object3D();
            var segmentGeometry = this._yLine.getOrCreateComponentByClass(feng3d.SegmentGeometry);
            segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, length, 0), 0x00ff00, 0x00ff00));
            this._yLine.addComponent(segmentGeometry);
            this._yLine.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
            this.addChild(this._yLine);
            //
            this._zLine = new feng3d.Object3D();
            var segmentGeometry = this._zLine.getOrCreateComponentByClass(feng3d.SegmentGeometry);
            segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, 0, length), 0x0000ff, 0x0000ff));
            this._zLine.addComponent(segmentGeometry);
            this._zLine.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
            this.addChild(this._zLine);
            //
            this._xArrow = new feng3d.ConeObject3D(5, 18);
            this._xArrow.transform.position.x = length;
            this._xArrow.transform.rotation.z = -90;
            var material = this._xArrow.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
            material.baseColor = new feng3d.Color(1, 0, 0);
            this.addChild(this._xArrow);
            //
            this._yArrow = new feng3d.ConeObject3D(5, 18);
            this._yArrow.transform.position.y = length;
            var material = this._yArrow.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
            material.baseColor = new feng3d.Color(0, 1, 0);
            this.addChild(this._yArrow);
            //
            this._zArrow = new feng3d.ConeObject3D(5, 18);
            this._zArrow.transform.position.z = length;
            this._zArrow.transform.rotation.x = 90;
            var material = this._zArrow.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
            material.baseColor = new feng3d.Color(0, 0, 1);
            this.addChild(this._zArrow);
        };
        return Trident;
    }(feng3d.Object3D));
    feng3d.Trident = Trident;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 摄像机3D对象
     * @author feng 2017-02-06
     */
    var CameraObject3D = (function (_super) {
        __extends(CameraObject3D, _super);
        function CameraObject3D(name) {
            if (name === void 0) { name = "camera"; }
            _super.call(this, name);
            this.camera = new feng3d.PerspectiveCamera();
            this.addComponent(this.camera);
        }
        return CameraObject3D;
    }(feng3d.Object3D));
    feng3d.CameraObject3D = CameraObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 平面3D对象
     * @author feng 2017-02-06
     */
    var PlaneObject3D = (function (_super) {
        __extends(PlaneObject3D, _super);
        /**
         * 构建3D对象
         */
        function PlaneObject3D(width, name) {
            if (width === void 0) { width = 100; }
            if (name === void 0) { name = "plane"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            this.planeGeometry = mesh.geometry = new feng3d.PlaneGeometry(width, width);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return PlaneObject3D;
    }(feng3d.Object3D));
    feng3d.PlaneObject3D = PlaneObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 立方体3D对象
     * @author feng 2017-02-06
     */
    var CubeObject3D = (function (_super) {
        __extends(CubeObject3D, _super);
        /**
         * 构建3D对象
         */
        function CubeObject3D(width, name) {
            if (width === void 0) { width = 100; }
            if (name === void 0) { name = "cube"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            mesh.geometry = new feng3d.CubeGeometry(width, width, width);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return CubeObject3D;
    }(feng3d.Object3D));
    feng3d.CubeObject3D = CubeObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆环3D对象
     * @author feng 2017-02-06
     */
    var TorusObect3D = (function (_super) {
        __extends(TorusObect3D, _super);
        /**
         * 构建3D对象
         */
        function TorusObect3D(name) {
            if (name === void 0) { name = "torus"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            this.torusGeometry = mesh.geometry = new feng3d.TorusGeometry();
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return TorusObect3D;
    }(feng3d.Object3D));
    feng3d.TorusObect3D = TorusObect3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 球体3D对象
     * @author feng 2017-02-06
     */
    var SphereObject3D = (function (_super) {
        __extends(SphereObject3D, _super);
        /**
         * 构建3D对象
         */
        function SphereObject3D(name) {
            if (name === void 0) { name = "sphere"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            mesh.geometry = new feng3d.SphereGeometry();
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return SphereObject3D;
    }(feng3d.Object3D));
    feng3d.SphereObject3D = SphereObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 胶囊体3D对象
     * @author feng 2017-02-06
     */
    var CapsuleObject3D = (function (_super) {
        __extends(CapsuleObject3D, _super);
        /**
         * 构建3D对象
         */
        function CapsuleObject3D(name) {
            if (name === void 0) { name = "capsule"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            mesh.geometry = new feng3d.CapsuleGeometry();
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return CapsuleObject3D;
    }(feng3d.Object3D));
    feng3d.CapsuleObject3D = CapsuleObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆柱体3D对象
     * @author feng 2017-02-06
     */
    var CylinderObject3D = (function (_super) {
        __extends(CylinderObject3D, _super);
        /**
         * 构建3D对象
         */
        function CylinderObject3D(name, topRadius, bottomRadius, height, segmentsW, segmentsH, topClosed, bottomClosed, surfaceClosed, yUp) {
            if (name === void 0) { name = "cylinder"; }
            if (topRadius === void 0) { topRadius = 50; }
            if (bottomRadius === void 0) { bottomRadius = 50; }
            if (height === void 0) { height = 100; }
            if (segmentsW === void 0) { segmentsW = 16; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (topClosed === void 0) { topClosed = true; }
            if (bottomClosed === void 0) { bottomClosed = true; }
            if (surfaceClosed === void 0) { surfaceClosed = true; }
            if (yUp === void 0) { yUp = true; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            mesh.geometry = new feng3d.CylinderGeometry(topRadius, bottomRadius, height, segmentsW, segmentsH, topClosed, bottomClosed, surfaceClosed, yUp);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return CylinderObject3D;
    }(feng3d.Object3D));
    feng3d.CylinderObject3D = CylinderObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 圆锥体3D对象
     * @author feng 2017-02-06
     */
    var ConeObject3D = (function (_super) {
        __extends(ConeObject3D, _super);
        /**
         * 构建3D对象
         */
        function ConeObject3D(radius, height, name) {
            if (radius === void 0) { radius = 50; }
            if (height === void 0) { height = 100; }
            if (name === void 0) { name = "cone"; }
            _super.call(this, name);
            var mesh = this.getOrCreateComponentByClass(feng3d.MeshFilter);
            mesh.geometry = new feng3d.ConeGeometry(radius, height);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
        }
        return ConeObject3D;
    }(feng3d.Object3D));
    feng3d.ConeObject3D = ConeObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 天空盒3D对象
     * @author feng 2017-02-06
     */
    var SkyBoxObject3D = (function (_super) {
        __extends(SkyBoxObject3D, _super);
        /**
         * 构建3D对象
         */
        function SkyBoxObject3D(images, name) {
            if (name === void 0) { name = "skyBox"; }
            _super.call(this, name);
            this.getOrCreateComponentByClass(feng3d.MeshFilter).geometry = new feng3d.SkyBoxGeometry();
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SkyBoxMaterial(images);
        }
        return SkyBoxObject3D;
    }(feng3d.Object3D));
    feng3d.SkyBoxObject3D = SkyBoxObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 线条3D对象
     * @author feng 2017-02-06
     */
    var SegmentObject3D = (function (_super) {
        __extends(SegmentObject3D, _super);
        function SegmentObject3D(name) {
            if (name === void 0) { name = "Segment3D"; }
            _super.call(this, name);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
            this.addComponent(new feng3d.SegmentGeometry());
        }
        return SegmentObject3D;
    }(feng3d.Object3D));
    feng3d.SegmentObject3D = SegmentObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 天空盒3D对象
     * @author feng 2017-02-06
     */
    var ParticleObject3D = (function (_super) {
        __extends(ParticleObject3D, _super);
        /**
         * 构建3D对象
         */
        function ParticleObject3D(name) {
            if (name === void 0) { name = "particle"; }
            _super.call(this, name);
            this.getOrCreateComponentByClass(feng3d.MeshFilter).geometry = new feng3d.PointGeometry();
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material = new feng3d.ParticleMaterial();
            var particleAnimator = this.getOrCreateComponentByClass(feng3d.ParticleAnimator);
            particleAnimator.cycle = 10;
            particleAnimator.numParticles = 1000;
            //发射组件
            var emission = new feng3d.ParticleEmission();
            //每秒发射数量
            emission.rate = 50;
            //批量发射
            emission.bursts.push({ time: 1, particles: 100 }, { time: 2, particles: 100 }, { time: 3, particles: 100 }, { time: 4, particles: 100 }, { time: 5, particles: 100 });
            //通过组件来创建粒子初始状态
            particleAnimator.addComponent(emission);
            particleAnimator.addComponent(new feng3d.ParticlePosition());
            particleAnimator.addComponent(new feng3d.ParticleVelocity());
            // particleAnimator.addComponent(new ParticleAcceleration());
            particleAnimator.particleGlobal.acceleration = new feng3d.Vector3D(0, -9.8, 0);
            //通过函数来创建粒子初始状态
            particleAnimator.addComponent(new feng3d.ParticleColor());
            // particleAnimator.generateFunctions.push({
            //     generate: (particle) =>
            //     {
            //         particle.color = new Color(1, 0, 0, 1).mix(new Color(0, 1, 0, 1), particle.index / particle.total);
            //     }, priority: 0
            // });
        }
        return ParticleObject3D;
    }(feng3d.Object3D));
    feng3d.ParticleObject3D = ParticleObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 点光源3D对象
     * @author feng 2017-03-10
     */
    var PointLightObject3D = (function (_super) {
        __extends(PointLightObject3D, _super);
        function PointLightObject3D(name) {
            if (name === void 0) { name = "PointLight"; }
            _super.call(this, name);
            //
            this.getOrCreateComponentByClass(feng3d.MeshFilter).geometry = new feng3d.SphereGeometry(5);
            this.getOrCreateComponentByClass(feng3d.MeshRenderer);
            //初始化点光源
            this.addComponent(new feng3d.PointLight());
            this.getOrCreateComponentByClass(feng3d.MeshRenderer).material;
        }
        return PointLightObject3D;
    }(feng3d.Object3D));
    feng3d.PointLightObject3D = PointLightObject3D;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 鼠标事件管理
     * @author feng 2014-4-29
     */
    var Mouse3DManager = (function () {
        function Mouse3DManager() {
            this.viewRect = new feng3d.Rectangle(0, 0, 100, 100);
            this.mouseEventTypes = [];
            this.mouseRenderer = new feng3d.MouseRenderer();
            //
            mouse3DEventMap[feng3d.inputType.CLICK] = Mouse3DEvent.CLICK;
            mouse3DEventMap[feng3d.inputType.DOUBLE_CLICK] = Mouse3DEvent.DOUBLE_CLICK;
            mouse3DEventMap[feng3d.inputType.MOUSE_DOWN] = Mouse3DEvent.MOUSE_DOWN;
            mouse3DEventMap[feng3d.inputType.MOUSE_MOVE] = Mouse3DEvent.MOUSE_MOVE;
            mouse3DEventMap[feng3d.inputType.MOUSE_UP] = Mouse3DEvent.MOUSE_UP;
            feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMousemove, this);
            //
            feng3d.input.addEventListener(feng3d.inputType.CLICK, this.onMouseEvent, this);
            feng3d.input.addEventListener(feng3d.inputType.DOUBLE_CLICK, this.onMouseEvent, this);
            feng3d.input.addEventListener(feng3d.inputType.MOUSE_DOWN, this.onMouseEvent, this);
            feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseEvent, this);
            feng3d.input.addEventListener(feng3d.inputType.MOUSE_UP, this.onMouseEvent, this);
        }
        /**
         * 监听鼠标事件收集事件类型
         */
        Mouse3DManager.prototype.onMouseEvent = function (event) {
            if (this.mouseEventTypes.indexOf(event.type) == -1)
                this.mouseEventTypes.push(event.type);
        };
        /**
         * 监听鼠标移动事件获取鼠标位置
         */
        Mouse3DManager.prototype.onMousemove = function (event) {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        };
        /**
         * 渲染
         */
        Mouse3DManager.prototype.draw = function (context3D, scene3D, camera) {
            if (!this.viewRect.contains(this.mouseX, this.mouseY))
                return;
            var offsetX = -(this.mouseX - this.viewRect.x);
            var offsetY = -(this.viewRect.height - (this.mouseY - this.viewRect.y)); //y轴与window中坐标反向，所以需要 h = (maxHeight - h)
            context3D.clearColor(0, 0, 0, 0);
            context3D.clearDepth(1);
            context3D.clear(feng3d.Context3D.COLOR_BUFFER_BIT | feng3d.Context3D.DEPTH_BUFFER_BIT);
            context3D.viewport(offsetX, offsetY, this.viewRect.width, this.viewRect.height);
            this.mouseRenderer.draw(context3D, scene3D, camera);
            var object3D = this.mouseRenderer.selectedObject3D;
            this.setSelectedObject3D(object3D);
        };
        /**
         * 设置选中对象
         */
        Mouse3DManager.prototype.setSelectedObject3D = function (value) {
            var _this = this;
            if (this.selectedObject3D != value) {
                if (this.selectedObject3D)
                    this.selectedObject3D.dispatchEvent(new Mouse3DEvent(Mouse3DEvent.MOUSE_OUT, null, true));
                if (value)
                    value.dispatchEvent(new Mouse3DEvent(Mouse3DEvent.MOUSE_OVER, null, true));
            }
            this.selectedObject3D = value;
            if (this.selectedObject3D) {
                this.mouseEventTypes.forEach(function (element) {
                    switch (element) {
                        case feng3d.inputType.MOUSE_DOWN:
                            if (_this.preMouseDownObject3D != _this.selectedObject3D) {
                                _this.Object3DClickNum = 0;
                                _this.preMouseDownObject3D = _this.selectedObject3D;
                            }
                            _this.selectedObject3D.dispatchEvent(new Mouse3DEvent(mouse3DEventMap[element], null, true));
                            break;
                        case feng3d.inputType.MOUSE_UP:
                            if (_this.selectedObject3D == _this.preMouseDownObject3D) {
                                _this.Object3DClickNum++;
                            }
                            else {
                                _this.Object3DClickNum = 0;
                                _this.preMouseDownObject3D = null;
                            }
                            _this.selectedObject3D.dispatchEvent(new Mouse3DEvent(mouse3DEventMap[element], null, true));
                            break;
                        case feng3d.inputType.MOUSE_MOVE:
                            _this.selectedObject3D.dispatchEvent(new Mouse3DEvent(mouse3DEventMap[element], null, true));
                            break;
                        case feng3d.inputType.CLICK:
                            if (_this.Object3DClickNum > 0)
                                _this.selectedObject3D.dispatchEvent(new Mouse3DEvent(mouse3DEventMap[element], null, true));
                            break;
                        case feng3d.inputType.DOUBLE_CLICK:
                            if (_this.Object3DClickNum > 1)
                                _this.selectedObject3D.dispatchEvent(new Mouse3DEvent(mouse3DEventMap[element], null, true));
                            break;
                    }
                });
            }
            else {
                this.Object3DClickNum = 0;
                this.preMouseDownObject3D = null;
            }
            this.mouseEventTypes.length = 0;
        };
        return Mouse3DManager;
    }());
    feng3d.Mouse3DManager = Mouse3DManager;
    /**
     * 3D鼠标事件
     */
    var Mouse3DEvent = (function (_super) {
        __extends(Mouse3DEvent, _super);
        function Mouse3DEvent() {
            _super.apply(this, arguments);
        }
        /** 鼠标单击 */
        Mouse3DEvent.CLICK = "click3D";
        /** 鼠标按下 */
        Mouse3DEvent.MOUSE_DOWN = "mousedown3d";
        /** 鼠标移动 */
        Mouse3DEvent.MOUSE_MOVE = "mousemove3d";
        /** 鼠标移出 */
        Mouse3DEvent.MOUSE_OUT = "mouseout3d";
        /** 鼠标移入 */
        Mouse3DEvent.MOUSE_OVER = "mouseover3d";
        /** 鼠标弹起 */
        Mouse3DEvent.MOUSE_UP = "mouseup3d";
        return Mouse3DEvent;
    }(feng3d.Event));
    feng3d.Mouse3DEvent = Mouse3DEvent;
    /**
     * 鼠标事件与3D鼠标事件类型映射
     */
    var mouse3DEventMap = {};
})(feng3d || (feng3d = {}));
feng3d.ShaderLib.shaderFileMap = { "shaders/color.fragment.glsl": "\r\n\r\nprecision mediump float;\r\n\r\nuniform vec4 u_diffuseInput;\r\n\r\n\r\n\r\nvoid main(void) {\r\n   \r\n    gl_FragColor = u_diffuseInput;\r\n}\r\n", "shaders/color.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvoid main(void) {\r\n\r\n    vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\r\n    gl_Position = u_viewProjection * globalPosition;\r\n}", "shaders/modules/pointLightShading.declare.glsl": "//参考资料\r\n//http://blog.csdn.net/leonwei/article/details/44539217\r\n//https://github.com/mcleary/pbr/blob/master/shaders/phong_pbr_frag.glsl\r\n\r\n#if NUM_POINTLIGHT > 0\r\n    //点光源位置列表\r\n    uniform vec3 u_pointLightPositions[NUM_POINTLIGHT];\r\n    //点光源漫反射颜色\r\n    uniform vec3 u_pointLightColors[NUM_POINTLIGHT];\r\n    //点光源镜面反射颜色\r\n    uniform float u_pointLightIntensitys[NUM_POINTLIGHT];\r\n    //反射率\r\n    uniform float u_reflectance;\r\n    //粗糙度\r\n    uniform float u_roughness;\r\n    //金属度\r\n    uniform float u_metalic;\r\n\r\n    vec3 fresnelSchlick(float VdotH,vec3 reflectance){\r\n\r\n        return reflectance + (1.0 - reflectance) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);\r\n        // return reflectance;\r\n    }\r\n\r\n    float normalDistributionGGX(float NdotH,float alphaG){\r\n\r\n        float alphaG2 = alphaG * alphaG;\r\n        float d = NdotH * NdotH * (alphaG2 - 1.0) + 1.0; \r\n        return alphaG2 / (3.1415926 * d * d);\r\n    }\r\n\r\n    float smithVisibility(float dot,float alphaG){\r\n\r\n        float tanSquared = (1.0 - dot * dot) / (dot * dot);\r\n        return 2.0 / (1.0 + sqrt(1.0 + alphaG * alphaG * tanSquared));\r\n    }\r\n\r\n    vec3 calculateLight(vec3 normal,vec3 viewDir,vec3 lightDir,vec3 lightColor,float lightIntensity,vec3 baseColor,vec3 reflectance,float roughness){\r\n\r\n        //BRDF = D(h) * F(1, h) * V(l, v, h) / (4 * dot(n, l) * dot(n, v));\r\n\r\n        vec3 halfVec = normalize(lightDir + viewDir);\r\n        float NdotL = clamp(dot(normal,lightDir),0.0,1.0);\r\n        float NdotH = clamp(dot(normal,halfVec),0.0,1.0);\r\n        float NdotV = max(abs(dot(normal,viewDir)),0.000001);\r\n        float VdotH = clamp(dot(viewDir, halfVec),0.0,1.0);\r\n        \r\n        float alphaG = max(roughness * roughness,0.0005);\r\n\r\n        //F(v,h)\r\n        vec3 F = fresnelSchlick(VdotH, reflectance);\r\n\r\n        //D(h)\r\n        float D = normalDistributionGGX(NdotH,alphaG);\r\n\r\n        //V(l,h)\r\n        float V = smithVisibility(NdotL,alphaG) * smithVisibility(NdotV,alphaG) / (4.0 * NdotL * NdotV);\r\n\r\n        vec3 specular = max(0.0, D * V) * 3.1415926 * F;\r\n        \r\n        return (baseColor + specular) * NdotL * lightColor * lightIntensity;\r\n    }\r\n\r\n    //渲染点光源\r\n    vec3 pointLightShading(vec3 normal,vec3 baseColor){\r\n\r\n        float reflectance = u_reflectance;\r\n        float roughness = u_roughness;\r\n        float metalic = u_metalic;\r\n\r\n        reflectance = mix(0.0,0.5,reflectance);\r\n        vec3 realBaseColor = (1.0 - metalic) * baseColor;\r\n        vec3 realReflectance = mix(vec3(reflectance),baseColor,metalic);\r\n\r\n        vec3 totalLightColor = vec3(0.0,0.0,0.0);\r\n        for(int i = 0;i<NUM_POINTLIGHT;i++){\r\n            //光照方向\r\n            vec3 lightDir = normalize(u_pointLightPositions[i] - v_globalPosition);\r\n            //视线方向\r\n            vec3 viewDir = normalize(u_cameraMatrix[3].xyz - v_globalPosition);\r\n            //灯光颜色\r\n            vec3 lightColor = u_pointLightColors[i];\r\n            //灯光强度\r\n            float lightIntensity = u_pointLightIntensitys[i];\r\n\r\n            totalLightColor = totalLightColor + calculateLight(normal,viewDir,lightDir,lightColor,lightIntensity,realBaseColor,realReflectance,roughness);\r\n        }\r\n        \r\n        return totalLightColor;\r\n    }\r\n#endif", "shaders/modules/pointLightShading.main.glsl": "#if NUM_POINTLIGHT > 0\r\n    // finalColor = finalColor * 0.5 +  pointLightShading(v_normal,u_baseColor) * 0.5;\r\n    finalColor.xyz = pointLightShading(v_normal,finalColor.xyz);\r\n#endif", "shaders/mouse.fragment.glsl": "\r\n\r\nprecision highp float;\r\n\r\nuniform int u_objectID;\r\n\r\nvoid main(){\r\n\r\n    //支持 255*255*255*255 个索引\r\n    const float invColor = 1.0/255.0;\r\n    float temp = float(u_objectID);\r\n    temp = floor(temp) * invColor;\r\n    gl_FragColor.x = fract(temp);\r\n    temp = floor(temp) * invColor;\r\n    gl_FragColor.y = fract(temp);\r\n    temp = floor(temp) * invColor;\r\n    gl_FragColor.z = fract(temp);\r\n    temp = floor(temp) * invColor;\r\n    gl_FragColor.w = fract(temp);\r\n}", "shaders/mouse.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvoid main(){\r\n\r\n    vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\r\n    gl_Position = u_viewProjection * globalPosition;\r\n}", "shaders/particle.fragment.glsl": "\r\nprecision mediump float;\r\n\r\n//此处将填充宏定义\r\n#define macros\r\n\r\nvarying vec4 v_particle_color;\r\n\r\n\r\n\r\nvoid main(void) {\r\n\r\n    gl_FragColor = v_particle_color;\r\n}\r\n", "shaders/particle.vertex.glsl": "\r\nprecision mediump float;\r\n\r\n//根据是否提供(a_particle_position)数据自动定义 #define D_(a_particle_position)\r\n\r\n//此处将填充宏定义\r\n#define macros\r\n\r\nattribute vec3 a_position;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nattribute float a_particle_birthTime;\r\n\r\n#ifdef D_a_particle_position\r\n    attribute vec3 a_particle_position;\r\n#endif\r\n\r\n#ifdef D_a_particle_velocity\r\n    attribute vec3 a_particle_velocity;\r\n#endif\r\n\r\n#ifdef D_a_particle_color\r\n    attribute vec4 a_particle_color;\r\n    varying vec4 v_particle_color;\r\n#endif\r\n\r\nuniform float u_particleTime;\r\n\r\n#ifdef D_u_particle_acceleration\r\n    uniform vec3 u_particle_acceleration;\r\n#endif\r\n\r\nvoid main(void) {\r\n\r\n    vec3 position = a_position;\r\n\r\n    float pTime = u_particleTime - a_particle_birthTime;\r\n    if(pTime > 0.0){\r\n\r\n        vec3 pPosition = vec3(0.0,0.0,0.0);\r\n        vec3 pVelocity = vec3(0.0,0.0,0.0);\r\n\r\n        #ifdef D_a_particle_position\r\n            pPosition = pPosition + a_particle_position;\r\n        #endif\r\n\r\n        #ifdef D_a_particle_velocity\r\n            pVelocity = pVelocity + a_particle_velocity;\r\n        #endif\r\n\r\n        #ifdef D_u_particle_acceleration\r\n            pVelocity = pVelocity + u_particle_acceleration * pTime;\r\n        #endif\r\n        \r\n        #ifdef D_a_particle_color\r\n            v_particle_color = a_particle_color;\r\n        #endif\r\n\r\n        pPosition = pPosition + pVelocity * pTime;\r\n        position = position + pPosition;\r\n    }\r\n    \r\n    vec4 globalPosition = u_modelMatrix * vec4(position, 1.0);\r\n    gl_Position = u_viewProjection * globalPosition;\r\n    gl_PointSize = 1.0;\r\n}", "shaders/point.fragment.glsl": "\r\n\r\nprecision mediump float;\r\n\r\n\r\n\r\nvoid main(void) {\r\n   \r\n    gl_FragColor = vec4(1.0,1.0,1.0,1.0);\r\n}\r\n", "shaders/point.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\n\r\nuniform float u_PointSize;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvoid main(void) {\r\n\r\n    vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\r\n    gl_Position = u_viewProjection * globalPosition;\r\n    gl_PointSize = u_PointSize;\r\n}", "shaders/postEffect/fxaa.fragment.glsl": "\r\n\r\n#define FXAA_REDUCE_Mvarying   (1.0/128.0)\r\n#define FXAA_REDUCE_MUL   (1.0/8.0)\r\n#define FXAA_SPAN_MAX     8.0\r\n\r\nvarying vec2 vUV;\r\nuniform sampler2D textureSampler;\r\nuniform vec2 texelSize;\r\n\r\n\r\n\r\nvoid main(){\r\n\tvec2 localTexelSize = texelSize;\r\n\tvec4 rgbNW = texture2D(textureSampler, (vUV + vec2(-1.0, -1.0) * localTexelSize));\r\n\tvec4 rgbNE = texture2D(textureSampler, (vUV + vec2(1.0, -1.0) * localTexelSize));\r\n\tvec4 rgbSW = texture2D(textureSampler, (vUV + vec2(-1.0, 1.0) * localTexelSize));\r\n\tvec4 rgbSE = texture2D(textureSampler, (vUV + vec2(1.0, 1.0) * localTexelSize));\r\n\tvec4 rgbM = texture2D(textureSampler, vUV);\r\n\tvec4 luma = vec4(0.299, 0.587, 0.114, 1.0);\r\n\tfloat lumaNW = dot(rgbNW, luma);\r\n\tfloat lumaNE = dot(rgbNE, luma);\r\n\tfloat lumaSW = dot(rgbSW, luma);\r\n\tfloat lumaSE = dot(rgbSE, luma);\r\n\tfloat lumaM = dot(rgbM, luma);\r\n\tfloat lumaMvarying = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\r\n\tfloat lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\r\n\r\n\tvec2 dir = vec2(-((lumaNW + lumaNE) - (lumaSW + lumaSE)), ((lumaNW + lumaSW) - (lumaNE + lumaSE)));\r\n\r\n\tfloat dirReduce = max(\r\n\t\t(lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),\r\n\t\tFXAA_REDUCE_MIN);\r\n\r\n\tfloat rcpDirMvarying = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\r\n\tdir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\r\n\t\tmax(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\r\n\t\tdir * rcpDirMin)) * localTexelSize;\r\n\r\n\tvec4 rgbA = 0.5 * (\r\n\t\ttexture2D(textureSampler, vUV + dir * (1.0 / 3.0 - 0.5)) +\r\n\t\ttexture2D(textureSampler, vUV + dir * (2.0 / 3.0 - 0.5)));\r\n\r\n\tvec4 rgbB = rgbA * 0.5 + 0.25 * (\r\n\t\ttexture2D(textureSampler, vUV + dir *  -0.5) +\r\n\t\ttexture2D(textureSampler, vUV + dir * 0.5));\r\n\tfloat lumaB = dot(rgbB, luma);\r\n\tif ((lumaB < lumaMin) || (lumaB > lumaMax)) {\r\n\t\tgl_FragColor = rgbA;\r\n\t}\r\n\telse {\r\n\t\tgl_FragColor = rgbB;\r\n\t}\r\n}", "shaders/segment.fragment.glsl": "\r\nprecision mediump float;\r\n\r\nvarying vec4 v_color;\r\n\r\n\r\n\r\nvoid main(void) {\r\n    gl_FragColor = v_color;\r\n}", "shaders/segment.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\nattribute vec4 a_color;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvarying vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = u_viewProjection * u_modelMatrix * vec4(a_position, 1.0);\r\n    v_color = a_color;\r\n}", "shaders/skeleton.fragment.glsl": "\r\n\r\nprecision mediump float;\r\n\r\nuniform sampler2D s_texture;\r\nvarying vec2 v_uv;\r\n\r\n\r\n\r\nvoid main(void) {\r\n   \r\n    gl_FragColor = texture2D(s_texture, v_uv);\r\n}\r\n", "shaders/skeleton.vertex.glsl": "\r\nprecision mediump float;\r\n\r\n//此处将填充宏定义\r\n#define macros\r\n\r\nattribute vec3 a_position;\r\nattribute vec2 a_uv;\r\n\r\nattribute vec4 a_jointindex0;\r\nattribute vec4 a_jointweight0;\r\n\r\nattribute vec4 a_jointindex1;\r\nattribute vec4 a_jointweight1;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nuniform mat4 u_skeletonGlobalMatriices[NUM_SKELETONJOINT];\r\n\r\nvarying vec2 v_uv;\r\n\r\nvoid main(void) {\r\n\r\n    int jointIndics[8];\r\n    jointIndics[0] = int(a_jointindex0.x);\r\n    jointIndics[1] = int(a_jointindex0.y);\r\n    jointIndics[2] = int(a_jointindex0.z);\r\n    jointIndics[3] = int(a_jointindex0.w);\r\n    jointIndics[4] = int(a_jointindex1.x);\r\n    jointIndics[5] = int(a_jointindex1.y);\r\n    jointIndics[6] = int(a_jointindex1.z);\r\n    jointIndics[7] = int(a_jointindex1.w);\r\n\r\n    float jointweights[8];\r\n    jointweights[0] = a_jointweight0.x;\r\n    jointweights[1] = a_jointweight0.y;\r\n    jointweights[2] = a_jointweight0.z;\r\n    jointweights[3] = a_jointweight0.w;\r\n    jointweights[4] = a_jointweight1.x;\r\n    jointweights[5] = a_jointweight1.y;\r\n    jointweights[6] = a_jointweight1.z;\r\n    jointweights[7] = a_jointweight1.w;\r\n\r\n    vec4 position = vec4(a_position,1.0);\r\n    vec4 totalPosition = vec4(0.0,0.0,0.0,1.0);\r\n    for(int i = 0; i < 8; i++){\r\n\r\n        totalPosition += u_skeletonGlobalMatriices[jointIndics[i]] * position * jointweights[i];\r\n\r\n        // totalPosition.x += dot(position, u_skeletonGlobalMatriices[jointIndics[i] * 3]) * jointweights[i];\r\n        // totalPosition.y += dot(position, u_skeletonGlobalMatriices[jointIndics[i] * 3 + 1]) * jointweights[i];\r\n        // totalPosition.z += dot(position, u_skeletonGlobalMatriices[jointIndics[i] * 3 + 2]) * jointweights[i];\r\n    }\r\n    position = totalPosition;\r\n    position.w = 1.0;\r\n\r\n    vec4 globalPosition = u_modelMatrix * position;\r\n    gl_Position = u_viewProjection * globalPosition;\r\n    v_uv = a_uv;\r\n}", "shaders/skybox.fragment.glsl": "\r\n\r\nprecision highp float;\r\n\r\nuniform samplerCube s_skyboxTexture;\r\nuniform mat4 u_cameraMatrix;\r\n\r\nvarying vec3 v_worldPos;\r\n\r\n\r\n\r\nvoid main(){\r\n    vec3 viewDir = normalize(v_worldPos - u_cameraMatrix[3].xyz);\r\n    gl_FragColor = textureCube(s_skyboxTexture, viewDir);\r\n}", "shaders/skybox.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\n\r\nuniform mat4 u_cameraMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nuniform vec3 u_skyBoxSize;\r\n\r\nvarying vec3 v_worldPos;\r\n\r\nvoid main(){\r\n    vec3 worldPos = a_position.xyz * u_skyBoxSize.xyz + u_cameraMatrix[3].xyz;\r\n    gl_Position = u_viewProjection * vec4(worldPos.xyz,1.0);\r\n    v_worldPos = worldPos;\r\n}", "shaders/standard.fragment.glsl": "\r\nprecision mediump float;\r\n\r\n//此处将填充宏定义\r\n#define macros\r\n\r\nvarying vec2 v_uv;\r\nvarying vec3 v_globalPosition;\r\nvarying vec3 v_normal;\r\n\r\nuniform mat4 u_cameraMatrix;\r\n//基本颜色\r\nuniform vec4 u_baseColor;\r\n\r\n#include<modules/pointLightShading.declare>\r\n\r\n\r\n\r\nvoid main(void) {\r\n\r\n    vec4 finalColor = u_baseColor;\r\n    \r\n    //渲染灯光\r\n    #include<modules/pointLightShading.main>\r\n\r\n    gl_FragColor = finalColor;\r\n}", "shaders/standard.vertex.glsl": "\r\n\r\n//此处将填充宏定义\r\n#define macros\r\n\r\n//坐标属性\r\nattribute vec3 a_position;\r\nattribute vec2 a_uv;\r\nattribute vec3 a_normal;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvarying vec2 v_uv;\r\nvarying vec3 v_globalPosition;\r\nvarying vec3 v_normal;\r\n\r\nvoid main(void) {\r\n\r\n    //获取全局坐标\r\n    vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\r\n    //计算投影坐标\r\n    gl_Position = u_viewProjection * globalPosition;\r\n    //输出全局坐标\r\n    v_globalPosition = globalPosition.xyz;\r\n    //输出uv\r\n    v_uv = a_uv;\r\n    //输出法线，此处待处理\r\n    v_normal = a_normal;\r\n}", "shaders/terrain.fragment.glsl": "\r\n\r\nprecision mediump float;\r\n\r\nuniform sampler2D s_texture;\r\nuniform sampler2D s_blendTexture;\r\nuniform sampler2D s_splatTexture1;\r\nuniform sampler2D s_splatTexture2;\r\nuniform sampler2D s_splatTexture3;\r\n\r\nuniform vec4 u_splatRepeats;\r\n\r\nvarying vec2 v_uv;\r\n\r\n\r\n\r\nvoid main(void) {\r\n\r\n    vec2 t_uv = v_uv.xy * u_splatRepeats.x;\r\n    vec4 finalColor = texture2D(s_texture,t_uv);\r\n    \r\n    vec4 blend = texture2D(s_blendTexture,v_uv);\r\n\r\n    t_uv = v_uv.xy * u_splatRepeats.y;\r\n    vec4 tColor = texture2D(s_splatTexture1,t_uv);\r\n    finalColor = (tColor - finalColor) * blend.x + finalColor;\r\n\r\n    t_uv = v_uv.xy * u_splatRepeats.z;\r\n    tColor = texture2D(s_splatTexture2,t_uv);\r\n    finalColor = (tColor - finalColor) * blend.y + finalColor;\r\n\r\n    t_uv = v_uv.xy * u_splatRepeats.w;\r\n    tColor = texture2D(s_splatTexture3,t_uv);\r\n    finalColor = (tColor - finalColor) * blend.z + finalColor;\r\n\r\n    gl_FragColor = finalColor;\r\n}", "shaders/terrain.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\nattribute vec2 a_uv;\r\n\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvarying vec2 v_uv;\r\n\r\nvoid main(void) {\r\n\r\n    gl_Position = u_viewProjection * u_modelMatrix * vec4(a_position, 1.0);\r\n\r\n    v_uv = a_uv;\r\n}", "shaders/texture.fragment.glsl": "\r\n\r\nprecision mediump float;\r\n\r\nuniform sampler2D s_texture;\r\nvarying vec2 v_uv;\r\n\r\n\r\n\r\nvoid main(void) {\r\n\r\n    gl_FragColor = texture2D(s_texture, v_uv);\r\n}\r\n", "shaders/texture.vertex.glsl": "\r\n\r\nattribute vec3 a_position;\r\nattribute vec2 a_uv;\r\n\r\nvarying vec2 v_uv;\r\nuniform mat4 u_modelMatrix;\r\nuniform mat4 u_viewProjection;\r\n\r\nvoid main(void) {\r\n\r\n    gl_Position = u_viewProjection * u_modelMatrix * vec4(a_position, 1.0);\r\n    v_uv = a_uv;\r\n}" };
var feng3d;
(function (feng3d) {
    /**
     * feng3d的版本号
     * @author feng 2015-03-20
     */
    var $REVISION = "0.0.0";
    console.log("Feng3D version " + $REVISION);
    /*************************** 初始化模块 ***************************/
    // export var feng3dObjects: { [parentUUid: string]: any } = {};
    /**
     * 是否开启调试(主要用于断言)
     */
    feng3d.debuger = true;
    //数据持久化
    feng3d.serialization = new feng3d.Serialization();
    //键盘鼠标输入
    feng3d.input = new feng3d.Input();
    feng3d.inputType = new feng3d.InputEventType();
    //快捷键
    feng3d.shortcut = new feng3d.ShortCut();
})(feng3d || (feng3d = {}));
//# sourceMappingURL=feng3d.js.map