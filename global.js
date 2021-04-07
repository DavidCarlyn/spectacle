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
    //console.log(currentDesign + ' design not implemented');
    
    // *** Assumes data is a matrix with one row and many columns *** //

    // SVG parameters
    let n_features = data[0].length
    let width_per_feature = 100;
    let height = 500;
    let width = width_per_feature*n_features;
    
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);
    
    // SVG initialize
    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    // Set up graph in SVG
    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x.domain([1,length(data[0])]);
    y.domain([d3.min(data[0], d3.max(data[0]))]);
    
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
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", Array(8).fill().map((data[0], index) => index + 1))
      .attr("y", data[0])
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - data[0]; });
    
    // Define color scale for positive to negative weights
        // blue to orange best for red-green color blindness 
    var colorScale = d3.scale.ordinal()
    .domain(d3.range(n_features))
    .range(["blue","orange"])
    
    g.selectAll(".bar")
      .data(function(d, i) { 
              return d; })
      .style("fill", colorMap)
      .append("title")
      .text(function(d, i) {  return  "Weight Value: " + d; })
}

/****************************************************** 
 * Function for handling the Linear layer drawing
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawLinear(data) {
    //console.log(currentDesign + ' design not implemented');
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

    //FIXME: will change later 
    var colorMap = d3.scale.linear()
    .domain([min,0.02, max])
    .range(["white", "blue", "red"]); 


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
    .attr("transform", function(d, i) { return "translate(" + x(i) + ", 25)"; });

x_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  3)
    .text(function(d, i) { return d; }); 


//y axis 
   var y_axis = svg.selectAll(".y_axis")
    .data(y_label)
    .enter().append("g")
    .attr("transform", function(d, i) {  var temp=y(i)+4; return "translate(25, " + temp +")"; });

    y_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  3)
    .text(function(d, i) { return d; });

//x,y  axis title
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", 20 )
    .text("X axis: Input Channel");
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -50 )
    .text("Y axis: Output Channel");
    
    
//map data to colormap
    row.selectAll(".cell")
        .data(function(d, i) { 
            return d ; 
         })
        .style("fill", colorMap)
        .append("title")
        .text(function(d, i) {  
      return  "weight value: "+d ; });
}

/****************************************************** 
 * Function for handling the convolutional layer
 * drawing.
 * 
 * TODO: NOT STARTED
*******************************************************/
function drawConv2d(data) {
    let height = 100;
    let width = 100;
    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let kernel_ex = data.data.weight[0][0]

    // Setting up data per row
    var row = svg.selectAll(".kernel_row")
        .data(kernel_ex)
        .enter().append("g")
        .attr("class", "kernel_row")
        .attr("transform", (d, i) => "translate(0, " + (i * 20 + i + 1) + ")")
        .each(draw_row);

    function draw_row(row) {
        var cell = d3.select(this).selectAll(".kernel_cell")
            .data(row)
            .enter().append("rect")
            .attr("class", "kernel_cell")
            .attr("x", (d, i) => i * 20 + i * 1)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", d => "red");
            //.on("mouseover", mouseover)
            //.on("mouseout", mouseout);
    }
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