import Vue from 'vue';

function render(el, binding) {
    if (binding.modifiers.removeonfalse && binding.value == false) {
        el.removeAttribute(binding.arg);
    }
    else {
        el.setAttribute(binding.arg, binding.value);
    }
}
var attributeHelper = Vue.directive("attribute-helper", {
    // When the bound element is inserted into the DOM...
    inserted: render,
    update: render,
});

let functionSave = null;
/**
 *
 * @param el
 * @param binding
 * @param {Array<string>} binding.value An array of key Strings as defined by KeyboardEvent
 */
function render$1(el, binding) {
    functionSave = function eventHandler(evt) {
        const value = binding.value;
        if (value.indexOf(evt.key) > -1) {
            evt.preventDefault();
        }
    };
    el.addEventListener("keydown", functionSave);
}
var preventKeys = Vue.directive("prevent-keys", {
    // When the bound element is inserted into the DOM...
    inserted: render$1,
    unbind: (el) => el.removeEventListener("keydown", functionSave),
});

function* IdGenerator(prefix) {
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
var IdGeneratorMixin = {
    methods: {
        getId() {
            return idGenerator.next().value;
        },
    },
};

//@ts-nocheck
var script = Vue.extend({
    name: "base-roving-focus",
    props: {
        items: {
            type: Array,
        },
        activeElementId: {
            type: String,
        },
        downTriggers: {
            type: Array,
            default: () => ["ArrowDown"],
        },
        upTriggers: {
            type: Array,
            default: () => ["ArrowUp"],
        },
        enterTriggers: {
            type: Array,
            default: () => ["Enter"],
        },
        closeTriggers: {
            type: Array,
            default: () => ["Escape"],
        },
    },
    render() {
        return this.$scopedSlots.default({
            lstn: this.listeners,
        })[0];
    },
    data() {
        return {
            listeners: {},
        };
    },
    mounted() {
        this.listeners = this.createListeners();
    },
    methods: {
        createListeners() {
            const downs = this.downTriggers.reduce((obj, key) => {
                obj["keyup"] = (evt) => this.handleKeystroke(evt);
                return obj;
            }, {});
            return { ...downs };
        },
        getActiveElementIndex() {
            return this.items.findIndex((x) => x.id == this.activeElementId);
        },
        moveFocusDown() {
            let nextIndex = this.getActiveElementIndex() + 1;
            if (nextIndex == this.items.length) {
                nextIndex = 0;
            }
            return nextIndex;
        },
        moveFocusUp() {
            let nextIndex = this.getActiveElementIndex() - 1;
            if (nextIndex == -1) {
                nextIndex = this.items.length - 1;
            }
            return nextIndex;
        },
        handleKeystroke(event) {
            let nextIndex = 0;
            if (this.downTriggers.some((x) => x == event.key)) {
                event.preventDefault();
                nextIndex = this.moveFocusDown();
                this.$emit("down");
                this.$emit("update:activeElementId", this.items[nextIndex].id);
            }
            else if (this.upTriggers.some((x) => x == event.key)) {
                event.preventDefault();
                nextIndex = this.moveFocusUp();
                this.$emit("up");
                this.$emit("update:activeElementId", this.items[nextIndex].id);
            }
            else if (this.enterTriggers.some((x) => x == event.key)) {
                this.$emit("enter");
            }
            else if (this.closeTriggers.some((x) => x == event.key)) {
                this.$emit("escape");
            }
        },
    },
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

//@ts-nocheck
var script$1 = Vue.extend({
    name: "base-filter",
    props: {
        filterTimeout: {
            type: Number,
            default: 500,
        },
    },
    data() {
        return {
            typedSoFar: "",
            timeout: undefined,
        };
    },
    methods: {
        keydown(event) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            const char = event.key;
            if (char.length == 1 && /[\s\S]/.test(char)) {
                this.typeahead(char);
            }
        },
        typeahead(char) {
            this.typedSoFar += char;
            this.timeout = setTimeout(() => (this.typedSoFar = ""), this.filterTimeout);
        },
    },
    watch: {
        typedSoFar(val) {
            this.$emit("filter", val);
        },
    },
    render() {
        return this.$scopedSlots.default({
            listners: { keydown: this.keydown },
        });
    },
});

/* script */
const __vue_script__$1 = script$1;

/* template */

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

function elementHasToScroll(ele) {
    return ele.scrollHeight > ele.clientHeight;
}
var script$2 = Vue.extend(IdGeneratorMixin).extend({
    name: "allyop-select",
    components: {
        BaseRovingFocus: __vue_component__,
        BaseKeystrokeFilter: __vue_component__$1,
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
            type: Array,
            default: [],
        },
    },
    methods: {
        toggleShown(event) {
            if (!this.expandedListShown) {
                this.show();
            }
            else if (this.expandedListShown) {
                this.collapse();
            }
        },
        focusItemByText(text) {
            if (text != null && text.length > 0) {
                const filteredItems = this.innerItems.filter((x) => x.text.toLowerCase().startsWith(text.toLowerCase()));
                if (filteredItems[0]) {
                    this.focusItem(filteredItems[0]);
                }
            }
        },
        focusItem(item) {
            this.activeDescendant = item.id;
        },
        show() {
            if (!this.expandedListShown) {
                this.expandedListShown = true;
                Vue.nextTick(() => this.$refs.listbox.focus());
            }
        },
        collapse(focusButton = true) {
            if (this.expandedListShown) {
                this.expandedListShown = false;
                if (focusButton) {
                    Vue.nextTick(() => this.$refs.mainbutton.focus());
                }
            }
        },
        getCalculatedId(item) {
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
            activeDescendant: null,
        };
    },
    watch: {
        activeDescendant(id) {
            const activeElement = document.getElementById(id);
            const listbox = this.$refs["listbox"];
            if (elementHasToScroll(listbox)) {
                var scrollBottom = listbox.clientHeight + listbox.scrollTop;
                var elementBottom = activeElement.offsetTop + activeElement.offsetHeight;
                if (elementBottom > scrollBottom) {
                    listbox.scrollTop = elementBottom - listbox.clientHeight;
                }
                else if (activeElement.offsetTop < listbox.scrollTop) {
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
        listClasses() {
            return {
                hidden: !this.expandedListShown,
            };
        },
        innerItems() {
            return this.items.map((x) => ({ ...x, id: this.getCalculatedId(x) }));
        },
    },
});

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "allyop-select" }, [
    _c("div", { staticClass: "allyop-select__listbox-area" }, [
      _c(
        "div",
        [
          _c("span", { attrs: { id: _vm.labelId } }, [
            _vm._v(_vm._s(_vm.label))
          ]),
          _vm._v(" "),
          _c("base-roving-focus", {
            attrs: {
              items: _vm.innerItems,
              activeElementId: _vm.activeDescendant
            },
            on: {
              "update:activeElementId": function($event) {
                _vm.activeDescendant = $event;
              },
              "update:active-element-id": function($event) {
                _vm.activeDescendant = $event;
              },
              up: function($event) {
                _vm.expandedListShown = true;
              },
              down: function($event) {
                _vm.expandedListShown = true;
              },
              enter: _vm.toggleShown,
              escape: _vm.collapse
            },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(ref) {
                  var lstn = ref.lstn;
                  return [
                    _c("base-keystroke-filter", {
                      on: { filter: _vm.focusItemByText },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "default",
                            fn: function(ref) {
                              var listners = ref.listners;
                              return [
                                _c(
                                  "div",
                                  _vm._g(
                                    { attrs: { id: "exp_wrapper" } },
                                    Object.assign({}, lstn, listners)
                                  ),
                                  [
                                    _c("button", {
                                      directives: [
                                        {
                                          name: "attribute-helper",
                                          rawName:
                                            "v-attribute-helper:aria-expanded.removeonfalse",
                                          value: _vm.expandedListShown,
                                          expression:
                                            "\n                expandedListShown\n              ",
                                          arg: "aria-expanded",
                                          modifiers: { removeonfalse: true }
                                        }
                                      ],
                                      ref: "mainbutton",
                                      staticClass: "allyop-select__button",
                                      attrs: {
                                        "aria-haspopup": "listbox",
                                        "aria-labelledby":
                                          _vm.labelId + " " + _vm.buttonId,
                                        id: _vm.buttonId,
                                        type: "button"
                                      },
                                      domProps: {
                                        textContent: _vm._s(_vm.buttonText)
                                      },
                                      on: { mouseup: _vm.toggleShown }
                                    }),
                                    _vm._v(" "),
                                    _c(
                                      "ul",
                                      {
                                        directives: [
                                          {
                                            name: "prevent-keys",
                                            rawName: "v-prevent-keys",
                                            value: ["ArrowUp", "ArrowDown"],
                                            expression:
                                              "['ArrowUp', 'ArrowDown']"
                                          },
                                          {
                                            name: "attribute-helper",
                                            rawName:
                                              "v-attribute-helper:aria-activedescendant.removeonfalse",
                                            value: _vm.activeDescendant,
                                            expression:
                                              "\n                activeDescendant\n              ",
                                            arg: "aria-activedescendant",
                                            modifiers: { removeonfalse: true }
                                          }
                                        ],
                                        ref: "listbox",
                                        staticClass: "allyop-select__list",
                                        class: _vm.listClasses,
                                        attrs: {
                                          id: _vm.listboxId,
                                          tabindex: "-1",
                                          role: "listbox",
                                          "aria-labelledby": _vm.labelId
                                        },
                                        on: {
                                          blur: function($event) {
                                            return _vm.collapse(false)
                                          }
                                        }
                                      },
                                      _vm._l(_vm.innerItems, function(item) {
                                        return _c(
                                          "li",
                                          {
                                            directives: [
                                              {
                                                name: "attribute-helper",
                                                rawName:
                                                  "v-attribute-helper:aria-selected.removeonfalse",
                                                value:
                                                  _vm.activeDescendant ==
                                                  item.id,
                                                expression:
                                                  "\n                  activeDescendant == item.id\n                ",
                                                arg: "aria-selected",
                                                modifiers: {
                                                  removeonfalse: true
                                                }
                                              }
                                            ],
                                            key: item.value,
                                            class: {
                                              focused:
                                                _vm.activeDescendant == item.id
                                            },
                                            attrs: {
                                              id: item.id,
                                              role: "option"
                                            },
                                            on: {
                                              mouseup: function($event) {
                                                return _vm.focusItem(item)
                                              }
                                            }
                                          },
                                          [
                                            _vm._v(
                                              "\n                " +
                                                _vm._s(item.text) +
                                                "\n              "
                                            )
                                          ]
                                        )
                                      }),
                                      0
                                    )
                                  ]
                                )
                              ]
                            }
                          }
                        ],
                        null,
                        true
                      )
                    })
                  ]
                }
              }
            ])
          })
        ],
        1
      )
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-37fc24e6_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**:focus {\n  outline: 3px blue solid !important;\n}*/\n.allyop-select__listbox-area {\n  width: 100%;\n  position: relative;\n}\n.allyop-select {\n  box-sizing: border-box;\n}\n.allyop-select * {\n  box-sizing: inherit;\n}\n.allyop-select .allyop-select__button {\n  max-width: 100%;\n  width: 100%;\n  min-height: 1em;\n}\n.allyop-select [role=\"listbox\"] {\n  min-height: 1em;\n  padding: 0;\n  background: white;\n  border: 1px solid #aaa;\n}\n.allyop-select [role=\"option\"] {\n  display: block;\n  padding: 0 0 0 1.5em;\n  position: relative;\n  line-height: 1.8em;\n}\n.allyop-select [role=\"option\"].focused {\n  background: #bde4ff;\n}\n.allyop-select [role=\"option\"][aria-selected=\"true\"]::before {\n  content: \"⇨\";\n  position: absolute;\n  left: 0.5em;\n}\n.allyop-select button {\n  font-size: 16px;\n  width: 100%;\n}\n.allyop-select__button {\n  border-radius: 0;\n  font-size: 16px;\n  text-align: left;\n  padding: 5px 10px;\n  width: 150px;\n  position: relative;\n}\n.allyop-select__list {\n  border: 0;\n  max-height: 10em;\n  overflow-y: auto;\n  position: absolute;\n  margin: 0;\n  width: 100%;\n}\n.hidden {\n  display: none;\n}\n.offscreen {\n  clip: rect(1px 1px 1px 1px);\n  clip: rect(1px, 1px, 1px, 1px);\n  font-size: 14px;\n  height: 1px;\n  overflow: hidden;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n}\n", map: {"version":3,"sources":["/home/zirror/coding/component-library-test/library-test/src/components/allyop-select.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAmMA;;EAEA;AACA;EACA,WAAA;EACA,kBAAA;AACA;AAEA;EACA,sBAAA;AACA;AAEA;EACA,mBAAA;AACA;AAEA;EACA,eAAA;EACA,WAAA;EACA,eAAA;AACA;AAEA;EACA,eAAA;EACA,UAAA;EACA,iBAAA;EACA,sBAAA;AACA;AAEA;EACA,cAAA;EACA,oBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AAEA;EACA,mBAAA;AACA;AAEA;EACA,YAAA;EACA,kBAAA;EACA,WAAA;AACA;AAEA;EACA,eAAA;EACA,WAAA;AACA;AAEA;EACA,gBAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;EACA,YAAA;EACA,kBAAA;AACA;AAEA;EACA,SAAA;EACA,gBAAA;EACA,gBAAA;EACA,kBAAA;EACA,SAAA;EACA,WAAA;AACA;AAEA;EACA,aAAA;AACA;AACA;EACA,2BAAA;EACA,8BAAA;EACA,eAAA;EACA,WAAA;EACA,gBAAA;EACA,kBAAA;EACA,mBAAA;EACA,UAAA;AACA","file":"allyop-select.vue","sourcesContent":["<template>\n  <div class=\"allyop-select\">\n    <div class=\"allyop-select__listbox-area\">\n      <div>\n        <span :id=\"labelId\">{{ label }}</span>\n        <base-roving-focus\n          #default=\"{lstn}\"\n          :items=\"innerItems\"\n          :activeElementId.sync=\"activeDescendant\"\n          @up=\"expandedListShown = true\"\n          @down=\"expandedListShown = true\"\n          @enter=\"toggleShown\"\n          @escape=\"collapse\"\n        >\n          <base-keystroke-filter\n            @filter=\"focusItemByText\"\n            #default=\"{listners}\"\n          >\n            <div id=\"exp_wrapper\" v-on=\"{ ...lstn, ...listners }\">\n              <button\n                aria-haspopup=\"listbox\"\n                :aria-labelledby=\"labelId + ' ' + buttonId\"\n                :id=\"buttonId\"\n                type=\"button\"\n                ref=\"mainbutton\"\n                @mouseup=\"toggleShown\"\n                v-attribute-helper:aria-expanded.removeonfalse=\"\n                  expandedListShown\n                \"\n                class=\"allyop-select__button\"\n                v-text=\"buttonText\"\n              ></button>\n              <ul\n                ref=\"listbox\"\n                :id=\"listboxId\"\n                tabindex=\"-1\"\n                v-prevent-keys=\"['ArrowUp', 'ArrowDown']\"\n                @blur=\"collapse(false)\"\n                class=\"allyop-select__list\"\n                role=\"listbox\"\n                v-attribute-helper:aria-activedescendant.removeonfalse=\"\n                  activeDescendant\n                \"\n                :aria-labelledby=\"labelId\"\n                :class=\"listClasses\"\n              >\n                <li\n                  v-for=\"item in innerItems\"\n                  :key=\"item.value\"\n                  :id=\"item.id\"\n                  v-attribute-helper:aria-selected.removeonfalse=\"\n                    activeDescendant == item.id\n                  \"\n                  role=\"option\"\n                  :class=\"{ focused: activeDescendant == item.id }\"\n                  @mouseup=\"focusItem(item)\"\n                >\n                  {{ item.text }}\n                </li>\n              </ul>\n            </div>\n          </base-keystroke-filter>\n        </base-roving-focus>\n      </div>\n    </div>\n  </div>\n</template>\n<script lang=\"ts\">\nimport Vue from \"vue\";\nimport attributeHelper from \"../directives/attribute-helper\";\nimport preventKeys from \"../directives/prevent-keys\";\nimport IdGeneratorMixin from \"../mixins/id-generator\";\nimport BaseRovingFocus from \"./base/base-roving-focus.vue\";\nimport BaseKeystrokeFilter from \"./base/base-keystroke-filter.vue\";\n\nexport type allySelectItem = {\n  text: string;\n  value: string;\n};\n\nfunction elementHasToScroll(ele: Element): boolean {\n  return ele.scrollHeight > ele.clientHeight;\n}\n\nexport default Vue.extend(IdGeneratorMixin).extend({\n  name: \"allyop-select\",\n  components: {\n    BaseRovingFocus,\n    BaseKeystrokeFilter,\n  },\n  props: {\n    label: {\n      type: String,\n      required: true,\n    },\n    nonSelectedText: {\n      type: String,\n      default: \"Bitte Auswahl treffen\",\n    },\n    items: {\n      type: Array as () => Array<allySelectItem>,\n      default: [],\n    },\n  },\n  methods: {\n    toggleShown(event: any) {\n      if (!this.expandedListShown) {\n        this.show();\n      } else if (this.expandedListShown) {\n        this.collapse();\n      }\n    },\n    focusItemByText(text: string | null) {\n      if (text != null && text.length > 0) {\n        const filteredItems = this.innerItems.filter((x) =>\n          x.text.toLowerCase().startsWith(text.toLowerCase())\n        );\n        if (filteredItems[0]) {\n          this.focusItem(filteredItems[0]);\n        }\n      }\n    },\n    focusItem(item: allySelectItem & { id: string }) {\n      this.activeDescendant = item.id;\n    },\n    show(): void {\n      if (!this.expandedListShown) {\n        this.expandedListShown = true;\n        Vue.nextTick(() => (this.$refs.listbox as HTMLUListElement).focus());\n      }\n    },\n    collapse(focusButton = true): void {\n      if (this.expandedListShown) {\n        this.expandedListShown = false;\n        if (focusButton) {\n          Vue.nextTick(() =>\n            (this.$refs.mainbutton as HTMLUListElement).focus()\n          );\n        }\n      }\n    },\n    getCalculatedId(item: allySelectItem) {\n      return this.keyPrefix + item.value;\n    },\n  },\n  data() {\n    return {\n      expandedListShown: false,\n      buttonId: this.getId(),\n      labelId: this.getId(),\n      keyPrefix: this.getId(),\n      listboxId: this.getId(),\n      buttonText: this.nonSelectedText,\n      activeDescendant: null as string | null,\n    };\n  },\n  watch: {\n    activeDescendant(id: string): void {\n      const activeElement = document.getElementById(id)!;\n      const listbox = this.$refs[\"listbox\"]! as Element;\n      if (elementHasToScroll(listbox)) {\n        var scrollBottom = listbox.clientHeight + listbox.scrollTop;\n        var elementBottom =\n          activeElement.offsetTop + activeElement.offsetHeight;\n        if (elementBottom > scrollBottom) {\n          listbox.scrollTop = elementBottom - listbox.clientHeight;\n        } else if (activeElement.offsetTop < listbox.scrollTop) {\n          listbox.scrollTop = activeElement.offsetTop;\n        }\n      }\n      if (id) {\n        this.buttonText = this.innerItems.find((x) => x.id == id).text;\n        return;\n      }\n      this.buttonText == this.nonSelectedText;\n    },\n  },\n  directives: {\n    attributeHelper,\n    preventKeys,\n  },\n  computed: {\n    listClasses(): Record<string, boolean> {\n      return {\n        hidden: !this.expandedListShown,\n      };\n    },\n    innerItems(): Array<any> {\n      return this.items.map((x) => ({ ...x, id: this.getCalculatedId(x) }));\n    },\n  },\n});\n</script>\n\n<style>\n/**:focus {\n  outline: 3px blue solid !important;\n}*/\n.allyop-select__listbox-area {\n  width: 100%;\n  position: relative;\n}\n\n.allyop-select {\n  box-sizing: border-box;\n}\n\n.allyop-select * {\n  box-sizing: inherit;\n}\n\n.allyop-select .allyop-select__button {\n  max-width: 100%;\n  width: 100%;\n  min-height: 1em;\n}\n\n.allyop-select [role=\"listbox\"] {\n  min-height: 1em;\n  padding: 0;\n  background: white;\n  border: 1px solid #aaa;\n}\n\n.allyop-select [role=\"option\"] {\n  display: block;\n  padding: 0 0 0 1.5em;\n  position: relative;\n  line-height: 1.8em;\n}\n\n.allyop-select [role=\"option\"].focused {\n  background: #bde4ff;\n}\n\n.allyop-select [role=\"option\"][aria-selected=\"true\"]::before {\n  content: \"⇨\";\n  position: absolute;\n  left: 0.5em;\n}\n\n.allyop-select button {\n  font-size: 16px;\n  width: 100%;\n}\n\n.allyop-select__button {\n  border-radius: 0;\n  font-size: 16px;\n  text-align: left;\n  padding: 5px 10px;\n  width: 150px;\n  position: relative;\n}\n\n.allyop-select__list {\n  border: 0;\n  max-height: 10em;\n  overflow-y: auto;\n  position: absolute;\n  margin: 0;\n  width: 100%;\n}\n\n.hidden {\n  display: none;\n}\n.offscreen {\n  clip: rect(1px 1px 1px 1px);\n  clip: rect(1px, 1px, 1px, 1px);\n  font-size: 14px;\n  height: 1px;\n  overflow: hidden;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

const AllyopSelect = __vue_component__$2;

export { AllyopSelect };
