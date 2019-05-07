import { ISNodeType } from './is-node.model';

let NODE_COUNT = 1;
let TEMP_LIST = [];
const ID = 99999;

function generateTree() {
  if (TEMP_LIST.length === 0) {
    return TEMP_LIST.push({
      id: 'id-0',
      parent: null,
      type: ISNodeType.root
    });
  }
  if (NODE_COUNT < 20) {
    return TEMP_LIST.push({
      id: `id-${NODE_COUNT++}`,
      parent: `${TEMP_LIST[Math.floor(Math.random() * TEMP_LIST.length)].id}`,
      type: ISNodeType.group
    });
  }

  TEMP_LIST.push({
    id: `id-${NODE_COUNT++}`,
    parent: `${TEMP_LIST[Math.floor(Math.random() * 20)].id}`,
    type: ISNodeType.child
  });
}

export function generateInitialTreeState(): any {
  TEMP_LIST = [];
  NODE_COUNT = 1;
  for (let index = 0; index <= 150; index++) {
    generateTree();
  }

  return TEMP_LIST;
}
