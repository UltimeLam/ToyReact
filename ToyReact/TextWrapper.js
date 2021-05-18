class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
    this.type = "#text";
    this.children = [];
    this.props = Object.create(null);
  }
  get vdom() {
    return this;
  }
  mountTo(range) {
    this.range = range;
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export default TextWrapper;
