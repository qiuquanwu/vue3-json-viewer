import { h, resolveComponent, openBlock, createBlock, createVNode, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from 'vue';
import Clipboard from 'clipboard';
import "./index.css"
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var REG_LINK = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
var script = {
    name: 'JsonString',
    props: {
        jsonValue: {
            type: String,
            required: true
        }
    },
    data: function data() {
        return {
            expand: true,
            canExtend: false
        };
    },
    mounted: function mounted() {
        if (this.$refs.itemRef.offsetHeight > this.$refs.holderRef.offsetHeight) {
            this.canExtend = true;
        }
    },
    methods: {
        toggle: function toggle() {
            this.expand = !this.expand;
        }
    },
    render: function render() {
        var value = this.jsonValue;
        var islink = REG_LINK.test(value);
        var domItem;
        if (!this.expand) {
            domItem = {
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                innerText: '...'
            };
        } else {
            domItem = {
                'class': {
                    'jv-item': true,
                    'jv-string': true
                },
                ref: 'itemRef'
            };
            if (islink) {
                value = '<a href="'.concat(value, '" target="_blank" class="jv-link">').concat(value, '</a>');
                domItem.innerHTML = '"'.concat(value.toString(), '"');
            } else {
                domItem.innerText = '"'.concat(value.toString(), '"');
            }
        }
        return h('span', {}, [
            this.canExtend && h('span', {
                'class': {
                    'jv-toggle': true,
                    open: this.expand
                },
                onClick: this.toggle
            }),
            h('span', {
                'class': { 'jv-holder-node': true },
                ref: 'holderRef'
            }),
            h('span', domItem)
        ]);
    }
};

script.__file = "src/Components/types/json-string.vue";

var script$1 = {
    name: 'JsonUndefined',
    functional: true,
    props: {
        jsonValue: {
            type: Object,
            'default': null
        }
    },
    render: function render() {
        return h('span', {
            'class': {
                'jv-item': true,
                'jv-undefined': true
            },
            innerText: this.jsonValue === null ? 'null' : 'undefined'
        });
    }
};

script$1.__file = "src/Components/types/json-undefined.vue";

var script$2 = {
    name: 'JsonNumber',
    functional: true,
    props: {
        jsonValue: {
            type: Number,
            required: true
        }
    },
    render: function render() {
        var isInteger = Number.isInteger(this.jsonValue);
        return h('span', {
            'class': {
                'jv-item': true,
                'jv-number': true,
                'jv-number-integer': isInteger,
                'jv-number-float': !isInteger
            },
            innerText: this.jsonValue.toString()
        });
    }
};

script$2.__file = "src/Components/types/json-number.vue";

var script$3 = {
    name: 'JsonBoolean',
    functional: true,
    props: { jsonValue: Boolean },
    render: function render() {
        return h('span', {
            'class': {
                'jv-item': true,
                'jv-boolean': true
            },
            innerText: this.jsonValue.toString()
        });
    }
};

script$3.__file = "src/Components/types/json-boolean.vue";

var script$4 = {
    name: 'JsonObject',
    props: {
        jsonValue: {
            type: Object,
            required: true
        },
        keyName: {
            type: String,
            'default': ''
        },
        depth: {
            type: Number,
            'default': 0
        },
        expand: Boolean,
        sort: Boolean,
        previewMode: Boolean
    },
    data: function data() {
        return { value: {} };
    },
    computed: {
        ordered: function ordered() {
            var _this = this;
            if (!this.sort) {
                return this.value;
            }
            var ordered = {};
            Object.keys(this.value).sort().forEach(function (key) {
                ordered[key] = _this.value[key];
            });
            return ordered;
        }
    },
    watch: {
        jsonValue: function jsonValue(newVal) {
            this.setValue(newVal);
        }
    },
    mounted: function mounted() {
        this.setValue(this.jsonValue);
    },
    methods: {
        setValue: function setValue(val) {
            var _this2 = this;
            setTimeout(function () {
                _this2.value = val;
            }, 0);
        },
        toggle: function toggle() {
            console.log(123);
            this.$emit('update:expand', !this.expand);
            this.dispatchEvent();
        },
        dispatchEvent: function dispatchEvent() {
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var elements = [];
        if (!this.previewMode && !this.keyName) {
            elements.push(h('span', {
                'class': {
                    'jv-toggle': true,
                    'open': !!this.expand
                },
                onClick: this.toggle
            }));
        }
        elements.push(h('span', {
            'class': {
                'jv-item': true,
                'jv-object': true
            },
            innerText: '{'
        }));
        if (this.expand) {
            for (var key in this.ordered) {
                if (this.ordered.hasOwnProperty(key)) {
                    var value = this.ordered[key];
                    elements.push(h(script$8, {
                        key: key,
                        style: { display: !this.expand ? 'none' : undefined },
                        sort: this.sort,
                        keyName: key,
                        depth: this.depth + 1,
                        value: value,
                        previewMode: this.previewMode
                    }));
                }
            }
        }
        if (!this.expand && Object.keys(this.value).length) {
            elements.push(h('span', {
                style: { display: this.expand ? 'none' : undefined },
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                title: 'click to reveal object content (keys: '.concat(Object.keys(this.ordered).join(', '), ')'),
                innerText: '...'
            }));
        }
        elements.push(h('span', {
            'class': {
                'jv-item': true,
                'jv-object': true
            },
            innerText: '}'
        }));
        return h('span', elements);
    }
};

script$4.__file = "src/Components/types/json-object.vue";

var script$5 = {
    name: 'JsonArray',
    props: {
        jsonValue: {
            type: Array,
            required: true
        },
        keyName: {
            type: String,
            'default': ''
        },
        depth: {
            type: Number,
            'default': 0
        },
        sort: Boolean,
        expand: Boolean,
        previewMode: Boolean
    },
    data: function data() {
        return { value: [] };
    },
    watch: {
        jsonValue: function jsonValue(newVal) {
            this.setValue(newVal);
        }
    },
    mounted: function mounted() {
        this.setValue(this.jsonValue);
    },
    methods: {
        setValue: function setValue(vals) {
            var _this = this;
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            if (index === 0) {
                this.value = [];
            }
            setTimeout(function () {
                if (vals.length > index) {
                    _this.value.push(vals[index]);
                    _this.setValue(vals, index + 1);
                }
            }, 0);
        },
        toggle: function toggle() {
            console.log(789);
            this.$emit('update:expand', !this.expand);
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var _this2 = this;
        var elements = [];
        if (!this.previewMode && !this.keyName) {
            elements.push(h('span', {
                'class': {
                    'jv-toggle': true,
                    'open': !!this.expand
                },
                onClick: this.toggle
            }));
        }
        elements.push(h('span', {
            'class': {
                'jv-item': true,
                'jv-array': true
            },
            innerText: '['
        }));
        if (this.expand) {
            this.value.forEach(function (value, key) {
                elements.push(h(script$8, {
                    key: key,
                    style: { display: _this2.expand ? undefined : 'none' },
                    sort: _this2.sort,
                    depth: _this2.depth + 1,
                    value: value,
                    previewMode: _this2.previewMode
                }));
            });
        }
        if (!this.expand && this.value.length) {
            elements.push(h('span', {
                style: { display: undefined },
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                title: 'click to reveal '.concat(this.value.length, ' hidden items'),
                innerText: '...'
            }));
        }
        elements.push(h('span', {
            'class': {
                'jv-item': true,
                'jv-array': true
            },
            innerText: ']'
        }));
        return h('span', elements);
    }
};

script$5.__file = "src/Components/types/json-array.vue";

var script$6 = {
    name: 'JsonFunction',
    functional: true,
    props: {
        jsonValue: {
            type: Function,
            required: true
        }
    },
    render: function render() {
        return h('span', {
            'class': {
                'jv-item': true,
                'jv-function': true
            },
            attrs: { title: this.jsonValue.toString() },
            innerHTML: '&lt;function&gt;'
        });
    }
};

script$6.__file = "src/Components/types/json-function.vue";

var script$7 = {
    name: 'JsonDate',
    inject: ['timeformat'],
    functional: true,
    props: {
        jsonValue: {
            type: Date,
            required: true
        }
    },
    render: function render() {
        var value = this.jsonValue;
        var timeformat = this.timeformat;
        return h('span', {
            'class': {
                'jv-item': true,
                'jv-string': true
            },
            innerText: '"'.concat(timeformat(value), '"')
        });
    }
};

script$7.__file = "src/Components/types/json-date.vue";

var script$8 = {
    name: 'JsonBox',
    inject: ['expandDepth'],
    props: {
        value: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function,
                Date
            ],
            'default': null
        },
        keyName: {
            type: String,
            'default': ''
        },
        sort: Boolean,
        depth: {
            type: Number,
            'default': 0
        },
        previewMode: Boolean
    },
    data: function data() {
        return { expand: true };
    },
    mounted: function mounted() {
        this.expand = this.previewMode || (this.depth >= this.expandDepth ? false : true);
    },
    methods: {
        toggle: function toggle() {
            this.expand = !this.expand;
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var _this = this;
        var elements = [];
        var dataType;
        if (this.value === null || this.value === undefined) {
            dataType = script$1;
        } else if (Array.isArray(this.value)) {
            dataType = script$5;
        } else if (Object.prototype.toString.call(this.value) === '[object Date]') {
            dataType = script$7;
        } else if (_typeof(this.value) === 'object') {
            dataType = script$4;
        } else if (typeof this.value === 'number') {
            dataType = script$2;
        } else if (typeof this.value === 'string') {
            dataType = script;
        } else if (typeof this.value === 'boolean') {
            dataType = script$3;
        } else if (typeof this.value === 'function') {
            dataType = script$6;
        }
        var complex = this.keyName && this.value && (Array.isArray(this.value) || _typeof(this.value) === 'object' && Object.prototype.toString.call(this.value) !== '[object Date]');
        if (!this.previewMode && complex) {
            elements.push(h('span', {
                'class': {
                    'jv-toggle': true,
                    open: !!this.expand
                },
                onClick: this.toggle
            }));
        }
        if (this.keyName) {
            elements.push(h('span', {
                'class': { 'jv-key': true },
                innerText: ''.concat(this.keyName, ':')
            }));
        }
        elements.push(h(dataType, {
            'class': { 'jv-push': true },
            jsonValue: this.value,
            keyName: this.keyName,
            sort: this.sort,
            depth: this.depth,
            expand: this.expand,
            previewMode: this.previewMode,
            'onUpdate:expand': function onUpdateExpand(value) {
                _this.expand = value;
            }
        }));
        return h('div', {
            'class': {
                'jv-node': true,
                'jv-key-node': Boolean(this.keyName) && !complex,
                'toggle': !this.previewMode && complex
            }
        }, elements);
    }
};

script$8.__file = "src/Components/json-box.vue";

var debounce = function debounce(func, wait) {
    var startTime = Date.now();
    var timer;
    return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }
        if (Date.now() - startTime < wait && timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            func.apply(void 0, args);
        }, wait);
        startTime = Date.now();
    };
};

