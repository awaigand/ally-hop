import Vue from "vue";
import { DirectiveBinding } from "vue/types/options";

function render(el: HTMLElement, binding: DirectiveBinding): void {
  if (binding.modifiers.removeonfalse && binding.value! == false) {
    el.removeAttribute(binding.arg!);
  } else {
    el.setAttribute(binding.arg!, binding.value);
  }
}

export default Vue.directive("attribute-helper", {
  // When the bound element is inserted into the DOM...
  inserted: render,
  update: render
});
