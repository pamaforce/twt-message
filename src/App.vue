<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
.v-input--radio-group__input {
  flex-wrap: wrap;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
.v-note-wrapper {
  min-width: 200px !important;
}
</style>

