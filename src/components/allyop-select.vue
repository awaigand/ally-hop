<template>
  <div class="allyop-select">
    <div class="allyop-select__listbox-area">
      <div>
        <span :id="labelId">{{ label }}</span>
        <base-roving-focus
          #default="{lstn}"
          :items="innerItems"
          :activeElementId.sync="activeDescendant"
          @up="expandedListShown = true"
          @down="expandedListShown = true"
          @enter="toggleShown"
          @escape="collapse"
        >
          <base-keystroke-filter
            @filter="focusItemByText"
            #default="{listners}"
          >
            <div id="exp_wrapper" v-on="{ ...lstn, ...listners }">
              <button
                aria-haspopup="listbox"
                :aria-labelledby="labelId + ' ' + buttonId"
                :id="buttonId"
                type="button"
                ref="mainbutton"
                @mouseup="toggleShown"
                v-attribute-helper:aria-expanded.removeonfalse="
                  expandedListShown
                "
                class="allyop-select__button"
                v-text="buttonText"
              ></button>
              <ul
                ref="listbox"
                :id="listboxId"
                tabindex="-1"
                v-prevent-keys="['ArrowUp', 'ArrowDown']"
                @blur="collapse(false)"
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
                  @mouseup="focusItem(item)"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </base-keystroke-filter>
        </base-roving-focus>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import attributeHelper from "../directives/attribute-helper";
import preventKeys from "../directives/prevent-keys";
import IdGeneratorMixin from "../mixins/id-generator";
import BaseRovingFocus from "./base/base-roving-focus.vue";
import BaseKeystrokeFilter from "./base/base-keystroke-filter.vue";

export type allySelectItem = {
  text: string;
  value: string;
};

function elementHasToScroll(ele: Element): boolean {
  return ele.scrollHeight > ele.clientHeight;
}

export default Vue.extend(IdGeneratorMixin).extend({
  name: "allyop-select",
  components: {
    BaseRovingFocus,
    BaseKeystrokeFilter,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    nonSelectedText: {
      type: String,
      default: "Bitte Auswahl treffen",
    },
    items: {
      type: Array as () => Array<allySelectItem>,
      default: [],
    },
  },
  methods: {
    toggleShown(event: any) {
      if (!this.expandedListShown) {
        this.show();
      } else if (this.expandedListShown) {
        this.collapse();
      }
    },
    focusItemByText(text: string | null) {
      if (text != null && text.length > 0) {
        const filteredItems = this.innerItems.filter((x) =>
          x.text.toLowerCase().startsWith(text.toLowerCase())
        );
        if (filteredItems[0]) {
          this.focusItem(filteredItems[0]);
        }
      }
    },
    focusItem(item: allySelectItem & { id: string }) {
      this.activeDescendant = item.id;
    },
    show(): void {
      if (!this.expandedListShown) {
        this.expandedListShown = true;
        Vue.nextTick(() => (this.$refs.listbox as HTMLUListElement).focus());
      }
    },
    collapse(focusButton = true): void {
      if (this.expandedListShown) {
        this.expandedListShown = false;
        if (focusButton) {
          Vue.nextTick(() =>
            (this.$refs.mainbutton as HTMLUListElement).focus()
          );
        }
      }
    },
    getCalculatedId(item: allySelectItem) {
      return this.keyPrefix + item.value;
    },
  },
  data() {
    return {
      expandedListShown: false,
      buttonId: this.getId(),
      labelId: this.getId(),
      keyPrefix: this.getId(),
      listboxId: this.getId(),
      buttonText: this.nonSelectedText,
      activeDescendant: null as string | null,
    };
  },
  watch: {
    activeDescendant(id: string): void {
      const activeElement = document.getElementById(id)!;
      const listbox = this.$refs["listbox"]! as Element;
      if (elementHasToScroll(listbox)) {
        var scrollBottom = listbox.clientHeight + listbox.scrollTop;
        var elementBottom =
          activeElement.offsetTop + activeElement.offsetHeight;
        if (elementBottom > scrollBottom) {
          listbox.scrollTop = elementBottom - listbox.clientHeight;
        } else if (activeElement.offsetTop < listbox.scrollTop) {
          listbox.scrollTop = activeElement.offsetTop;
        }
      }
      if (id) {
        this.buttonText = this.innerItems.find((x) => x.id == id).text;
        return;
      }
      this.buttonText == this.nonSelectedText;
    },
  },
  directives: {
    attributeHelper,
    preventKeys,
  },
  computed: {
    listClasses(): Record<string, boolean> {
      return {
        hidden: !this.expandedListShown,
      };
    },
    innerItems(): Array<any> {
      return this.items.map((x) => ({ ...x, id: this.getCalculatedId(x) }));
    },
  },
});
</script>

<style>
/**:focus {
  outline: 3px blue solid !important;
}*/
.allyop-select__listbox-area {
  width: 100%;
  position: relative;
}

.allyop-select {
  box-sizing: border-box;
}

.allyop-select * {
  box-sizing: inherit;
}

.allyop-select .allyop-select__button {
  max-width: 100%;
  width: 100%;
  min-height: 1em;
}

.allyop-select [role="listbox"] {
  min-height: 1em;
  padding: 0;
  background: white;
  border: 1px solid #aaa;
}

.allyop-select [role="option"] {
  display: block;
  padding: 0 0 0 1.5em;
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
  width: 100%;
}

.allyop-select__button {
  border-radius: 0;
  font-size: 16px;
  text-align: left;
  padding: 5px 10px;
  width: 150px;
  position: relative;
}

.allyop-select__list {
  border: 0;
  max-height: 10em;
  overflow-y: auto;
  position: absolute;
  margin: 0;
  width: 100%;
}

.hidden {
  display: none;
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
