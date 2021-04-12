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
 * TODO: Test and debug
*******************************************************/
function drawBatchNorm2d(data) {
    // *** Assumes data is a matrix with one row and many columns *** //

    // SVG parameters
    let n_features = data.data.num_features
    let padding = 10;
    let width_per_feature = 20;
    let height = 200;
    let width = width_per_feature * n_features + padding * n_features;
    
    const x = d3.scaleLinear()
        .domain([0, n_features])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max([Math.abs(d3.min(data.data.weight)), d3.max(data.data.weight)])])
        .range([height, 0]);
    
    // SVG initialize
    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    // Set up graph in SVG
    var g = svg.append("g")
    
    //
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      
    g.append("g")
      .attr("class", "axis axis--y")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Weight Size");

    g.selectAll(".bar")
      .data(data.data.weight)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(Math.abs(d)))
      .attr("width", width_per_feature)
      .attr("height", d => height - y(Math.abs(d)));
    
    // Define color scale for positive to negative weights
    // blue to orange best for red-green color blindness 
    // Setting rect titles
    g.selectAll(".bar")
      .style("fill", d => d > 0 ? "blue" : "orange")
      .append("title")
      .text((d, i) => "Weight Value: " + d)
}

/****************************************************** 
 * Function for handling the Linear layer drawing
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawLinear(data) {
    //console.log(currentDesign + ' design not implemented');
    weight_matrix = data["data"]["weight"] ;
    let width = 3072 ; //512*6
    let height = 6000;  //1000*6
    var margin = {top: 30, right: 30, bottom: 30, left: 30}; 

    var numcols = weight_matrix[1].length;//512
    var numrows = weight_matrix.length; //1000

    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", width+margin.left)
        .attr("height", height+ margin.top) ; 
        

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
    .domain(d3.range(numcols))
    .rangeBands([30, width+ margin.left]);

    var y = d3.scale.ordinal()
    .domain(d3.range(numrows))
    .rangeBands([30, height+ margin.top]);
    
    //find max/min weight value
    /*min = weight_matrix[0][0] ; 
    max = weight_matrix[0][0] ; 
    for (var i = 0; i < numrows; i++) {
        for (var j = 0; j < numcols; j++) {
           if(weight_matrix[i][j]<min){
                min= weight_matrix[i][j] ; 
           }
           if(weight_matrix[i][j]>max){
                max= weight_matrix[i][j] ; 
           }
    }
    console.log(max, "  ", min) ;  */
    var max =0.043576840311288834 ; 
    var min = -0.04393909499049187 ; 

    //labels for x,y axis
    var x_label = [], y_label=[] ; 
    for(var i =0 ; i<numcols; i++){
        x_label.push(i) ; 
    }
    for(var i =0 ; i<numrows; i++){
        y_label.push(i) ; 
    }

     
    var colorMap = d3.scale.linear()
    .domain([min,0.0, max])
    .range(["blue", "white", "red"]); 


    var row = svg.selectAll(".row")
    .data(weight_matrix)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
  
  row.selectAll(".cell")
    .data(function(d) {  return d; })
    .enter().append("rect")
    .attr("class", "cell")
    .attr("x", function(d, i) { return x(i); })
    .attr("width", x.rangeBand())
    .attr("height", y.rangeBand())
    .style("stroke-width", 1);



var x_axis= svg.selectAll(".x_axis")
    .data(x_label)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + x(i) + ", 30)"; });

x_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  8)
    .text(function(d, i) {
        return i % 10 == 0 ? d : ""; 
    }); 


//y axis 
   var y_axis = svg.selectAll(".y_axis")
    .data(y_label)
    .enter().append("g")
    .attr("transform", function(d, i) {  var temp=y(i)+4; return "translate(15, " + temp +")"; }); //25

    y_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  8)
    .text(function(d, i) {
        return i % 10 == 0 ? d : ""; 
    }); 

//x,y  axis title
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 120)
    .attr("y", 20 )
    .text(" Input Channel");
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -50 )
    .text(" Output Channel");
    
    
//map data to colormap
    row.selectAll(".cell")
        .data(function(d, i) { 
            return d ; 
         })
        .style("fill", colorMap)
     /*   .append("title")
        .text(function(d, i) {  
      return  "weight value: "+d ; }); */
        .on("mouseover", (evt, d) => createToolTip(evt, "Weight Value: " + d))
        .on("mouseout", (evt, d) => removeToolTip());
}

