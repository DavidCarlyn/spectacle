/****************************************************** 
 * global.js
 * Main script for handling drawing
 * 
 * TODO: Fix height calculation for containers (look at max height)
 * TODO: Fix on click for leaf nodes
 * TODO: Fix coloring (pick good colors)
 * TODO: Add Text to rects (Conv2d, ReLU, etc.)
*******************************************************/


/****************************************************** 
 * Global Variables
*******************************************************/
//! GLOBAL CONSTANTS
const SVG_ID = "network";
const LOADING_PATH = "loading.gif";
const DESIGNS = {
    ARCHITECTURE: 'architecture',
    CONV2D: 'conv2d',
    BATCHNORM2D: 'batchnorm2d',
    LINEAR: 'linear',
    INVALID: 'invalid'
};

const FONT_SIZE = 14;
const LEAF_PADDING = 10;
const CONTAINER_PADDING = 20;
const NODE_DISTANCE = 50;

//! GLOBAL VARS
let currentDesign = DESIGNS.ARCHITECTURE;

/****************************************************** 
 * Functions
*******************************************************/

//! Main Draw Function
function draw(elementData) {
    //! Clear Area
    clear()

    switch (currentDesign) {
        case DESIGNS.ARCHITECTURE:
            drawArchitecture();
            break;
        case DESIGNS.CONV2D:
            console.log(currentDesign + ' design not implemented');
            break;
        case DESIGNS.BATCHNORM2D:
            console.log(currentDesign + ' design not implemented');
            break;
        case DESIGNS.LINEAR:
            console.log(currentDesign + ' design not implemented');
            break;
        default:
            console.log('current design is not valid!');
    }

}

//! Main Design Draw Functions

async function drawArchitecture() {

    //Toggle Loading Image
    toggleLoadingImage();
    
    //! Obtaining data
    data = await getData();
    let containers = data[0]
    let leaves = data[1]
    
    //Toggle Loading Image
    toggleLoadingImage();

    // ! Initialize Draw Area
    var height = screen.height * .8;
    var width = screen.width;

    console.log(containers[0])

    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", containers[0].drawVars.width)
        .attr("height", containers[0].drawVars.height);


    // Draw Containers
    svg.selectAll("rect_containers")
        .data(containers)
        .enter().append("rect")
        .style("stroke", "gray")
        .style("fill", "#080808")
        .attr("height", (d, i) => d.drawVars.height)
        .attr("width",(d, i) => d.drawVars.width)
        .attr("x", (d, i) => d.drawVars.x)
        .attr("y", (d, i) => d.drawVars.y)
        .append("title").text((d, i) => d.name);
    
    // Draw Leaves
    svg.selectAll("rect_leaves")
        .data(leaves)
        .enter().append("rect")
        .style("stroke", "gray")
        .style("fill", "red")
        .attr("height", (d, i) => d.drawVars.height)
        .attr("width",(d, i) => d.drawVars.width)
        .attr("x", (d, i) => d.drawVars.x)
        .attr("y", (d, i) => d.drawVars.y)
        .append("title").text((d, i) => d.name)
        .on('click', (htmlEle, d) => {
            console.log(d)
            currentDesign = getDesignFromString(d.name);
            if (currentDesign === DESIGNS.INVALID) {
                currentDesign = DESIGNS.ARCHITECTURE;
            } else {
                draw(d);
            }
        });

}

//! Helper Functions

// Get Design Enum from String
function getDesignFromString(name) {
    switch (name) {
        case 'Conv2d':
            return DESIGNS.CONV2D
        case 'BatchNorm2d':
            return DESIGNS.BATCHNORM2D
        case 'Linear':
            return DESIGNS.LINEAR
        case 'Architecture':
            return DESIGNS.ARCHITECTURE
        default:
            return DESIGNS.INVALID
    }
}

// Toggle loading image
function toggleLoadingImage() {
    const LOADING_ID = "loading_image";
    loadingElement = document.getElementById(LOADING_ID);

    if (loadingElement === null) {
        loadingElement = document.createElement("img");
        loadingElement.id = LOADING_ID
        loadingElement.src = LOADING_PATH;
        loadingElement.height = 200;
        loadingElement.width = 200;
        document.getElementById(SVG_ID).prepend(loadingElement);
    } else {
        loadingElement.remove();
    }

}

// Calculate the positional & size variables for each node
function calcDrawVars(node, position) {
    node.drawVars = {
        x : position.x,
        y : position.y
    }

    nextPosition = {
        x : position.x,
        y : position.y
    }
    width = 0
    height = 0
    if (node.children.length > 0) {
        nextPosition.x += CONTAINER_PADDING
        nextPosition.y += CONTAINER_PADDING
        maxHeight = 0
        // Cycle through children
        node.children.forEach(child => {
            calcDrawVars(child, nextPosition) // Recursion
            nextPosition.x = NODE_DISTANCE + child.drawVars.x + child.drawVars.width
            maxHeight = child.drawVars.height > maxHeight ? child.drawVars.height : maxHeight
        });

        height = CONTAINER_PADDING * 2 + maxHeight;
        nextPosition.x -= NODE_DISTANCE
        nextPosition.x += CONTAINER_PADDING
        nextPosition.y -= CONTAINER_PADDING
        width = nextPosition.x - node.drawVars.x
    } else {
        width = LEAF_PADDING * 2 + node.name.length * FONT_SIZE
        height = LEAF_PADDING * 2 + FONT_SIZE
    }

    node.drawVars.width = width
    node.drawVars.height = height
}

// Obtaining Data & Cleaning it
async function getData() {
    var leaves = []
    var containers = []
    // Load Data
    let data = await d3.json("resnet18_weights.json");

    // Calculate Draw Variables
    console.log("Calculating Draw Variables")
    calcDrawVars(data, { x: 0, y: 0 })
    console.log("Finished Calculating Draw Variables")

    // Bredth-First Traversal
    containers.push(data)
    var stackOuter = [...data.children]
    while (stackOuter.length > 0) {
        var stackInner = [...stackOuter]
        stackOuter = []
        while (stackInner.length > 0) {
            node = stackInner.shift() // pop from front
            if (node.children.length > 0) {
                stackOuter.push(...node.children)
                containers.push(node)
            } else {
                leaves.push(node)
            }
        }
    }

    return [containers, leaves];
}

// Clear Draw Area
function clear() {
    drawArea = document.getElementById(SVG_ID);
    drawArea.innerHTML = ''; //TODO: optimize later
}

draw(null);