var script$9 = {
    name: 'JsonViewer',
    components: { JsonBox: script$8 },
    props: {
        value: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function
            ],
            required: true
        },
        expanded: {
            type: Boolean,
            'default': false
        },
        expandDepth: {
            type: Number,
            'default': 1
        },
        copyable: {
            type: [
                Boolean,
                Object
            ],
            'default': false
        },
        sort: {
            type: Boolean,
            'default': false
        },
        boxed: {
            type: Boolean,
            'default': false
        },
        theme: {
            type: String,
            'default': 'jv-light'
        },
        timeformat: {
            type: Function,
            'default': function _default(value) {
                return value.toLocaleString();
            }
        },
        previewMode: {
            type: Boolean,
            'default': false
        }
    },
    provide: function provide() {
        return {
            expandDepth: this.expandDepth,
            timeformat: this.timeformat
        };
    },
    data: function data() {
        return {
            copied: false,
            expandableCode: false,
            expandCode: this.expanded
        };
    },
    computed: {
        jvClass: function jvClass() {
            return 'jv-container ' + this.theme + (this.boxed ? ' boxed' : '');
        },
        copyText: function copyText() {
            var _this$copyable = this.copyable, copyText = _this$copyable.copyText, copiedText = _this$copyable.copiedText, timeout = _this$copyable.timeout, align = _this$copyable.align;
            return {
                copyText: copyText || 'copy',
                copiedText: copiedText || 'copied!',
                timeout: timeout || 2000,
                align: align
            };
        }
    },
    watch: {
        value: function value() {
            this.onResized();
        }
    },
    mounted: function mounted() {
        var _this = this;
        this.debounceResized = debounce(this.debResized.bind(this), 200);
        if (this.boxed && this.$refs.jsonBox) {
            this.onResized();
            this.$refs.jsonBox.$el.addEventListener('resized', this.onResized, true);
        }
        if (this.copyable) {
            var clipBoard = new Clipboard(this.$refs.clip, {
                text: function text() {
                    return JSON.stringify(_this.value, null, 2);
                }
            });
            clipBoard.on('success', function (e) {
                _this.onCopied(e);
            });
        }
    },
    methods: {
        onResized: function onResized() {
            this.debounceResized();
        },
        debResized: function debResized() {
            var _this2 = this;
            this.$nextTick(function () {
                if (!_this2.$refs.jsonBox)
                    return;
                if (_this2.$refs.jsonBox.$el.clientHeight >= 250) {
                    _this2.expandableCode = true;
                } else {
                    _this2.expandableCode = false;
                }
            });
        },
        onCopied: function onCopied(copyEvent) {
            var _this3 = this;
            if (this.copied) {
                return;
            }
            this.copied = true;
            setTimeout(function () {
                _this3.copied = false;
            }, this.copyText.timeout);
            this.$emit('copied', copyEvent);
        },
        toggleExpandCode: function toggleExpandCode() {
            this.expandCode = !this.expandCode;
        }
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_json_box = resolveComponent('json-box');
    return openBlock(), createBlock('div', { 'class': $options.jvClass }, [
        $props.copyable ? (openBlock(), createBlock('div', {
            key: 0,
            'class': 'jv-tooltip '.concat($options.copyText.align || 'right')
        }, [createVNode('span', {
                ref: 'clip',
                'class': [
                    'jv-button',
                    { copied: $data.copied }
                ]
            }, [renderSlot(_ctx.$slots, 'copy', { copied: $data.copied }, function () {
                    return [createTextVNode(toDisplayString($data.copied ? $options.copyText.copiedText : $options.copyText.copyText), 1)];
                })], 2)], 2)) : createCommentVNode('v-if', true),
        createVNode('div', {
            'class': [
                'jv-code',
                {
                    'open': $data.expandCode,
                    boxed: $props.boxed
                }
            ]
        }, [createVNode(_component_json_box, {
                ref: 'jsonBox',
                value: $props.value,
                sort: $props.sort,
                'preview-mode': $props.previewMode
            }, null, 8, [
                'value',
                'sort',
                'preview-mode'
            ])], 2),
        $data.expandableCode && $props.boxed ? (openBlock(), createBlock('div', {
            key: 1,
            'class': 'jv-more',
            onClick: _cache[1] || (_cache[1] = function () {
                return $options.toggleExpandCode && $options.toggleExpandCode.apply($options, arguments);
            })
        }, [createVNode('span', {
                'class': [
                    'jv-toggle',
                    { open: !!$data.expandCode }
                ]
            }, null, 2)])) : createCommentVNode('v-if', true)
    ], 2);
}

script$9.render = render;
script$9.__file = "src/Components/json-viewer.vue";

var install = function install(app) {
    app.component(script$9.name, script$9);
};
var index = { install: install };

export default index;
export { script$9 as JsonViewer };
