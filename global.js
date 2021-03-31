/****************************************************** 
 * global.js
 * Main script for handling drawing
*******************************************************/


/****************************************************** 
 ****************************************************** 
 *!              Global Variables                     *
 ******************************************************
******************************************************/
//! CONSTANTS
const SVG_ID = "network";
const LOADING_PATH = "loading.gif";
const DESIGNS = {
    ARCHITECTURE: 'architecture',
    CONV2D: 'conv2d',
    BATCHNORM2D: 'batchnorm2d',
    LINEAR: 'linear',
    INVALID: 'invalid'
};

const ACTIVE_ID = 'active';
const TOOLTIP_ID = 'tooltip';
const LEAF_CLASS = 'leaf';
const CLICKABLE_CLASS = 'clickable';
const FONT_SIZE = 14;
const FONT_FAMILY = 'Arial';
const LEAF_PADDING = 10;
const CONTAINER_PADDING = 20;
const NODE_DISTANCE = 50;

//! VARS
let currentDesign = DESIGNS.ARCHITECTURE;

/****************************************************** 
 ****************************************************** 
 *!                  Functions                        *
 ******************************************************
******************************************************/

/****************************************************** 
 *!                Draw Functions                     *
******************************************************/

/****************************************************** 
 * Main function for handling our project and all
 * drawings
*******************************************************/
function draw(moduleData) {
    // Clear Area
    clear()

    switch (currentDesign) {
        case DESIGNS.ARCHITECTURE:
            drawArchitecture();
            break;
        case DESIGNS.CONV2D:
            drawConv2d(moduleData);
            break;
        case DESIGNS.BATCHNORM2D:
            drawBatchNorm2d(moduleData);
            break;
        case DESIGNS.LINEAR:
            drawLinear(moduleData);
            break;
        default:
            console.log('current design is not valid!');
    }

}

/****************************************************** 
 * Function for handling the batch normalization layer
 * drawing.
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawBatchNorm2d(data) {
    console.log(currentDesign + ' design not implemented');
}

/****************************************************** 
 * Function for handling the Linear layer drawing
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawLinear(data) {
    console.log(currentDesign + ' design not implemented');
}

/****************************************************** 
 * Function for handling the convolutional layer
 * drawing.
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawConv2d(data) {
    console.log(currentDesign + ' design not implemented');
}

/****************************************************** 
 * Function for handling the architectur drawing.
 * 
 * TODO: Center architecture
 * TODO: Draw arrows between modules
 * TODO: Center Text
 * TODO: Fix mouseover for leaves with text (highlight goes away)
*******************************************************/
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
        .style("stroke", "black")
        .style("fill", "#28282828")
        .attr("height", (d, i) => d.drawVars.height)
        .attr("width",(d, i) => d.drawVars.width)
        .attr("x", (d, i) => d.drawVars.x)
        .attr("y", (d, i) => d.drawVars.y)
        .append("title").text((d, i) => d.name);
    
    // Draw Leaves
    svg.selectAll("rect_leaves")
        .data(leaves)
        .enter().append("rect")
        .style("stroke", "black")
        .style("fill", "white")
        .attr("height", (d, i) => d.drawVars.height)
        .attr("width", (d, i) => d.drawVars.width)
        .attr("class", (d, i) => {
            var classes = LEAF_CLASS;
            if (getDesignFromString(d.name) !== DESIGNS.INVALID) {
                classes += " " + CLICKABLE_CLASS;
            }
            return classes
        })
        .attr("x", (d, i) => d.drawVars.x)
        .attr("y", (d, i) => d.drawVars.y)
        .on('click', (evt, d) => {
            currentDesign = getDesignFromString(d.name);
            if (currentDesign === DESIGNS.INVALID) {
                currentDesign = DESIGNS.ARCHITECTURE;
            } else {
                draw(d);
            }
        })
        .on('mouseover', (evt, d) => {
            evt.target.id = ACTIVE_ID;
            createToolTip(evt, d)
        })
        .on('mouseout', evt => {
            evt.target.id = '';
            removeToolTip()
        })
        .append("title").text((d, i) => d.name);

    // Draw Leaf text
    svg.selectAll("rect_leaf_text")
        .data(leaves)
        .enter().append("text")
        .attr("x", (d, i) => d.drawVars.x + LEAF_PADDING)
        .attr("y", (d, i) => d.drawVars.y + LEAF_PADDING + FONT_SIZE)
        .attr("font-size", FONT_SIZE + "px")
        .text((d, i) => d.name)

}

