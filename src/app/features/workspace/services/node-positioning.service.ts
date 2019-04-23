import { BlockScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { stratify } from 'd3-hierarchy';
import { BehaviorSubject } from 'rxjs';
import { Heirarchy, NodeItem, NodeType } from '../interfaces/NodeType';

let ID = 999;

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
    id: 'id-33',
    parent: 'id-1',
    type: NodeType.active,
  },
  {
    id: 'id-34',
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
    id: 'id-14',
    parent: 'id-10',
    type: NodeType.active,
  },
  {
    id: 'id-15',
    parent: 'id-14',
    type: NodeType.active,
  },
  {
    id: 'id-16',
    parent: 'id-15',
    type: NodeType.active,
  },
  {
    id: 'id-17',
    parent: 'id-16',
    type: NodeType.active,
  },
  {
    id: 'id-18',
    parent: 'id-17',
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
  TEMP_LIST.push({
    id: `id-${NODE_COUNT++}`,
    parent: `${TEMP_LIST[Math.floor(Math.random() * TEMP_LIST.length)].id}`,
    type: NodeType.active,
  });
}

@Injectable()
export class NodePositioningService {
  items = NODE_ITEMS;

  locations$: BehaviorSubject<any> = new BehaviorSubject({});
  heirarchy$: BehaviorSubject<Heirarchy> = new BehaviorSubject(null);
  grid$: BehaviorSubject<any> = new BehaviorSubject(null);

  blockScrollStrategy = new BlockScrollStrategy(this.viewPortRuler, document);

  constructor(private viewPortRuler: ViewportRuler) {
    for (let index = 0; index < 600; index++) {
      generateTree();
    }

    this.items = TEMP_LIST;

    const heirarchy = this.buildHierarchy(this.items);
    const grid = this.generateGrid(heirarchy);
    this.heirarchy$.next(heirarchy);
    this.grid$.next(grid);
  }

  addTempNode(previousId: string) {
    // Block Scroll On Layout Recreation
    this.blockScrollStrategy.enable();
    const items = [
      { id: `id-${ID++}`, parent: previousId, type: NodeType.empty },
      ...this.items,
    ];

    const heirarchy = this.buildHierarchy(items);
    const grid = this.generateGrid(heirarchy);
    this.heirarchy$.next(heirarchy);
    this.grid$.next(grid);
  }

  removeTempNode() {
    const items = this.items;
    const heirarchy = this.buildHierarchy(items);
    this.heirarchy$.next(heirarchy);
    const grid = this.generateGrid(heirarchy);
    this.grid$.next(grid);
    this.blockScrollStrategy.disable();
  }

  buildHierarchy(nodeList: NodeItem[]): Heirarchy {
    const roots = stratify()
      .id((d: NodeItem) => d.id as string)
      .parentId((d: NodeItem) => d.parent as string)(nodeList);

    console.log(roots);

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
