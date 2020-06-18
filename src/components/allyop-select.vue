<template>
  <div class="allyop-select">
    <div class="allyop-select__listbox-area">
      <div>
        <span :id="labelId">
          {{ label }}
        </span>
        <base-roving-focus
          #default="{lstn}"
          :items="innerItems"
          :activeElementId.sync="activeDescendant"
        >
          <div id="exp_wrapper" v-on="lstn">
            <button
              aria-haspopup="listbox"
              :aria-labelledby="labelId + ' ' + buttonId"
              :id="buttonId"
              v-attribute-helper:aria-expanded.removeonfalse="expandedListShown"
              class="allyop-select__button"
              @click="toggleShown"
              v-text="buttonText"
            ></button>
            <ul
              ref="listbox"
              :id="listboxId"
              tabindex="-1"
              class="allyop-select__list"
              role="listbox"
              v-attribute-helper:aria-activedescendant.removeonfalse="
                activeDescendant
              "
              :aria-labelledby="labelId"
              :class="listClasses"
            >
              <li
                v-for="item in innerItems"
                :key="item.value"
                :id="item.id"
                v-attribute-helper:aria-selected.removeonfalse="
                  activeDescendant == item.id
                "
                role="option"
                :class="{ focused: activeDescendant == item.id }"
                @click="focusItem(item)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
        </base-roving-focus>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import attributeHelper from "../directives/attribute-helper";
import IdGeneratorMixin from "../mixins/id-generator";
import BaseRovingFocus from "./base/base-roving-focus.vue";

export type allySelectItem = {
  text: string;
  value: string;
};

export default Vue.extend(IdGeneratorMixin).extend({
  name: "allyop-select",
  components: {
    BaseRovingFocus
  },
  props: {
    label: {
      type: String,
      required: true
    },
    items: {
      type: Array as () => Array<allySelectItem>,
      default: []
    }
  },
  methods: {
    toggleShown() {
      this.expandedListShown = !this.expandedListShown;
      if (this.expandedListShown && this.$refs.listbox) {
        Vue.nextTick(() => (this.$refs.listbox as HTMLUListElement).focus());
      }
    },
    focusItem(item: allySelectItem & { id: string }) {
      this.activeDescendant = item.id;
      this.buttonText = item.text;
    },
    getCalculatedId(item: allySelectItem) {
      return this.keyPrefix + item.value;
    }
  },
  data() {
    return {
      expandedListShown: false,
      buttonId: this.getId(),
      labelId: this.getId(),
      keyPrefix: this.getId(),
      listboxId: this.getId(),
      buttonText: "Bitte Auswahl treffen",
      activeDescendant: null as string | null
    };
  },
  directives: {
    attributeHelper
  },
  computed: {
    listClasses(): Record<string, boolean> {
      return {
        hidden: !this.expandedListShown
      };
    },
    innerItems(): Array<any> {
      return this.items.map(x => ({ ...x, id: this.getCalculatedId(x) }));
    }
  }
});
</script>

<style>
*:focus {
  outline: 3px blue solid !important;
}
.allyop-select__listbox-area {
  width: 100%;
  position: relative;
}

.allyop-select .allyop-select__button {
  max-width: 100%;
  width: 100%;
  min-height: 1em;
}

.allyop-select .annotate {
  font-style: italic;
  color: #366ed4;
}

.allyop-select .left-area,
.allyop-select .right-area {
  box-sizing: border-box;
  display: inline-block;
  font-size: 14px;
  vertical-align: top;
  width: 50%;
}

.allyop-select .left-area {
  padding-right: 10px;
}

.allyop-select .right-area {
  padding-left: 10px;
}

.allyop-select [role="listbox"] {
  min-height: 18em;
  padding: 0;
  background: white;
  border: 1px solid #aaa;
}

.allyop-select [role="option"] {
  display: block;
  padding: 0 1em 0 1.5em;
  position: relative;
  line-height: 1.8em;
}

.allyop-select [role="option"].focused {
  background: #bde4ff;
}

.allyop-select [role="option"][aria-selected="true"]::before {
  content: "⇨";
  position: absolute;
  left: 0.5em;
}

.allyop-select button {
  font-size: 16px;
}

.allyop-select button[aria-disabled="true"] {
  opacity: 0.5;
}

.allyop-select__button {
  border-radius: 0;
  font-size: 16px;
  text-align: left;
  padding: 5px 10px;
  width: 150px;
  position: relative;
}

.allyop-select__button::after {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #aaa;
  content: " ";
  position: absolute;
  right: 5px;
  top: 10px;
}

.allyop-select__button[aria-expanded="true"]::after {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 0;
  border-bottom: 8px solid #aaa;
  content: " ";
  position: absolute;
  right: 5px;
  top: 10px;
}

.allyop-select__list {
  border-top: 0;
  max-height: 10em;
  overflow-y: auto;
  position: absolute;
  margin: 0;
  width: 100%;
}

.hidden {
  display: none;
}

.toolbar {
  font-size: 0;
}

.toolbar-item {
  border: 1px solid #aaa;
  background: #ccc;
}

.toolbar-item[aria-disabled="false"]:focus {
  background-color: #eee;
}

.offscreen {
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  font-size: 14px;
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