/****************************************************** 
 *!               Helper Functions                    *
******************************************************/

/****************************************************** 
 * TODO: Document
*******************************************************/
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

/****************************************************** 
 * TODO: Document
*******************************************************/
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

/****************************************************** 
 * TODO: Document
*******************************************************/
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
        var maxHeight = 0

        // Cycle through children
        node.children.forEach(child => {
            calcDrawVars(child, nextPosition) // Recursion
            let cHeight = child.drawVars.height
            nextPosition.x = NODE_DISTANCE + child.drawVars.x + child.drawVars.width
            maxHeight = cHeight > maxHeight ? cHeight : maxHeight
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

/****************************************************** 
 * TODO: Document
*******************************************************/
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

/****************************************************** 
 * TODO: Document
*******************************************************/
function createModuleToolTipDescription(d) {
    var text = "<strong>" + d.name + "</strong><br>";
    if (d.name == "Conv2d") {
        text += "Kernel Size: " + d.data.kernel_size.toString().replace(',', ' x ') + "<br>";
        text += "In Channels: " + d.data.in_channels + "<br>";
        text += "Out Channels: " + d.data.out_channels + "<br>";
        text += "Padding: " + d.data.padding.toString().replace(',', ' x ') + "<br>";
        text += "Stride: " + d.data.stride.toString().replace(',', ' x ') + "<br>";
    } else if (d.name == "BatchNorm2d") {
        text += "# of features: " + d.data.num_features;
    } else if (d.name == "ReLU") {
        text += ""
    } else if (d.name == "MaxPool2d") {
        text += "Kernel Size: " + d.data.kernel_size + "<br>";
        text += "Padding: " + d.data.padding + "<br>";
        text += "Stride: " + d.data.stride;
    } else if (d.name == "AdaptiveAvgPool2d") {
        text += "Output Size: " + d.data.output_size.toString().replace(',', ' x ');
    } else if (d.name == "Linear") {
        text += "In Features: " + d.data.in_features + "<br>";
        text += "Out Features: " + d.data.out_features;
    } else {
        text += "Not implemented";
    }

    return text;
}

/****************************************************** 
 * TODO: Document
*******************************************************/
function createToolTip(evt, d) {
    // Create Tooltip box
    var div = document.createElement("DIV");
    div.style.top = (evt.y + window.scrollY + 10) + "px";
    div.style.left = (evt.x + window.scrollX + 10) + "px";
    div.id = TOOLTIP_ID;

    // Set Tooltip text
    div.innerHTML = createModuleToolTipDescription(d);

    // Add to body
    document.body.appendChild(div);
}
/****************************************************** 
 * TODO: Document
*******************************************************/
function removeToolTip() {
    // Remove tooltip
    div = document.getElementById(TOOLTIP_ID);
    if (div) {
        div.remove()
    }
}
/****************************************************** 
 * TODO: Document
*******************************************************/
function clear() {
    removeToolTip()
    drawArea = document.getElementById(SVG_ID);
    drawArea.innerHTML = ''; //TODO: optimize later
}

/****************************************************** 
 * TODO: Document
*******************************************************/
function reset() {
    currentDesign = DESIGNS.ARCHITECTURE;
    draw(null);
}

/****************************************************** 
 *!               Initial Draw Call
*******************************************************/
draw(null);