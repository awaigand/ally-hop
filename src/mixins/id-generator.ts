import { VueConstructor } from "vue/types/umd";
import Vue from "vue";

function* IdGenerator(prefix: string): IterableIterator<string> {
  let number = 1;
  let pre = prefix;
  while (true) {
    yield `${pre}-${number}`;
    if (number == Number.MAX_SAFE_INTEGER - 1) {
      number = 0;
      pre += "x";
    }
    number++;
  }
}

const idGenerator = IdGenerator("allyop");

export default {
  methods: {
    getId(this: any): string {
      return idGenerator.next().value;
    }
  }
};
