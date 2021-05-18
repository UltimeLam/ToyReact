const isSameNode = (node1, node2) => {
  if (node1.type !== node2.type) {
    return false;
  }
  if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
    return false;
  }
  for (const name in node1.props) {
    // if (
    //   typeof node1.props[name] === "function" &&
    //   typeof node2.props[name] === "function" &&
    //   node1.props[name].toString() === node2.props[name].toString()
    // ) {
    //   continue;
    // }
    if (
      typeof node1.props[name] === "object" &&
      typeof node2.props[name] === "object" &&
      JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])
    ) {
      continue;
    }
    if (node1.props[name] !== node2.props[name]) {
      return false;
    }
  }
  return true;
};

const isSameTree = (node1, node2) => {
  if (!isSameNode(node1, node2)) {
    return false;
  }
  if (node1.children.length !== node2.children.length) {
    return false;
  }
  for (let i = 0, l = node1.children.length; i < l; i++) {
    if (!isSameTree(node1.children[i], node2.children[i])) {
      return false;
    }
  }
  return true;
};

const replaceTree = (oldTree, newTree) => {
  if (isSameTree(oldTree, newTree)) {
    return;
  }
  if (!isSameNode(oldTree, newTree)) {
    newTree.mountTo(oldTree.range);
  } else {
    for (let i = 0, l = newTree.children.length; i < l; i++) {
      if (oldTree.children[i]) {
        replaceTree(oldTree.children[i], newTree.children[i]);
      } else {
        newTree.mountTo(oldTree.range);
      }
    }
  }
};

const merge = (oldState, newState) => {
  for (const i in newState) {
    if (typeof newState[i] === "object" && newState[i] !== null) {
      if (typeof oldState[i] !== "object") {
        if (newState[i] instanceof Array) {
          oldState[i] = [];
        } else {
          oldState[i] = {};
        }
      }
      merge(oldState[i], newState[i]);
    } else {
      oldState[i] = newState[i];
    }
  }
};

class Component {
  constructor() {
    this.children = [];
    this.props = Object.create(null);
    this.state = Object.create(null);
  }
  get type() {
    return this.constructor.name;
  }
  get vdom() {
    return this.render().vdom;
  }
  setAttribute(name, value) {
    this.props[name] = value;
    this[name] = value;
  }
  appendChild(vchild) {
    this.children.push(vchild);
  }
  mountTo(range) {
    this.range = range;
    this.update();
  }
  update() {
    const vdom = this.vdom;
    if (this.oldVdom) {
      replaceTree(this.oldVdom, vdom);
    } else {
      vdom.mountTo(this.range);
    }
    this.oldVdom = vdom;
  }
  setState(state) {
    merge(this.state, state);
    this.update();
  }
}

export default Component;
