<template>
  <button class="cube-btn" :type="type" :class="btnClass" @click="handleClick">
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </button>
</template>

<script>
import { computed } from "vue";
export default {
  name: "CubeButton",
  props: {
    icon: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "button",
    },
  },
  setup(props,{emit}) {
    const btnClass = computed(() => {
      return {
        "cube-btn_active": props.active,
        "cube-btn_disabled": props.disabled,
        "cube-btn-inline": props.inline,
        "cube-btn-primary": props.primary,
        "cube-btn-outline": props.outline,
        "cube-btn-outline-primary": props.outline && props.primary,
        "cube-btn-light": props.light,
      };
    });
    const handleClick=(e)=>{
       if (props.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.stopPropagation();
      emit("onClick", event);
    }
    return {
      btnClass,
      handleClick
    };
  }
};
</script>

<style>
.cube-btn {
  display: block;
  margin: 0;
  padding: 17px 16px;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  background: #4a4c5b;
  outline: none;
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.cube-btn.cube-btn_active,
.cube-btn:active {
  background: #444654;
}
.cube-btn > i {
  display: inline-block;
  margin-right: 4px;
  font-size: 100%;
  transform: scale(1.13);
  transform-origin: right center;
}
.cube-btn-inline {
  width: auto;
  display: inline-block;
  vertical-align: middle;
  padding: 9px 10px;
  font-size: 12px;
}
.cube-btn-inline > i {
  margin-right: 2px;
  transform: scale(1.14);
}
.cube-btn-primary {
  color: #fff;
  background: #fc9153;
}
.cube-btn-primary.cube-btn_active,
.cube-btn-primary:active {
  background: #e8864c;
}
.cube-btn-light {
  color: #666;
  background: #fcfcfc;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.cube-btn-light.cube-btn_active,
.cube-btn-light:active {
  background: #e8e8e8;
}
.cube-btn-outline {
  color: #666;
  background: transparent;
  position: relative;
}
.cube-btn-outline::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #666;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn-outline::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn-outline::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}
.cube-btn-outline.cube-btn_active,
.cube-btn-outline:active {
  background: rgba(0,0,0,0.08);
  position: relative;
}
.cube-btn-outline.cube-btn_active::after,
.cube-btn-outline:active::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #666;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn-outline.cube-btn_active::after,
  .cube-btn-outline:active::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn-outline.cube-btn_active::after,
  .cube-btn-outline:active::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}
.cube-btn-outline-primary {
  color: #fc9153;
  background: transparent;
  position: relative;
}
.cube-btn-outline-primary::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #fc9153;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn-outline-primary::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn-outline-primary::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}
.cube-btn-outline-primary.cube-btn_active,
.cube-btn-outline-primary:active {
  background: rgba(252,145,83,0.08);
  position: relative;
}
.cube-btn-outline-primary.cube-btn_active::after,
.cube-btn-outline-primary:active::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #e8864c;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn-outline-primary.cube-btn_active::after,
  .cube-btn-outline-primary:active::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn-outline-primary.cube-btn_active::after,
  .cube-btn-outline-primary:active::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}
.cube-btn_disabled {
  color: #fff;
  background: #ccc;
  position: relative;
}
.cube-btn_disabled::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #ccc;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn_disabled::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn_disabled::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}
.cube-btn_disabled.cube-btn_active,
.cube-btn_disabled:active {
  background: #ccc;
  position: relative;
}
.cube-btn_disabled.cube-btn_active::after,
.cube-btn_disabled:active::after {
  content: "";
  pointer-events: none;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  border: 1PX solid #ccc;
  border-radius: 2PX;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
@media (min-resolution: 2dppx) {
  .cube-btn_disabled.cube-btn_active::after,
  .cube-btn_disabled:active::after {
    width: 200%;
    height: 200%;
    border-radius: 4PX;
    transform: scale(0.5);
  }
}
@media (min-resolution: 3dppx) {
  .cube-btn_disabled.cube-btn_active::after,
  .cube-btn_disabled:active::after {
    width: 300%;
    height: 300%;
    border-radius: 6PX;
    transform: scale(0.333);
  }
}

</style>>

