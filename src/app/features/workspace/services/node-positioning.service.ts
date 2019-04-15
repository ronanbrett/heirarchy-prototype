import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { stratify, HierarchyLink } from 'd3-hierarchy';

let ID = 50;

export enum NodeType {
  empty,
  active,
  root,
}

export interface GridItem {
  id: number;
  children: NodeItem[];
}

export interface NodeItem {
  id: string;
  parent: string;
  type: NodeType;
}

export interface Heirarchy {
  items: NodeItem[];
  graph: {};
  maxCols: number;
  maxDepth: number;
  links: any;
}

export const NODE_ITEMS: NodeItem[] = [
  {
    id: 'id-0',
    parent: null,
    type: NodeType.root,
  },
  {
    id: 'id-1',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-2',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-3',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-4',
    parent: 'id-1',
    type: NodeType.active,
  },
  {
    id: 'id-9',
    parent: 'id-4',
    type: NodeType.active,
  },
  {
    id: 'id-5',
    parent: 'id-1',
    type: NodeType.active,
  },
  {
    id: 'id-6',
    parent: 'id-2',
    type: NodeType.active,
  },
  {
    id: 'id-7',
    parent: 'id-3',
    type: NodeType.active,
  },
  {
    id: 'id-8',
    parent: 'id-5',
    type: NodeType.active,
  },
  {
    id: 'id-10',
    parent: 'id-9',
    type: NodeType.active,
  },
  {
    id: 'id-11',
    parent: 'id-9',
    type: NodeType.active,
  },
  {
    id: 'id-36',
    parent: 'id-2',
    type: NodeType.active,
  },
  {
    id: 'id-1433',
    parent: 'id-36',
    type: NodeType.active,
  },
  {
    id: 'id-113',
    parent: 'id-3',
    type: NodeType.active,
  },
];

@Injectable()
export class NodePositioningService {
  locations$: BehaviorSubject<any> = new BehaviorSubject({});
  heirarchy$: BehaviorSubject<Heirarchy> = new BehaviorSubject(null);
  grid$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    const heirarchy = this.buildHierarchy(NODE_ITEMS);
    const grid = this.generateGrid(heirarchy);
    this.heirarchy$.next(heirarchy);
    this.grid$.next(grid);
  }

  addTempNode(previousId: string) {
    const items = [
      { id: `id-${ID++}`, parent: previousId, type: NodeType.empty },
      ...NODE_ITEMS,
    ];
    const heirarchy = this.buildHierarchy(items);
    const grid = this.generateGrid(heirarchy);
    this.heirarchy$.next(heirarchy);
    this.grid$.next(grid);
  }

  removeTempNode() {
    const items = NODE_ITEMS;
    const heirarchy = this.buildHierarchy(items);
    this.heirarchy$.next(heirarchy);
    const grid = this.generateGrid(heirarchy);
    this.grid$.next(grid);
  }

  buildHierarchy(nodeList: NodeItem[]): Heirarchy {
    const roots = stratify()
      .id((d: NodeItem) => d.id as string)
      .parentId((d: NodeItem) => d.parent as string)(nodeList);

    const links = roots.links().reduce((accum, val) => {
      const prevArray = accum[val.source.id] || [];
      const vals = [...prevArray, val];
      return Object.assign({}, accum, { [val.source.id]: vals });
    }, {});

    return {
      items: nodeList,
      links,
      graph: this.generateTree(roots),
      maxCols: roots.children.length,
      maxDepth: roots.height,
    };
  }

  generateGrid(heirarchy: Heirarchy) {
    let grid = [];

    let cellCount = heirarchy.maxDepth * heirarchy.maxCols;
    const remainder = cellCount % heirarchy.maxCols;

    cellCount =
      remainder === 0
        ? cellCount + heirarchy.maxCols
        : cellCount + heirarchy.maxCols + remainder;

    let row = 0;
    let col = 0;

    for (let i = 0; i <= cellCount - 1; i++) {
      if (i % heirarchy.maxCols === 0) {
        row++;
      }

      grid = [...grid, { index: i, row: row - 1, col: col++ }];

      if (col === heirarchy.maxCols) {
        col = 0;
      }
    }

    return grid;
  }

  generateTree(graph: any) {
    const roots = {};

    const generate = (rootNode, rootIndex, nextNode?) => {
      if (!nextNode) {
        roots[rootIndex] = rootNode.data;
      }

      if (rootNode && rootNode.children) {
        roots[rootIndex].items = [rootNode.children.map(x => x.data)];

        rootNode.children.forEach(node => {
          generate(null, rootIndex, node);
        });
      }
      if (nextNode && nextNode.children) {
        const depth = nextNode.depth - 1;
        const prevItems = roots[rootIndex].items[depth] || [];

        roots[rootIndex].items[depth] = [
          ...prevItems,
          ...nextNode.children.map(x => x.data),
        ];

        nextNode.children.forEach(node => {
          generate(null, rootIndex, node);
        });
      }
    };

    graph.children.forEach((node, index) => {
      generate(node, index);
    });

    return roots;
  }

  setPosition(id: string, position: any) {
    const location = this.locations$.getValue();
    location[id] = position;
    this.locations$.next(location);
  }
}
