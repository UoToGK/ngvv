

export type DyNullableInput = string | null | undefined;
export type DyBooleanInput = boolean | DyNullableInput;

export function convertToBoolProperty(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();

    return (val === 'true' || val === '');
  }

  return !!val;
}

export function getElementHeight(el) {
  /**
   *
   * TODO: Move helpers in separate common module.
   * TODO: Provide window through di token.
   * */
  const style = window.getComputedStyle(el);
  const marginTop = parseInt(style.getPropertyValue('margin-top'), 10);
  const marginBottom = parseInt(style.getPropertyValue('margin-bottom'), 10);
  return el.offsetHeight + marginTop + marginBottom;
}

export function firstChildNotComment(node: Node) {
  const children = Array
    .from(node.childNodes)
    .filter((child: Node) => child.nodeType !== Node.COMMENT_NODE);
  return children[0];
}

export function lastChildNotComment(node: Node) {
  const children = Array
    .from(node.childNodes)
    .filter((child: Node) => child.nodeType !== Node.COMMENT_NODE);
  return children[children.length - 1];
}
