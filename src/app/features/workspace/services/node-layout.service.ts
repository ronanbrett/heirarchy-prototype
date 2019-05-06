import { BlockScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { stratify, HierarchyNode } from 'd3-hierarchy';
import { BehaviorSubject } from 'rxjs';
import { ISNodesQuery } from 'src/app/state/is-nodes/is-nodes.query';
import { HeirarchyNodeWithLink, NodeItem } from '../interfaces/NodeType';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';
let ID = 999;

@Injectable({
  providedIn: 'root'
})
export class NodeLayoutService {
  items;

  isOpen = {};

  items$: BehaviorSubject<any> = new BehaviorSubject([]);
  links$: BehaviorSubject<any> = new BehaviorSubject([]);

  blockScrollStrategy = new BlockScrollStrategy(this.viewPortRuler, document);

  NODE_WIDTH = 250;
  NODE_HEIGHT = 165;

  pageHeight: BehaviorSubject<number> = new BehaviorSubject(0);
  pageWidth: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private nodes: ISNodesQuery,
    private nodeService: IsNodesService,
    private viewPortRuler: ViewportRuler
  ) {
    this.nodes.selectAll().subscribe(n => {
      this.items = n;
      const roots = this.generateTree(n);
      this.generateTreePositions(roots);
    });
  }

  expandNode(id) {
    this.isOpen[id] = true;
    const roots = this.generateTree(this.items);
    this.generateTreePositions(roots);
  }

  createTempNode(previousId: string) {
    const items = [
      { id: `id-${ID++}`, parent: previousId, type: ISNodeType.draft },
      ...this.items
    ];

    const roots = this.generateTree(items);
    this.generateTreePositions(roots);
  }

  removeTempNode() {
    const roots = this.generateTree(this.items);
    this.generateTreePositions(roots);
  }

  confirmNode(parentId) {
    this.nodeService.add({
      id: `id-${ID++}`,
      parent: parentId,
      type: ISNodeType.child
    });
  }

  generateTree(items) {
    const root = stratify()
      .id((d: NodeItem) => d.id as string)
      .parentId((d: NodeItem) => d.parent as string)(items);
    return root;
  }

  collapse = d => {
    if (d.children && !this.isOpen[d.id]) {
      d._children = d.children;
      d.children = null;
    } else if (d._children && this.isOpen[d.id]) {
      d.children = d._children;
      d._children = null;
    }
  }

  generateTreePositions(node: any) {
    const itemsWithPositions = {};
    const tempItems = {};

    let maxLeft = 0;
    let maxTop = 0;

    let leftOffset = 0;
    let topOffset = 0;

    let previousNode: HeirarchyNodeWithLink;

    // Collapse Nodes
    // node.eachBefore((cNode: HeirarchyNodeWithLink) => {
    //   if (cNode.data.type === ISNodeType.group && cNode.children) {
    //     this.collapse(cNode);
    //   }
    // });

    node.eachBefore((currentNode: HeirarchyNodeWithLink) => {
      // If the Previous Node is not the Parent Node and the Parent Node of the Current Node
      // is not a Child Node, move the left offset over by one NODE_WIDTH
      if (
        previousNode &&
        previousNode.id !== currentNode.parent.id &&
        currentNode.parent.data.type !== ISNodeType.child
      ) {
        leftOffset = leftOffset + this.NODE_WIDTH;
        topOffset = tempItems[currentNode.parent.id].top + this.NODE_HEIGHT;
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

    console.log(node);

    this.links$.next(node.links());
    this.items$.next(itemsWithPositions);
  }
}
