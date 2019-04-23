import { Injectable } from '@angular/core';
import { NODE_ITEMS, HUGE_LIST } from '../data/workspace-node-list.const';
import { stratify, HierarchyNode, HierarchyLink, tree } from 'd3-hierarchy';
import {
  NodeItem,
  NodeType,
  HeirarchyNodeWithLink,
} from '../interfaces/NodeType';
import { BehaviorSubject } from 'rxjs';
import { BlockScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
let ID = 999;

const TEMP_LIST = [];
let NODE_COUNT = 1;
function generateTree() {
  if (TEMP_LIST.length === 0) {
    return TEMP_LIST.push({
      id: 'id-0',
      parent: null,
      type: NodeType.root,
    });
  }
  if (NODE_COUNT < 20) {
    return TEMP_LIST.push({
      id: `id-${NODE_COUNT++}`,
      parent: `${TEMP_LIST[Math.floor(Math.random() * TEMP_LIST.length)].id}`,
      type: NodeType.group,
    });
  }

  TEMP_LIST.push({
    id: `id-${NODE_COUNT++}`,
    parent: `${TEMP_LIST[Math.floor(Math.random() * 20)].id}`,
    type: NodeType.child,
  });
}

@Injectable({
  providedIn: 'root',
})
export class NodeLayoutService {
  items = NODE_ITEMS;

  items$: BehaviorSubject<any> = new BehaviorSubject([]);
  links$: BehaviorSubject<any> = new BehaviorSubject([]);

  blockScrollStrategy = new BlockScrollStrategy(this.viewPortRuler, document);

  NODE_WIDTH = 250;
  NODE_HEIGHT = 165;

  pageHeight: BehaviorSubject<number> = new BehaviorSubject(0);
  pageWidth: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private viewPortRuler: ViewportRuler) {
    for (let index = 0; index < 500; index++) {
      generateTree();
    }

    this.items = HUGE_LIST;

    const roots = this.generateTree(this.items);
    this.generateTreePositions(roots);
  }

  createTempNode(previousId: string) {
    const items = [
      { id: `id-${ID++}`, parent: previousId, type: NodeType.empty },
      ...this.items,
    ];

    const roots = this.generateTree(items);
    this.generateTreePositions(roots);
  }

  removeTempNode() {
    const roots = this.generateTree(this.items);
    this.generateTreePositions(roots);
  }

  generateTree(items) {
    const root = stratify()
      .id((d: NodeItem) => d.id as string)
      .parentId((d: NodeItem) => d.parent as string)(items);

    return root;
  }

  generateTreePositions(node: HierarchyNode<any>) {
    const itemsWithPositions = {};
    const tempItems = {};

    let maxLeft = 0;
    let maxTop = 0;

    let leftOffset = 0;
    let topOffset = 0;

    let previousNode: HeirarchyNodeWithLink;

    node.eachBefore((currentNode: HeirarchyNodeWithLink) => {
      // If the Previous Node is not the Parent Node and the Parent Node of the Current Node
      // is not a Child Node, move the left offset over by one NODE_WIDTH
      if (
        previousNode &&
        previousNode.id !== currentNode.parent.id &&
        currentNode.parent.data.type !== NodeType.child
      ) {
        leftOffset = leftOffset + this.NODE_WIDTH;
        topOffset = tempItems[currentNode.parent.id].top + this.NODE_HEIGHT;
      }

      // If the Current Node is a Child and the Previous Node was also a child and
      // the last item depth was less or equal to the current item, then we move this node
      // directly under the last item to create a series of child nodes in a line
      if (
        (currentNode.data.type === NodeType.child &&
          previousNode.data.type === NodeType.child &&
          previousNode.depth <= currentNode.depth) ||
        (currentNode.data.type === NodeType.child &&
          previousNode.data.type === NodeType.empty &&
          previousNode.depth <= currentNode.depth + 1)
      ) {
        // add childParent to the currentNode here so that we can remap the connector nodes
        // to use childParent instead of the origin node to connect the child links
        currentNode.childParent = previousNode;
        leftOffset = previousNode.left;
        topOffset = previousNode.top + this.NODE_HEIGHT;
      }

      currentNode.top = topOffset;
      currentNode.left = leftOffset;

      tempItems[currentNode.id] = currentNode;

      maxLeft = Math.max(leftOffset, maxLeft);
      maxTop = Math.max(topOffset, maxTop);

      topOffset = topOffset + this.NODE_HEIGHT;

      previousNode = currentNode;
    });

    // As the nodes are positioned absolutely, we need to manually set the page width/height
    // to be able to show them all
    this.pageHeight.next(maxTop + this.NODE_HEIGHT);
    this.pageWidth.next(maxLeft + this.NODE_WIDTH + 30);

    node.eachBefore(n => {
      itemsWithPositions[n.id] = { ...n };
    });

    this.links$.next(node.links());
    this.items$.next(itemsWithPositions);
  }
}
