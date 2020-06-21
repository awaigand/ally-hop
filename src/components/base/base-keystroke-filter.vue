<script lang="ts">
//@ts-nocheck
import Vue from "vue";

export default Vue.extend({
  name: "base-filter",
  props: {
    filterTimeout: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      typedSoFar: "" as string,
      timeout: undefined as undefined | number,
    };
  },
  methods: {
    keydown(event: KeyboardEvent) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      const char = event.key;
      if (char.length == 1 && /[\s\S]/.test(char)) {
        this.typeahead(char);
      }
    },
    typeahead(char: string) {
      this.typedSoFar += char;
      this.timeout = setTimeout(
        () => (this.typedSoFar = ""),
        this.filterTimeout
      );
    },
  },
  watch: {
    typedSoFar(val: string): void {
      this.$emit("filter", val);
    },
  },
  render(): any {
    return this.$scopedSlots.default!({
      listners: { keydown: this.keydown },
    });
  },
});
</script>
