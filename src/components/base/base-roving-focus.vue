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
    downTriggers: {
      type: Array as () => Array<string>,
      default: () => ["ArrowDown"]
    },
    upTriggers: {
      type: Array as () => Array<string>,
      default: () => ["ArrowUp"]
    },
    enterTriggers: {
      type: Array as () => Array<string>,
      default: () => ["Enter"]
    },
    closeTriggers: {
      type: Array as () => Array<string>,
      default: () => ["Escape"]
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
  },
  methods: {
    createListeners(): any {
      const downs = this.downTriggers.reduce((obj, key) => {
        obj["keyup"] = evt => this.handleKeystroke(evt);
        return obj;
      }, {});

      return { ...downs };
    },
    getActiveElementIndex(): number {
      return this.items.findIndex(x => x.id == this.activeElementId);
    },
    moveFocusDown(): void {
      let nextIndex = this.getActiveElementIndex() + 1;
      if (nextIndex == this.items.length) {
        nextIndex = 0;
      }
      return nextIndex;
    },
    moveFocusUp(): void {
      let nextIndex = this.getActiveElementIndex() - 1;
      if (nextIndex == -1) {
        nextIndex = this.items.length - 1;
      }
      return nextIndex;
    },
    handleKeystroke(event: KeyboardEvent): void {
      let nextIndex = 0;
      if (this.downTriggers.some(x => x == event.key)) {
        event.preventDefault();
        nextIndex = this.moveFocusDown();
        this.$emit("down");
        this.$emit("update:activeElementId", this.items[nextIndex].id);
      } else if (this.upTriggers.some(x => x == event.key)) {
        event.preventDefault();
        nextIndex = this.moveFocusUp();
        this.$emit("up");
        this.$emit("update:activeElementId", this.items[nextIndex].id);
      } else if (this.enterTriggers.some(x => x == event.key)) {
        this.$emit("enter");
      } else if (this.closeTriggers.some(x => x == event.key)) {
        this.$emit("escape");
      }
    }
  }
});
</script>
