/**
 * Created by simon on 2016/11/15.
 */
;(function (global, DOC) {
    var W3C = DOC.dispatchEvent;
    var hasOwn = Object.prototype.hasOwnProperty;

    String.prototype.format = function () {
        var args = arguments, i = 0;
        return this.replace(/\{(\d*)\}/g, function () {return args[i++];});
    };
    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length;i < n;i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret;
        return Function("fn,scope", fun);
    }

    Array.prototype.filter = iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r');
    Array.prototype.map = iterator('r=[],', 'r[i]=_', 'return r');
    Array.prototype.forEach = iterator('', '_', '');
    Array.prototype.contains = function (item) {
        return this.indexOf(item) > -1;
    };
    Array.prototype.removeAt = function (index) {
        return !!this.splice(index, 1).length;
    };
    Array.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (~index)
            return this.removeAt(index);

        return false;
    };
    Array.prototype.indexOf = function (item, index) {
        var n = this.length, i = ~~index;
        if (i < 0)i += n;
        for (; i < n; i++)if (this[i] === item)return i;
        return -1;
    };
    String.prototype.startsWith = function (str, ignorecase) {
        var end_str = this.substr(0, str.length);
        return ignorecase ? end_str.toLocaleLowerCase() === str.toLowerCase() :
            end_str === str;
    };
    String.prototype.endsWith = function (str, ignorecase) {
        var end_str = this.substring(this.length - str.length);
        return ignorecase ? end_str.toLocaleLowerCase() === str.toLowerCase() :
            end_str === str;
    };


    global.ump = function () {};
    function mix(receiver, supplier) {
        var args = [].slice.call(arguments),
            i = 1,
            key, //如果最后参数是布尔，判定是否覆写同名属性
            ride = typeof args[args.length - 1] === "boolean" ? args.pop() : true;

        if (args.length === 1) { //处理$.mix(hash)的情形
            receiver = !this.window ? this : {};
            i = 0;
        }
        while ((supplier = args[i++])) {
            for (key in supplier) { //允许对象糅杂，用户保证都是对象
                if (hasOwn.call(supplier, key) && (ride || !(key in receiver))) {
                    receiver[key] = supplier[key];
                }
            }
        }

        return receiver;
    }

    function delay(fun, flagFun, undefined) {
        if (flagFun == undefined)
            flagFun = function () {
                return true;
            };

        function trueDelay(func) {
            setTimeout(func, 1);
        }

        function execute(func, flagFun) {
            if (!flagFun())
                trueDelay(func, flagFun);
            else
                func();
        }

        trueDelay(function () {
            execute(fun, flagFun);
        });
    }

    mix(ump, {
        version: '1.0',
        mix: mix,
        extend: $.extend,
        rword: /[^, ]+/g,
        slice: W3C ? function (nodes, start, end) {
            return factorys.slice.call(nodes, start, end);
        } : function (nodes, start, end) {
            var ret = [], n = nodes.length;
            if (end === void 0 || typeof end === "number" && isFinite(end)) {
                start = parseInt(start, 10) || 0;
                end = end === void 0 ? n : parseInt(end, 10);
                if (start < 0) {start += n;}
                if (end > n) { end = n; }
                if (end < 0) { end += n; }
                for (var i = start; i < end; ++i) {
                    ret[i - start] = nodes[i];
                }
            }
            return ret;
        },
        delay: delay,
        noop: function () {},
        createObject: function (o) {
            var F = function () {};
            F.prototype = o;
            return new F();
        },
        guid: function () {
            return Math.random().toString().substr(2);
        },
        uid: function () {
            return setTimeout("1");
        }
    });

    mix(ump, {
        type: $.type,
        isFunction: $.isFunction,
        isArray: function (obj) {
            return this.type(obj) === 'array';
        },
        isBoolean: function (obj) {
            return this.type(obj) === 'boolean';
        },
        isString: function (obj) {
            return this.type(obj) === 'string';
        },
        isBaseType: function (obj) {
            return typeof obj != 'object';
        },
        isPlainObject: $.isPlainObject
    });

    mix(ump, {
        ready: function (fun) {$(fun);},
        redirect: function (url, target) {
            if (target == '_blank') {
                window.open(url)
            } else {
                window.location.href = url;
            }
        },
        reload: function () {
            window.location.reload();
        },
        getDom: function (id) {return document.getElementById(id)}
    });

    //简单的模块化设计，并不包括动态加载
    var modules = {}, factorys = [], loadings = [];
    global.require = ump.require = function (list, factory, parent) {
        var deps = {},//用于检测它的依赖是否都为2
            args = [],//用于保存依赖模块的返回值
            dn = 0,//需要引入的模块数
            cn = 0,//已安装完的模块数
            id = parent || "anonymous-" + setTimeout("1");

        String(list).replace(ump.rword, function (el) {
            dn++;
            if (modules[el] && modules[el].state === 2) {cn++;}
            if (!deps[el]) {
                args.push(el);
                deps[el] = true;
            }
        });

        modules[id] = {
            id: id,
            factory: factory,
            deps: deps,
            args: args,
            state: 1
        };

        if (dn === cn) {
            fireFactory(id, args, factory)
        } else {
            loadings.unshift(id);
        }
        checkDeps();
    };
    global.define = ump.define = function (id, deps, factory) {
        if (typeof deps === 'function') {
            factory = deps;
            deps = [];
        }
        require(deps, factory, id);
    };

    function checkCycle(deps, nick) {
        for (var id in deps) {
            var dep = deps[id];
            if (modules[dep] && modules[dep].state !== 2
                && (id === nick || checkCycle(modules[dep].deps, nick))) {
                return true;
            }
        }
    }

    function fireFactory(id, deps, factory) {
        if (checkCycle(deps, id))
            ump.error("模块之间存在循环依赖");

        for (var i = 0, array = [], d; d = deps[i++];) {
            array.push(modules[d].exports);
        }
        var module = Object(modules[id]),
            ret = factory.apply(global, array);
        module.state = 2;
        if (ret !== void 0) {
            modules[id].exports = ret;
        }
        return ret;
    }

    function checkDeps() {
        var checkLater = false;
        //检测此JS模块的依赖是否都已安装完毕,是则安装自身
        loop: for (var i = loadings.length, id; id = loadings[--i];) {
            var obj = modules[id],
                deps = obj.deps;
            for (var key in deps) {
                if (hasOwn.call(deps, key) && (!modules[key] || modules[key].state !== 2)) {
                    checkLater = true;
                    continue loop;
                }
            }
            //如果deps是空对象或者其依赖的模块的状态都是2
            if (obj.state !== 2) {
                loadings.splice(i, 1); //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                fireFactory(obj.id, obj.args, obj.factory);
                checkDeps();//如果成功,则再执行一次,以防有些模块就差本模块没有安装好
            }
        }
        if (checkLater)
            delay(checkDeps);
    }

    $.extend({
        getObjectValue: function (data, path) {
            if (ump.isString(path))
                path = path.split('.');

            var key = path.shift();
            return path.length == 0 ? data[key] : this.getObjectValue(data[key], path);
        }
    });
    $.fn.extend({
        fillData: function (data) {
            this.find('span[key]').each(function () {
                var el = $(this);
                el.html($.getObjectValue(data, el.attr('key')));
            });
        }
    });

    //导出System模块
    define("System", [], function () {
        return ump;
    });

    //引入jQuery，后续也可以根据情况替换成其他库
    define("$", [], function () {
        $.extend($.fn, {
            hasAttr: function (attr, undefined) {
                return this.attr(attr) !== undefined
            }
        });
        return $;
    });

    define("Echarts", [], function () {
        try {
            return echarts;
        } catch (e) {
            return {};
        }
    })

})(window, document);


/**
 * 定义Event事件模型，为应用框架提供便利的调用方式。
 */
define("Event", "System", function (System) {
    var Event = function (targetName, eventTarget) {
        return Event.weave(targetName, eventTarget);
    };

    var cache = {},
        eventQueue = [];
    System.mix(Event, {
        weave: function (targetName, eventTarget) {
            if (eventTarget === undefined && cache[targetName])
                return cache[targetName];

            if (eventTarget === undefined)eventTarget = {};

            System.extend(true, eventTarget, baseEvent);
            eventTarget.setName(targetName);

            return eventTarget;
        },
        fire: function (eventTarget, eventType, eventData, sync) {
            cache[eventTarget].fire(eventType, eventData, sync);
        },
        bind: function (eventTarget, eventType, priority, callback) {
            cache[eventTarget].bind(eventType, priority, callback);
        },
        clear: function (eventTarget, eventType, level) {
            cache[eventTarget].clear(eventType, level);
        }
    });

    var baseEvent = {
        name: "",
        handlerManager: {},
        setName: function (name) {
            this.name = name;
            cache[name] = this;
        },
        fire: function (eventType, eventData, sync) {
            var self = this;
            if (System.isBoolean(eventData))
                sync = eventData;
            else if (!System.isBoolean(sync))
                sync = true;

            if (!sync) {
                System.delay(function () {self.fire(eventType, eventData, true);});
                return;
            }

            var handlers = this.handlerManager[eventType];
            var priorityList = [];
            for (var priority in handlers)
                priorityList.push(priority)

            priorityList.sort(function (a, b) {return a - b}).forEach(function (p) {
                var hp = handlers[p];
                hp.forEach(function (data) {
                    data.call(this, eventData, eventType);
                });
            });
        },
        bind: function (eventType, priority, callback) {
            if ($.isFunction(priority)) {
                callback = priority;
                priority = 100;
            }

            var handlers = this.handlerManager[eventType] = this.handlerManager[eventType] || {};
            handlers[priority] = handlers[priority] || [];
            handlers[priority].push(callback);
            return this;
        },
        clear: function (eventType, level) {
            var handlers = this.handlerManager[eventType];
            if (!handlers)return;

            if (level != undefined) {
                delete handlers[level]
            } else {
                this.handlerManager[eventType] = {};
            }
        }
    };

    return Event;
});

/**
 * Created by simon on 2016/11/16.
 */
;define("Util", "$, System", function ($, System) {
    //添加基础的全局工具
    var Util = {
        alert: function (str) {
            alert(str);
        },
        toast: function (str, timeout) {
            this.alert(str);
        },
        message: function (msg, timeout) {
            this.toast(msg, timeout);
        },
        confirm: function (message, callback) {
            confirm(message)
            callback();
        },
        progressBar: function (title, message, callback) {
            progressBar(title, message);
            callback();
        },
        dateFormat: function (time) {
            return new Date(time).format("yyyy-MM-dd HH:mm:ss");
        },
        isEmpty: function () {
            for (var key = 0; key < arguments.length; key++) {
                if (!arguments[key] || arguments[key].length == 0) {
                    return true;
                }
            }
            return false;
        },
        isUndefined: function (value, undefined) {
            return value == undefined;
        },
        compat: (function (ua) {
            var underIe9 = false;
            if (ua.indexOf("MSIE") > 0) {
                underIe9 = true;
                if (ua.indexOf("MSIE 9.0") > 0) {
                    underIe9 = false;
                }
                if (ua.indexOf("MSIE 10.0") > 0) {
                    underIe9 = false;
                }
            }
            return {
                UNDER_IE_9: underIe9,
                LEFT_MOUSE: underIe9 ? 1 : 0
            }
        })(navigator.userAgent),
        $document: $(document),
        $window: $(window)
    };
    System.mix(Util, {
        trim: function (str) {
            if (!System.isString(str)) {
                return '';
            }
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
    });
    System.mix(Util, {
        error: function (str) {
            throw str;
        },
        log: function (str) {
            // for (var i = 0; i < arguments.length; i++)
            //     console.log(arguments[i]);
        }
    });
    return Util;
});
/**
 * Created by simon on 2016/11/15.
 */
define("Widget", ["System, $"], function (System, $) {
    var Widget = function () {};
    Widget.prototype = {
        options: {
            classes: {},
            disabled: false
        },
        _createWidget: function (options, element) {
            $.data(element, this.widgetName, this);
            this.element = $(element).addClass(this.widgetBaseClass);
            this.options = $.extend(true, {}, this.options, options);
            this._create();
            this._init();
        },
        _create: function () { },
        _init: function () { },
        _destroy: function () {},
        destroy: function () {
            this._destroy();
            this.element.removeClass(this.widgetBaseClass).empty().data(this.widgetName, null);
        },
        option: function (key, value) {
            var options = {};
            if (typeof key === "string") {
                if (value === undefined) {
                    return this.options[key];
                }
                options[key] = value;
            } else if (typeof key === "object") {
                options = key;
            }

            $.extend(true, this.options, options);
            return this;
        }
    };

    var factory = {};
    return function (name, base) {
        factory[name] = function (options, element) {
            if (arguments.length)
                this._createWidget(options, element);
        };

        var basePrototype = new Widget();
        basePrototype.options = $.extend(true, {}, basePrototype.options);
        factory[name].prototype = $.extend(true, basePrototype, {
            widgetName: name,
            widgetBaseClass: "cwm-" + name
        }, base);

        $.fn[name] = function (options) {
            var isMethodCall = typeof options === "string",
                args = System.slice(arguments, 1),
                returnValue = this, undefined;

            options = !isMethodCall && args.length ?
                $.extend.apply(null, [true, options].concat(args)) :
                options;

            //以_开头方法为私有函数, 不允许调用
            if (isMethodCall && options.charAt(0) === "_") {
                return returnValue;
            }

            if (isMethodCall) {
                this.each(function () {
                    var instance = $.data(this, name),
                        methodValue = instance && $.isFunction(instance[options]) ?
                            instance[options].apply(instance, args) :
                            instance;

                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $.data(this, name);
                    if (instance) {
                        instance.option(options || {})._init();
                    } else {
                        instance = new factory[name](options, this);
                        $.data(this, name, instance);
                    }
                });
            }

            return returnValue;
        }
    };
});

/**
 * Created by simon on 2016/12/2.
 */
define("Cookie", function () {
    var Cookie = {
        get: function (name) {
            var search = name + "="
            if (document.cookie.length > 0) {
                var offset = document.cookie.indexOf(search)
                if (offset != -1) {
                    offset += search.length
                    var end = document.cookie.indexOf(";", offset)
                    if (end == -1) end = document.cookie.length;
                    return unescape(document.cookie.substring(offset, end))
                }
            }
            return "";
        },
        set: function (name, value, expireHours) {
            var exDate = new Date();
            exDate.setHours(exDate.getHours() + expireHours);
            document.cookie = name + "=" + escape(value) + ((expireHours == null) ? "" : ";expires=" + exDate.toGMTString() + ';path=/');
        },
        clear: function (name) {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    if (name === undefined || name === keys[i]) {
                        document.cookie = keys[i] + '=0;expires=' + new Date().toUTCString() + ';path=/';
                    }
                }
            }
        }
    };

    return Cookie;
});
/**
 * Created by simon on 2016/12/2.
 */

define("Application", "System, Cookie,Event", function (System, Cookie, Event) {
        function parseURL(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }

        var Application = {},
            config = {
                redirectByUI: false
            };
        Event.weave("application", Application);

        var cache = {};
        System.mix(Application, {
            init: function (obj) {
                System.mix(config, obj);
            },
            getData: function (key) {
                return cache[key];
            },
            setData: function (key, value) {
                cache[key] = value;
                return value;
            },
            url: parseURL(document.location.href)
        });

        return Application;
    }
);

define("Cache", function () {
    var cache = {};
    return {
        add: function (key, v) {
            cache[key] = v;
            return v;
        },
        get: function (key) {
            return cache[key];
        },
        remove: function (key) {
            var v = cache[key];
            delete cache[key];
            return v;
        },
        'delete': function (key) {
            delete cache[key];
        }
    }
});

define("L", "System, Data", function (System, Data) {
    var LCache = {
        'g.add': '添加',
        'g.confirm': '确认',
        'g.apply': '应用',
        'g.cancel': '取消',
        'g.delete': '删除',
        'g.save': '保存',
        'g.close': '关闭',
        'g.sendEmail': '发送测试邮件'
    };

    var config = {
        module: 'system.language'
    };


    var L = function (key) {
        return LCache[key] || key;
    };

    L.init = function (obj) {
        System.mix(config, obj, true);
    };
    L.push = function (obj) {
        System.mix(LCache, obj, true);
    };
    L.load = function (module) {
        Data.send("get", config.module, {'module': module}, function (data) {
            System.mix(LCache, data, true);
        });
    };
    return L;
});
define("Html", function () {var html = {'widget.portal.edit':'<div class="portal-page-edit"><div class="page-header"></div><div id="portal-page-config"><div style="overflow: hidden;height:500px"><div id="page-auth"></div><div id="config-auth-wrapper"><span class="page-title">认证页</span><div class="m-line"></div><div id="config-auth"></div></div></div><div style="overflow: hidden"><div id="page-success"></div><div id="config-success-wrapper"><span class="page-title">认证成功页</span><div class="m-line"></div><div id="config-success"></div></div></div><div style="overflow: hidden"><input type="button" name="confirm" id="portal-page-save" value="保存" style="display: none"/></div></div></div>',
    'widget.portal':'<div id="portal"><div class="page-header" style="margin: 10px 0 0"></div><div class="template-select-wrapper" style="display: none;"><div style="margin: 15px 8px 15px 0"><!--<span class="if icon-warning if-s13 f-pr5"></span>--><span style="color: #666666"><span class="if icon-require"></span>请选择模板</span><span id="selected-template" style="color: #aaaaaa; margin: 0 8px 0 8px"></span><input id="select-template" type="button" value="选择模板"/><a id="collapse-template" class="m-click f-fr"> 收起<span class="if icon-pull-up f-pl5" style="padding-right: 0"></span></a></div><div class="portal-template-list-wrapper" style="display: none"><div class="left f-csp"><span class="if icon-page-back"></span></div><ul class="portal-template-list clear-fix"></ul><div class="right f-csp"><span class="if icon-page-next"></span></div></div></div><div id="portal-page-edit-wrapper"></div></div>'};return function (name){return html[name] || name;}})
//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
 eval, for, this
 */

/*property
 JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

//Add by SIMON : IE8时强制使用JSON2
if (typeof JSON !== "object" || (navigator.userAgent.indexOf("MSIE 8.0")>0)) {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                f(this.getUTCMonth() + 1) + "-" +
                f(this.getUTCDate()) + "T" +
                f(this.getUTCHours()) + ":" +
                f(this.getUTCMinutes()) + ":" +
                f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === "string"
                ? c
                : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
            typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value)
                    ? String(value)
                    : "null";

            case "boolean":
            case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

            case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

                if (!value) {
                    return "null";
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                            : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                        ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
define('Constant', '', function () {
    return {
        authType: [
            '不加密',
            '',
            'WPA/WPA2',
            'WPA-PSK / WPA2-PSK'
        ],
        authTypeEnum: {
            'NONE': 0,
            'WPA': 2,
            'WPA-PSK': 3
        },
        pskSecSubTypeEnum: {
            'AUTO': 3,
            'WPA-PSK': 1,
            'WPA2-PSK': 2
        },
        pskEncryptTypeEnum: {
            'AUTO': 1,
            'TKIP': 2,
            'AES': 3
        },
        bgnMode: {
            1: '802.11b',
            2: '802.11g',
            3: '802.11n',
            4: '802.11b/g',
            5: '802.11b/g/n'
        },
        bgnModeEnum: {
            '802.11b': 1,
            '802.11g': 2,
            '802.11n': 3,
            '802.11b/g': 4,
            '802.11b/g/n': 5
        },
        channelWidth: {
            1: '20MHz',
            2: '自动',
            3: '40MHz'
        },
        channelWidthEnum: {
            '20MHz': 1,
            'AUTO': 2,
            '40MHz': 3
        },
        channel: ['自动', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        guestNet: ['主人网络', '访客网络'],
        timeZone: [
            ['-720', '(UTC-12:00)埃尼威托克，夸贾林岛'],
            ['-660', '(UTC-11:00)中途岛，萨摩亚群岛'],
            ['-600', '(UTC-10:00)夏威夷'],
            ['-540', '(UTC-09:00)阿拉斯加'],
            ['-480', '(UTC-08:00)太平洋时间(美国和加拿大)；蒂华'],
            ['-420', '(UTC-07:00)山地时间(美国和加拿大)；亚利桑那'],
            ['-360', '(UTC-06:00)中部时间(美国和加拿大)；中美洲，墨西哥城'],
            ['-300', '(UTC-05:00)东部时间(美国和加拿大)；波哥达，利马'],
            ['-270', '(UTC-04:30)加拉加斯'],
            ['-240', '(UTC-04:00)大西洋时间(加拿大)；圣地亚哥'],
            ['-210', '(UTC-03:30)纽芬兰'],
            ['-180', '(UTC-03:00)巴西利亚，布宜诺斯艾利斯，乔治敦，格陵兰'],
            ['-120', '(UTC-02:00)中大西洋'],
            ['-60', '(UTC-01:00)佛得角群岛，亚速尔群岛'],
            ['0', '(UTC)协调世界时；都柏林，爱丁堡，伦敦，里斯本'],
            ['60', '(UTC+01:00)阿姆斯特丹，柏林，罗马，巴黎，斯德哥尔摩'],
            ['120', '(UTC+02:00)开罗，雅典，伊斯坦布尔，耶路撒冷'],
            ['180', '(UTC+03:00)巴格达，科威特，利雅得，明斯克，莫斯科，圣彼得堡'],
            ['210', '(UTC+03:30)德黑兰'],
            ['240', '(UTC+04:00)阿布扎比，马斯喀特，巴库，第比利斯，埃里温'],
            ['270', '(UTC+04:30)喀布尔'],
            ['300', '(UTC+05:00)叶卡捷林堡，伊斯兰堡，卡拉奇，塔什干'],
            ['330', '(UTC+05:30)马德拉斯，加尔各答，孟买，新德里'],
            ['345', '(UTC+05:45)加德满都'],
            ['360', '(UTC+06:00)阿拉木图，新西伯利亚，阿斯塔纳，达卡'],
            ['390', '(UTC+06:30)仰光'],
            ['420', '(UTC+07:00)曼谷，雅加达，河内'],
            ['480', '(UTC+08:00)北京，乌鲁木齐，香港特别行政区，台北，重庆'],
            ['540', '(UTC+09:00)东京，大坂，札幌，首尔，雅库茨克'],
            ['570', '(UTC+09:30)阿德莱德'],
            ['600', '(UTC+10:00)马加丹，布里斯班，关岛，堪培拉，墨尔本，悉尼'],
            ['660', '(UTC+11:00)所罗门群岛，新喀里多尼亚'],
            ['720', '(UTC+12:00)富士，勘察加半岛，马绍尔群岛，惠灵顿'],
            ['780', '(UTC+13:00)努库阿洛法'],
            ['840', '(UTC+14:00)圣诞岛']
        ],
        errorCode: {
            '-1': '',
            1: '',
            7: '认证失败'
        },
        logLevel: {
            0: 'EXCEPT',
            1: 'ERROR',
            2: 'WARNING',
            3: 'INFO',
            4: 'DEBUG'
        },
        uAuthMode: {
            0: 'NONE',
            4: 'WPA',
            5: 'WPA2',
            6: 'WPA/WPA2',
            7: 'WPA-PSK',
            8: 'WPA2-PSK',
            9: 'WPA-PSK / WPA2-PSK'
        },
        codeType: {
            0: 'UTF-8',
            1: 'GB2312'
        },
        codeTypeEnum: {
            'GB2312': 1,
            'UTF-8': 0
        },
        radio: {
            '2G': 0,
            '5G': 1
        },
        AuthFailEnum: {
            'FULL': 0,
            'LOCK': 1,
            'TIMEOUT': 2,
            'PWDERR': 3,
            'NORMAL': 4
        },
        WebPort: {
            'HTTP': 80,
            'HTTPS': 443
        }
    }
});
/**
 * Created by simon on 2017/1/22.
 */
