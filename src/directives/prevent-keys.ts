import Vue from "vue";
import { DirectiveBinding } from "vue/types/options";

let functionSave: ((evt: KeyboardEvent) => void) | null = null;
/**
 *
 * @param el
 * @param binding
 * @param {Array<string>} binding.value An array of key Strings as defined by KeyboardEvent
 */
function render(this: any, el: HTMLElement, binding: DirectiveBinding): void {
  functionSave = function eventHandler(evt: KeyboardEvent) {
    const value = binding.value! as Array<string>;

    if (value.indexOf(evt.key) > -1) {
      evt.preventDefault();
    }
  };

  el.addEventListener("keydown", functionSave);
}

export default Vue.directive("prevent-keys", {
  // When the bound element is inserted into the DOM...
  inserted: render,
  unbind: (el) =>
    el.removeEventListener(
      "keydown",
      functionSave as (evt: KeyboardEvent) => void
    ),
});
