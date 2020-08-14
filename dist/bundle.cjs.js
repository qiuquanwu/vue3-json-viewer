'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

var script = {
    name: 'CubeButton',
    props: {
        icon: {
            type: String,
            'default': ''
        },
        active: {
            type: Boolean,
            'default': false
        },
        disabled: {
            type: Boolean,
            'default': false
        },
        inline: {
            type: Boolean,
            'default': false
        },
        primary: {
            type: Boolean,
            'default': false
        },
        outline: {
            type: Boolean,
            'default': false
        },
        light: {
            type: Boolean,
            'default': false
        },
        type: {
            type: String,
            'default': 'button'
        }
    },
    setup: function setup(props, _ref) {
        var emit = _ref.emit;
        var btnClass = vue.computed(function () {
            return {
                'cube-btn_active': props.active,
                'cube-btn_disabled': props.disabled,
                'cube-btn-inline': props.inline,
                'cube-btn-primary': props.primary,
                'cube-btn-outline': props.outline,
                'cube-btn-outline-primary': props.outline && props.primary,
                'cube-btn-light': props.light
            };
        });
        var handleClick = function handleClick(e) {
            if (props.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            event.stopPropagation();
            emit('onClick', event);
        };
        return {
            btnClass: btnClass,
            handleClick: handleClick
        };
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("button", {
    class: ["cube-btn", _ctx.btnClass],
    type: _ctx.type,
    onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick(...args)))
  }, [
    (_ctx.icon)
      ? (vue.openBlock(), vue.createBlock("i", {
          key: 0,
          class: _ctx.icon
        }, null, 2 /* CLASS */))
      : vue.createCommentVNode("v-if", true),
    vue.renderSlot(_ctx.$slots, "default")
  ], 10 /* CLASS, PROPS */, ["type"]))
}

script.render = render;
script.__file = "src/Components/button/button.vue";

var install = function install(app) {
    app.component(script.name, script);
};
var index = { install: install };

exports.cButton = script;
exports.default = index;