define("Data", "System, Util, ErrorCode, $, Util", function (System, Util, ErrorCode, $) {
    var Data = {
        url: "/api/v1",
        send: function (method, params, success, error) {
            var param = method === 'slp' ?  params : {method: method, params: params};
            // SLP请求需要将内容进行编码处理
            var post_data = (method === "slp" ? JSON.stringify(param, function(key, value) {
                if (typeof(value) === "string") {
                    return encodeURIComponent(value);
                }
                return value;
            }) : JSON.stringify(param));
            $.ajax({
                url: $.isFunction(this.url) ? this.url() : this.url,
                type: "POST",
                contentType: "application/json; charset=UTF-8",
                data: post_data,
                success: function (data) {
                    if (!data || data.error_code != 0) {
                        var error_code = data ? data.error_code : ErrorCode.UNKNOWN_ERROR;
                        if (error_code == ErrorCode.ACCOUNT_TIMEOUT_ERROR
                            || error_code == ErrorCode.ACCOUNT_UNAUTHORIZED) {
                            if ($('#time-out-confirm').length>0)
                                return;

                            Util.confirm('<a id="time-out-confirm"/>' + ErrorCode.get(error_code), function () {
                                var service = window.location.href.startsWith("/account") ? ""
                                    : ("?service=" + encodeURIComponent(window.location.href));
                                window.location.href = '/account/login' + service
                            });
                            return;
                        }
                        if(error_code == ErrorCode.ACCOUNT_NO_PERMISSION_ERROR) {
                            System.reload();
                            return;
                        }

                        var errorFun = error || Util.alert;
                        errorFun(ErrorCode.get(error_code) || data.msg);
                        return;
                    }

                    if (System.isFunction(success)) {
                        success.call(this, data.authentication, data.error_code, data.msg);
                    }
                },
                error: function () {
                    var errorFun = error || Util.alert;
                    errorFun("网络错误");
                },
                dataType: 'json'
            });
        },
        setUrl: function (path) {
            this.url = path;
        },
        getUploadResult: function (el) {
            var cw = el.contentWindow || el.contentDocument,
                data = $(cw.document).find('body').html();

            data = JSON.parse(data);
            if (data.error_code != 0) {
                Util.alert(ErrorCode.get(data ? data.error_code : ErrorCode.UNKNOWN_ERROR) || data.msg);
                return null;
            }

            return data.result;
        }
    };
    return Data;
});
require('Util,System,$,Constant', function (Util, System, $, Constant) {
    System.mix(Util, {
        fillInfo: function (dom, values) {
            dom.find('[key]').each(function (i, d) {
                var value = values[$(d).attr('key')];
                if (!Util.isUndefined(value)) {
                    $(d).html(Util.escapeHtml(value));
                    $(d).val(Util.escapeHtml(value));
                }
            })
        },
        zfill: function (num, size) {
            var s = "0000000000" + num;
            return s.substr(s.length - size);
        },
        refresh: function () {
            window.location.reload()
        },
        initWheelInput: function (el, min, max, zfillLen) {
            var $el = $(el);
            $el.data({min: parseInt(min), max: parseInt(max)});

            $el.focus(function () {
                $(this).select();
            }).on('mousewheel', function (e) {
                var $e = $(this);
                if (!$e.is(":focus"))return;

                e.stopPropagation();
                var min = $e.data('min'), max = $e.data('max'),
                    value = parseInt($e.val());
                if (isNaN(value)) {
                    value = min;
                } else {
                    e.originalEvent.wheelDelta > 0 ? (value++) : (value--);
                    if (value > max) value = min;
                    if (value < min) value = max;
                }

                $e.val(zfillLen ? Util.zfill(value, zfillLen) : value).select();
                return false;
            })
        },
        timeSegmentFormat: function (d, h, m, s) {
            for (var i = 0; i < arguments.length; i++)
                arguments[i] = parseInt(arguments[i]);
            if (arguments.length == 1) {
                var time = d;
                s = time % 60;
                time = Math.floor(time / 60);
                m = time % 60;
                time = Math.floor(time / 60);
                h = time % 24;
                d = Math.floor(time / 24);
            }
            return (d ? (d + '天') : '') + ((d || h) ? (h + '小时') : '') + m + '分' + s + '秒';
        },
        containChinese: function (str) {
            return /[\u4e00-\u9fa5]/.test(str);
        },
        containUnAcsiiCode: function (str) {
            return /[^\x00-\xff]/.test(str);
        },
        buildInstructCmd: function (param) {
            var cmd = '';
            $.each(param, function (index, value) {
                if (value !== undefined) {
                    if (value.type === 'quote') {
                        cmd += index + ':' + '"' + value.value + '"' + ' ';
                    } else {
                        if (System.isArray(value)) {
                            var arrayStr = '';
                            value.forEach(function (v) {
                                arrayStr += v + ',';
                            });
                            cmd += index + ':' + arrayStr.slice(0, arrayStr.length - 1) + ' ';
                        } else {
                            cmd += index + ':' + value + ' ';
                        }

                    }
                } else {
                    cmd += index + ' ';
                }

            });

            return cmd.slice(0, cmd.length - 1);
        },
        buildTree: function (data, initCb) {
            var result = {}, resultTemp = {};

            function defaultInitCb(v) {
                v.name = Util.escapeHtml(v.name)
            }

            function sort(item) {
                if (item.children == 0)return;
                item.children.sort(function (a, b) {
                    return a.order - b.order;
                });
                item.children.forEach(function (v) {
                    sort(v);
                })
            }

            data.forEach(function (v) {
                v.children = [];
                (initCb || defaultInitCb)(v);
                resultTemp[v.id] = v;
            });
            data.forEach(function (v) {
                if (v.level == 0) result = v;
                else resultTemp[v.parentId].children.push(v);
            });

            sort(result);
            return result;
        },
        getUtf8RealLength: function (value) {
            var len = value.length;
            var charCode;
            var realLen = 0;

            for (var i = 0; i < len; i++) {
                charCode = value.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    realLen += 1;
                } else {
                    realLen += 3;
                }
            }
            return realLen;
        },
        getStringRealLength: function (value, type) {
            var len = value.length;
            var charCode;
            var realLen = 0;

            for (var i = 0; i < len; i++) {
                charCode = value.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    realLen += 1;
                } else {
                    realLen += (Constant.codeTypeEnum['UTF-8'] == type ? 3 : 2);
                }
            }
            return realLen;
        },
        getRealLen: function (str) {
            return str.replace(/[^\x00-\xff]/g, '__').length;
        },
        getDomain: function () {
            var url = /^http:\/\/([^\/^:]+)/.exec(window.location.href);
            return url[1];
        },
        escapeHtml: function (string) {
            if (string == undefined)return '';
            var r = string.toString();
            r = r.replace(/\&/g, "&amp;");
            r = r.replace(/\</g, "&lt;");
            r = r.replace(/\>/g, "&gt;");
            r = r.replace(/\"/g, "&quot;");
            r = r.replace(/\'/g, "&#39;");
            r = r.replace(/\s/g, "&nbsp;");
            return r;
        },
        unescapeHtml: function (string) {
            if (string == undefined)return '';
            var r = string.toString();
            r = r.replace(/&lt;/g, "<");
            r = r.replace(/&gt;/g, ">");
            r = r.replace(/&quot;/g, "\"");
            r = r.replace(/&#39;/g, "\'");
            r = r.replace(/&nbsp;/g, " ");
            r = r.replace(/&amp;/g, "&");
            return r;
        },
        formatDate: function (date, format) {
            /*
             * 使用例子:format="yyyy-MM-dd hh:mm:ss";
             */
            var o = {
                "M+": date.getMonth() + 1, // month
                "d+": date.getDate(), // day
                "h+": date.getHours(), // hour
                "m+": date.getMinutes(), // minute
                "s+": date.getSeconds(), // second
                "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
                "S": date.getMilliseconds() // millisecond
            };

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
                    - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        obj2Str: function obj2Str(o) {
            var r = [];
            if (o === undefined) {
                return 'undefined';
            }
            if (typeof o === "string") {
                return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            }
            if (typeof o === "object") {
                if (o) {
                    if (!o.sort) {
                        for (var i in o) {
                            r.push(i + ":" + obj2Str(o[i]));
                        }
                        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                            r.push("toString:" + o.toString.toString());
                        }
                        r = "{" + r.join() + "}";
                    } else {
                        for (var i = 0; i < o.length; i++) {
                            r.push(obj2Str(o[i]))
                        }
                        r = "[" + r.join() + "]";
                    }
                } else {
                    r = 'null';
                }
                return r;
            }
            return o.toString();
        },
        isEmptyObj: function (o) {
            return o || $.isEmptyObject(o);
        },
        escape2Html: function (str) {
            str = String(str);
            var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
                return arrEntities[t];
            });
        },
        addIfNotExist: function (arrTarget, arr2In) {
            for (var i = 0; i < arr2In.length; i++) {
                if (arrTarget.indexOf(arr2In[i]) === -1) {
                    arrTarget.push(arr2In[i]);
                }
            }
            return arrTarget;
        },
        removeIfExist: function (arrTarget, arr2Out) {
            for (var i = 0; i < arr2Out.length; i++) {
                var index = arrTarget.indexOf(arr2Out[i]);
                if (index !== -1) {
                    var arrPre = arrTarget.slice(0, index);
                    var arrNext = arrTarget.slice(index + 1, arrTarget.length);
                    arrTarget = arrPre.concat(arrNext);
                }
            }
            return arrTarget;
        },
        hash: function (input) {
            var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
            var hash = 5381;
            var i = input.length - 1;

            if (typeof input == 'string') {
                for (; i > -1; i--)
                    hash += (hash << 5) + input.charCodeAt(i);
            } else {
                for (; i > -1; i--)
                    hash += (hash << 5) + input[i];
            }
            var value = hash & 0x7FFFFFFF;
            var retValue = '';
            do {
                retValue += I64BIT_TABLE[value & 0x3F];
            }
            while (value >>= 6);

            return retValue;
        },
        ascii2char: function (string) {
            var ascii2escape = {
                '09': '&emsp;',
                '20': '&nbsp;',
                '22': '&quot;',
                '25': '%',
                '26': '&amp;',
                '27': '&#39;',
                '28': '(',
                '29': ')',
                '2c': ',',
                '2f': '/',
                '3a': '&#58;',
                '3c': '&lt;',
                '3e': '&gt;',
                '5b': '[',
                '5c': '\\',
                '5d': ']',
                '7b': '{',
                '7d': '}'
            };
            return string.replace(/%([0-9a-z]{2})/g, function (g, g1) {
                if (ascii2escape[g1])
                    return ascii2escape[g1];
                return g;
            });
        },
        randInt: function () {
            return Math.floor(Math.random() * 10000000);
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(/)" + name + "=([^&]*)(/userrpm)");
            var r = window.location.pathname.match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        }
    })
});

