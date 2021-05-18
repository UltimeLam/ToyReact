const childrenSymbol = Symbol("children");

class ElementWrapper {
  constructor(type) {
    this.type = type;
    this.props = Object.create(null);
    this[childrenSymbol] = [];
    this.children = [];
  }
  get vdom() {
    return this;
  }
  // 虚拟dom操作
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(vchild) {
    this[childrenSymbol].push(vchild);
    this.children.push(vchild.vdom);
  }
  // 实体dom操作
  mountTo(range) {
    this.range = range;

    if (!this.endRange) {
      this.endRange = document.createRange();
      this.endRange.setStart(range.endContainer, range.endOffset);
      this.endRange.setEnd(range.endContainer, range.endOffset);
      this.endRange.insertNode(document.createComment(""));
    } else {
      this.endRange.setStart(range.endContainer, range.endOffset);
      this.endRange.setEnd(range.endContainer, range.endOffset);
    }

    range.deleteContents();
    const el = document.createElement(this.type);

    for (const name in this.props) {
      const value = this.props[name];
      if (name.startsWith("on")) {
        const eventName = name.replace(/^on[\s\S]/, (s) =>
          s.substr(2).toLocaleLowerCase()
        );
        el.addEventListener(eventName, value);
      }
      el.setAttribute(name, value);
    }

    for (const child of this.children) {
      const range = document.createRange();
      if (el.children.length) {
        range.setStartAfter(el.lastChild);
        range.setEndAfter(el.lastChild);
      } else {
        range.setStart(el, 0);
        range.setEnd(el, 0);
      }
      child.mountTo(range);
    }

    range.insertNode(el);
  }
}

export default ElementWrapper;
