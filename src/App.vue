<template>
  <div>
    <allyop-select
      label="1. Leistungsart (Pflichtfeld)"
      :items="testItems"
      v-model="value"
    ></allyop-select>
    <button type="button">Just a button</button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import AllyopSelect, { allySelectItem } from "./components/allyop-select.vue";

export default Vue.extend({
  components: {
    AllyopSelect,
  },
  data() {
    return {
      value: "Flabbergasted",
      testItems: [
        {
          text: "Neptunium",
          value: "neptunium",
        },
        {
          text: "Einsteinium",
          value: "einsteinium",
        },
        {
          text: "Bohrium",
          value: "bohr",
        },
        {
          text: "Planium",
          value: "planium",
        },
        {
          text: "Californium",
          value: "californium",
        },
        {
          text: "Eisen",
          value: "eisen",
        },
        {
          text: "Neptnium",
          value: "neptnium",
        },
        {
          text: "Einstinium",
          value: "einstinium",
        },
        {
          text: "Bohium",
          value: "bor",
        },
        {
          text: "Planum",
          value: "planum",
        },
        {
          text: "Califrnium",
          value: "caliornium",
        },
        {
          text: "Eisn",
          value: "eien",
        },
      ] as Array<allySelectItem>,
    };
  },
});
</script>