define('ErrorCode', '', function () {
    var errorCode = {
            ACCOUNT_UNAUTHORIZED: -201201,
            ACCOUNT_NO_PERMISSION_ERROR: -201202,
            ACCOUNT_TIMEOUT_ERROR: -201203,
            UNKNOWN_ERROR: -20000
        },
        errorStr = {"-1": "网络错误",
            "-201000": "\u672a\u77e5\u9519\u8bef",
            "-201001": "\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef",
            "-201002": "\u8bf7\u6c42\u6307\u4ee4\u672a\u5e26\u65b9\u6cd5\u6216\u8005\u65b9\u6cd5\u672a\u5b9a\u4e49",
            "-201003": "\u8bf7\u6c42\u8d85\u65f6",
            "-201101": "\u53c2\u6570\u7c7b\u578b\u4e0e\u503c\u4e0d\u7b26",
            "-201102": "\u53c2\u6570\u503c\u8d85\u51fa\u8303\u56f4",
            "-201103": "\u975e\u6cd5\u53c2\u6570",
            "-201104": "\u0049\u0050\u5730\u5740\u683c\u5f0f\u9519\u8bef",
            "-201105": "\u004d\u0041\u0043\u5730\u5740\u683c\u5f0f\u9519\u8bef",
            "-201106": "\u6587\u4ef6\u683c\u5f0f\u9519\u8bef",
            "-201107": "\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u8303\u56f4",
            "-201201": "\u672a\u767b\u5f55\uff0c\u8bf7\u5148\u767b\u5f55",
            "-201202": "\u8d26\u53f7\u6ca1\u6709\u6743\u9650",
            "-201203": "\u767b\u5f55\u8d85\u65f6\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55",
            "-202001": "\u8d26\u6237\u4e0d\u5b58\u5728",
            "-202002": "\u8d26\u53f7\u4e0d\u5b58\u5728\u6216\u5bc6\u7801\u9519\u8bef",
            "-202003": "\u8d26\u53f7\u683c\u5f0f\u9519\u8bef",
            "-202004": "\u5bc6\u7801\u683c\u5f0f\u9519\u8bef",
            "-202005": "\u8d26\u6237\u5df2\u5b58\u5728",
            "-202006": "\u9a8c\u8bc1\u7801\u9519\u8bef",
            "-202007": "\u9a8c\u8bc1\u7801\u5931\u6548",
            "-202008": "\u8d26\u53f7\u88ab\u9501\u5b9a",
            "-202009": "\u5bc6\u7801\u8f93\u9519\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u0032\u5c0f\u65f6\u4e4b\u540e\u518d\u767b\u5f55",
            "-203001": "\u9879\u76ee\u4e0d\u5b58\u5728",
            "-203002": "\u8d26\u53f7\u6ca1\u6709\u9879\u76ee\u6743\u9650",
            "-203003": "\u8bbe\u5907\u4e0d\u5b58\u5728",
            "-203004": "\u8bbe\u5907\u7ec4\u4e0d\u5b58\u5728",
            "-203005": "\u8bbe\u5907\u7ec4\u548c\u9879\u76ee\u4e0d\u5339\u914d",
            "-203006": "\u9879\u76ee\u5185\u5b58\u5728\u8bbe\u5907\uff0c\u65e0\u6cd5\u5220\u9664",
            "-203007": "\u8bbe\u5907\u7ec4\u5df2\u5b58\u5728",
            "-203008": "\u9879\u76ee\u81f3\u5c11\u9700\u8981\u4e00\u4e2a\u7ba1\u7406\u5458\uff0c\u65e0\u6cd5\u9000\u51fa\u6b64\u9879\u76ee",
            "-203009": "\u8bbe\u5907\u548c\u9879\u76ee\u4e0d\u5339\u914d",
            "-203010": "\u8bbe\u5907\u548c\u8bbe\u5907\u7ec4\u4e0d\u5339\u914d",
            "-203011": "\u9879\u76ee\u9ed8\u8ba4\u8bbe\u5907\u5206\u7ec4\u4e0d\u80fd\u7f16\u8f91",
            "-203012": "\u9879\u76ee\u9ed8\u8ba4\u8bbe\u5907\u5206\u7ec4\u4e0d\u80fd\u5220\u9664",
            "-203013": "\u9879\u76ee\u540d\u79f0\u975e\u6cd5",
            "-203014": "\u9879\u76ee\u548c\u8d26\u6237\u4e0d\u5339\u914d",
            "-203015": "\u8bbe\u5907\u5df2\u7ecf\u7ed1\u5b9a\u5230\u9879\u76ee",
            "-203016": "\u8bbe\u5907\u79bb\u7ebf",
            "-203017": "\u7ed1\u5b9a\u6210\u529f\u8fd4\u56de\u8bbe\u5907\u53c2\u6570\u4e0d\u5168",
            "-203018": "\u6279\u91cf\u7ed1\u5b9a\u6587\u4ef6\u975e\u6cd5",
            "-203019": "\u8bbe\u5907\u79bb\u7ebf\u6216\u8005\u6b63\u5728\u91cd\u542f\u4e2d",
            "-203020": "\u90e8\u5206\u8bbe\u5907\u91cd\u542f\u5931\u8d25",
            "-203021": "\u91cd\u542f\u5931\u8d25",
            "-203022": "\u8bbe\u5907\u5df2\u5b58\u5728",
            "-203023": "\u8bbe\u5907\u0044\u0053\u004e\u7801\u975e\u6cd5",
            "-203024": "\u8d26\u53f7\u65e0\u6743\u9650",
            "-203025": "\u6279\u91cf\u7ed1\u5b9a\u6587\u4ef6\u4e3a\u7a7a",
            "-203026": "\u6279\u91cf\u7ed1\u5b9a\u6587\u4ef6\u5185\u5bb9\u683c\u5f0f\u9519\u8bef",
            "-203027": "\u8bbe\u5907\u7ed1\u5b9a\u7528\u6237\u540d\u4e0d\u5b58\u5728",
            "-203028": "\u8bbe\u5907\u7ed1\u5b9a\u7528\u6237\u540d\u548c\u5bc6\u7801\u4e0d\u5339\u914d",
            "-203029": "\u8bbe\u5907\u7ed1\u5b9a\u5931\u8d25",
            "-203030": "\u8bbe\u5907\u7ed1\u5b9a\u53c2\u6570\u9519\u8bef",
            "-203031": "\u8bbe\u5907\u5206\u7ec4\u7ea7\u522b\u9519\u8bef",
            "-203032": "\u8bbe\u5907\u4e91\u7ba1\u7406\u5f00\u5173\u672a\u5f00\u542f",
            "-203033": "\u8be5\u6210\u5458\u5df2\u5b58\u5728",
            "-204006": "\u5ba2\u6237\u7aef\u6ca1\u6709\u627e\u5230",
            "-204005": "\u5ba2\u6237\u7aef\u4fe1\u53f7\u9519\u8bef",
            "-204004": "\u6237\u7aef\u5c04\u9891\u9519\u8bef",
            "-204003": "\u5ba2\u6237\u7aef\u9891\u6bb5\u9519\u8bef",
            "-204002": "\u5ba2\u6237\u7aef\u6d41\u91cf\u9519\u8bef",
            "-204001": "\u5ba2\u6237\u7aef\u7c7b\u578b\u9519\u8bef",
            "-205003": "\u6570\u636e\u83b7\u53d6\u5931\u8d25",
            "-205002": "\u6570\u91cf\u8303\u56f4\u9519\u8bef",
            "-205001": "\u65f6\u95f4\u6bb5\u7c7b\u578b\u9519\u8bef",
            "-207000": "\u8d85\u51fa\u8bbe\u5907\u89c4\u683c\u6570",
            "-207004": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u56fe\u7247\u4e0d\u5b58\u5728",
            "-207003": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u56fe\u7247\u5b58\u50a8\u5931\u8d25",
            "-207002": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u51b2\u7a81",
            "-207001": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u4e0d\u5b58\u5728",
            "-207005": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u56fe\u7247\u5927\u5c0f\u8d85\u8fc7\u9650\u5236",
            "-207006": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u88ab\u4f7f\u7528",
            "-207007": "\u0050\u006f\u0072\u0074\u0061\u006c\u9875\u9762\u6570\u91cf\u8d85\u51fa\u89c4\u683c\u6570",
            "-207102": "\u65e0\u7ebf\u6761\u76ee\u540d\u79f0\u51b2\u7a81",
            "-207101": "\u65e0\u7ebf\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207103": "\u65e0\u7ebf\u6761\u76ee\u6570\u91cf\u8d85\u8fc7\u9650\u5236",
            "-207201": "\u8ba4\u8bc1\u006c\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207202": "\u8ba4\u8bc1\u6761\u76ee\u540d\u79f0\u51b2\u7a81",
            "-207203": "\u8ba4\u8bc1\u6761\u76ee\u88ab\u7ed1\u5b9a\uff0c\u4e0d\u53ef\u5220\u9664",
            "-207301": "\u514d\u8ba4\u8bc1\u7b56\u7565\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207302": "\u514d\u8ba4\u8bc1\u7b56\u7565\u6761\u76ee\u5df2\u5b58\u5728",
            "-207303": "\u514d\u8ba4\u8bc1\u7b56\u7565\u6761\u76ee\u8d85\u8fc7\u9650\u5236",
            "-207403": "\u5173\u8054\u5c04\u9891\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207402": "\u5c04\u9891\u6761\u76ee\u5df2\u5b58\u5728",
            "-207401": "\u5c04\u9891\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207501": "\u8ba4\u8bc1\u7528\u6237\u6761\u76ee\u4e0d\u5b58\u5728",
            "-207502": "\u8ba4\u8bc1\u7528\u6237\u6761\u76ee\u5df2\u5b58\u5728",
            "-207503": "\u8ba4\u8bc1\u7528\u6237\u6761\u76ee\u8d85\u8fc7\u9650\u5236",
            "-207504": "\u6279\u91cf\u6dfb\u52a0\u8ba4\u8bc1\u7528\u6237\u6587\u4ef6\u65e0\u6548",
            "-207601": "\u8ba4\u8bc1\u5168\u5c40\u53c2\u6570\u4e0d\u5b58\u5728",
            "-207701": "\u8fbe\u5230\u6700\u5927\u5ba2\u6237\u7aef\u6570\u91cf",
            "-207702": "\u8bbe\u5907\u7c7b\u578b\u4e0d\u5b58\u5728",
            "-207801": "\u7ed1\u5b9a\u5931\u8d25",
            "-207802": "\u7ed1\u5b9a\u5173\u7cfb\u4e0d\u5b58\u5728",
            "-504004": "\u9879\u76ee\u4e0d\u5b58\u5728",
            "-504001": "\u8bbe\u5907\u4e91\u5e73\u53f0\u96c6\u4e2d\u914d\u7f6e\u529f\u80fd\u5df2\u5173\u95ed",
            "-301001": "\u6761\u76ee\u64cd\u4f5c\u5931\u8d25",
            "-301002": "\u5b58\u5728\u6761\u76ee\u914d\u7f6e\u5931\u8d25",
            "-301003": "\u53c2\u6570\u975e\u6cd5",
            "-301004": "\u6761\u76ee\u672a\u627e\u5230",
            "-301005": "\u6761\u76ee\u8d85\u8fc7\u89c4\u683c",
            "-301006": "\u9891\u6bb5\u4e0d\u652f\u6301",
            "-301007": "\u0053\u0053\u0049\u0044\u51b2\u7a81",
            "-301008": "\u4e0d\u652f\u6301\u5e26\u0050\u006f\u0072\u0074\u0061\u006c\u7684\u0053\u0053\u0049\u0044",
            "-301009": "\u0054\u004b\u0049\u0050\u52a0\u5bc6\u65b9\u5f0f\u548c\u0031\u0031\u004e\u6a21\u5f0f\u51b2\u7a81",
            "-301010": "\u0031\u0031\u004e\u6a21\u5f0f\u548c\u0054\u004b\u0049\u0050\u52a0\u5bc6\u65b9\u5f0f\u51b2\u7a81",
            "-301999": "\u0053\u0053\u0049\u0044\u7ed1\u5b9a\u0041\u0050\u5931\u8d25",
            "-302001": "\u672a\u77e5\u7684\u9519\u8bef",
            "-302002": "\u8bbe\u7f6e\u5168\u5c40\u8ba4\u8bc1\u53c2\u6570\u5931\u8d25",
            "-302003": "\u53c2\u6570\u4e0d\u5408\u6cd5",
            "-302004": "\u7aef\u53e3\u53f7\u4e0d\u5728\u5408\u6cd5\u8303\u56f4\u5185",
            "-302005": "\u7aef\u53e3\u53f7\u88ab\u5360\u7528",
            "-302006": "\u8001\u5316\u65f6\u95f4\u4e0d\u5728\u5408\u6cd5\u8303\u56f4\u5185",
            "-302007": "\u672a\u77e5\u7684\u9519\u8bef",
            "-302008": "\u6dfb\u52a0\u0070\u006f\u0072\u0074\u0061\u006c\u6761\u76ee\u5931\u8d25",
            "-302009": "\u8bbe\u7f6e\u0070\u006f\u0072\u0074\u0061\u006c\u6761\u76ee\u5931\u8d25",
            "-302010": "\u5220\u9664\u0070\u006f\u0072\u0074\u0061\u006c\u6761\u76ee\u5931\u8d25",
            "-302011": "\u0070\u006f\u0072\u0074\u0061\u006c\u0020\u0069\u0064\u0020\u5bf9\u5e94\u7684\u6761\u76ee\u5df2\u7ecf\u5b58\u5728",
            "-302012": "\u0070\u006f\u0072\u0074\u0061\u006c\u0020\u0069\u0064\u0020\u5bf9\u5e94\u7684\u6761\u76ee\u4e0d\u5b58\u5728",
            "-302013": "\u53c2\u6570\u4e0d\u5408\u6cd5",
            "-302014": "\u6761\u76ee\u6570\u91cf\u8fbe\u5230\u4e0a\u9650",
            "-302015": "\u6dfb\u52a0\u8df3\u8f6c\u9875\u9762\u5931\u8d25",
            "-302016": "\u8bbe\u7f6e\u8df3\u8f6c\u9875\u9762\u5931\u8d25",
            "-302017": "\u5220\u9664\u8df3\u8f6c\u9875\u9762\u5931\u8d25",
            "-302018": "\u6dfb\u52a0\u8ba4\u8bc1\u670d\u52a1\u5668\u7ec4\u5931\u8d25",
            "-302019": "\u8bbe\u7f6e\u8ba4\u8bc1\u670d\u52a1\u5668\u7ec4\u5931\u8d25",
            "-302020": "\u5220\u9664\u8ba4\u8bc1\u670d\u52a1\u5668\u7ec4\u5931\u8d25",
            "-302021": "\u6dfb\u52a0\u0072\u0061\u0064\u0069\u0075\u0073\u670d\u52a1\u5668\u5931\u8d25",
            "-302022": "\u8bbe\u7f6e\u0072\u0061\u0064\u0069\u0075\u0073\u670d\u52a1\u5668\u5931\u8d25",
            "-302023": "\u5220\u9664\u0072\u0061\u0064\u0069\u0075\u0073\u670d\u52a1\u5668\u5931\u8d25",
            "-303001": "\u672a\u77e5\u7684\u9519\u8bef",
            "-303002": "\u6dfb\u52a0\u514d\u8ba4\u8bc1\u7b56\u7565\u5931\u8d25",
            "-303003": "\u8bbe\u7f6e\u514d\u8ba4\u8bc1\u7b56\u7565\u5931\u8d25",
            "-303004": "\u5220\u9664\u514d\u8ba4\u8bc1\u7b56\u7565\u5931\u8d25",
            "-303005": "\u53c2\u6570\u975e\u6cd5",
            "-303006": "\u0049\u0044\u6216\u7b56\u7565\u540d\u79f0\u5df2\u7ecf\u5b58\u5728",
            "-303007": "\u6570\u91cf\u8fbe\u5230\u4e0a\u9650",
            "-303008": "\u534f\u8bae\u4e0d\u5408\u6cd5",
            "-303009": "\u514d\u8ba4\u8bc1\u7b56\u7565\u0069\u0064\u4e0d\u5b58\u5728",
            "-303010": "\u514d\u8ba4\u8bc1\u7b56\u7565\u540d\u79f0\u7981\u6b62\u4fee\u6539",
            "-304001": "\u672a\u77e5\u9519\u8bef",
            "-304002": "\u6dfb\u52a0\u7528\u6237\u5931\u8d25",
            "-304003": "\u8bbe\u7f6e\u7528\u6237\u5931\u8d25",
            "-304004": "\u5220\u9664\u7528\u6237\u5931\u8d25",
            "-304005": "\u53c2\u6570\u975e\u6cd5",
            "-304006": "\u7528\u6237\u6570\u8fbe\u5230\u4e0a\u9650",
            "-304007": "\u0075\u0073\u0065\u0072\u0020\u0069\u0064\u0020\u5df2\u88ab\u4f7f\u7528",
            "-304008": "\u7528\u6237\u540d\u5df2\u88ab\u4f7f\u7528",
            "-304009": "\u0075\u0073\u0065\u0072\u0020\u0069\u0064\u0020\u4e0d\u5b58\u5728",
            "-304010": "\u7528\u6237\u540d\u7981\u6b62\u4fee\u6539",
            "-305002": "\u670d\u52a1\u5668\u4e0b\u53d1\u7684\u8bbe\u5907\u5217\u8868\u4e2d\u4e0d\u5b58\u5728\u5f53\u524d\u8bbe\u5907",
            "-305020": "\u0075\u0063\u0069\u6587\u4ef6\u8bbe\u7f6e\u5931\u8d25",
            "-305021": "\u672a\u77e5\u72b6\u6001",
            "-305022": "\u5347\u7ea7\u5931\u8d25"
        };

    errorCode.get = function (errCode) {
        return errorStr[errCode];
    };

    return errorCode;
});
define('Validator', 'System,Util', function (System, Util) {
    var regex = {
        ip: /^([01]?\d{1,2}|2[0-4]\d|25[0-5])(\.([01]?\d{1,2}|2[0-4]\d|25[0-5])){3}$/,
        mac: /^[A-Fa-f0-9][02468AaCcEe]-([A-Fa-f0-9]{2}-){4}[A-Fa-f0-9]{2}$/,
        mac_multicast: /^[0-9A-Fa-f][13579bdfBDF](-[A-Fa-f0-9]{2}){5}$/,
        mac_broadcast: /^(((FF)|(ff))-){5}((FF)|(ff))$/,
        mac_zero: /^(00-){5}(00)$/,
        number: /^-?\d+$/,
        date: /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/,
        time: /(^((2[0-3])|([0-1]\d)):[0-5]\d$)|^(24:00)$/,
        datetime: /^(\d{1,4})[\/-](\d{1,2})[\/-](\d{1,2})\s+(\d{1,2}):(\d{1,2})$/,
        username: /^([a-zA-Z0-9\-_.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(1\d{10})$/,
        password: /^[A-Za-z0-9\`\~\!\@\#\$\&\*\(\)\-\=\_\+\[\]\{\}\;\:\'\"\\\|\/\?\.\,\<\>\%\^\/]+$/,
        securityPassword: /^[A-Za-z0-9\`\~\!\@\#\$\&\*\(\)\-\=\_\+\[\]\{\}\;\:\'\"\\\|\/\?\.\,\<\>\%\^\/\s]+$/,
        hex: /^[A-Fa-f0-9]{2}$/,
        nohex: /^.*[^a-fA-F\d]+.*$/,
        letter: /[a-zA-Z]+/,
        letterOnly: /^[a-zA-Z]+$/,
        digit: /\d+/,
        digitOnly: /^\d+$/,
        symbol: /[^\d\w\s]+/,
        symbolOnly: /^[^\d\w\s]+$/,
        phone_number: /^1\d{10}$/,
        mail_address: /^([0-9A-Za-z\-_.]+)@([0-9a-z-]+\.[a-z]{2,3}(\.[a-z]{2})?)$/,
        reg_code: /^[0-9]{6}$/,
        // url: /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
        url: (function () {
            var strRegex = '^((https|http|ftp|file)://)?'
                + '(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
                + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
                + '|' // 允许IP和DOMAIN（域名）
                + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
                + '([0-9a-z][0-9a-z]{0,61})?[0-9a-z].' // 二级域名
                + '[a-z]{2,6})' // first level domain- .com or .museum
                + '(:[0-9]{1,5})?' // 端口- :80
                + '((/?)|' // a slash isn't required if there is no file name
                + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
            return new RegExp(strRegex);
        })()
    };

    var validation = {
        broadcastIp: '不能为广播IP地址',
        multicastIp: '不能为多播IP地址',
        ipAllZero: '不能为 0.0.0.0',
        ipAllOne: "IP地址不能为255.255.255.255。",
        ipFirstAllOne: "不能是以255开头的IP地址。",
        ipEClass: 'IP地址非法（E类地址）',
        loopIp: 'IP地址非法（环回地址）',
        macBroadcast: 'MAC地址非法（广播MAC地址）',
        macMulti: 'MAC地址非法（多播MAC地址）',
        macAllZero: 'MAC地址非法（不能为00-00-00-00-00-00）',
        passwordLenMin: '密码长度必须超过6位',
        passwordLenMax: '密码长度不能超过32位',
        usernameLen: '用户名长度不能超过64位',
        securePwdLen: '密码长度不能超过64位',
        securePwdInvalid: '密码含有非法字符',
        timeFormatInvalid: '时间非法',
        dateFormatInvalid: '日期非法',
        phoneNumInvalid: '手机号非法'
    };

    var validator = function (type) {
        return this[type].apply(this, arguments.shift());
    };

    System.mix(validator, {
        is_dsn: function (dsn) {
            return /^[\dA-Fa-f]{17}$/.test(dsn);
        },
        is_int: function (num) {
            if (Math.floor(num) == num && num.indexOf('.') < 0) {
                return true;
            }
            return '请输入整数';
        },
        is_net_address: function (str, param) {
            return regex.url.test(str) || validator.is_ip(str, param);
        },
        is_ip: function (str, param) {
            if (!regex.ip.test(str)) {
                return false;
            }
            var ip = [], sum = 0;
            var isLegal = true;
            str.split('.').forEach(function (v) {
                if (/^0\d{1,2}$/.test(v)) {
                    isLegal = false;
                }

                var v = parseInt(v, 10);
                ip.push(v);
                sum += v;
            });

            if (!isLegal) {
                return false;
            }

            if (sum == 0) {
                return validation.ipAllZero;
            }
            //todo why?
            // if (ip[3] == 0 || ip[3] == 255 || ip[0] == 255) {
            //     return false;
            // }
            if (ip[0] >= 240 && ip[0] <= 254) {
                return validation.ipEClass;
            }
            if (ip[0] >= 224 && ip[0] <= 239) {
                return validation.multicastIp;
            }
            if (ip[0] == 127) {
                return validation.loopIp;
            }

            if (param == 'strict') {
                if (sum == 255 * 4) {
                    return validation.ipAllOne;
                }
                if (ip[0] == 255) {
                    return validation.ipFirstAllOne;
                }
            }
            return true;
        },
        is_mac: function (str) {
            return !regex.mac.test(str) ? false
                : regex.mac_broadcast.test(str) ? validation.macBroadcast
                    : regex.mac_multicast.test(str) ? validation.macMulti
                        : regex.mac_zero.test(str) ? validation.macAllZero : true;
        },
        is_number: function (str, min, max) {
            if (!regex.number.test(str)) return false;
            var value = parseInt(str, 10);
            if (min !== undefined && max !== undefined) {
                if (max !== '' && min !== '') {
                    return (value >= min) && (value <= max);
                } else if (min !== '') {
                    return value >= min;
                } else if (max !== '') {
                    return value <= max;
                } else return true;
            } else return true;
        },
        is_phone_number: function (str) {
            return regex.phone_number.test(str) ? true : validation.phoneNumInvalid;
        },
        is_mail_address: function (str) {
            return regex.mail_address.test(str);
        },
        is_ip_mask: function (str) {
            var result = regex.ip.test(str);
            if (!result) return false;

            if (str == '255.255.255.255') {
                return false;
            }

            result = parseInt(str.replace(/\d+\.?/ig, function (a) {
                return Util.zfill(parseInt(a).toString(16), 2);
            }), 16).toString(2);
            if (result.length != 32) return false;

            return /^1+0*$/.test(result.toString(2));
        },
        is_date: function (str, param) {
            var result;
            if (param === 'strict') {
                result = /^(\d{1,4})-(\d{2})-(\d{2})$/.exec(str);
            } else {
                result = regex.date.exec(str)
            }

            if (result === null) {
                return validation.dateFormatInvalid;
            }

            var d = new Date(result[1], result[2] - 1, result[3]);
            // d.getFullYear() == result[1] &&
            return ((d.getMonth() + 1) == result[2] && d.getDate() == result[3]) ? true : validation.dateFormatInvalid;
        },
        is_datetime: function (str) {
            var result = regex.datetime.exec(str);
            if (result == null) return false;

            var d = new Date(str);
            return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3]
                && d.getHours() == result[4] && d.getMinutes() == result[5]);
        },
        is_within_length: function (str, minLength, maxLength) {
            var realLen = Util.getRealLen(str);
            if (realLen < minLength) {
                return '输入内容的长度小于' + minLength + '，一个中文算2个字符';
            }
            if (realLen > maxLength) {
                return '输入内容的长度大于' + maxLength + '，一个中文算2个字符';
            }

            return true;
        },
        is_time: function (str) {
            return regex.time.test(str) ? true : validation.timeFormatInvalid;
        },
        is_hex: function (str) {
            return regex.hex.test(str);
        },
        is_username: function (str) {
            if (!regex.username.test(str)) return false;
            return str.length > 64 ? validation.usernameLen : true;
        },
        is_user_password: function (str) {
            if (!regex.password.test(str)) return false;
            return str.length < 6 ? validation.passwordLenMin
                : str.length > 32 ? validation.passwordLenMax : true;
        },
        is_security_password: function (str) {
            if (!regex.securityPassword.test(str)) return false;
            if (regex.nohex.test(str) && str.length > 63) return validation.securePwdInvalid;
            return str.length > 64 ? validation.securePwdLen : true;
        },
        is_veri_code: function (str) {
            return regex.reg_code.test(str);
        },
        is_string: function (val, minLen, maxLen) {
            if (val == undefined) return true;
            if (val.length >= minLen && val.length <= maxLen)
                return true;
            return "字段长度应在" + minLen + "-" + maxLen + "之间";
        },
        is_url: function (val) {
            return regex.url.test(val);
        },
        hasLetter: function (val) {
            return regex.letter.test(val);
        },
        isLetter: function (val) {
            return regex.letterOnly.test(val);
        },
        hasDigit: function (val) {
            return regex.digit.test(val);
        },
        isDigit: function (val) {
            return regex.digitOnly.test(val);
        },
        hasSymbol: function (val) {
            return regex.symbol.test(val);
        },
        isSymbol: function (val) {
            return regex.symbolOnly.test(val);
        },
        isMix: function (val) {
            return validator.hasDigit(val) && validator.hasSymbol(val) && validator.hasLetter(val);
        },
        isPure: function (val) {
            return validator.isDigit(val) || validator.isLetter(val) || validator.isSymbol(val);
        }
    });

    return validator;
});


require("Widget, System", function (Widget, System) {
    Widget("button", {
        options: {
            name: "",
            id: "",
            height: 'auto',
            width: 'auto',

            iconType: false,
            cssAppend: 'default',

            onPress: false,
            toggle: false,
            onToggle: false,
            disabled: false,
            isPressed: false
        },
        _create: function () {
            var me = this,
                e = me.element,
                o = me.options;

            e.addClass("unselectable " + o.cssAppend)
                .append('<span></span><span class="ump-button-text f-ib">' + o.name + '</span>')
                .css({
                    height: o.height, width: o.width
                });
            e.attr('id', o.id);

            me._setBtnClass();
        },
        _init: function () {
            var me = this,
                e = me.element,
                o = me.options;
            me.onToggle = o.onToggle;

            me.element.click(function (event) {
                if (o.disabled)return;
                if (o.onPress) {
                    o.onPress.call(e, event);
                }
                if (o.toggle) {
                    o.isPressed = !o.isPressed;
                    o.isPressed
                        ? e.addClass("down")
                        : e.removeClass("down");
                    if (me.onToggle) {
                        me.onToggle.call(e, o.isPressed);
                    }
                }
            }).mouseenter(function () {
                if (!o.disabled) {
                    e.addClass("hover");
                }
            }).mouseleave(function () {
                e.removeClass("hover");
            });

        },
        _setBtnClass: function () {
            var me = this,
                e = me.element,
                o = me.options;

            if (o.disabled) e.addClass("disabled");
            if (o.iconType) {
                e.addClass('button-icon').children("span:first").addClass("if if-s13 icon-" + o.iconType);
            } else {
                e.children("span:first").hide();
            }

            if (o.toggle && o.isPressed)
                e.addClass("down");
            if (o.name === '') e.addClass("ump-button-icon-only");
        },
        setClassName: function (className) {
            this.element.addClass(className);
        },
        setName: function (name) {
            this.element.find('.text').text(name);
        },
        getName: function () {
            return this.element.find('.text').text();
        },
        enable: function () {
            var me = this;

            if (me.options.disabled) {
                me.options.disabled = false;
                me.element.removeClass("disabled");
            }
        },
        disable: function () {
            var me = this;

            if (!me.options.disabled) {
                me.options.disabled = true;
                me.element.addClass("disabled");
            }
        },
        isDisabled: function () {
            return this.options.disabled;
        },
        isPressed: function () {
            return this.options.isPressed;
        },
        toggle: function (fireEvent) {
            var me = this,
                e = me.element,
                o = me.options;

            if (!o.toggle || o.disabled) {
                return;
            }
            o.isPressed = !o.isPressed;
            o.isPressed
                ? e.addClass("down")
                : e.removeClass("down");
            if (me.onToggle && fireEvent) {
                me.onToggle.call(e, o.isPressed);
            }
        },
        setOnToggle: function (callback) {
            this.onToggle = callback;
        }

    });
});

require("Widget, System, $, L, Util", function (Widget, System, $, L, Util) {
    Widget("combobox", {
        options: {
            height: 30,
            width: 160,
            maxOptions: 6,
            optionsDirection: 'down',//'up'
            focusOption: 0,
            /*sortable: true,*/
            disabled: false,
            isTree: false,
            autoComplete: true,
            onChanged: false,
            opts: [],
            multiple: false
        },

        _create: function () {
            var s = this,
                e = this.element,
                o = this.options;


            e.addClass("f-ib");
            s.disabled = o.disabled;
            s.value = '';
            s.$header = $("<div></div>").addClass("cwm-combo-header");
            s.$input = $('<input type="text" class="cwm-combo-input" autocomplete="off' + '"/>').appendTo(s.$header);
            s.$arrow = $('<span class="if icon-spread"></span>').appendTo(s.$header);
            s.$opts = $('<div class="opt-block"></div>');

            e.append(s.$header).append(s.$opts);

            s.$input.css({
                width: o.width - 33,
                height: o.height,
                "line-height": (o.height - 2) + 'px',
                "user-select": 'text'
            });

            s.$opts.css({width: o.width - 2, "line-height": (o.height - 2) + "px"});
        },
        _init: function () {
            var s = this,
                e = this.element,
                o = this.options,
                html = "";

            s.optItems = [];
            s.readOnly = ((typeof o.opts[0]) === "object" );
            /* used as select */
            s.$input.prop("readOnly", s.readOnly);
            s.$input.val(null);

            s._treeOptsInit(o.opts);

            o.opts.forEach(function (obj) {html += s._option2HTML(obj);});

            //common
            s.focusedOpt = false;


            if (o.maxOptions < o.opts.length) {
                s.$opts.css("height", o.maxOptions * o.height + "px");
            } else {
                s.$opts.css("height", "auto");
            }

            s.$opts.hide().append(html).find(".opt")
                .each(function (i, el) {
                    s._bindOptEvent($(el));
                    s.optItems.push($(el));
                });

            //readOnly mode
            if (s.readOnly) {
                s.$header.unbind("click").bind("click", function () {
                    if (s.$opts.is(':visible') || s.disabled) return;
                    s._displayOpts(!s.$opts.is(':visible'));
                });

                e.unbind("mouseleave").bind("mouseleave", function () {
                    s._displayOpts(false);
                });

                //writable mode
            } else {
                s.$arrow.unbind("click").bind("click", function () {
                    s._displayOpts(true, true);
                });

                e.unbind("mouseleave").bind("mouseleave", function () {
                    s._displayOpts(false);
                });

                s.$input.unbind("keyup").unbind("click").bind("click", function () {
                    s._displayOpts(true, true);
                }).bind("keyup", function () {
                    if (s.disabled) return;

                    //auto-complete
                    if (o.autoComplete) {
                        s.$opts.find(".opt").detach();
                        var value = s.$input.val();

                        for (var i = 0; i < s.optItems.length; i++) {
                            var item = s.optItems[i].get(0).innerHTML;

                            if (value === item.slice(0, value.length)) {
                                s.$opts.append(s.optItems[i]);
                            }
                        }
                    }

                    s._displayOpts(true);
                });
            }

        },

        _treeOptsInit: function () {
            var o = this.options;
            if (!o.isTree || !o.opts || o.opts.length == 0)return;

            var treeData = Util.buildTree(o.opts, function (v) {
                v.display = v.groupName;
                v.value = v.groupId;
                v.id = v.groupId;
            }), result = [];

            function build(item) {
                result.push(item);
                if (item.children.length == 0)return;
                item.children.forEach(function (v) {build(v)})
            }

            build(treeData);
            o.opts = result;
        },
        _option2HTML: function (opt) {
            if (!this.readOnly) {
                return '<div class="opt">' + Util.escapeHtml(opt) + '</div>';
            } else {
                return '<div class="opt" val="' + opt.value + '" style="' + (opt.level ? ('padding-left:' + opt.level + 'em') : '') + '">' + Util.escapeHtml(opt.display) + '</div>';
            }
        },

        _displayOpts: function (show, reload) {
            var s = this,
                o = s.options;

            if (s.disabled)return;

            if (show) {
                s.$opts.show();//.focus();
                if (reload) {
                    s.$opts.find(".opt").detach();
                    for (var i = 0; i < s.optItems.length; i++) {
                        s.optItems[i].appendTo(s.$opts);
                    }
                }
                if (o.optionsDirection === 'up' || (o.optionsDirection === 'down' &&
                    s.element.offset().top - Util.$document.scrollTop() + o.height * o.maxOptions >= Util.$window.height())) {
                    s.$opts.css({
                        top: 'auto',
                        bottom: o.height,
                        'border-bottom-style': 'none',
                        'border-top-style': 'solid'
                    });
                } else {
                    s.$opts.css({
                        top: o.height + 2,
                        bottom: 'auto',
                        'border-bottom-style': 'solid'
                    });
                }
            } else {
                s.$opts.hide();
            }
        },

        _focusOpts: function (opt) {
            var s = this;
            if (typeof s.focusedOpt === "object") {
                s.focusedOpt.removeClass("opt-focused");
            }
            s.focusedOpt = opt.addClass("opt-focused");
        },

        _bindOptEvent: function (opt) {
            var s = this,
                o = s.options;

            if (o.multiple) {
                s.value = [];
                opt.toggle(function () {
                    opt.addClass('opt-selected');
                    if (s.$input.val().length === 0) {
                        s.$input.val(Util.unescapeHtml(this.innerHTML));
                    } else {
                        s.$input.val(s.$input.val() + ', ' + Util.unescapeHtml(this.innerHTML));
                    }
                    s.value.push($(this).attr("val"));
                    if ($.isFunction(o.onChanged)) {
                        o.onChanged.call(s.element, s.value);
                    }
                }, function () {
                    opt.removeClass('opt-selected');
                    s.value = [];
                    var curVal = [];
                    s.$input.val('');
                    $.each(opt.siblings(), function (i, o) {
                        if ($(o).hasClass('opt-selected')) {
                            curVal.push(o.innerHTML);
                            s.value.push($(o).attr('val'));
                        }
                    });
                    s.$input.val(curVal.join(', '));
                })
            } else {
                opt.click(function () {
                    s.$input.val(Util.unescapeHtml(this.innerHTML));

                    if (s.readOnly) {
                        s.value = $(this).attr("val");
                        //trigger change event
                        if ($.isFunction(o.onChanged)) {
                            o.onChanged.call(s.element, s.value);
                        }
                    }

                    s._focusOpts($(this));
                    s._displayOpts(false);

                });
            }

            opt.mouseover(function () {
                s._focusOpts($(this));
            });
        },

        _onHotKey: function (keyCode) {
            var s = this;

            if (!s.focusedOpt) {
                return;
            }
            switch (keyCode) {
                //up
                case L("keyCode.UP"):
                    s._focusOpts(s.focusedOpt.prev());
                    break;
                //down
                case L("keyCode.DOWN"):
                    s._focusOpts(s.focusedOpt.next());
                    break;
                default:
                    return;
            }
        },
        getValue: function () {
            var s = this,
                o = s.options,
                inputVal = s.$input.val();

            //search opts[], even code like $combo.find("input").val("value"); , we can also read the correct value if "value" is in this.options.opts.
            if (s.readOnly) {
                if (o.multiple) {
                    var retValue = [];
                    for (var i = 0; i < o.opts.length; i++) {
                        if (s.$opts.children('div:eq(' + i + ')').hasClass('opt-selected')) {
                            retValue.push(o.opts[i].value);
                        }
                    }
                    return retValue;
                } else {
                    return s.value;
                }
            }
            else {
                return inputVal;
            }

        },
        setValue: function (v, isInit) {
            var s = this,
                o = s.options;

            if (s.readOnly) {
                if (o.multiple) {
                    s.value = [];
                    for (var i = 0; i < v.length; i++) {
                        for (var j = 0; j < o.opts.length; j++) {
                            if (o.opts[j].value === v[i]) {
                                s.value.push(o.opts[j].value);
                                s.$opts.children('div:eq(' + j + ')').click();
                                break;
                            }
                        }
                    }
                } else {
                    for (var index = 0; index < o.opts.length; index++) {
                        if (o.opts[index].value == v) {
                            if (!isInit) {
                                s.$opts.children('div:eq(' + index + ')').click();
                            }
                            else {/* if is init, then do not trigger combobox change event */
                                s.$input.val(Util.unescapeHtml(o.opts[index].display));
                                s.value = v;
                            }
                            return;
                        }
                    }
                    s.$input.val("");
                    s.value = "";
                }

            }
            else {
                s.$input.val(Util.unescapeHtml(v));
            }
        },
        setStatus: function (isEnabled) {
            var s = this;

            if (typeof  isEnabled !== 'boolean') {
                return;
            }
            s.disabled = !isEnabled;
            if (s.disabled) {
                s.$header.addClass('disabled');
                s.$input.prop('disabled', true).addClass('disabled');
            }
            else {
                s.$header.removeClass('disabled');
                s.$input.prop('disabled', false).removeClass('disabled');
            }
        },
        resetCombo: function (opts) {
            var s = this;
            s.options.opts = opts;
            s.$opts.empty();
            s._init();
            return s;
        },
        isReadOnly: function () {
            return this.readOnly;
        }
    })
});
require('Widget, Validator, $, Util, System, Tip', function (Widget, Validator, $, Util, System, Tip) {
    var weekDays = ["日", "一", "二", "三", "四", "五", "六"],
        months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        mIndex = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11],
        yIndex = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9];

    function getDateString(date) {
        return date.getFullYear() + '/'
            + Util.zfill(date.getMonth() + 1, 2) + '/'
            + Util.zfill(date.getDate(), 2) + ' '
            + Util.zfill(date.getHours(), 2) + ':'
            + Util.zfill(date.getMinutes(), 2);
    }

    function calculate(year, month, day, hour, minute) {
        if (arguments.length == 1) {
            var date = year;
            if ((System.type(year) == 'number') || System.isString(year)) {
                date = new Date(year);
            }

            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
            hour = date.getHours();
            minute = date.getMinutes();
        }

        var firstDate = new Date(year, month, 1);
        return {
            selectDate: date,
            firstDate: firstDate,
            firstYear: year - 5,
            monthLen: new Date(year, month + 1, 0).getDate(),
            whichDay: firstDate.getDay(),
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            title: months[month] + year + '年'
        };
    }

    function initDate(date) {
        if (System.type(date) == 'string') {
            return new Date(date);
        } else if (System.type(date) == 'number') {
            return new Date(date * 1000);
        } else if (System.isFunction(date)) {
            return new Date(date())
        }
        return date;
    }

    Widget('datePicker', {
        options: {
            width: 200,
            defaultValue: new Date(),
            onChange: System.noop
        },
        _create: function () {
            var me = this, o = me.options, el = me.element;

            var html = '<input class="value" readonly type="text" style="width:' + (o.width - 28) + 'px" /><span class="if icon-calender"></span>';
            html += '<div class="date-pane unselectable"><div class="date-header">';
            html += '<span class="if icon-page-back"></span><span class="title"></span><span class="if icon-page-next"></span>';
            html += '</div><div class="date-week">';
            weekDays.forEach(function (v) {html += '<span>' + v + '</span>';});
            html += '</div><div class="date-body">';
            html += '</div><div class="date-footer">' +
                '<span>时间</span>' +
                '<input class="hour" type="tel" maxlength="2">:<input class="minute" type="tel" maxlength="2">' +
                '<button class="btn-today">今天</button>' +
                '<button class="btn-apply">确定</button>' +
                '</div></div>';

            html += '<div class="ym-pane unselectable">' +
                '<div class="clear-fix"><div class="pane-month">';
            mIndex.forEach(function (v) {html += '<span index="' + v + '">' + months[v] + '</span>'});

            html += '</div><div class="pane-year"><div><span class="if icon-page-back"></span><span class="if-gap"></span><span class="if icon-page-next"></span></div>';
            yIndex.forEach(function (v) {html += '<span index="' + v + '"></span>'});
            html += '</div></div>' +
                '<div class="date-footer"><button class="btn-year-apply">确定</button><button class="btn-cancel">取消</button></div>' +
                '</div>';

            el.html(html);
            me.$input = el.find('input.value');
            me.$hour = el.find('input.hour');
            Util.initWheelInput(me.$hour, 0, 23, 2);
            me.$hour.change(function () {
                if($(this).val() > '23') {
                    Util.alert('时间输入错误');
                    $(this).val(23);
                }
            });
            me.$minute = el.find('input.minute');
            Util.initWheelInput(me.$minute, 0, 59, 2);
            me.$minute.change(function () {
                if($(this).val() > '59') {
                    $(this).val(59);
                    Util.alert('时间输入错误');
                }
            })

            // me.changed = false;
        },
        _init: function () {
            var me = this, el = me.element;

            el.click(function (e) { e.stopPropagation(); });
            el.find('.icon-calender').click(function (e) {
                me._showPane();
            });
            el.find('input').click(function (e) {
                e.stopPropagation();
            });
            me.$input.on('change', function () {
                me.refresh();
            }).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    // me.changed = true;
                    me.refresh();
                }
            });
            me.$hour.on('blur', function () {
                me.date = calculate(me.data.selectDate.setHours($(this).val()));
            });
            me.$minute.on('blur', function () {
                me.date = calculate(me.data.selectDate.setMinutes($(this).val()));
            });
            el.find('.btn-apply').click(function () {
                me.val(getDateString(me.data.selectDate));
                // me.changed = true;
                me._showPane('hide');
                me.options.onChange.call(me, me.val());
            });
            el.find('.btn-today').click(function () {
                me.setDate(new Date(), false);
            });
            el.find('.date-pane .icon-page-back').click(function () {
                me.setDate(new Date(me.data.selectDate.setMonth(me.data.month - 1)), false);
            });
            el.find('.date-pane .icon-page-next').click(function () {
                me.setDate(new Date(me.data.selectDate.setMonth(me.data.month + 1)), false);
            });
            el.find('.title').click(function () {
                var ymPane = el.find('.ym-pane');

                ymPane.find('.pane-month').find("span[index=" + me.data.month + "]")
                    .addClass('select').siblings().removeClass('select');

                me._initYear();

                el.find('.ym-pane').slideDown(200);
            });
            el.find('.pane-month').children().click(function () {
                $(this).addClass('select').siblings().removeClass('select');
            });
            el.find('.pane-year').children('span').click(function () {
                $(this).addClass('select').siblings().removeClass('select');
            });
            el.find('.ym-pane .icon-page-back').click(function () {
                me.data.firstYear -= 10;
                me._initYear();
            });
            el.find('.ym-pane .icon-page-next').click(function () {
                me.data.firstYear += 10;
                me._initYear();
            });

            el.find('.btn-cancel').click(function () {
                el.find('.ym-pane').slideUp(200);
            });
            el.find('.btn-year-apply').click(function () {
                el.find('.ym-pane').slideUp(200);

                var month = parseInt(el.find('.pane-month').find('.select').attr('index'));
                var year = el.find('.pane-year').find('.select').attr('index');
                year = (year == undefined) ? me.data.year : (me.data.firstYear + parseInt(year));

                me.setDate(new Date(year, month, me.data.day, me.data.hour, me.data.minute), true);
            });

            this.setDate(initDate(this.options.defaultValue));
        },
        _initYear: function () {
            var me = this;
            me.element.find('.pane-year').children('span').removeClass('select').each(function (i, e) {
                var year = me.data.firstYear + yIndex[i], select = year == me.data.year;
                $(e).html(year).addClass(select ? 'select' : '');
            });
        },
        _generateBody: function (data) {
            var dates = [], date = new Date(data.firstDate.setDate(-data.whichDay));

            for (var i = 0; i < 42; i++) {
                date.setDate(date.getDate() + 1);
                dates.push(new Date(date));
            }
            this.dates = dates;

            function getTip(date) {
                return months[date.getMonth()] + ' ' + date.getDate() + '，' + date.getFullYear();
            }

            var html = "", selectDate = new Date(data.year, data.month, data.day);
            dates.forEach(function (date, index) {
                html += '<span class="' + ((date.getMonth() == data.month) ? '' : 'over') +
                    (date.getTime() == selectDate.getTime() ? ' today' : '') + '"' +
                    'tip="' + getTip(date) + '"' +
                    ' index="' + index + '">' + date.getDate() + '</span>';
            });
            return html;
        },

        _showPane: function (show) {
            var me = this;
            show = show || 'toggle';
            var $dp = this.element.find('.date-pane')[show]();
            this.element.find('.ym.pane').hide();

            if (!$dp.is(':hidden')) {
                me.setDate(new Date(me.val(true) * 1000), false);
                $('body').on('click', function () {me._showPane('hide')})
            } else {
                $('body').off('click');
            }
        },

        setDate: function (date, save) {
            var me = this, el = me.element,
                data = me.data = calculate(date);

            el.find('.title').html(data.title);
            el.find('.date-body').empty().html(me._generateBody(data)).find('span').click(function () {
                $(this).addClass('today').siblings().removeClass('today');
                var d = me.dates[$(this).attr('index')];
                d.setHours(me.data.hour, me.data.minute);
                me.data = calculate(d);
            });
            Tip.init(el.find('.date-body'));

            me.$hour.val(Util.zfill(data.hour, 2));
            me.$minute.val(Util.zfill(data.minute, 2));

            save = save == undefined ? true : save;
            if (save)
                me.val(getDateString(data.selectDate));
        },

        val: function (val) {
            if (val == undefined || val == 'timestamp' || (System.isBoolean(val) && val)) {
                // if(this.changed || (val === true)) {
                return new Date(this.$input.val()).getTime() / 1000;
                // } else {
                //     return 0;
                // }
            }
            if (val === 'string')return this.$input.val();

            if (System.isString(val) && /^\d+$/.test(val)) {
                val = parseInt(val) * 1000;
            }

            this.data.selectDate = new Date(val);
            this.$input.val(getDateString(this.data.selectDate));
        },

        refresh: function () {
            var me = this, v = me.$input.val();
            if (!Validator.is_datetime(v)) {
                me.setDate(me.data.selectDate);
                return;
            }

            me.setDate(new Date(v));
        },

        reset: function () {
            // this.changed = false;
            this.val(initDate(this.options.defaultValue));
        }
    })
});
define("Dialog", "$,System,Util,L,Tip", function ($, System, Util, L, Tip) {
    var dialogStack = [], dialogZIndex = 5000, messageZIndex = 50000;
    var Dialog = function (title, content, ready, hasMask, confirm, action, closeFn) {
        var id = System.uid(), hasMask = System.isBoolean(hasMask) ? hasMask : true;
        $('body').append(generateHtml(id, title, content, hasMask, action));

        dialogStack.push(id);

        var $element = $('#dialog-' + id);
        System.delay(function () {
            if (typeof ready === 'function') {
                ready.call($element, id);
                Tip.init($element);
            }
        });

        initAction($element, action);
        positionInit($element);
        bindEvent($element, confirm, closeFn);

        if (Util.compat.UNDER_IE_9 === true) {
            $element.find('.icon-close').addClass('content-empty')
            setTimeout(function () {
                $element.find('.icon-close').removeClass('content-empty')
            }, 0)
        }

        return id;
    };

    Dialog.close = function (id) {
        if (id != undefined) {
            dialogStack.remove(id);
        } else {
            id = dialogStack.pop();
        }

        setTimeout(function () {
            $('#dialog-' + id).remove();
        }, 300);
        $('#dialog-' + id).addClass("a-fadeoutT");
        $('#dialog-mask-' + id).remove();
    };

    var messageId = 0;
    Dialog.message = function (message, timeout, type) {
        close(true);

        messageId = System.uid();
        var html = '<div class="cwm-message a-fadeinT ' + (type == 'alert' ? 'cwm-alert' : '') + '" id="cwm-message-' + messageId + '" style="z-index: ' + (messageZIndex++) + '">' +
            '<span class="if icon-close"></span>' +
            '<span class="if ' + (type == 'alert' ? 'icon-warning' : 'icon-info') + '"></span>' +
            '<div class="message-content"><span>' + message + '</span></div></div>';
        $('body').append(html);

        var $element = $('#cwm-message-' + messageId);
        $element.find('.icon-close').click(close);

        function close(direct) {
            var dom = $('#cwm-message-' + messageId);
            if (direct === true)dom.remove();
            else {
                dom.addClass('a-fadeoutT')
                setTimeout(function () {
                    dom.remove()
                }, 300);
            }
        }

        if (type !== 'alert') {
            setTimeout(function () {
                close()
            }, timeout || 1800);
        }
    };

    Dialog.alert = function (message, timeout) {
        Dialog.message(message, timeout, 'alert');
    };

    Dialog.confirm = function (message, callback, action) {
        Dialog('提示',
            '<div style="min-width: 200px;max-width: 360px">' + message + '</div>',
            function () {
                this.find('.dg-bd').css({
                    'border-color': 'transparent',
                    background: 'transparent'
                });
            }, true, callback, action == undefined ? 'apply,cancel' : action);
    };

    Dialog.progressBar = function (title, message, timeout, callback) {
        var id = System.uid(),
            html = '<div class="dialog-mask" id="dialog-mask-' + id + '" style="z-index: ' + (dialogZIndex++) + '"></div>' +
                '<div class="cwm-dialog dialog-progress a-fadeinT" id="dialog-' + id + '" style="z-index: ' + (dialogZIndex++) + '">' +
                '<div class="dialog-header unselectable"><div class="dialog-title">' + title + '</div></div>' +
                '<div class="dialog-content clear-fix">' + message + '</div>' +
                '<div class="progress-bar"><div class="left-progress"></div>' +
                '</div>';
        $('body').append(html);

        var $element = $('#dialog-' + id);
        var leftBar = $element.find('.left-progress');
        var times = 0, unit = parseInt($element.find('.progress-bar').css('width')) / timeout;
        var t = setInterval(function () {
            if (times == timeout) {
                clearInterval(t);
                callback();
                Dialog.close(id);
            }
            leftBar.animate({width: (unit * (times + 1)) + 'px'}, 'slow');
            times++;
        }, 1000);

        positionInit($element);
        $element.draggable({handler: '.dialog-header'});
        return {id: id, timer: t};
    };

    Dialog.input = function (title, callback, defaultValue, validType, required) {
        if (defaultValue == undefined)defaultValue = '';

        var form;

        function submit(element) {
            if (!form.valid())return;
            var value = element.find('input').val();
            if (callback.call(this, value))
                Dialog.close(id);
        }

        var id = Dialog(title,
            '<div><input name="input" type="text" class="dialog-input" {} validType="{}"/></div>'
                .format((required == undefined || required) ? 'required' : '', validType),
            function (id) {
                var element = this;
                element.form({
                    validLazy: true,
                    items: {
                        input: {
                            actions: {
                                onKeyPress: function (keycode) {
                                    if (keycode == 13)
                                        submit(element);
                                }
                            }
                        }
                    },
                    ready: function () {
                        form = this;
                    }
                });
                element.find('input').focus().val(defaultValue).select();
            }, true, function () { submit(this) }, 'apply,cancel');
    };
    Dialog.waiting = function (stop) {
        if (System.isBoolean(stop) && !stop) {
            $('#cwm-waiting').remove();
            return;
        }

        if ($('#cwm-waiting').length > 0)return;

        var html = '<div id="cwm-waiting" style="z-index: ' + (dialogZIndex++) + '">' +
            '<div class="dialog-mask"></div>' +
            '<span></span></div>';
        $('body').append(html);
    };
    function generateHtml(id, title, content, hasMask, action) {
        return (hasMask ? '<div class="dialog-mask" id="dialog-mask-' + id + '" style="z-index: ' + (dialogZIndex++) + '"></div>' : '') +
            '<div class="cwm-dialog a-fadeinT" id="dialog-' + id + '" style="visibility: hidden;z-index:' + (dialogZIndex++) + '">' +
            '<div class="dg-hd unselectable"><span>' + title + '</span><span class="if icon-close f-fr"></span></div>' +
            '<div class="dg-bd clear-fix">' + content + '</div>' +
            '<div class="dg-ft"><div>' +
            '<button class="cancel inconspicuous" action="cancel" type="button">' + L('g.cancel') + '</button>' +
            '<button class="giveup inconspicuous" action="giveup" type="button">放弃</button>' +
            '<button class="apply" type="button" action="apply">' + L('g.confirm') + '</button>' +
            '</div></div>' +
            '</div>'
    }

    function positionInit($element) {
        var dialogWidth = $element.width();

        $element.css({
            'margin-left': (-dialogWidth) / 2,
            width: dialogWidth,
            visibility: 'visible'
        })
    }

    function bindEvent($element, confirmFn, closeFn) {
        $element.draggable({handler: '.dg-hd'});
        $element.find('.icon-close').click(function (e) {
            Dialog.close();
            $.isFunction(closeFn) && closeFn.call();
        }).on('mousedown', function (e) {e.stopPropagation();});
        $element.find('.dg-ft button').click(function () {
            var key = $(this).attr('action');
            if (key == 'cancel') {
                Dialog.close();
                return;
            }

            if (System.isFunction(confirmFn)) {
                var con = confirmFn.call($element, key);
                if (con) {
                    Dialog.close();
                }
            }
        });
    }

    function initAction($element, action, undefined) {
        if (action == undefined)action = 'apply';

        $element = $element.find('.dg-ft');
        if (System.isBoolean(action) && !action) {
        } else if (System.isString(action)) {
            action.split(',').forEach(function (v) {
                $element.find('.' + v).show();
            });
        } else if (System.isPlainObject(action)) {
            $.each(action, function (k, v) {
                $element.find('.' + k).html(v).show();
            })
        }
    }

    Util.toast = Dialog.message;
    Util.alert = Dialog.alert;
    Util.confirm = Dialog.confirm;
    Util.waiting = Dialog.waiting;
    Util.progressBar = Dialog.progressBar;
    return Dialog;
});


require('$', function ($) {
    $.extend($.fn, {
        getCss: function (key) {
            var v = parseInt(this.css(key));
            if (isNaN(v))
                return false;
            return v;
        }
    });

    $.fn.draggable = function (opts) {
        var ps = $.extend({
            zIndex: 20,
            opacity: .7,
            handler: null,
            inWindow: true,
            onDragStart: function () {},
            onMove: function () { },
            onDrop: function () { }
        }, opts);
        var dragndrop = {
            drag: function (e) {
                var dragData = e.data.dragData;

                /* dialog的位置相对于浏览器窗口，所以此处用clientX和clientY */
                var left = dragData.left + e.clientX - dragData.offLeft,
                    top = dragData.top + e.clientY - dragData.offTop,
                    $w = $(window),
                    $e = e.data.dragData.me;

                if (ps.inWindow) {
                    var max_left = $w.width() - dragData.width,
                        max_top = $w.height() - dragData.height;

                    max_left = max_left > 0 ? max_left : ($w.width() / 2);
                    max_top = max_top > 0 ? max_top : ($w.height() / 2);

                    left = left > 0 ? ( left < max_left ? left : max_left ) : 0;
                    top = top > 0 ? (top < max_top ? top : max_top ) : 0;
                }

                dragData.target.css({
                    'margin-left': 0,
                    left: left,
                    top: top
                });
                return false;
            },
            drop: function (e) {
                var dragData = e.data.dragData;
                dragData.target.css(dragData.oldCss)

                $(this).unbind('mousemove', dragndrop.drag)
                    .unbind('mouseup', dragndrop.drop);

                $(document).unbind('mousemove').unbind('mouseup');
                dragData.handler.unbind('mousemove').unbind('mouseup');
                document.onmousemove = null;
                document.onmouseup = null;

                // nms.restoreUserSelect();

                //拖拽结束后仍保持光标为move
                $(this).mouseover();
                return false;
            }
        };
        return this.each(function () {
            var me = this,
                $me = $(me),
                handler = null;

            if (typeof ps.handler == 'undefined' || ps.handler == null)
                handler = $me;
            else
                handler = (typeof ps.handler == 'string' ? $(ps.handler, this) : ps.handler);

            handler.bind('mousedown', {e: me}, function (s) {
                var target = $(s.data.e);
                var oldCss = {};
                if (target.css('position') != 'fixed')
                    target.css('position', 'fixed');

                var oldPosition = target.position(),
                    marginLeft = parseInt(target.css('margin-left'));

                // oldCss.cursor = target.css('cursor') || 'default';
                oldCss.opacity = target.getCss('opacity') || 1;
                var dragData = {
                    left: oldPosition.left + marginLeft,
                    top: oldPosition.top,
                    width: target.outerWidth() || target.getCss('width'),
                    height: target.outerHeight() || target.getCss('height'),
                    offLeft: s.pageX,
                    offTop: s.pageY,
                    oldCss: oldCss,
                    onMove: ps.onMove,
                    onDrop: ps.onDrop,
                    handler: handler,
                    target: target
                }
                target.css('opacity', ps.opacity);

                handler.bind('mousemove', {dragData: dragData}, dragndrop.drag)
                    .bind('mouseup', {dragData: dragData}, dragndrop.drop);

                $(document).bind('mousemove', {dragData: dragData}, function (e) {
                    dragndrop.drag(e);
                }).bind('mouseup', {dragData: dragData}, function (e) {
                    dragndrop.drop(e);
                });

                $me.find('body').bind('mousemove', {dragData: dragData}, function (e) {
                    dragndrop.drag(e);
                }).bind('mouseup', {dragData: dragData}, function (e) {
                    dragndrop.drop(e);
                });
            }).bind('mouseout', function () {
                return false;
            });
        });
    };
});
require("Widget, System, $, L, Util, Data, Tip, Validator", function (Widget, System, $, L, Util, Data, Tip, Validator) {
    var defaultErrMsg = {
        ip: "IP地址非法",
        mac: "MAC地址非法",
        number: function () {
            var msg = "字段必须为数字{0}";
            if (arguments.length === 1) {
                return msg.format('');
            }
            if (arguments.length === 2) {
                return msg.format('，且大于等于' + arguments[1]);
            }
            return msg.format('请输入' + arguments[1] + '-' + arguments[2] + '之间的数字');
        },
        ip_mask: "非法子网掩码",
        date: '日期有误',
        time: '时间有误',
        username: 'TP-LINK ID必须为邮箱或手机号',
        user_password: '密码有非法字符',
        security_password: '密码含有非法字符',
        url: '非法的URL'
    };

    function baseBindCheck(items, nameList) {
        var item1 = items[nameList[0]], item2 = items[nameList[1]],
            v1 = item1.val(), v2 = item2.val();

        if (Util.isEmpty(v1)) {
            if (Util.isEmpty(v2))return true;
            item1.error("该字段不能为空");
            return false;
        } else {
            if (!Util.isEmpty(v2)) return true;
            item2.error("该字段不能为空");
            return false;
        }
    }

    var itemType = {
        baseVariable: function () {
            return {
                _baseAttrKeys: 'name, type, help, disabled',
                valid: true,
                disabled: false,
                actions: {onChange: System.noop, onKeyPress: System.noop},
                errorMessage: '该字段有误'
            };
        },
        baseFun: {
            init: System.noop,
            initEvent: System.noop,
            _baseOnChange: System.noop,
            _initAttrs: function (element, options) {
                var me = this;
                String(me._baseAttrKeys + ',' + me.attrKeys).replace(System.rword, function (key) {
                    me[key] = element.attr(key)
                });

                if (options.items[me.name]) {
                    $.extend(true, me, options.items[me.name]);
                }

                if (!Util.isEmpty(me.help)) {
                    me.element.removeAttr('help');
                    Tip.init(me.element.after('<span class="icon icon-help" tip="' + this.help + '"></span>'));
                }

                if (me.disabled) {
                    me.element.addClass("disabled");
                }
                me.element.attr('autocomplete', 'off');
            },
            _end: function () {
                if (!Util.isUndefined(this.value)) this.val(this.value);
                this.initEvent();
            },
            _valid: function () {
                var me = this, value = me.val().toString();

                if (!me.element.is(':visible')) {
                    me.valid = true;
                    return;
                }

                if (me.disabled) {
                    me.valid = true;
                    return;
                }

                if (Util.isEmpty(value)) {
                    if (me.required) {
                        me.error("该项不能为空");
                    } else {
                        me.element.removeClass('error');
                        me.valid = true;
                        me.error(false);
                    }
                    return;
                }

                if (System.isString(me.validType)) {
                    var args = me.validType.split(','), type = args.shift(), valid_str;
                    if (true != (valid_str = Validator['is_' + type].apply(me, (args.unshift(value), args)))) {
                        var msg = (valid_str == false ? defaultErrMsg[type] : valid_str);
                        me.error(System.isFunction(msg) ? msg.apply(this, args) : msg);
                        return;
                    }
                }

                var result;
                me.error(System.isFunction(me.actions.valid)
                    ? (result = me.actions.valid.call(me, value), System.isBoolean(result) ? !result : result)
                    : false)
            },
            _generateInputEvent: function (item, validLazy) {
                function onChange() {
                    if (!validLazy)
                        item._valid();
                    item.actions['onChange'].call(item, item.val());
                }

                return {
                    keypress: function (e) {
                        item.actions['onKeyPress'].call(item, e.keyCode, e);
                    },
                    keyup: function () {
                        onChange();
                    },

                    // propertychange : function () {
                    //      onChange();
                    // },
                    compositionstart: function () {
                        $(this).off('input');
                    },
                    compositionend: function (e) {
                        $(this).on('input', onChange);
                        onChange();
                    },
                    focus: function () {
                        if (validLazy && !item.valid)
                            item.error(false);
                    },
                    blur: function () {
                        if (!validLazy)
                            item._valid();
                    }
                }
            },
            sibling: function (name) {
                return this.parent[name];
            },
            action: function (type, fun) {
                this.actions[type] = fun;
            },
            val: function () {
                var oldValue = this.element.val();

                for (var i = 0; i < arguments.length; i++) {
                    arguments[i] = arguments[i];
                }

                var result = this.element.val.apply(this.element, arguments);
                if ((oldValue != this.element.val()) && (arguments[arguments.length - 1] == false) && !this.options.validLazy)//通过代码设置时触发_valid
                    this._valid();

                return result;
            },
            error: function (message) {
                var me = this, element = me.element;

                if (message === false) {
                    element.removeClass('error').find('input').removeClass('error');
                    me.valid = true;
                } else {
                    element.addClass('error').find('input').addClass('error');

                    if (!System.isString(message))
                        message = this.errorMessage;

                    if (!me.valid)
                        me.latestMessage = message;
                }

                if (me._error) {
                    me._error.call(me, message);
                } else {
                    if (message === false) {
                        element.next('.icon-error').remove();
                    } else {
                        if (!me.valid) {
                            element.next('.icon-error').html(' '+message);
                        } else {
                            element.after('<span class="if icon-error error-msg f-pr5" style="margin-left: 4px"> ' + message + '</span>');
                        }
                        this.valid = false;
                    }
                }
            },
            enable: function (enable) {
                var me = this;
                if (enable == undefined) return !me.disabled;

                me.disabled = !enable;
                if (me.disabled) {
                    me.element.addClass('disabled').attr('disabled', 'disabled');
                    me.element.off();
                    if (me.type != 'button')
                        me.error(false);
                } else {
                    me.element.removeClass('disabled').removeAttr('disabled');
                    me.initEvent();
                    me._valid();
                }
            }
        },
        text: {
            attrKeys: 'required,validType',
            init: function (el, options) {
                var me = this;
                me.width = me.width || options.width;
                el.css({'height': 30, width: parseInt(me.width) - 10});
            },
            initEvent: function (validLazy) {
                var me = this;
                if (me.disabled) return;

                me.element.unbind().on(me._generateInputEvent(me, validLazy));

                if (me.validType) {
                    var args = me.validType.split(','), type = args.shift();
                    if (type == 'number' && args.length > 1) {
                        Util.initWheelInput.apply(me, (args.unshift(me.element), args))
                    }
                }
            }
        },
        password: {
            attrKeys: 'required,validType',
            init: function (element, options) {
                var me = this;
                me.width = me.width || options.width;
                me.textInput = element.after('<input type="text">').next();
                me.pswdInput = element;

                me.pswdInput.css('height', 30);
                me.pswdInput.css('width', me.width - 34);
                me.textInput.hide();
                me.textInput.css({
                    'width': me.width - 34, //考虑到padding和border width
                    'padding-right': 28,
                    'height': '30px'
                }).attr('placeholder', me.pswdInput.attr('placeholder'))
                    .attr('maxlength', me.pswdInput.attr('maxlength'));

                if (me.pswdInput.attr('spoiler') != 'true') {
                    me.switchBtn = me.textInput.after('<span class="if f-csp f-ib icon-hidepassword"></span>').next();
                    me.switchBtn.click(function () {
                        me.showPassword(!me.switchBtn.hasClass('icon-showpassword'));
                        me.switchBtn.toggleClass('icon-hidepassword').toggleClass('icon-showpassword');
                    })
                }
            },
            showPassword: function (show) {
                var me = this, oldValue = me.val(), oldValid = me.valid;
                me.pswdInput.hide();
                me.textInput.hide();
                me.error(false);

                me.element = show ? me.textInput : me.pswdInput;
                me.element.show();
                me.val(oldValue);

                if (!oldValid && !me.options.validLazy) me.error(me.latestMessage);
            },
            initEvent: function (validLazy) {
                var me = this;
                if (me.disabled) return;

                var events = me._generateInputEvent(me, validLazy);
                me.textInput.on(events);
                me.pswdInput.on(events);
            }
        },
        checkbox: {
            attrKeys: 'checked,text',
            init: function () {
                var me = this, element = me.element;
                element = element.after('<div class="form-checkbox f-ib unselectable"><span class="icon icon-checkbox"></span><span>' + me.text + '</span></div>').next();
                me.element.hide();
                me.element = element;
                me.checked = false;
            },
            val: function (value) {
                var me = this;
                if (value != undefined) {
                    if (this.disabled) return;

                    if (value != this.checked)
                        me.valid = me.actions['onChange'].call(me, value);
                    me.checked = value;
                    me.element[value ? 'addClass' : 'removeClass']('checked')
                        .children('.icon-checkbox')[value ? 'addClass' : 'removeClass']('checked');
                } else {
                    return this.checked;
                }
            },
            initEvent: function () {
                var me = this;
                me.element.on('click', function () {
                    if (me.disabled) return;
                    me.val(!me.checked);
                })
            },
            enable: function (enable) {
                if (enable == undefined) return !this.disabled;
                this.disabled = !enable;
                this.element.toggleClass('disabled');
            },
            _valid: function () {
                this.valid = true;// do not valid checkbox, always return true
                return true;
            }
        },
        combobox: {
            attrKeys: 'options,width,validType',
            init: function (element, options) {
                var me = this;
                element = element.after('<div class="form-combobox"></div>').next();
                me.element.hide();
                me.element = element;
                me.width = parseInt(me.width || options.width) || 190;

                var opts = [], i = 0;
                if (System.isArray(me.options)) {
                    if (System.isArray(me.options[0])) {
                        me.options.forEach(function (v) {
                            opts.push(v.length == 1 ? v[0] : {value: v[0], display: v[1]})
                        });
                    } else {
                        me.options.forEach(function (v) {
                            var opt = v.split(":"), val = i++;
                            if (opt.length == 1) opt.unshift(val);
                            opts.push({value: opt[0], display: Util.escapeHtml(opt[1])});
                        });
                    }
                } else if (me.options) {
                    String(me.options).replace(ump.rword, function (key) {
                        var opt = key.split(":"), val = i++;
                        if (opt.length == 1) opt.unshift(val);
                        opts.push({value: opt[0], display: Util.escapeHtml(opt[1])});
                    });
                }

                element.combobox({
                    opts: opts,
                    multiple: me.multiple ? true : false,
                    width: me.width,
                    isTree: me.isTree,
                    onChanged: function (value) {
                        me.actions['onChange'].call(me, value);
                    }
                });
            },
            initEvent: function () {
                if (!this.element.combobox('isReadOnly')) {
                    this.element.find('.ump-combo-input').on(this._generateInputEvent(this));
                }
            },
            val: function (value) {
                if (value == undefined) {
                    return this.element.combobox('getValue');
                } else {
                    this.element.combobox("setValue", value);
                }
                return this;
            },
            enable: function (enable) {
                if (enable == undefined) return !this.disabled;
                this.disabled == !enable;
                this.element.combobox('setStatus', enable);
                return this;
            },
            addItem: function (val, opt) {
                if (opt == undefined) {
                    curVal = this.options.split(':').length;
                    this.options += ',' + (curVal + 1) + ':' + val;
                } else {
                    this.options += ',' + opt + ':' + val;
                }

                this.init();
                return this;
            },
            reset: function (opts) {
                this.element.combobox('resetCombo', opts);
                return this;
            }
        },
        radio: {
            attrKeys: 'text,values',
            init: function () {
                var me = this, element = me.element;
                element = element.after('<div class="form-radio f-ib"></div>').next();

                me.values = Util.isUndefined(me.values) ? [] : String(me.values).split(',');
                me.text = String(me.text).split(',');
                if (me.values.length != me.text.length)
                    me.text.forEach(function (v, i) {
                        me.values.push(i)
                    });

                me.text.forEach(function (v, i) {
                    element.append('<div class="form-radio-unit f-ib" index="' + i + '"><span class="icon icon-radio"></span><span>' + v + '</span></div>');
                });

                me.element.hide();
                me.element = element;
                me.currentValue = me.values[0];
            },
            initEvent: function () {
                var me = this;
                me.element.children('.form-radio-unit').on('click', function () {
                    me.val(me.values[$(this).attr('index')]);
                });
                me.val(me.currentValue);
            },
            val: function (value) {
                var me = this;
                var changed = (value != me.currentValue);
                if (value != undefined) {
                    if (me.disabled) return;
                    var index = me.values.indexOf(String(value));
                    if (index < 0) return;

                    me.currentValue = value;
                    me.element.children('.form-radio-unit').removeClass('checked').children('.icon-radio').removeClass('checked');
                    me.element.children('.form-radio-unit[index=' + index + ']').addClass('checked').children('.icon-radio').addClass('checked');

                    if (changed)
                        me.valid = me.actions['onChange'].call(me, value);

                } else {
                    return me.currentValue;
                }
            },
            enable: function (enable) {
                if (enable == undefined) return !this.disabled;
                this.disabled = !enable;
                this.element.toggleClass('disabled');
            }
        },
        button: {
            attrKeys: '',
            initEvent: function () {
                var me = this;
                me.element.css('width', me.width);
                me.element.unbind().bind('click', function () {
                    me.actions['onClick'].call(me);
                })
            }
        },
        datetime: {
            attrKeys: 'width',
            init: function () {
                var me = this, element = me.element;
                element = element.after('<div class="form-date"></div>').next();
                me.element.hide();
                me.element = element;
                me.width = parseInt(me.width) || 200;

                element.datePicker({
                    width: me.width,
                    height: 30,
                    defaultValue: me.value, onChange: function (value) {
                        me._valid();
                        me.actions['onChange'].call(me, value);
                    }
                });
                me.validType = 'datetime';
            },
            initEvent: function () {
                var me = this;
                me.element.find('input').unbind().on(me._generateInputEvent(me));
            },
            val: function (val) {
                return this.element.datePicker('val', val);
            }
        },
        slider: {
            attrKeys: 'min,max,step,width',
            init: function () {
                var me = this, element = me.element;
                element = element.after('<div class="form-date"></div>').next();
                me.element.hide();
                me.element = element;
                me.width = parseInt(me.width || 200);

                element.slider({
                    min: parseInt(me.min),
                    max: parseInt(me.max),
                    step: parseInt(me.step),
                    width: me.width,
                    defaultValue: me.value,
                    onChange: function (value) {
                        me.actions['onChange'].call(me, value);
                    }
                });
            },
            val: function (val) {
                return this.element.slider('val', val);
            }
        },
        'switch': {
            attrKeys: '',
            init: function () {
                var me = this, element = me.element;
                element = element.after('<div style="display: inline-block;vertical-align: middle;" class="m-switch"><span></span></div>').next();
                me.element.hide();
                me.element = element;
            },
            val: function (value) {
                var me = this;
                var changed = (value !== me.currentValue);
                if (value !== undefined) {
                    if (me.disabled) return;

                    me.currentValue = value;
                    me.element.removeClass(value === 'on' ? 'off' : 'on');
                    me.element.addClass(value);

                    if (changed) {
                        me.actions['onChange'].call(me, value);
                    }
                } else {
                    return me.currentValue;
                }
            },
            initEvent: function () {
                var me = this;
                var btn = me.element;
                btn.unbind().bind('click', function () {
                    me.val(btn.hasClass('on') ? 'off' : 'on');
                })
            }
        }
    };

    function FormItem(itemElement, options) {
        var me = this, element = me.element = $(itemElement),
            type = element.attr('type');

        // $('<div class="error-msg"><span class="if icon-error"></span></div>').insertBefore(element)

        System.mix(me, itemType.baseVariable(), itemType.baseFun, itemType[type]);
        me._initAttrs(element, options);
        me.init(element, options);

        if (options.error) {
            me._error = options.error;
        }

        var item = options.items[me.name];
        if (item) {
            //TODO: 后面添加其他的属性
        }

        me.options = {
            validLazy: options.validLazy
        };
        me.initEvent(options.validLazy);
    }

    function formScan(element, options) {
        element = System.isString(element) ? $("#" + element) : element;

        var items = {};
        element.find('input').each(function (i, e) {
            var item = new FormItem(e, options);
            items[item.name] = item;
            item.parent = items;
        });
        return items;
    }

    Widget('form', {
        options: {
            value: {}, //初始化值
            items: {},
            validLazy: false,
            error: false,
            ready: System.noop
        },
        _create: function () {
            var me = this;
            me.items = formScan(me.element, me.options);

            $.each(me.options.value, function (key, value) {
                if (!me.items[key]) return;
                me.items[key].val(value);
            });
            $.each(me.items, function (i, item) {
                if (!Util.isUndefined(item.value)) item.val(item.value);
                item.widget = me;
            })
        },
        _init: function () {
            this.options.ready.call(this, this.items);
            Tip.init(this.element);
        },
        enable: function (name, enable) {
            this.items[name].enable(enable);
        },
        valid: function (items) {
            var isValid = true, me = this;

            if (System.isString(items)) {
                var names = items.split(','), items = [];
                names.forEach(function (v) {
                    items.push(me.items[v])
                })
            }

            $.each(items || this.items, function (k, v) {
                if (!isValid && me.options.validLazy) return;
                v._valid();

                if (System.isFunction(v.actions.bindCheck) && v.valid
                    && v.element.is(':visible') && !v.disabled) {
                    var result = v.actions.bindCheck.call(v, me.items);
                    v.valid = (System.isArray(result)) ? baseBindCheck(me.items, result) : result;
                }


                if (!v.valid) isValid = false;
            });


            return isValid;
        },
        val: function (name, value) {
            var me = this;
            if (name == undefined) {
                var val = {};
                $.each(me.items, function (key, item) {
                    val[key] = item.val();
                });
                return val;
            } else if (arguments.length == 1 && System.isString(name)) {
                return me.items[name].val();
            } else if (System.isPlainObject(name)) {
                $.each(name, function (key, v) {
                    me.items[key].val(v, value);
                });
            } else if (arguments.length == 2) {
                me.items[name].val(value);
            }
        },
        getItems: function () {
            return this.items;
        }
    })
})
;
require("Widget, System, $, L, Util, Data, Tip, Application, Cookie",
    function (Widget, System, $, L, Util, Data, Tip, Application, Cookie) {
        L.push({
            'ui.grid.lineNumber': '序号',
            'ui.grid.limit': "每页显示",
            'ui.grid.total': "共 {0} 条记录",
            'ui.grid.jump': "跳转到",
            'ui.grid.empty': '表格内容为空',
            'ui.grid.error.pageNum': '页码输入有误。',
            'ui.grid.filter': '确定',
            'ui.grid.clear': '重置',
            'keyCode.Enter': 13
        });
        Widget("grid", {
            options: {
                siteApi: true,
                emptyTip: '',
                title: '',
                help: false,
                defaultClass: 'cwm-grid',
                defaultRequest: {
                    start: 0,
                    limit: 20,
                    filter: {},
                    sort: '',
                    dir: 'asc'
                },

                actions: [],
                filter: [],
                defaultShowFilter: false,
                columnSelect: true,
                columns: [],
                lineNumber: true,
                selectable: 'single',
                dataSource: [],
                page: {
                    pageSizeOptions: [20, 50, 100],
                    pageClickMaxNum: 7
                },
                ready: null,
                rowSelect: [],
                onSelect: null,
                onClickRow: System.noop,
                firstNotGet: false,
                dealFilter: false,
                searchable: false,
                searchPlaceHolder: '',
                searchCb: System.noop,
                clearFilterCb: System.noop,
                style: 'grid',//'pane'
                paneItemCallback: System.noop,
                paneItemAction: [],
                paneReady: System.noop,
                dataTag: ''
            },
            _defaultColumn: {
                width: "auto",
                align: "left",
                show: true,
                format: "",
                sortable: false
            },
            _create: function () {
                var me = this,
                    o = me.options,
                    e = me.element;

                e.addClass(o.defaultClass);
                me.id = e.attr('id');

                me.listener = {};
                me.cookieColumns = [];
                me.param = System.mix({}, o.defaultRequest);
                me.rowSelectCache = [];
                me.selectRowData = {};
                me.pageNum = 0;
                me.options.columns.forEach(function (col, index) {
                    me.options.columns[index] = System.mix(col, me._defaultColumn, false);
                });

                me._buildTitle();
                me._buildToolBar();
                me._buildFilter();
                me._buildColumnSelect();

                me._buildHeader();

                me._buildPage();
                if (!o.firstNotGet) {
                    me.refresh();
                } else {
                    me.$page.hide();
                    me.$tbody.append(me.emptyHtml);
                    return;
                    o.firstNotGet = false;
                }
            },
            _init: function () {

            },
            _buildTitle: function () {
                var me = this,
                    o = me.options;

                if (Util.isEmpty(o.title)) {
                    return;
                }

                var html = '<div class="title"><span>' + L(o.title) + '</span>';
                if (!!o.help) {
                    html += '<div class="icon icon-help help" tip="' + o.help + '"></div>';
                }
                html += '</div>';

                Tip.init(me.element.append(html).find('.icon-help'));
            },
            _buildToolSpace: function () {
                var me = this;
                if (!!me.$toolbar)return;

                var html = '<div class="toolbar"><div class="column-select f-ib"></div><div class="left f-ib"></div><div class="right"><div class="grid-search f-ib"></div></div></div>';
                me.$toolbar = me.element.append(html).find('.toolbar');
            },
            _buildSearchKey: function () {
                var me = this, op = me.options;

                if (!op.searchable)return;
                var html = '<span class="if icon-search f-csp"></span>' +
                    '<input type="text" placeholder="' + me.options.searchPlaceHolder + '"/>';

                function search() {
                    me.param.searchKey = me.$toolbar.find('.grid-search input').val();
                    me.param.start = 0;
                    me.refresh();
                    me.options.searchCb.call(me, me.param.searchKey);
                }

                me.$toolbar.find('.grid-search').append(html)
                    .find('input').keydown(function (e) {
                    if (e.keyCode === 13) {
                        search()
                    }
                }).siblings('.icon-search').click(search);
            },
            _buildToolBar: function () {
                var me = this,
                    actions = me.options.actions;

                me._buildToolSpace();
                me._buildSearchKey();
                if (Util.isEmpty(actions))return;

                var html = '';
                for (var i = 0; i < actions.length; i++) {
                    html += '<div></div>';
                }

                me.$toolbar.find('.left').append(html);
                me.$toolbar.find(".left div").each(function (index, ele) {
                    $(ele).button(actions[index]);
                });

            },

            _buildColumnSelect: function () {
                var me = this,
                    columnSelect = me.options.columnSelect;
                if (!columnSelect || Util.isEmpty(me.options.columns))return;

                me._buildToolSpace();

                me.selectCol = $("<div/>").button({
                    name: "显示列",
                    cssAppend: 'grid-columns',
                    iconType: "content",
                    onPress: function () { me._showColumnSelect();}
                }).appendTo(me.$toolbar.find(".column-select").addClass('show'));
                me.selectCol.click(function (e) {
                    e.stopPropagation();
                })
            },
            _showColumnSelect: function () {
                var me = this, o = me.options;

                if (me.columnStatus != undefined) {
                    me.$toolbar.find('.column-panel')[me.columnStatus ? 'show' : 'hide']();
                    me.columnStatus = !me.columnStatus;
                    return;
                }

                me.columnStatus = false;
                var html = '<ul class="column-panel">';
                me.options.columns.forEach(function (col, index) {
                    html += '<li index="' + index + '" class="' + (col.show ? 'select' : '') + '">' +
                        '<span class="icon icon-checkbox ' + (col.show ? "checked" : '') + '"></span><label>' + col.display + '</label></li>';
                    me.cookieColumns[index] = col.show;
                });
                me.$toolbar.find('.grid-columns').append(html).find('li').click(function (e) {
                    var $e = $(this),
                        col = me.options.columns[parseInt($e.attr('index'))];
                    col.show = !col.show;
                    me.cookieColumns[parseInt($e.attr('index'))] = col.show;
                    Cookie.set('C_' + Util.hash(me.id), me.cookieColumns.valueOf());

                    $e.find('span').toggleClass('checked');
                    me._adjustColumn();
                });

                $(document).click(function () {
                    me.$toolbar.find('.column-panel').remove();
                    me.columnStatus = undefined;
                });
                me.$toolbar.find('.column-panel').click(function (e) {
                    e.stopPropagation();
                });
            },

            _buildFilter: function () {
                var me = this,
                    filter = me.options.filter;

                if (Util.isEmpty(filter))return;
                me._buildToolSpace();

                $("<div/>").button({
                    name: "筛选",
                    // iconType: "filter",
                    cssAppend: 'grid-filter',
                    toggle: true,
                    onToggle: function () {
                        me.$filter.slideToggle(200);
                    }
                }).appendTo(me.$toolbar.find(".right"));

                var html = '<div class="filter">';
                html += '<div class="control">' +
                    '<button class="clear">' + L("ui.grid.clear") + '</button>' +
                    '<button class="apply" style="display: none">' + L("ui.grid.filter") + '</button>' +
                    '</div><div>';
                filter.forEach(function (f) {
                    if (f.type == "datetime") {
                        html += '<div class="item f-ib"><span>' + f.display + '</span>'
                            + '<div id="ump-grid-form-' + f.name + me.id + '" type="text" name="' + f.name + '"></div></div>';
                    } else if (f.type == 'input') {
                        html += '<div class="item f-ib"><span>' + f.display + '</span>'
                            + '<input id="ump-grid-form-' + f.name + me.id + '" type="text" name="' + f.name + '"/></div>';
                    } else if (f.type == "select") {
                        html += '<div class="item f-ib"><span>' + f.display + '</span><select id="ump-grid-form-' + f.name + me.id + '" name="' + f.name + '">';
                        for (var i = 0; i < f.options.length; i++) {
                            html += '<option value="' + f.options[i].value + '">' + f.options[i].display + '</option>';
                        }
                        html += '</select><div></div></div>';
                    } else if (f.type == "checkbox") {
                        html += '<div class="item f-ib"><label for="ump-grid-form-' + f.name + me.id + '"><span>' + f.display
                            + '</span></label><input id="ump-grid-form-' + f.name + me.id + '" type="checkbox" name="' + f.name + '"/><span class="icon icon-checkbox f-ib"></span></div>';
                    }
                });
                html += '</div>';
                if (me.options.defaultShowFilter) {
                    me.$toolbar.find(".right").children('div:eq(1)').remove();
                    me.$filter = $(html).appendTo(me.element);
                    me.$filter.find(".filter-arrow").hide();
                } else {
                    me.$filter = $(html).appendTo(me.element).hide();
                }

                me.$filter.form = {};
                me.combobox = {};
                me.$filter.isSlideDown = true;

                $.each(filter, function (index, o) {
                    var f = filter[index];
                    me.$filter.form[f.name] = me.$filter.find("#ump-grid-form-" + f.name + me.id);
                    if (f.type == "select") {
                        me.combobox[f.name] = me.$filter.form[f.name].hide().next().combobox({
                            multiple: f.multiple,
                            opts: f.options,
                            onChanged: function (v) {
                                System.isFunction(f.onChanged) && f.onChanged.call(this, v);
                                me.$filter.find('.apply').trigger('click');
                            },
                            width: 180,
                            height: 30
                        }).combobox('setValue', f.defaultOption, true);
                    }
                    else if (f.type == "input") {
                        me.$filter.form[f.name].css({width: 170, height: 30});
                    }
                    else if (f.type == "datetime") {
                        f.onChange = function () {me.$filter.find('.apply').trigger('click')};
                        me.$filter.form[f.name].css({height: 30}).datePicker(f);
                        // if (f.initNull) {
                        me.$filter.form[f.name].val('');
                        // }
                    }
                    else if (f.type == "checkbox") {
                        me.$filter.form[f.name].hide().change(function () {
                            if (this.checked) {
                                me.$filter.form[f.name].next().addClass("checked");
                            }
                            else {
                                me.$filter.form[f.name].next().removeClass("checked");
                            }
                        }).next().click(function () {
                            $(this).prev().trigger("click");
                        });
                    }
                    me.$filter.form[f.name].keypress(function (e) {
                        if (e.keyCode === L("keyCode.Enter")) {
                            e.preventDefault();
                            me.$filter.find('.apply').trigger('click');
                        }
                    })
                });

                me.$filter.find(".apply").click(function () {
                    me.param.filter = $.extend({}, me.param.filter);
                    me.param.start = 0;
                    me.filter = {};
                    for (var index = 0; index < filter.length; index++) {
                        var f = filter[index];
                        if (f.type == "input") {
                            if (me.$filter.form[f.name].val() == '') {
                                me.filter[f.name] = undefined;
                            } else {
                                me.filter[f.name] = me.$filter.form[f.name].val();
                            }
                        }
                        if (f.type == "datetime") {
                            var value = me.$filter.form[f.name].datePicker("val");
                            me.filter[f.name] = (value == 0) ? undefined : value;
                        }
                        if (f.type == "checkbox") {
                            me.filter[f.name] = me.$filter.form[f.name].attr("checked") ? true : false;
                        }
                        if (f.type == "select") {
                            me.filter[f.name] = me.combobox[f.name].combobox("getValue");
                        }
                    }
                    if (me.options.dealFilter) {
                        me.filter = me.options.dealFilter.call(me, me.filter);
                    }
                    if (me.filter !== false) {
                        System.mix(me.param.filter, me.filter, true);
                        me.refresh();
                    }
                });
                me.$filter.find(".clear").click(function () {
                    me.param.filter = $.extend({}, me.options.defaultRequest.filter);
                    me.param.start = 0;
                    var defaultFilter = me.param.filter;

                    for (var index = 0; index < filter.length; index++) {
                        var f = filter[index];
                        if (f.type == "input") {
                            me.$filter.form[f.name].val(defaultFilter[f.name]);
                        } else if (f.type == "datetime") {
                            // if (f.initNull) {
                            // me.$filter.form[f.name].val('');
                            // } else {
                            me.$filter.form[f.name].datePicker('reset');
                            // }
                        } else if (f.type == "checkbox") {
                            if (me.$filter.form[f.name].prop("checked") != false) {
                                me.$filter.form[f.name].trigger("click");
                            }
                        } else if (f.type == "select") {
                            me.$filter.form[f.name].val(f.defaultOption || '');
                            me.$filter.form[f.name].next().combobox('setValue', f.defaultOption || '', true);
                        }
                    }

                    if (me.options.clearFilterCb) {
                        me.options.clearFilterCb.call(me);
                    }
                    me.filter = {};
                    me.$filter.find('.apply').trigger('click');
                });
            },

            _buildHeader: function () {
                var me = this,
                    o = me.options,
                    columns = o.columns;

                var html = '<div class="grid-wrapper"><table class="content" border="0"><thead class="header"><tr>';
                if (!!o.selectable) {
                    html += '<td class="line-select">';
                    if (o.selectable == "multiple") {
                        html += '<span class="icon icon-checkbox select-all"></span>';
                    }
                    html += '</td>';
                }
                if (o.lineNumber) {
                    html += '<td class="line-number">' + L('ui.grid.lineNumber') + '</td>';
                }

                me.columnsName = [];
                columns.forEach(function (col) {
                    var w = (typeof col.width == "string") ? col.width : (col.width + "px");
                    var sortClass = col.sortable ? ' class="ump-grid-sortable"' : '';
                    if (col.sortable && col.dir) {
                        me.param.dir = col.dir;
                        me.param.sort = col.name;
                    }

                    if (col.align == 'center') {
                        html += '<td class="line-number" style="width:auto"' + sortClass + ' cellname="' + col.name + '">';
                    } else {
                        html += '<td style="width:auto"' + sortClass + ' cellname="' + col.name + '">';
                    }
                    html += '<div style="text-align:' + col.align + '" class="pointer">';
                    html += '<span>' + col.display + '</span>';
                    if (col.sortable) {
                        if (col.dir == 'desc') {
                            html += '<span class="ump-grid-arrow if icon-sort"></span>';
                        } else {
                            html += '<span class="ump-grid-arrow if icon-sort"></span>';
                        }
                    }
                    html += '</div></td>';

                    me.columnsName.push(col.name);
                });
                html += '</tr></thead><tbody class="body"></tbody></table><div class="pane"></div>';

                me.emptyHtml = '<tr class="empty"><td style="text-align: center" colspan="' + (columns.length + (o.selectable ? 1 : 0) + (o.lineNumber ? 1 : 0)) + '"><div>' + (o.emptyTip ? o.emptyTip : L("ui.grid.empty")) + '</div></td></tr>';
                me.$tbody = me.element.append(html).find('.body');
                me.$header = me.element.find('thead');
                me.$header.find(".select-all").click(function () {
                    me.setSelectRow('all');
                    if ($.isFunction(o.onSelect)) {
                        me.$tbody.find('tr').each(function () {
                            var index = parseInt($(this).find('.select').attr('index'));
                            o.onSelect.call(me, $(this), me.getSelectRow(), index, me.response[index]);
                        });
                    }
                });
                me.$wrapper = me.element.find('.grid-wrapper');
                me.$table = me.element.find('.content');
                me.$pane = me.element.find('.pane');

                me.$header.find('.ump-grid-sortable').click(function (e) {
                    me.param.sort = $(this).attr('cellname');
                    $(this).find('.icon-sort').toggleClass('icon-sort-asc');
                    if ($(this).find('.icon-sort').hasClass('icon-sort-asc')) {
                        me.param.dir = 'asc';
                    } else {
                        me.param.dir = 'desc';
                    }
                    me.refresh();

                });

                me._adjustColumn();
            },

            _buildContent: function () {
                var me = this, o = me.options;
                if (o.style == 'grid') {
                    me.$pane.hide();
                    me.$table.show();
                    me._buildBody();
                } else {
                    me.$table.hide();
                    me.$pane.show();
                    me._buildPane();
                }
            },

            _buildPane: function () {
                var me = this, o = me.options, list = me.response.data;

                var actions = '<div class="pane-item-actions">';
                o.paneItemAction.forEach(function (t, i) {
                    actions = actions + ('<span index="{}" class="if icon-{}" tip="{}"></span>'.format(i, t.icon, t.tip));
                });
                actions += '</div>';

                var html = '<ul class="grid-pane clear-fix">';
                list.forEach(function (v, i) {
                    var result = o.paneItemCallback.call(me, v);
                    if (!Util.isEmpty(result)) html += '<li class="pane-item" index="' + i + '">' + result + actions + '</li>';
                });
                me.$pane.html(html);

                if (!!o.selectable) {
                    me.$pane.find('.pane-item').click(function () {
                        var $item = $(this), index = parseInt($item.attr('index'));

                        if ($item.hasClass('ump-grid-row-disabled')) {
                            return;
                        }

                        if (o.selectable == 'multiple') {
                            $item.toggleClass('selected');
                            selectPane(index, $item.hasClass('selected'));
                        } else if (o.selectable == 'single') {
                            $item.siblings('.selected').removeClass('selected');
                            $item.toggleClass('selected');
                            selectPane(index, $item.hasClass('selected'));
                        } else {
                            $(this).siblings('.selected').removeClass('selected');
                            $(this).toggleClass('selected');
                        }

                        if ($.isFunction(o.onSelect)) {
                            o.onSelect.call(me, me.element, me.getSelectRow(), index, me.response[index]);
                        }
                    })
                }
                me.$pane.find('.pane-item-actions>span').click(function () {
                    var $action = $(this),
                        actionIndex = parseInt($action.attr('index')),
                        itemIndex = parseInt($action.parent().parent().attr('index'));
                    o.paneItemAction[actionIndex].cb.call(me, list[itemIndex]);
                });

                function selectPane(index, isSelected) {
                    if (o.selectable === 'single') {
                        me.selectRowData = {};
                        me.rowSelectCache = [];
                    }

                    var d = me.getData();
                    var id = d[index][o.dataTag];
                    me.selectRowData[id] = isSelected ? d[index] : undefined;
                    me.rowSelectCache[index + 1] = isSelected;
                }

                o.paneReady.call(me, me.$pane);
            },

            _buildBody: function () {
                var me = this,
                    o = me.options,
                    list = me.response.data,
                    html = '';

                if (me.$tbody)me.$tbody.empty();
                list.forEach(function (line, index) {
                    if (o.dataTag && !$.isEmptyObject(me.selectRowData)) {
                        $.each(me.selectRowData, function (m, n) {
                            if (m === line[o.dataTag] && !$.isEmptyObject(n)) {
                                me.rowSelect.push(index);
                            }
                        });
                    }
                    html += '<tr index="' + index + '">';
                    if (!!o.selectable) {
                        html += '<td class="line-select"><span class="icon grid-checkbox ' + (o.selectable == 'single' ? 'icon-checkbox-single' : 'icon-checkbox') + ' select select-' + index + '" index="' + index + '"></span></td>';
                    }
                    if (o.lineNumber) {
                        html += '<td class="line-number">' + (index + 1) + '</td>';
                    }
                    o.columns.forEach(function (t) {
                        var fun = t.callback || me._buildCell;
                        if (t.align == 'center') {
                            html += '<td class="line-number">' + fun.call(me, t.name, line, index) + '</td>';
                        } else {
                            html += '<td>' + fun.call(me, t.name, line, index) + '</td>';
                        }
                    });
                    html += '</tr>';
                });
                me.$tbody.append(html);
                me._adjustColumn();

                me.$header.find(".select-all").removeClass('checked');
                me.$tbody.find('tr').click(function (e) {
                    var $item = $(this), index = parseInt($item.attr('index'));

                    if (o.onClickRow.call(me, $item, index, me.response[index], e))return;

                    if ($item.hasClass('ump-grid-row-disabled')) {
                        return;
                    }
                    if (o.selectable == 'multiple') {
                        $item.toggleClass('selected');
                        checkboxClick($(this).find('.select'));
                    } else if (o.selectable == 'single') {
                        $item.siblings('.selected').removeClass('selected');
                        $item.addClass('selected');
                        checkboxClick($(this).find('.select'));
                    } else {
                        $item.siblings('.selected').removeClass('selected');
                        $item.toggleClass('selected');
                    }

                    if ($.isFunction(o.onSelect)) {
                        var index = parseInt($(this).find('.select').attr('index'));
                        o.onSelect.call(me, $item, me.getSelectRow(), index, me.response[index]);
                    }
                }).hover(function () {
                    var prev = $(this).toggleClass('hover').prev();
                    if (prev.length > 0)
                        prev.toggleClass('hover-t');
                    else
                        me.$header.toggleClass('hover-t');
                });
                me.rowSelect.forEach(function (data) {
                    me.setSelectRow(data, true);
                });

                var checkboxClick = function ($checkbox) {
                    if ($checkbox.parents('tr:first').hasClass('ump-grid-row-disabled')) {
                        return;
                    }
                    var trIndex = $checkbox.attr('index');
                    me.setSelectRow(trIndex);

                    if (o.selectable === 'multiple') {
                        me.$header.find(".select-all").removeClass('checked');
                        var d = me.getData();
                        var id = d[trIndex][o.dataTag];
                        if ($checkbox.hasClass('checked')) {
                            $checkbox.parents('tr:first').addClass('selected');
                            if (id && id.length > 0) {
                                me.selectRowData[id] = d[trIndex];
                            }
                        } else {
                            if (id && id.length > 0) {
                                me.selectRowData[id] = undefined;
                            }
                            $checkbox.parents('tr:first').removeClass('selected');
                        }
                        var all = true;
                        $.each($checkbox.parents('tbody:first').find('.grid-checkbox'), function (id, obj) {
                            if (!$(obj).hasClass('checked')) {
                                all = false;
                            }
                        });
                        if (all) {
                            me.$header.find(".select-all").addClass('checked');
                        } else {
                            me.$header.find(".select-all").remove('checked');
                        }
                    } else if (o.selectable == 'single') {
                        me.$tbody.find('.icon-checkbox-single').each(function (i, o) {
                            var $o = $(o);
                            if ($o.attr('index') != trIndex) {
                                $o.removeClass('checked');
                                $o.parents('tr:first').removeClass('selected');
                            }
                        });
                        $checkbox.addClass('checked');
                        $checkbox.parents('tr:first').addClass('selected');
                    }
                };
            },

            _buildCell: function (name, line) {
                if (typeof name == "string") {
                    var names = name.split(".");
                    return (names.length == 1) ? (line[name] !== undefined ? Util.escapeHtml(line[name]) : '') : this._buildCell(line, names);
                }

                return (name.length <= 1) ? line[name] : this._buildCell(line[name.shift()], name);
            },

            _buildPage: function () {
                var me = this,
                    page = me.options.page;

                if (!page)return;

                var param = me.param,
                    pageSizeOptions = page.pageSizeOptions || [20, 50, 100, 200] || [param.limit];

                var html = '<div class="page"><div class="limit">' +
                    '<span>' + L('ui.grid.limit') + '</span>' +
                    '<div class="page-select"></div>' +
                    '<span class="total-page"></span>' +
                    '</div>';
                html += '<div class="shortcut">' +
                    '<div class="click"></div>' +
                    '<div class="jump"><input type="text" /><span class="if icon-go"></span>';
                html += '</div>';
                me.$page = me.element.append(html).find('.page');

                //初始化页面选择
                var pageSizeOpts = [];
                pageSizeOptions.forEach(function (item) {
                    pageSizeOpts.push({
                        display: item,
                        value: item
                    });
                });
                me.$page.find('.page-select').combobox({
                    width: 60,
                    height: 22,
                    opts: pageSizeOpts,
                    onChanged: function (v) {
                        me.param.limit = parseInt(v, 10);
                        me.param.start = 0;
                        me.refresh();
                        // me.selectRowData = {};
                    }
                }).combobox('setValue', pageSizeOptions[0], true);

                me.$page.find(".icon-go").click(function () {
                    var page = parseInt(me.$page.find(".jump input").val());
                    if (!page || page <= 0 || page > me.pageNum) {
                        Util.toast(L('ui.grid.error.pageNum'));
                        return;
                    }
                    me.param.start = me.param.limit * (page - 1);
                    me.refresh();
                });
            },

            _refreshPage: function (currentPage, totalPage, total) {
                var me = this;
                me.pageNum = totalPage;

                if (!me.options.page) return;
                me.$page.find('.total-page').html(L('ui.grid.total').format(total));

                var firstClass = currentPage == 1 ? "disabled" : '',
                    lastClass = currentPage == totalPage ? "disabled" : '';
                var omitLength = 2, html = '', leftOmit = false, rightOmit = false;
                for (var i = 1; i <= totalPage; i++) {
                    if ((currentPage - i > omitLength) && (totalPage - i > omitLength * 2)) {
                        if (!leftOmit) {
                            html += '<span class="omit">...</span>';
                            leftOmit = true;
                        }
                        continue;//do not create
                    }
                    if ((i - currentPage > omitLength) && (i - 1 > omitLength * 2)) {
                        if (!rightOmit) {
                            html += '<span class="omit">...</span>';
                            rightOmit = true;
                        }
                        continue;//do not create
                    }
                    if (i != currentPage) {
                        html += '<span class="click-page" page="' + i + '">' + i + '</span>';
                    }
                    else {
                        html += '<span class="current-page" page="' + i + '">' + i + '</span>';
                    }
                }

                me.$page.find('.click').html('<span class="if icon-page-first ' + firstClass + '" page="1" tip="第1页"></span>' +
                    '<span class="if icon-page-back ' + firstClass + '" page="' + (currentPage - 1) + '" tip="上一页"></span>' +
                    html +
                    // '<span class="current-page">' + currentPage + '</span>' +
                    '<span class="if icon-page-next ' + lastClass + '" page="' + (currentPage + 1) + '" tip="下一页"></span>' +
                    '<span class="if icon-page-last ' + lastClass + '" page="' + totalPage + '" tip="第' + totalPage + '页"></span>')
                    .find('.if,.click-page').click(function () {
                    if ($(this).hasClass("disabled"))return;
                    me.param.start = me.param.limit * (parseInt($(this).attr('page')) - 1);
                    me.refresh();
                });
            },

            _adjustColumn: function () {
                var me = this,
                    columns = me.options.columns;
                var cookieColumnArr = Cookie.get('C_' + Util.hash(me.id)).split(',');

                columns.forEach(function (col, index) {
                    var aIndex = index;
                    if (me.options.selectable && me.options.lineNumber) {
                        index += 2;
                    } else if (me.options.lineNumber || me.options.selectable) {
                        index += 1;
                    } else {
                        // index = index;
                    }

                    if (cookieColumnArr.length > 0 && Boolean(cookieColumnArr[0])) {
                        col.show = (cookieColumnArr[aIndex] === 'true');
                    }

                    me.$header.find('tr').find('td:eq(' + index + ')')[col.show ? "show" : "hide"]();
                    me.$tbody.find('tr').find('td:eq(' + index + ')')[col.show ? "show" : "hide"]();
                });
                $.each(me.$tbody.find('tr'), function (trI, tr) {
                    $.each($(tr).find('td'), function (tdI, td) {
                        if ($(td).text().length > 24) {
                            $(td).css({
                                'white-space': 'pre-line',
                                'lineHeight': '24px',
                                'paddingTop': 4,
                                'paddingBottom': 4
                            });
                        }
                    });
                });
            },

            refresh: function (source, callback, param, options) {
                var me = this,
                    dataSource = source || me.options.dataSource;

                var key = Util.hash('gf-' + me.id), cacheFilter = $.parseJSON(Cookie.get(key));
                Cookie.clear(key);

                //目前仅处理了combobox类型的filter，其他类型的filter有需求再加
                if (cacheFilter && me.$filter) {
                    me.$filter.show();
                    me.$toolbar.find('.grid-filter').addClass('down');

                    $.each(cacheFilter, function (k, v) {
                        me.param.filter[k] = v;
                        me.$filter.form[k].next().combobox('setValue', v, true);
                    });
                }

                var param = System.mix(me.param, param, true);
                if (System.type(dataSource) == 'string') {
                    if (me.$page) {
                        me.$page.show();
                    }
                    Data.send(dataSource, me.options.siteApi ? {
                        siteId: "",
                        grid: param
                    } : param, function (data) {
                        me._refresh(data);
                    }, me.options.error)
                } else {
                    if (me.$page) {
                        me.$page.hide();
                    }
                    me._refresh(dataSource)
                }
            },

            _refresh: function (_data) {
                var me = this;

                me.$tbody.empty();
                //清空选中数据缓存
                me.rowSelectCache = [];
                me.rowSelect = [];
                if (System.type(_data) == 'object') {
                    me.response = _data;
                } else if (System.isArray(_data) && _data.length > 0) {
                    me.response = System.mix({
                        start: 0,
                        data: _data,
                        total: _data.length
                    });
                }

                if (!System.isArray(me.response.data) || me.response.data.length == 0) {
                    if (me.param.start == 0) {
                        if (me.$page) {
                            me.$page.hide();
                        }

                        if (me.options.style == 'grid') {
                            me.$table.show();
                            me.$pane.hide();
                            me.$tbody.append(me.emptyHtml);
                        } else {
                            me.$table.hide();
                            me.$pane.show();
                            me.$pane.html("<div style='padding: 16px 0 0 17px'>数据为空</div>");
                        }
                    } else {
                        System.delay(function () {
                            me.param.start = Math.max(0, me.param.start - me.param.limit);
                            me.refresh();
                        })
                    }

                } else {
                    me._buildContent();
                    me._refreshPage(parseInt(me.param.start / me.param.limit) + 1, Math.ceil(me.response.total / me.param.limit), me.response.total);
                }

                //可以在初始化完成之后对表格进行定制
                if (System.isFunction(me.options.ready)) {
                    me.options.ready.call(me, me.element, _data.data);

                    if ($('body').find('.role-action').length > 0) {
                        Application.getSiteRole(function (role) {
                            if (role === 0) {
                                $('.role-action').button('enable');
                                $('.role-action').removeClass('disabled');
                                $('.role-action').attr('disabled', false);
                            } else if (role === 1) {
                                $('.role-action').button('disable');
                                $('.role-action').addClass('disabled');
                                $('.role-action').attr('disabled', true).unbind('click');
                                $('a.role-action').attr('href', 'javascript:void(0)');
                            }
                        });
                    }
                }
                Tip.init();
            },

            getSelectRowDataOverPage: function () {
                var me = this,
                    o = me.options;
                var retData = {};
                $.each(me.selectRowData, function (i, o) {
                    if (o != undefined) {
                        retData[i] = o;
                    }
                });

                return retData;
            },
            resetSelectRowDateOverPage: function () {
                this.selectRowData = {};
            },
            getSelectRow: function () {
                var me = this,
                    o = me.options;
                var row = [];

                if (o.style == 'pane') {
                    System.slice(this.rowSelectCache, 1).forEach(function (data, index) {
                        if (!!data)row.push(index);
                    });
                    return row;
                }

                if (o.selectable === 'multiple') {
                    System.slice(this.rowSelectCache, 1).forEach(function (data, index) {
                        if (!!data)row.push(index);
                    });
                } else if (o.selectable === 'single') {
                    var checked = me.$tbody.find('.checked');
                    if (checked.length > 0) {
                        row.push(checked.attr('index'));
                    }
                } else {
                    $.each(me.$tbody.find('tr.selected'), function (id, obj) {
                        row.push(obj.rowIndex - 1);
                    });
                }
                return row;
            },
            setSelectRow: function (index, checked) {
                var me = this,
                    rowSelectCache = me.rowSelectCache;

                if (me.options.style == 'pane') {
                    me.element.find('.pane-item:eq(' + index + ')').trigger('click');
                    return;
                }

                if (index == 'all') {
                    var $rows = me.$tbody.find('.select');
                    rowSelectCache[0] = checked || !rowSelectCache[0];
                    me.response.data.forEach(function (data, index) {
                        if ($($rows[index]).parents('tr:first').hasClass('ump-grid-row-disabled')) {
                            return;
                        }
                        rowSelectCache[parseInt(index) + 1] = rowSelectCache[0];
                        if (me.options.dataTag.length > 0) {
                            if (rowSelectCache[i]) {
                                me.selectRowData[data[me.options.dataTag]] = data;
                            } else {
                                me.selectRowData[data[me.options.dataTag]] = undefined;
                            }
                        }
                    });
                    var action = rowSelectCache[0] ? 'addClass' : 'removeClass';
                    me.$header.find('.select-all')[action]('checked');
                    var data = me.response.data;
                    for (var i = 0, length = $rows.length; i < length; i++) {
                        if (!$($rows[i]).parents('tr:first').hasClass('ump-grid-row-disabled')) {
                            $($rows[i]).parents('tr:first')[action]('selected');
                            $($rows[i])[action]('checked');
                            if (me.options.dataTag) {
                                var d = data[i];
                                me.selectRowData[d[me.options.dataTag]] = d;
                            }
                        }
                    }
                } else {
                    var $row = me.$tbody.find('.select-' + index);
                    if ($row.parents('tr:first').hasClass('ump-grid-row-disabled')) {
                        return;
                    }
                    rowSelectCache[0] = false;
                    rowSelectCache[parseInt(index) + 1] = checked || !rowSelectCache[parseInt(index) + 1];
                    me.$header.find('.select-all').removeClass('checked');
                    $row.parents('tr:first').toggleClass('selected');
                    $row.toggleClass('checked');

                    if (checked)
                        me.$pane.find('li.pane-item[index=' + index + ']').addClass('selected');
                    else
                        me.$pane.find('li.pane-item[index=' + index + ']').removeClass('selected');

                    if (me.options.dataTag) {
                        var data = me.response.data[index];
                        if (rowSelectCache[parseInt(index) + 1]) {
                            me.selectRowData[data[me.options.dataTag]] = data;
                        } else {
                            me.selectRowData[data[me.options.dataTag]] = undefined;
                        }
                    }
                }
            },

            setSelectItem: function (checkCb, checked) {
                var me = this;
                var items = this.response.data;
                for (var i = 0; i < items.length; i++) {
                    if (checkCb(items[i]))
                        me.setSelectRow(i, checked);
                }
            },

            getData: function (index) {
                var response = this.response;
                if (index == undefined) {
                    return response.data;
                } else if (index == 'all')
                    return response;
                return response.data[index];
            },

            getFilterByName: function (name) {
                var me = this,
                    o = me.options;

                if (!name) {
                    return false;
                }
                var $filters = me.element.find('.filter .item');

                for (var i = 0, l = $filters.length; i < l; i++) {
                    var f = $($filters[i]).find('input');
                    var s = $($filters[i]).find('select');
                    if (f.attr('name') === name) {
                        return $filters[i];
                    }
                    if (s.attr('name') == name) {
                        return me.combobox[name];
                    }
                }
                return false;
            },

            disableRow: function (index) {
                var me = this,
                    $tBody = me.element.find('table.content').children('tbody'),
                    $rows = $tBody.find("tr");

                if (!$.isArray(index)) {
                    index = [index];
                }
                $.each(index, function (i, row) {
                    $rows.eq(row).addClass("ump-grid-row-disabled");
                    $rows.eq(row).find('.icon-checkbox').addClass('disabled');
                });
            },

            enableRow: function (index) {
                var me = this,
                    $tBody = me.element.find('tbody'),
                    $rows = $tBody.find("tr");

                if (!$.isArray(index)) {
                    index = [index];
                }
                $.each(index, function (i, row) {
                    $rows.eq(row).removeClass("ump-grid-row-disabled");
                    $rows.eq(row).children('.icon-checkbox').removeClass('disabled');
                });
            }
        });
    });
require("Widget,System,$,L,Data,Util,Application,Dialog",
    function (Widget, System, $, L, Data, Util, Application, Dialog) {
        var menu = [
            {name: 'add', display: '添加子组'},
            {name: 'edit', display: '修改组名'},
            {name: 'delete', display: '删除组'},
            {name: 'upward', display: '上移'},
            {name: 'down', display: '下移'}
        ];

        function getSelectId(el) {
            return $(el).attr('index');
        }

        Widget("group", {
            options: {
                dataSource: {},
                nodeClick: System.noop,
                ready: System.noop
            },
            _init: function () {
                var me = this, count = 0;

                function checkApplicationName() {
                    if (Application.getData('site-name') || count > 50) {
                        me.refresh()
                    } else {
                        setTimeout(checkApplicationName, 100);
                        count++;
                    }
                }

                checkApplicationName();
            },
            _initData: function (data) {
                var me = this;
                me.data = Util.buildTree(data, function (v) {
                    v.id = v.groupId;
                    me.dataCache[v.id] = v;
                    me.dataStatus[v.id] = me.dataStatus[v.id] || {};
                    me.deviceNum += v.deviceNumber;
                    v.name = Util.escapeHtml(v.level == 0 ? Application.getData('site-name') : v.groupName);
                });
            },
            _buildGroup: function () {
                this.element.append('<div class="item group-all">所有组</div><div class="line"></div>')
            },
            _buildTree: function () {
                var me = this, o = me.options, data = me.data;

                var html = '<ul>' + me._buildNode(data) + '</ul>';
                html += '<ul class="item-menu">';
                menu.forEach(function (v) {
                    html += '<li name="' + v.name + '"><span class="if icon-' + v.name + ' f-pr5"></span>' + v.display + '</li>';
                });
                html += '</ul>';

                me.element.append(html);
            },

            _buildNode: function (data) {
                var me = this, id = data.id,
                    html = '', status = me.dataStatus[id],
                    expend = status.expend = (status.expend == undefined) ? true : status.expend,
                    isLeaf = Util.isEmpty(data.children),
                    isSelected = me.selected == id;

                html += '<li><div class="item node {} {}" index="{}" style="padding-left:{}px;">'
                    .format(isSelected ? 'selected' : '',
                        (isLeaf || data.level == 0) ? 'retract' : '',
                        data.id, data.level * 16);
                if (data.level !== 0) {
                    html += '<div><span class="if ' + (isLeaf ? '' : 'expend icon-spread') + (isLeaf || expend ? '' : ' icon-retract') + '"></span></div>';
                } else {
                    html += '<div><span class="if"></span></div>';
                }
                html += '<div class="name"><span class="f-wwb">' + data.name + '</span></div>' +
                    '<span class="if icon-more role-action" style="display: none"></span>' +
                    '</div><ul style="' + (expend ? '' : 'display:none') + '">';

                !isLeaf && data.children.forEach(function (v) {
                    html += me._buildNode(v);
                });

                return html + '</ul></li>';
            },
            _buildEvent: function () {
                var me = this, o = me.options;

                Application.getSiteRole(function (role) {
                    if (role === 0) {
                        me.element.find('.item').hover(function () {
                            $(this).find('.icon-more').show();
                        }).mouseleave(function () {
                            $(this).find('.icon-more').hide();
                        });
                    }else {
                        me.element.find(".item").hover(function () {
                        }).mouseover(function () {});
                    }
                });


                me.element.find('.item').click(function () {
                    var data = me.dataCache[getSelectId(this)] || {id: ''};
                    me.selected = data && data.id;
                    me.currentItem && me.currentItem.removeClass('selected');
                    o.nodeClick.call(me, data);
                    me.currentItem = $(this).addClass('selected');
                });
                me.element.find('.expend').click(function (e) {
                    e.stopPropagation();
                    me._expendChildren($(this).parents('.node'));
                });
                me.element.find('.icon-more').click(function (e) {
                    e.stopPropagation();
                    me._showMenu($(this).parent());
                });
                me.element.find('.item-menu li').click(function () {
                    me._menuAction($(this).attr('name'));
                })
            },

            _expendChildren: function ($ele) {
                data = this.dataStatus[getSelectId($ele)];

                data.expend = !data.expend;
                $ele.find('.expend:first').toggleClass('icon-retract');
                $ele.next("ul")[data.expend ? 'show' : 'hide']();
            },

            _showMenu: function ($ele) {
                var me = this, x = $ele.offset();

                me.menuNode = $ele;

                var index = $ele.attr('index'),
                    data = me.dataCache[index];

                if (data.level == 0) {
                    me.element.find('.item-menu li').hide();
                    me.element.find('.item-menu li[name=add]').show();
                } else {
                    me.element.find('.item-menu li').show();
                }
                me.element.find('.item-menu').css({top: x.top + 28, left: x.left + 95}).show();


                $('body').on('click', function () {
                    me.element.find('.item-menu').hide();
                    $('body').off('click');
                });
            },

            _menuAction: function (name) {
                var me = this, index = me.menuNode.attr('index'),
                    data = me.dataCache[index];

                switch (name) {
                    case 'add': {
                        if (data.level >= 4) {
                            Util.toast('分组层级不能超过5级');
                            return;
                        }

                        var dialogId = Dialog.input('添加子分组', function (value) {
                            Data.send('addDeviceGroup', {
                                siteId: "",
                                groupName: value,
                                parentId: data.groupId,
                                order: data.children.length == 0 ? 0 : data.children[data.children.length - 1].order + 1,
                                level: data.level + 1
                            }, function () {
                                Dialog.close(dialogId);
                                me.refresh();
                            });
                        }, '', 'within_length,1,32');
                        break;
                    }
                    case 'edit': {
                        var dialogId = Dialog.input('设备组重命名', function (value) {
                            Data.send('editDeviceGroup', {
                                siteId: "",
                                groupName: value,
                                groupId: data.groupId
                            }, function () {
                                Dialog.close(dialogId);
                                data.groupName = value;
                                me.menuNode.find('.name').html(value);
                            });
                        }, data.groupName, 'within_length,1,32');
                        break;
                    }
                    case 'delete': {
                        Dialog.confirm("确认删除设备组？", function () {
                            Data.send('deleteDeviceGroup', {
                                siteId: "",
                                groupIds: [data.groupId]
                            }, function () {me.refresh()});
                            return true;
                        });
                        break;
                    }
                    case 'upward': {
                        var parent = me.dataCache[data.parentId], childIndex = parent.children.indexOf(data);
                        if (childIndex == 0) {
                            Util.toast("设备组已经是第一个");
                            return;
                        }

                        Data.send('switchDeviceGroupOrder', {
                            siteId: "",
                            firstGroup: data.groupId,
                            secondGroup: parent.children[childIndex - 1].groupId
                        }, function () {me.refresh() });

                        break;
                    }
                    case 'down': {
                        var parent = me.dataCache[data.parentId], childIndex = parent.children.indexOf(data);
                        if (childIndex == parent.children.length - 1) {
                            Util.toast("设备组已经是最后一个");
                            return;
                        }

                        Data.send('switchDeviceGroupOrder', {
                            siteId: "",
                            firstGroup: data.groupId,
                            secondGroup: parent.children[childIndex + 1].groupId
                        }, function () {me.refresh() });
                        break;
                    }
                }
            },

            refresh: function (param, dataSource) {
                var me = this, o = me.options;
                o.dataSource = dataSource || o.dataSource;

                me.element.empty();
                me.deviceNum = 0;
                me.dataCache = {};
                me.dataStatus = me.dataStatus || {};

                Data.send(o.dataSource, {
                    siteId: "",
                    grid: {
                        start: 0,
                        limit: 1000
                    }
                }, function (data) {
                    me._initData(data.data);
                    me._buildGroup();
                    me._buildTree();
                    me._buildEvent();

                    Application.getSiteRole(function (role) {
                        if (role === 1) {
                            me.element.find(".item").hover(function () {
                            }).mouseover(function () {});;
                        }
                    });

                    var item = me.element.find('.item.selected');
                    if (item.length > 0)
                        item.trigger('click');
                    else
                        me.element.find('.item.group-all').trigger('click');

                    o.ready.call(this);
                });
            }
        });
    });

require("Widget, System, Data, Application, Util, Html", function (Widget, System, Data, Application, Util, Html) {
    Widget("portal", {
        options: {
            cb: System.noop,
            commit: true,
            isNewTemplate: false,
            forDevice: false
        },
        _init: function () {
            var me = this,
                e = me.element,
                o = me.options;
            if (o.forDevice)
                Data.setUrl(function () {
                    return "/stok="+Util.getUrlParam("stok")+"/ds";
                });

            e.empty().html(Html('widget.portal'));

            e.find('.page-header').html('<div style="display: none">* 页面名称：' +
                '<input type="text" id="portal-page-name" maxlength="22"></div>');

            if (!o.isNewTemplate)
                me.initTemplateUI();
            if (!o.portalPageId) {
                me.isCreate = true;
                me.initPortalTemplate(e);
            } else {
                me.isCreate = false;
                me.initPortalTemplate(e, function () {
                    me.initPortalEdit(o.portalPageId);
                });
            }
        },
        initTemplateUI: function () {
            var me = this,
                e = me.element;
            e.find('.template-select-wrapper').show();

            var $ul = e.find('.portal-template-list');
            e.find(".left").click(function () {
                $ul.scrollLeft($ul.scrollLeft() - 167)
            });
            e.find(".right").click(function () {
                $ul.scrollLeft($ul.scrollLeft() + 167)
            });
            $ul.on('mousewheel', function (eve) {
                var delta = eve.originalEvent.wheelDelta > 0 ? 40 : -40;
                $ul.scrollLeft($ul.scrollLeft() + delta);
                return false;
            });

            e.find('#selected-template').hide();
            e.find('#select-template').hide();
            e.find('#collapse-template').click(function () {
                me.toggleTemplateList();
            });
            e.find('#select-template').click(function () {
                me.toggleTemplateList();
            });
        },
        toggleTemplateList: function () {
            var me = this,
                e = me.element;

            e.find('.portal-template-list-wrapper').toggle(200);
            e.find('#selected-template').toggle();
            e.find('#select-template').toggle();
            e.find('#collapse-template').toggle();
        },
        templates: [],
        selectedTemplate: -1,
        isCreate: true,
        templateConfig: false,
        initPortalTemplate: function (el, cb) {
            var me = this,
                e = me.element,
                o = me.options;
            var param, method;
            if (o.forDevice) {
                param = {
                    method: "get",
                    authentication: {
                        table: "portal_local_template_list",
                        para: {
                            start: "0",
                            end: "10"
                        }
                    }
                };
                method = 'slp'
            } else {
                param = {
                    siteId: "",
                    grid: {
                        start: 0,
                        limit: 10,
                        sort: "portalPageId",
                        filter: {
                            siteId: "",
                            portalPageDesc: o.authType
                        }
                    }
                };
                method = 'getPortalTemplateList';
            }
            Data.send(method, param, function (result) {
                var templates = me.templates = result.portal_template_list || result.portal_local_template_list||[], $ul = el.find('.portal-template-list'),
                html = '';

                el.find('.portal-template-list-wrapper').show();
                if (templates.length == 0) {
                    $ul.html('<span class="list-empty">无模板</span>');
                    return;
                }
                
                templates.forEach(function (template, i) {
                    var tempId = "";
                    for(var key in template) {
                        if(template[key] && template[key].portalTemplateId) tempId = template[key].portalTemplateId;

                    }
                    var thumbnail = '';
                    if (me.options.forDevice)
                        thumbnail = "/web-static/resources/cloud/"+tempId + "/thumbnail.png?random=20201217044300";
                    else
                        thumbnail = "/api/v1/templateImg?portalTemplateId=" + template.portalTemplateId + "&imgId=thumbnail.png?random=20201217044300";
                    html += '<li index="{}" class="f-csp"><img src="{}"/><div><span class="portal-template-name">{}</span></div></li>'
                        .format(i, thumbnail, template.portalTemplateName);
                });

                $ul.html(html).find('li').click(function () {
                    var $el = $(this);

                    $el.siblings().removeClass("selected");
                    $el.addClass('selected');

                    var ti = $el.attr('index');
                    me.selectedTemplate = ti;
                    e.find('#selected-template').html(me.templates[ti].portalTemplateName);
                    me.options.isNewTemplate = true;
                    me.initPortalEdit(templates[ti], true);

                    me.toggleTemplateList();
                });
                if (cb)
                    cb.apply(this);
            });
        },
        initPortalEdit: function (portalId) {
            var me = this;
            var el = this.element,
                o = me.options;

            var portalConfig = {};

            if (me.isCreate) {
                var tempId = ""
                for(var key in portalId) {
                    if(portalId[key] && portalId[key].portalTemplateId) tempId = portalId[key].portalTemplateId;

                }
                portalConfig.config = "{}";
                getTemplate(tempId, me.createEditPage);
            } else if (System.isString(portalId)) {
                var param, method;
                if (o.forDevice) {
                    param = {
                        method: "get",
                        authentication: {
                            table: "portal_page_list",
                            para: {
                                start: "0",
                                end: "10"
                            },
                            filter: [{
                                portalPageId: portalId
                            }]
                            }
                    };
                    method = 'slp'
                } else {
                    param = {
                        siteId: "",
                        portalPageId: portalId
                    };
                    method = 'getPortalPage';
                }
                Data.send(method, param, function (data) {
                    var tempId = ""
                    for(var key in data.portal_page_list[0]) {
                        if(data.portal_page_list[0][key] && data.portal_page_list[0][key].templateId){
                            tempId = data.portal_page_list[0][key].templateId;
                            portalConfig = data.portal_page_list[0][key];
                        } 
                    }
                    el.find('#portal-page-name').val(data.portalPageName);
                    me.templates.forEach(function (t, i) {
                        for(var key in t) {
                            if (t[key] && t[key].portalTemplateId == tempId) {
                                $('.portal-template-list>li:eq(' + i + ')').addClass('selected');
                            }
                        }
                        // if (t.portalTemplateId == tempId) {
                        //     $('.portal-template-list>li:eq(' + i + ')').addClass('selected');
                        // }
                    });

                    getTemplate(tempId, me.createEditPage);
                })
            } else {
                var tempId = ""
                for(var key in portalId) {
                    if(portalId[key] && portalId[key].portalTemplateId) tempId = portalId[key].portalTemplateId;

                }
                portalConfig.config = "{}";

                getTemplate(tempId, me.createEditPage)
            }

            function decode(str) {
                var res;
                try {
                    res = decodeURIComponent(str);
                } catch (e) {
                    res = str;
                }
                return res;
            };


            function urlDecodeJSON(data) {
                return JSON.parse(JSON.stringify(data), function(k, v) {
                    return typeof v === 'string'
                    ? decode(v)
                    : v;
                });
            };

            function getTemplate(templateId, callback) {
                var param, method;
                if (o.forDevice) {
                    param = {
                        method:"get",
                        authentication: {
                                table: "portal_template_config",
                                para: {
                                    start : "0",
                                    end : "10"
                                },
                                filter: [{
                                    portalTemplateId:templateId}
                                    ]}

                    };
                    method = 'slp'
                } else {
                    param = {
                        siteId: "",
                        portalTemplateId: templateId
                    };
                    method = 'getPortalTemplateConfig';
                }

                Data.send(method, param, function (data) {
                     data = urlDecodeJSON(data);
                     me.templateConfig = data;
                    callback.apply(me, [portalConfig]);
                })
            }
        },
        createEditPage: function createEditPage(portalConfig) {
            var me = this;
            var el = this.element;
            var o = me.options;

            el.find('#portal-page-edit-wrapper').empty().html(Html('widget.portal.edit'));
            if (o.commit)
                el.find('#portal-page-save').show();

            //me.isCreate = !portalConfig.portalPageId;

            var baseUrl;
            var authType = o.authType ? '&auth_type=' + o.authType : '';
            if (me.isCreate || o.isNewTemplate) {

                if (o.forDevice){
                    var tempId = ""
                    for(var key in me.templateConfig.portal_template_config[0]) {

                        if(me.templateConfig.portal_template_config[0] && me.templateConfig.portal_template_config[0][key].templateId) tempId = me.templateConfig.portal_template_config[0][key].templateId;
                    }
                    baseUrl = '/web-static/resources/cloud/' + tempId+'/portalPagePreviewNew/';
                }
                else{
                    baseUrl = "/api/v1/portalPagePreviewNew?" +
                        "portalTemplateId=" + me.templateConfig.templateId + '&siteId=' + "" + authType;
                }
            } else {
                if (o.forDevice){
                    var portalPageId = ""
                    portalPageId = o.portalPageId
                    baseUrl = '/web-static/resources/cloud/' + portalPageId + '/portalPagePreview/';
                }  
                else{
                    baseUrl = "/api/v1/portalPagePreview?" +
                        "portalPageId=" + portalConfig.portalPageId + '&siteId=' + "" + authType;
                }
            }

            if (o.forDevice) {
                var authPageName = "auth";
                $("#page-auth").html('<iframe name="auth-iframe" scrolling="no" src="' + baseUrl + authPageName +".html" + '"></iframe>');
                $("#page-success").html('<iframe name="success-iframe" scrolling="no" src="' + baseUrl + "success.html" + '"></iframe>');
            } else {
                $("#page-auth").html('<iframe name="auth-iframe" scrolling="no" src="' + baseUrl + "&type=auth" + '"></iframe>');
                $("#page-success").html('<iframe name="success-iframe" scrolling="no" src="' + baseUrl + "&type=success" + '"></iframe>');
            }

            initPortalConfigPage();

            function initPortalConfigPage() {

                function generateHtml(configItem) {
                    var html = '<tr ' + (configItem.configurable === false ? 'style="display:none"' : '') + '><td>',
                        type = configItem.type,
                        constraint = configItem.constraint || {};

                    html += configItem.desc + '</td>' + '<td>';
                    if (type == 'select-multiple') {
                    } else if (type == 'text') {
                        var args = constraint.validType.split(','), type = args.shift();
                        var maxLength = args[1];

                        html += '<input name="' + configItem.name + '" type="text"' +
                            ' maxlength=' + maxLength +
                            (constraint.required ? ' required="true"' : '') +
                            //(constraint.validType ? (' validType="' + constraint.validType + '"') : '') +
                            '>'
                        if (configItem.tip)
                            html += '<span class="if icon-help f-pl if-s18 if-cgray" tip="' + configItem.tip +'"></span>';

                    } else if (type == 'url') {
                        html += '<input name="' + configItem.name + '" type="text"' +
                            (constraint.required ? ' required="true"' : '') +
                            (' validType="url"') + '>'
                    } else if (type == 'image') {
                        var id = 'portal-image-' + configItem.name;
                        html += '<input style="display: none" name="' + configItem.name + '" type="text"/>';
                        html += '<form method="post" enctype="multipart/form-data" target="' + id + '">';
                        html += '<input type="file" accept="image/*" name="img_' + configItem.name + '"/>';
                        html += '<input style="display: none" type="text" name="operation" value="upload"/>';
                        html += '<button>上传图片</button></form>';
                        html += '<iframe name="' + id + '" style="display: none;"></iframe>'
                    }
                    return html + '</td></tr>';
                }

                var html = '<table>';
                for(var key in me.templateConfig.portal_template_config[0]) {

                    if(me.templateConfig.portal_template_config[0] && me.templateConfig.portal_template_config[0][key].auth) tmp_key = key;
                }

                me.templateConfig.portal_template_config[0][tmp_key].auth.config.forEach(function (v) {
                    html += generateHtml(v);
                });
                el.find("#config-auth").html(html + '</table>');

                html = '<table>';
                me.templateConfig.portal_template_config[0][tmp_key].success.config.forEach(function (v) {
                    html += generateHtml(v);
                });
                el.find("#config-success").html(html + '</table>');

                function decode(str) {
                    var res;
                    try {
                        res = decodeURIComponent(str);
                    } catch (e) {
                        res = str;
                    }
                    return res;
                };

                function urlDecodeJSON(data) {
                    return JSON.parse(JSON.stringify(data), function(k, v) {
                        return typeof v === 'string'
                        ? decode(v)
                        : v;
                    });
                };

                var items = {}, value = {};
                portalConfig.config = urlDecodeJSON(portalConfig.config);
                var config = portalConfig && portalConfig.config ? JSON.parse(portalConfig.config.replace(/&quot;/g, '"')) : {};
                me.templateConfig.portal_template_config[0][tmp_key].auth.config.forEach(function (v) {
                    var name = v.name, item = items[name] = {}, type = v.type;
                    items[name].type = type;
                    //config[name] && (value[name] = config[name]);
                    value[name] = config[name] ? config[name] : v['default'];

                    if (type == 'text') {
                        items[name].actions = {
                            onChange: function (v) {
                                if (!this.valid)
                                    return;

                                var name = this.name;

                                var iframe = window.frames["auth-iframe"];
                                $(iframe.document).find("#" + name).html(Util.escapeHtml(v).replace(/&nbsp;/g, " "));
                            }
                        }
                    }

                    if (type == 'image') {
                        items[name].maxSize = v.constraint['max-size'];
                    }
                });

                me.templateConfig.portal_template_config[0][tmp_key].success.config.forEach(function (v) {
                    var name = v.name, item = items[name] = {}, type = v.type;
                    items[name].type = type;
                    //config[name] && (value[name] = config[name]);
                    value[name] = config[name] ? config[name] : v['default'];

                    if (type == 'text') {
                        items[name].actions = {
                            onChange: function (v) {
                                if (!this.valid)
                                    return;

                                var name = this.name;

                                var iframe = window.frames["success-iframe"];
                                $(iframe.document).find("#" + name).html(Util.escapeHtml(v).replace(/&nbsp;/g, " "));
                            }
                        }
                    }

                    if (type == 'image') {
                        items[name].maxSize = v.constraint['max-size'];
                    }
                });

                el.find('#portal-page-config').form({
                    value: value,
                    items: $.extend(items, {
                        confirm: {
                            actions: {
                                onClick: function () {
                                    /*var items = this.parent;
                                     Util.log(items);
                                     if (!$('#portal-page-config').form('valid', items))
                                     return;

                                     var config = {};
                                     $.each(items, function (key) {
                                     config[key] = items[key].val();
                                     });*/
                                    me.commit();
                                }
                            }
                        }
                    }),
                    ready: function (items) {
                        this.element.find('input[type=file]').on('change', function () {
                            Util.log($(this).val());

                            var form = $(this).closest('form');

                            if (form.find('input').val() === '')
                                return;

                            if (o.forDevice)
                                form.attr('action', '/stok='+Util.getUrlParam("stok")+"/admin/authentication/upload_tmp_img");
                            else
                                form.attr('action', '/api/v1/uploadTmpImg?siteId=' + "");

                            form.siblings('iframe').empty().one('load', function () {
                                var data = Data.getUploadResult(this);
                                if (!data)
                                    return;

                                //$('#portal-page-config').form('val', $input.attr('name'), data);
                                //Util.log(form.siblings('input').attr('name'), items);
                                var $input = form.siblings('input');

                                var maxSize = items[$input.attr('name')].maxSize;
                                if (data.fileSize > maxSize) {
                                    Util.alert('当前图片最大支持' + maxSize / 1024 + 'k');
                                    return;
                                }

                                $input.val(data.fileId);

                                var imgUrl = '';
                                if (o.forDevice)
                                    imgUrl = '/web-static/resources/cloud/'+data.fileId;
                                else
                                    imgUrl = "/api/v1/tempImg?siteId=" + "" + "&imgId=" + data.fileId;
                                //TODO
                                var iframe1 = window.frames["auth-iframe"];
                                var iframe2 = window.frames["success-iframe"];
                                var img = $(iframe1.document).find("." + $input.attr('name'));
                                img = img.length > 0 ? img : $(iframe2.document).find("." + $input.attr('name'));
                                if (img[0].tagName == "IMG")
                                    img.attr('src', imgUrl);
                                else
                                    img.css('background-image', 'url("' + imgUrl + '")');
                            });
                            form.submit();
                        })
                    }
                });
            }
        },

        check: function () {
            var portalForm = this.element.find('#portal-page-config');
            var items = portalForm.form('getItems');
            return (portalForm.form('valid', items) && this.templateConfig);
        },

        commit: function (callback) {
            var me = this,
                o = me.options,
                e = me.element;
            var portalForm = e.find('#portal-page-config');
            var items = portalForm.form('getItems');

            if (!portalForm.form('valid', items) || !me.templateConfig)
                return false;

            var config = {};
            $.each(items, function (key) {
                config[key] = items[key].val();
            });

            if (me.isCreate) {
                var param, method;
                if (o.forDevice) {
                    var tempId = ""
                    for(var key in me.templateConfig.portal_template_config[0]) {

                        if(me.templateConfig.portal_template_config[0] && me.templateConfig.portal_template_config[0][key].templateId) tempId = me.templateConfig.portal_template_config[0][key].templateId;
                    }
                    param = {
                        method: "add",
                        authentication: {
                                table: "portal_page_list",
                                para: {
                                    portal_page_name: e.find("#portal-page-name").val(),
                                    template_id: tempId,
                                    portal_page_desc: config.auth_type ? config.auth_type : me.templateConfig.authType,
                                    site_id: "",
                                    config: config
                                }
                        }
                    }
                    method = 'slp'
                } else {
                    param = {
                        "portalPageName": e.find("#portal-page-name").val(),
                        "portalPageDesc": config.auth_type ? config.auth_type : me.templateConfig.authType,
                        "templateId": me.templateConfig.templateId,
                        "siteId": "",
                        "config": config
                    };
                    method = 'addPortalPage';
                }
                Data.send(method, param, function (result) {
                        o.cb(result);
                        System.isFunction(callback) && callback.call(me, result)
                    });
            } else {
                var param, method;
                var tempId = ""
                for(var key in me.templateConfig.portal_template_config[0]) {

                    if(me.templateConfig.portal_template_config[0] && me.templateConfig.portal_template_config[0][key].templateId) tempId = me.templateConfig.portal_template_config[0][key].templateId;
                }
                if (o.forDevice) {
                    param = {
                        method: "set",
                        authentication: {
                                table: "portal_page_list",
                                filter: [{
                                    portal_page_id: System.isString(o.portalPageId) ? o.portalPageId : o.portalPageId.portalPageId
                                }],
                                para:
                                    {
                                        portal_page_name: e.find("#portal-page-name").val(),
                                        template_id: tempId,
                                        portal_page_desc: config.auth_type ? config.auth_type : me.templateConfig.authType,
                                        site_id: "",
                                        config: config
                                    }
                            }
                    };
                    method = 'slp'
                } else {
                    param = {
                        "portalPageId": System.isString(o.portalPageId) ? o.portalPageId : o.portalPageId.portalPageId,
                        "portalPageName": e.find("#portal-page-name").val(),
                        "portalPageDesc": config.auth_type ? config.auth_type : me.templateConfig.authType,
                        "templateId": me.templateConfig.templateId,
                        "siteId": "",
                        "config": config
                    };
                    method = 'editPortalPage';
                }
                Data.send(method, param, function (result) {
                        o.cb(result);
                        System.isFunction(callback) && callback.call(me, result)
                    })
            }

        },

        getConfig: function () {
            var me = this,
                e = me.element;
            var portalForm = e.find('#portal-page-config');
            var items = portalForm.form('getItems');
            Util.log(items);
            if (!portalForm.form('valid', items) || !me.templateConfig)
                return false;

            var config = {};
            $.each(items, function (key) {
                config[key] = items[key].val();
            });

            return {
                "templateId": me.templateConfig.templateId,
                "config": config
            }
        }
    });
});
require("Widget, System, Data, Application, Util, Html, Dialog, Tip", function (Widget, System, Data, Application, Util, Html, Dialog, Tip) {
    Widget("portalPageList", {
        options: {
            useDefaultActions: false
        },
        defaultActions: [{
            icon: 'copy',
            tip : "复制",
            cb: function (ele, page) {
                var me = this;
                Dialog('复制Portal页面', '<div style="width: 160px"><span>复制页面？</span></div>',
                    function () {
                    }, true, function () {
                        Data.send('duplicatePortalPage', {
                            siteId: page.siteId,
                            portalPageId: page.portalPageId
                        }, function () {
                            me.initPageList();
                        });
                        return true;
                    });
            }
        }, {
            icon: 'delete',
            tip : "删除",
            cb: function (ele, page) {
                var me = this,
                    $el = $(ele),
                    o = me.options;
                Dialog('删除Portal页面', '<div style="width: 160px"><span>确认删除？</span></div>',
                    function () {
                    }, true, function () {
                        var param, method;
                        if (o && o.forDevice) {
                            param = {
                                method:"delete",
                                authentication: {
                                    table: "portal_page_list",
                                    filter: [{
                                        "portal_page_id": page.portalPageId
                                    }]
                                }
                            };
                            method = 'slp'
                        } else {
                            param = {
                                siteId: page.siteId,
                                portalPageIds: [page.portalPageId]
                            };
                            method = 'deletePortalPages';
                        }
                        Data.send(method, param, function () {
                            $el.closest('.page-item').remove();
                        });
                        return true;
                    });
            }
        }],

        _create: function () {
            var me = this,
                e = me.element,
                o = me.options;
        },
        _init: function () {
            var me = this,
                e = me.element,
                o = me.options;

            if (o.useDefaultActions) {
                o.actions = o.actions ? o.actions : [];
                o.actions = o.actions.concat(me.defaultActions);
            }

            me.initPageList(e);
        },
        portalPageMap: {},
        initPageList: function () {
            var me = this,
                el = me.element,
                o = me.options;
            Data.send('getPortalPageList', {
                siteId: "",
                grid: {
                    start: 0,
                    limit: 10,
                    sort: "portalPageId",
                    filter: {
                        siteId: "",
                        portalPageDesc: o.authType
                    }
                }
            }, function (result) {
                var pageList = result.data || [],
                    $ul = el.find('ul').empty(), html = '';

                if (pageList.length == 0) {
                    $ul.html('<span class="list-empty">无Portal页面</span>');
                    return;
                }

                pageList.forEach(function (page) {
                    page.config = page.config.replace(/&quot;/g, '"');
                    me.portalPageMap[page.portalPageId] = page;
                });

                var htmlactions = '';
                o.actions.forEach(function (v, i) {
                    if (v.icon)
                        htmlactions += '<span class="if icon-{} role-action" index="{}" tip="{}"></span>'.format(v.icon, i, v.tip)
                    else
                        htmlactions += '<span class="role-action" index="{}">{}</span>'.format(i, v.text)
                });

                pageList.forEach(function (page) {
                    var userConfig = JSON.parse(page.config);
                    var thumbnail = "/api/v1/portalPagePreviewImg?siteId=" + "" + "&portalPageId=" + page.portalPageId + '&r=' + Util.randInt();


                    var portalInfo = '<div class="page-portal-info" title="">';
                    if (page.portals.length > 0) {
                        portalInfo += '<div>使用此页面的配置：</div>';
                        page.portals.forEach(function (p, i) {
                            portalInfo += '<a>' + Util.escapeHtml(p) + '</a>、';
                        });
                        portalInfo = portalInfo.substring(0, portalInfo.length - 1);
                    }
                    portalInfo += '</div>';

                    html += '<li class="page-item" index="' + page.portalPageId + '">' +
                        '<div class="image" style=\'background: url("' + thumbnail + '") no-repeat;\'></div>' +
                        '<div class="actions">' + htmlactions + '</div>' +
                        '<div class="portal-page-name" style="display: none"><span>' + Util.escapeHtml(page.portalPageName) + '</span></div>' +
                        portalInfo +
                        '</li>';
                });

                $ul.html(html)
                Application.getSiteRole(function (role) {
                    if (role === 0) {
                        $ul.find('.role-action').click(function () {
                            $(this).parent().parent().parent().find('li').removeClass('selected');
                            $(this).parent().parent().addClass('selected');

                            var actionIndex = $(this).attr('index');
                            var pageId = $(this).closest('.page-item').attr('index');
                            o.actions[actionIndex].cb.apply(me, [this, me.portalPageMap[pageId]]);
                        }).on({
                            'mouseover': function (e) {
                                Tip.show($(this).attr("tip"), e.clientX, e.clientY);
                                $(document).bind('mousemove', Tip.hide);
                            }, 'mousemove': function (e) {
                                e.stopPropagation();
                            }, 'mouseleave': Tip.hide
                        });
                    } else if (role === 1) {
                        $ul.find('.role-action').addClass('disabled');
                        $ul.find('.role-action').attr('disabled', true).unbind('click');
                    }
                });

                Application.getSiteRole(function (role) {
                    if (role !== 0)
                        $ul.find(".detail").hide();
                });

                if (el.height() > 500)
                    el.closest('.cwm-dialog').css('top', '6%');
            });
        }
    });
});
/**
 * Created by admin on 2017/1/10.
 */
require("Widget, System, $, Data, Dialog", function(Widget, System, $, Data, Dialog){
    Widget("progressBar", {
        options: {
            percent: 100,
            showPercent: true,
            rgb: [9, 152, 222],
            width: 360,
            message: false,
            downMsg: false,
            colorRenderer: function(){
                if(this.staticColorRenderer == undefined) {
                    this.staticColorRenderer = function () {
                        return '#099EDE';
                    }
                }
                return this.staticColorRenderer.call(this, null, arguments[0]);
            },
            url: false
        },

        _create: function(){
            var me = this,
                e = me.element,
                o = me.options;

            if(typeof o.percent === 'string'){
                if(o.percent[o.percent.length - 1] === '%'){
                    o.percent = o.percent.slice(0, -1);
                }
                o.percent = parseFloat(o.percent);
            }
            if(isNaN(o.percent) || o.percent < 0){
                o.percent = 100;
            }
            while(o.percent > 100){
                o.percent /= 10;
            }

            $('body').append('<div class="progressBar-mask"></div>');

            var html = '<div class="cwm-progressBar-wrapper"><div class="cwm-progressBar-msg inline"></div><span class="cwm-progressBar-percent">' + o.percent + '%' + '</span><div class="cwm-progressBar inline"><div class="cwm-progressBar-cb inline"></div></div><div class="cwm-progressBar-downMsg"></div></div>';

            e.html(html);
            // e.find('.cwm-progressBar:first').width(o.width);

            me.$wrapper = e.find('.cwm-progressBar-wrapper');
            me.$bar = me.$wrapper.find('.cwm-progressBar');
            me.$colorBar = e.find('.cwm-progressBar-cb');
            me.$percentText = e.find('.cwm-progressBar-percent');
            me.$message = e.find('.cwm-progressBar-msg');
            me.$downMsg = e.find('.cwm-progressBar-downMsg');
            if(o.message){
                me.$message.html(o.message);
            }
            if(o.downMsg){
                me.$downMsg.html(o.downMsg);
            }
        },

        _init: function(){
            var me = this,
                o = me.options;

            me.$colorBar.css({
                width: o.width * o.percent / 100,
                height: o.height,
                backgroundColor: o.colorRenderer.call(this, o.percent, o.rgb)
            });
            me.$bar.css('height', o.height);

            if(!o.showPercent){
                me.$percentText.hide();
            }
            if(o.url){
                me.interval = setInterval(function () {
                    me._query.call(me);
                }, 1000);
            }

        },

        _query: function(){
            var me = this,
                o = me.options;

            Data.send(o.url, function(data){
                me.refresh();
            })

        },

        refreshDownMsg: function(downMsg){
            if(!downMsg){
                this.$downMsg.hide();
            }else{
                this.$downMsg.show().html(downMsg);
            }
        },

        refresh: function(percent, message, colorRenderer){
            var me = this,
                o = me.options;

            if(typeof percent === 'string'){
                if(percent[percent.length - 1] === '%'){
                    percent = percent.splice(0, -1);
                }
                percent = parseFloat(percent);
            }
            o.percent = (percent || percent === 0) ? percent : o.percent;

            while(o.percent > 100){
                o.percent /= 10;
            }

            var cbWidth = o.width * o.percent / 100;
            var cr = colorRenderer || o.colorRenderer;

            if(typeof message === 'undefined'){

            }else if(message === false || message === ''){
                me.$message.hide();
            }else{
                me.$message.show().html(message);
            }
            me.$colorBar.animate({width: cbWidth}, 'fast', function(){
                me.$colorBar.css({backgroundColor: cr(o.percent, o.rgb)});
                me.$percentText.html(o.percent + '%');
            });
            return this;

        },

        _destroy: function(){
            var me = this;
            clearInterval(me.interval);
            $('.progressBar-mask').remove();
        },

        alphaColorRenderer: function(params, percent){
            params = params || [0.5, 1, [9, 158, 222]];
            var alpha_from = params[0],
                alpha_to = params[1],
                color = params[2];

            var alpha = alpha_from + (percent / 100)*(alpha_to - alpha_from);
            var result = {
                r: parseInt((1 - alpha)*255 + alpha * color[0]),
                g: parseInt((1 - alpha)*255 + alpha * color[1]),
                b: parseInt((1 - alpha)*255 + alpha * color[2])
            };

            return 'rgb(' +
                result.r + ',' +
                result.g + ',' +
                result.b + ')';
        },

        linearColorRenderer: function(percent, fromColor){
            //linear gradient
            var toColor = [255,255,255],
                rgb = fromColor || [9, 152, 222];

            var result = {
                r: parseInt( toColor[0] - ((toColor[0] - rgb[0]) * percent / 100), 10),
                g: parseInt( toColor[1] - ((toColor[1] - rgb[1]) * percent / 100), 10),
                b: parseInt( toColor[2] - ((toColor[2] - rgb[2]) * percent / 100), 10)
            };

            return 'rgb(' +
                result.r + ',' +
                result.g + ',' +
                result.b + ')';
        },

        staticColorRenderer: function(){
            return '#099EDE';
        }
    });
});
require("Widget, System", function (Widget, System) {
    Widget('tab', {
        options: {
            title: false,
            clickable: true,
            backFunc: false,
            tabOpts: [],
            currentOpt: 0,
            onChange: System.noop,
            ready: System.noop

        },
        _create: function () {
            var me = this,
                o = me.options,
                e = me.element;
            e.removeClass('cwm-tab');

            var html = '<div class="cwm-tab-header">';
            if(o.backFunc) {
                html += '<div class="cwm-tab-back"><span>&lt;返回&nbsp;</span></div>';
            }
            if(o.title) {
                html += '<div class="cwm-tab-title">' +
                    '<span>' + o.title + '</span>' + '</div>';
            }

            html += '<ul class="cwm-tab">';
            for (var i = 0; i < o.tabOpts.length; i++) {
                html += '<li><span tabindex="' + i + (i === o.currentOpt ? '" class="selected"' : '"') + ' > ' + o.tabOpts[i] + ' </span></li>';
            }
            html += '</ul></div>';
            e.append(html);

        },
        _init: function () {
            var me = this;

            if (me.options.clickable) {
                me.element.find('span').click(function (e) {
                    var $target = $(e.target);
                    if (!$target.hasClass('selected')) {
                        $target.addClass('selected');
                        $target.parent().siblings().children('span.selected').removeClass('selected');

                        me.options.onChange.call(me, $target.attr('tabindex'));
                    }
                });
            } else {
                me.element.find('span').css('cursor', 'default');
                me.element.find('ul').css('cursor', 'default');
            }
            if($.isFunction(me.options.ready)) {
                me.options.ready.call(me);
            }
            if($.isFunction(me.options.backFunc)) {
                $('.cwm-tab-back').click(function () {
                    me.options.backFunc.call(me);
                })
            }
        },
        setSelected: function (index) {
            var me = this;
            me.element.find('span').each(function (i, o) {
                if(i === index) {
                    $(o).addClass('selected');
                } else {
                    $(o).removeClass('selected');
                }
            });
            me.options.onChange(index);
        }

    });
});
define('Tip', 'System, Util, $', function (System, Util, $) {
    var isInit = false;

    function init() {
        if (isInit)return;
        $('body').append('<div id="tip"></div>')
        isInit = true;
    }

    return {
        init: function (id) {
            var me = this;

            function initEl($el) {
                $el.on({
                    'mouseover': function (e) {
                        show.call(this, e);
                        $(document).bind('mousemove', hide);
                    }, 'mousemove': function (e) {
                        e.stopPropagation();
                    }, 'mouseleave': hide
                });
            }

            function show(e) {
                me.show($(this).attr('tip'), e.clientX, e.clientY);
            }

            function hide() {
                me.hide();
                $(document).unbind('mousemove')
            };

            if (Util.isUndefined(id)) {
                initEl($('span[tip]'))
            } else {
                var $el = (System.isString(id)) ? $("#" + id) : id;
                if ($el.hasAttr('tip')) {
                    initEl($el);
                }
                initEl($el.find('span[tip]'));
            }
        },
        show: function (tip, x, y) {
            init()
            $('#tip').html(tip).css({
                top: y + 16,
                left: x + 13
            }).show();
        },
        hide: function () {
            $("#tip").hide();
        }
    }
});
