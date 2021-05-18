import ElementWrapper from "./ElementWrapper"
import TextWrapper from "./TextWrapper"
import Component from "./Component"

const ToyReact = {
  Component,
  createElement: (type, attr, ...children) => {
    let el;
    if (typeof type === "string") {
      el = new ElementWrapper(type);
    } else {
      el = new type(attr);
    }

    for (const name in attr) {
      el.setAttribute(name, attr[name]);
    }

    const insertChildren = (children) => {
      for (const child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child);
        } else {
          if (child === null || child === void 0) {
            child = "";
          }
          if (
            !(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)
          ) {
            child = String(child);
          }
          if (typeof child === "string") {
            child = new TextWrapper(child);
          }
          el.appendChild(child);
        }
      }
    };
    insertChildren(children);
    return el;
  },
  render: (vdom, el) => {
    const range = document.createRange();
    if (el.children.length) {
      range.setStartAfter(el.lastChild);
      range.setEndAfter(el.lastChild);
    } else {
      range.setStart(el, 0);
      range.setEnd(el, 0);
    }
    vdom.mountTo(range);
  },
};

export default ToyReact;
