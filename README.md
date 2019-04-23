# Tree Layout

## Requirements
- To create a visual representation of an investment structure
- Needs to be able to display potentially huge trees of hundreds of accounts and the links between them to their group accounts and parent group accounts
- Need to be able to attach an account to a group account
- Needs to be able to attach a group account to group account
- Need to be able to attach a [group account + account] to a group account
- Needs to be able to attach, connect, move, add & remove nodes.
----------
## Layout Tests

To test the current layout I created a randomly generated test tree with 700 nodes sized at 200px by 100px, with 25px horizontal spacing and 60px vertical spacing. 

 **Tree layout with spacing for child nodes**

![Structure with space for child nodes](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555950012901_image.png)

![Spaced structure test with 600 nodes](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555947939045_image.png)


Just to get to the second group account node in this layout you need to scroll across 48,750px or the equivalent of about 30 page lengths, to see the full tree the total page width is 114,750px or the equivalent of 71 page lengths - just to see one layer of the tree.

This makes real analysis / manipulation of the tree almost impossible - it’s just too big to be able to really comprehend what's going on and requires far too much scrolling (especially horizontal) to make your way around it.

 **Tree layout with packed spacing for child nodes**

![Packed Layout Structure](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555950335123_image.png)

![Packed structure test with 600 nodes](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555948559596_image.png)


This layout allows us to cut the page width to 32,731px or about 20 page lengths but it comes with sacrificing the users ability to understand both connections between parent + child but also how the accounts are structured. The connections become so overlapped it's quite difficult to work out what node belongs to what parent.

----------
## Issues
- The layout structures in both instances have their own critical flaws
- After a certain number of child nodes it becomes either difficult to navigate or difficult to comprehend what's going on.
        - The same issues occur in L-R layouts the same as T-B layouts - just on an inverted axis.
- There are also performance issues that start appearing around the 500 nodes mark, the browser has to manage not just the nodes but also the connections between them, as well as redrawing them all whenever the user makes changes to the tree.
    - We can optimise this to a certain extent but eventually in a large enough tree it will fail
----------
## Design Solutions

**Follow the tree layout from the original documents with child account nodes aligned to their parent and not branching horizontally**

![Original Structure from PT documents](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555955265515_image.png)

****
We follow the structure from the original documents that isn’t quite a standard tree. In this structure the grouped accounts still branch off like normal but the Accounts inside a group continue down in a straight line. 

This would solve some of the problems in the spaced out tree structure but I don’t think it would be a sufficient fix on it’s own in a large enough tree.


**Visually Collapse Group nodes**
We could collapse group accounts so they don’t automatically show the child accounts underneath them. This could be automatically determined based on how large the graph is or if a group has an unusually large amount of nodes relative to other nodes.


![Mockup of what an uncollapsed Group Account could look like](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555952722724_image.png)


**Alternative List View**
Create a new alternative view of the policy tree, so you can also view the tree as a list of indented expanding/collapsing accounts as well as the visualised tree structure.

![Mockup of a PT list view that would live alongside the Tree view](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555955120001_image.png)


This gives us a backup view if the tree is just too big to be easily manageable through a tree visualisation. But would also give us the option to let the user visualise the tree at any level from this view - so they could pick a deeper level of tree and visualise only that section or visualise it from the root and see the whole thing. This might be necessary for gigantic trees as there’s a limit to how far we can stretch the browser performance.

**Minimap**
We could create a minimap view of the PT so the user can easily move around the policy tree through a miniaturized abstract representation of the whole tree.

![](https://paper-attachments.dropbox.com/s_2BC684FB3C5CC5598B3BBDCF9C06F80D1314E168E8DAB6EA1519AA42D1A0AC87_1555956881776_image.png)


Which would make exploration of particularly long/wide trees a lot easier particularly if they have many groupings that can make it difficult to work out are there nodes above/below your current position.

**Alternative Tree Layout**
We could look at radial/circular based layouts in addition to the top-down/left-right layouts. It might make editing the graph more complicated but it would be easier to show a graph with a larger number of nodes in this format.

----------
## Potential Optimisation Solutions

**Canvas instead of HTML**
We could swap to using the canvas to visualise the tree instead of HTML - this has its own complications but it should theoretically give us greater performance as we could leverage the GPU for the layout as well as have some greater control over what and how we render.

**Web Workers**
We can offload the tree layout generation into a web worker, this takes the pressure off the main thread which will let us recalculate the graph’s layout on changes much faster. However it won’t have much of an impact on the actual layout redraw - which is where most of the performance killer will come from in larger trees.

**Virtual Scrolling**
We could try and implement virtual rendering - so the browser only creates what is currently on screen, however given the structure of the tree can potentially be huge with nodes connecting over huge distances - this will probably be of only limited benefit as we will still have to render the connections even while the nodes themselves are disappearing. This would also be very complex to code.

----------
## Recommendations
[x] DESIGN - Use original tree structure
[ ] DESIGN - Visually collapse nodes
[ ] DESIGN - Implement Minimap
[ ] OPTIMISATION - Implement Web Workers


## Results

**Original Tree Structure**
Created a layout algorithm that allows branching on any group node but will align any child account under another child account

After talking to Marion, she indicated that they might want to allow a Group Account to be able to hold both Child Accounts and Child Group Accounts, so I made it so it’s able to support this.


- 500 nodes rendered in 5940 x 5030px!
- Tree is significantly compressed as now branching only occurs below Root/Group Accounts.

