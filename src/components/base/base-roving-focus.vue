<script lang="ts">
//@ts-nocheck
import Vue from "vue";

export interface HasId {
  id: string;
}

export default Vue.extend({
  name: "base-roving-focus",
  props: {
    items: {
      type: Array as () => Array<hasId>
    },
    activeElementId: {
      type: String
    },
    focusIdOnClose: {
      type: String
    },
    downTriggers: {
      type: Array as () => Array<string>,
      default: () => ["ArrowDown", "enter"]
    },
    upTriggers: {
      type: Array as () => Array<string>,
      default: () => ["ArrowUp"]
    },
    closeTriggers: {
      type: Array as () => Array<string>,
      default: () => ["esc"]
    }
  },
  render(): any {
    return this.$scopedSlots!.default!({
      lstn: this.listeners
    })![0];
  },
  data() {
    return {
      listeners: {}
    };
  },
  mounted() {
    this.listeners = this.createListeners();
    console.log(this.listeners);
  },
  methods: {
    createListeners(): any {
      const downs = this.downTriggers.reduce((obj, key) => {
        obj["keyup"] = evt => this.moveFocusDown(evt);
        return obj;
      }, {});

      return { ...downs };
    },
    getActiveElementIndex(): number {
      return this.items.findIndex(x => x.id == this.activeElementId);
    },
    moveFocusDown(event: KeyboardEvent): void {
      if (this.downTriggers.some(x => x == event.key)) {
        event.preventDefault();
        let nextIndex = this.getActiveElementIndex() + 1;
        if (nextIndex == this.items.length) {
          nextIndex = 0;
        }
        this.$emit("update:activeElementId", this.items[nextIndex].id);
      }
    }
  }
});
</script>