/****************************************************** 
 * Function for handling the convolutional layer
 * drawing.
 * 
 * TODO: Clean up / stylize
 * TODO: Add legend
 * TODO: Make size react to user window size
 * TODO: Create tooltip per cell
 * TODO: Create a highlight mechanism for mouseover a cell
*******************************************************/
function drawConv2d(data) {
    let cellSize = 20;
    let cellBorder = 1;
    let margin = 50;

    let kernelWidth = cellSize * data.data.kernel_size[0] + cellBorder * (data.data.kernel_size[0] + 1) // Kernel Size
    let width = kernelWidth * data.data.in_channels + (margin - 1) * data.data.in_channels // In Channel
    let kernelHeight = cellSize * data.data.kernel_size[1] + cellBorder * (data.data.kernel_size[1] + 1) // Kernel Size
    let height = kernelHeight * data.data.out_channels + (margin - 1) * data.data.out_channels // In Channel

    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let weights = data.data.weight;

    // Creating Colors
    let min = Math.min.apply(Math, weights.map(ic => Math.min.apply(Math, ic.map(oc => Math.min.apply(Math, oc.map(kw => Math.min.apply(Math, kw.map(kh => kh))))))));
    let max = Math.max.apply(Math, weights.map(ic => Math.max.apply(Math, ic.map(oc => Math.max.apply(Math, oc.map(kw => Math.max.apply(Math, kw.map(kh => kh))))))));

    const COLORS = d3.scaleLinear()
        .domain([min, 0, max])
        .range(["#ff1414", "#ffffff", "#08c718"]);

    // Setting up data to be drawn
    weights = []
    data.data.weight.forEach( (inChannel, i) => {
        inChannel.forEach( (kernel, j) => {
            weights.push({
                kernel: kernel,
                in_channel: j,
                out_channel: i
            });
        });
    });

    var kernels = svg.selectAll(".kernel")
        .data(weights)
        .enter().append("g")
        .attr("class", "kernel")
        .attr("transform", (d, i) => "translate(" + (d.in_channel * kernelWidth + d.in_channel * margin) + ", " + (d.out_channel * kernelHeight + d.out_channel * margin) + ")")
        .each(drawKernels)

    function drawKernels(data) {
        // Kernel Row
        var cell = d3.select(this).selectAll(".kernel_row")
            .data(data.kernel)
            .enter().append("g")
            .attr("class", "kernel_row")
            .attr("transform", (d, i) => "translate(0, " + (i * cellSize + i * cellBorder) + ")")
            .each(drawKernelCells);
    }

    function drawKernelCells(data) {
        // Kernel Cell
        d3.select(this).selectAll(".kernel_cell")
            .data(data)
            .enter().append("rect")
            .attr("class", "kernel_cell")
            .attr("x", (d, i) => i * cellSize + i * cellBorder)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", d => COLORS(d))
            .on("mouseover", (evt, d) => createToolTip(evt, "Value: " + d))
            .on("mouseout", (evt, d) => removeToolTip());
    }
}

/****************************************************** 
 * Function for handling the architectur drawing.
 * 
 * TODO: Center Text
 * TODO: Fix mouseover for leaves with text (highlight goes away)
*******************************************************/
async function drawArchitecture() {

    //Toggle Loading Image
    toggleLoadingImage();
    
    //! Obtaining data
    data = await getData();
    let containers = data[0];
    let leaves = data[1];
    let arrows = data[2];
    
    //Toggle Loading Image
    toggleLoadingImage();

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
            createModuleToolTip(evt, d)
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

    // Defining Arrow Head
    svg.append('defs').append('marker')
        .attr('id','arrow_head')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('xoverflow', 'visible')
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', 'black')
            .style('stroke','none');

    // Draw Arrows
    svg.selectAll("arrows")
        .data(arrows)
        .enter().append("line")
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow_head)");

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

function centerNodesAndSetNext(node) {
    const parentY = node.drawVars.y;
    const parentHeight = node.drawVars.height;

    // Set centered y position for children & set next, then recursively call
    node.children.forEach((child, i) => {
        var offset = Math.round((parentHeight - child.drawVars.height) / 2);
        child.drawVars.y = parentY + offset;
        centerNodesAndSetNext(child); // Recursion
        if (i < node.children.length-1) {
            child.next = node.children[i+1].drawVars;
        } else {
            child.next = null;
        }
    });
}

/****************************************************** 
 * TODO: Document
*******************************************************/
async function getData() {
    var leaves = [];
    var containers = [];
    
    // Load Data
    let data = await d3.json("resnet18_weights.json");

    // Calculate Draw Variables
    console.log("Calculating Draw Variables");
    calcDrawVars(data, { x: 0, y: 0 });
    console.log("Finished Calculating Draw Variables");

    // Center Draw Variables along y & set next
    centerNodesAndSetNext(data);

    var arrows = [];

    // Bredth-First Traversal    
    containers.push(data);
    data.next = null;
    var stackOuter = [...data.children];
    while (stackOuter.length > 0) {
        var stackInner = [...stackOuter];
        stackOuter = [];
        while (stackInner.length > 0) {
            node = stackInner.shift(); // pop from front
            if (node.next !== null) {
                arrows.push({
                    x1 : node.drawVars.x + node.drawVars.width, 
                    y1 : node.drawVars.y + Math.round(node.drawVars.height / 2), 
                    x2 : node.next.x,
                    y2 : node.next.y + Math.round(node.next.height / 2), 
                });
            }
            if (node.children.length > 0) {
                stackOuter.push(...node.children);
                containers.push(node);
            } else {
                leaves.push(node);
            }
        }
    }

    return [containers, leaves, arrows];
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
function createModuleToolTip(evt, d) {
    // Tooltip text
    text = createModuleToolTipDescription(d);

    createToolTip(evt, text);
}
/****************************************************** 
 * TODO: Document
*******************************************************/
function createToolTip(evt, text) {
    // Create Tooltip box
    var div = document.createElement("DIV");
    div.style.top = (evt.y + window.scrollY + 10) + "px";
    div.style.left = (evt.x + window.scrollX + 10) + "px";
    div.id = TOOLTIP_ID;

    // Set Tooltip text
    div.innerHTML = text;

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