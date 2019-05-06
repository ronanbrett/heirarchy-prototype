import {
  LayoutWorkerParams,
  LayoutWorkerResult
} from '../interfaces/LayoutWorker';
import { expose } from 'comlinkjs';
import { stratify } from 'd3-hierarchy';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';
import { HeirarchyNodeWithLink, NodeItem } from '../interfaces/NodeType';

export class LayoutWorker {
  generateTreePositions({ node, NODE_HEIGHT, NODE_WIDTH }: LayoutWorkerParams) {
    node = stratify()
      .id((d: NodeItem) => d.id as string)
      .parentId((d: NodeItem) => d.parent as string)(node);

    const itemsWithPositions = {};
    const tempItems = {};

    let maxLeft = 0;
    let maxTop = 0;

    let leftOffset = 0;
    let topOffset = 0;

    let previousNode: HeirarchyNodeWithLink;

    console.log(node);

    node.eachBefore((currentNode: HeirarchyNodeWithLink) => {
      // If the Previous Node is not the Parent Node and the Parent Node of the Current Node
      // is not a Child Node, move the left offset over by one NODE_WIDTH
      if (
        previousNode &&
        previousNode.id !== currentNode.parent.id &&
        currentNode.parent.data.type !== ISNodeType.child
      ) {
        leftOffset = leftOffset + NODE_WIDTH;
        topOffset = tempItems[currentNode.parent.id].top + NODE_HEIGHT;
      }

      // If the Current Node is a Child and the Previous Node was also a child and
      // the last item depth was less or equal to the current item, then we move this node
      // directly under the last item to create a series of child nodes in a line
      if (
        (currentNode.data.type === ISNodeType.child &&
          previousNode.data.type === ISNodeType.child &&
          previousNode.depth <= currentNode.depth) ||
        (currentNode.data.type === ISNodeType.child &&
          previousNode.data.type === ISNodeType.draft &&
          previousNode.depth <= currentNode.depth + 1)
      ) {
        // add childParent to the currentNode here so that we can remap the connector nodes
        // to use childParent instead of the origin node to connect the child links
        currentNode.childParent = previousNode;
        leftOffset = previousNode.left;
        topOffset = previousNode.top + NODE_HEIGHT;
      }

      currentNode.top = topOffset;
      currentNode.left = leftOffset;

      tempItems[currentNode.id] = currentNode;

      maxLeft = Math.max(leftOffset, maxLeft);
      maxTop = Math.max(topOffset, maxTop);

      topOffset = topOffset + NODE_HEIGHT;

      previousNode = currentNode;
    });

    node.eachBefore(n => {
      itemsWithPositions[n.id] = { ...n };
    });

    return new Promise<LayoutWorkerResult>((res, rej) => {
      const result: LayoutWorkerResult = {
        pageHeight: maxTop + NODE_HEIGHT,
        pageWidth: maxLeft + NODE_WIDTH,
        links: node.links(),
        items: itemsWithPositions
      };
      res(result);
    });
  }
}

expose(LayoutWorker, self);
