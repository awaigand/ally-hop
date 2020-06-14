<template>
  <div>
    <allyop-select
      label="1. Leistungsart (Pflichtfeld)"
      :items="testItems"
      v-model="value"
    ></allyop-select>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import AllyopSelect, { allySelectItem } from "./components/allyop-select.vue";

export default Vue.extend({
  components: {
    AllyopSelect
  },
  data() {
    return {
      value: "Flabbergasted",
      testItems: [
        {
          text: "Neptunium",
          value: "neptunium"
        },
        {
          text: "Einsteinium",
          value: "einsteinium"
        },
        {
          text: "Bohrium",
          value: "bohr"
        },
        {
          text: "Planium",
          value: "planium"
        }
      ] as Array<allySelectItem>
    };
  }
});
</script>
