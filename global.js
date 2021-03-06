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
const VIS_ID = "module";
const LOADING_PATH = "loading.gif";
const DESIGNS = {
    ARCHITECTURE: 'architecture',
    CONV2D: 'conv2d',
    BATCHNORM2D: 'batchnorm2d',
    LINEAR: 'linear',
    INVALID: 'invalid'
};

const ACTIVE_ID = 'active';
const CURRENT_ID = 'current';
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
let modelData = null;

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
*******************************************************/
function drawBatchNorm2d(data) {
    // *** Assumes data is a matrix with one row and many columns *** //

    // Variables
    let titleHeight = 50;
    let bottomTitleMargin = 50;
    let labelSpace = 50;
    let n_features = data.data.num_features
    let padding = 10;
    let width_per_feature = 20;
    let maxBarHeight = 200;
    let height = maxBarHeight + titleHeight + bottomTitleMargin + labelSpace;
    let barChartWidth = width_per_feature * n_features + padding * n_features;
    let width = barChartWidth + labelSpace;

    let min = d3.min(data.data.weight);
    let max = d3.max(data.data.weight);
    
    const x = d3.scaleLinear()
        .domain([0, n_features])
        .range([0, barChartWidth]);

    const y = d3.scaleLinear()
        .domain([0, d3.max([Math.abs(min), max])])
        .range([height, 0]);
    
    // SVG initialize
    var svg = d3.select('#' + VIS_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    // Create Title
    const title = svg.append("text")
        .attr("x", 0)
        .attr("y", titleHeight)
        .attr("font-size", titleHeight + "px")
        .text("Batch2dNorm Layer");

    // Set up graph in SVG
    var g = svg.append("g")
        .attr("transform", "translate(" + labelSpace + ", " + (titleHeight + bottomTitleMargin) + ")");

    g.selectAll(".bar")
        .data(data.data.weight)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(Math.abs(d)))
        .attr("width", width_per_feature)
        .attr("height", d => maxBarHeight - y(Math.abs(d)))
        .style("fill", d => d > 0 ? "blue" : "orange")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .on("mouseover", (evt, d) => {
            evt.target.id = "active"
            text = "<strong>Value</strong>: " + d + "<br>"
            createToolTip(evt, text)
        })
        .on("mouseout", (evt, d) => {
            evt.target.id = ""
            removeToolTip()
        });
    

    // X-Axis Labels
    let xLabelG = svg.append("g")
        .attr("transform", "translate(" + labelSpace + ", " + (titleHeight + bottomTitleMargin + maxBarHeight) + ")")
    
    let xLabels = xLabelG.selectAll(".x_axis")
        .data(data.data.weight)
        .enter().append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("x", (d, i) => (i + 0.5) * width_per_feature + (i * padding) - FONT_SIZE/2)
        .attr("y", FONT_SIZE + 6)
        .text((d, i) => i+1)
    
    let xTitle = xLabelG.append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("x", 0)
        .attr("y", FONT_SIZE * 2 + 12)
        .text("Feature Number")

    // Y-Axis Labels
    let yLabelG = svg.append("g")
        .attr("transform", "translate(" + 0 + ", " + (titleHeight + bottomTitleMargin) + ")")
    
    let yLabels = yLabelG.selectAll(".y_axis")
        .data([0, maxBarHeight])
        .enter().append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("x", 20)
        .attr("y", d => d)
        .text((d, i) => {
            console.log(d)
            if (d == 0) return max.toFixed(4);
            else if (d == maxBarHeight) return 0;

            return "";
        });
    
    let yTitleText = "Magnitude of Weight Value";
    let yTitle = yLabelG.append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x",  0)
        .attr("y", FONT_SIZE)
        .text(yTitleText);
}

/****************************************************** 
 * Function for handling the Linear layer drawing
*******************************************************/
function drawLinear(data) {
    //console.log(currentDesign + ' design not implemented');
    weight_matrix = data["data"]["weight"] ;
    var numcols = weight_matrix[1].length;//512
    var numrows = weight_matrix.length; //1000

    //create data for visualizarion 
    var data =[] ; 
    var x_label = [], y_label=[] ; 
    for (i=0; i<numrows; i++ ){
        temp = [] ;
        y_label.push(i)
        for (j=0; j<numcols; j++){
            temp.push([weight_matrix[i][j] , j, i ]) ; //weight, input channel, output channel
            if(i==0){x_label.push(j) ;} 
        }
        data.push(temp); 
    }

    // Find min & max values
    let min = Math.min.apply(Math, weight_matrix.map(row => Math.min.apply(Math, row.map(val => val))));
    let max = Math.max.apply(Math, weight_matrix.map(row => Math.max.apply(Math, row.map(val => val))));

    console.log(min, max)

    let colorDomain = [min,0.0, max]
    let colorRange = ["blue", "white", "red"]

    let titleHeight = 50;
    let legendHeight = 50;

    let width = numcols * 6;
    let height = numrows * 6;
    var margin = {top: 60 + titleHeight + legendHeight + 20, right: 160, bottom: 120, left: 60}; 

    var svg = d3.select('#' + VIS_ID)
        .append("svg")
        .attr("width", width+margin.left + margin.right)
        .attr("height", height+ margin.top + margin.bottom) ; 

    // Create Title
    const title = svg.append("text")
        .attr("x", 0)
        .attr("y", titleHeight)
        .attr("font-size", titleHeight + "px")
        .text("Linear Layer Visualization");

    // Create Legend
    createLegend(svg, 0, titleHeight + 20, legendHeight, screen.width * 0.9, colorDomain, colorRange, 10, 2, 10, 4);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
    .domain(d3.range(numcols))
    .rangeBands([margin.left, width+ margin.left]);

    var y = d3.scale.ordinal()
    .domain(d3.range(numrows))
    .rangeBands([margin.top, height+ margin.top]);
    
    var colorMap = d3.scale.linear()
    .domain(colorDomain)
    .range(colorRange); 


    var row = svg.selectAll(".row")
    .data(data)
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
    .attr("transform", function(d, i) { return "translate(" + x(i) + ", " + (margin.top - 10) + ")"; });

x_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  8)
    .text(function(d, i) {
        return (i + 1) % 10 == 0 || i == 0 ? d+1 : ""; 
    }); 


//y axis 
   var y_axis = svg.selectAll(".y_axis")
    .data(y_label)
    .enter().append("g")
    .attr("transform", function(d, i) {  var temp=y(i)+4; return "translate(30, " + temp +")"; }); //25

    y_axis.append("text")
    .attr("text-anchor", "start")
    .style("font-size",  8)
    .text(function(d, i) {
        return (i + 1) % 10 == 0 || i == 0 ? d+1 : "";
    }); 

//x,y  axis title
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 140)
    .attr("y", margin.top - 40)
    .text("Input Channel");

svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -margin.top)
    .text("Output Channel");
    
    
//map data to colormap
    row.selectAll(".cell")
        .data( function(d, i) { 
            weight_data =[] ;
            for(  j=0; j<512; j++){
                weight_data.push(d[j][0]) ; 

            }
            return weight_data ;  
         }  )
        .style("fill", colorMap) ;

    row.selectAll(".cell")
        .data(function(d, i) { 
            return d ; 
         })
        .on("mouseover", (evt, d) => createToolTip(evt,"weight value: "+d[0] + 
            "<br> Input channel#: " + (d[1] + 1) +
            "<br> Ouput channel#: " + (d[2] + 1) ))
        .on("mouseout", (evt, d) => removeToolTip()); 
}

/****************************************************** 
 * Function for handling the convolutional layer
 * drawing.
 * 
 * TODO: Make size react to user window size
*******************************************************/
function drawConv2d(data) {
    let borderRadius = 0;
    let cellSize = 6;
    let cellBorder = 0;
    let borderColor = "black";
    let margin = 2;
    let legendHeight = 50;
    let legendWidth = screen.width * 0.9;
    let bottomLegendMargin = 30;
    const TITLE_TEXT = "Convolutional Layer Visualization";
    let titleHeight = 50;
    let bottomTitleMargin = 30;
    let extraPadding = 60;

    let weights = data.data.weight;

    // Creating Colors
    let min = Math.min.apply(Math, weights.map(ic => Math.min.apply(Math, ic.map(oc => Math.min.apply(Math, oc.map(kw => Math.min.apply(Math, kw.map(kh => kh))))))));
    let max = Math.max.apply(Math, weights.map(ic => Math.max.apply(Math, ic.map(oc => Math.max.apply(Math, oc.map(kw => Math.max.apply(Math, kw.map(kh => kh))))))));
    let domain = [min, 0, max];
    let range = ["#ff0000", "#ffffff", "#00ff00"];
    const COLORS = d3.scaleLinear()
        .domain(domain)
        .range(range);

    let kernelWidth = cellSize * data.data.kernel_size[0] + (cellBorder * 2) * (data.data.kernel_size[0] + 1); // Kernel Size
    let width = Math.max(kernelWidth * data.data.in_channels + margin * data.data.in_channels + extraPadding, screen.width)
    let kernelHeight = cellSize * data.data.kernel_size[1] + (cellBorder * 2) * (data.data.kernel_size[1] + 1); // Kernel Size
    let height = kernelHeight * data.data.out_channels + margin * data.data.out_channels
        + titleHeight + bottomTitleMargin
        + legendHeight + bottomLegendMargin
        + FONT_SIZE * 4 // For Axis Labels
        + extraPadding; //Extra padding on bottom

    var svg = d3.select('#' + VIS_ID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var yMargin = 0;
    var xMargin = 0;

    // Create Title
    const title = svg.append("text")
        .attr("x", xMargin)
        .attr("y", yMargin + titleHeight)
        .attr("font-size", titleHeight + "px")
        .text(TITLE_TEXT);

    yMargin += titleHeight + bottomTitleMargin;


    // Create Legend
    createLegend(svg, xMargin, yMargin, legendHeight, legendWidth, domain, range, 10, 2, 10, 4);
    yMargin += legendHeight + bottomLegendMargin;

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

    // Description of xaxis
    xMargin += FONT_SIZE * 4;
    const xAxisTitle = svg.append("text")
        .attr("x", xMargin)
        .attr("y", yMargin + FONT_SIZE)
        .attr("font-size", FONT_SIZE + "px")
        .text("In Channel");

    yMargin += FONT_SIZE * 3;

    // Give Room for yAxis
    var xAxisY = yMargin;
    yMargin += FONT_SIZE;

    // Description of yaxis
    const yAxisTitle = svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -yMargin - FONT_SIZE)
        .attr("y", FONT_SIZE + 2)
        .attr("font-size", FONT_SIZE + "px")
        .text("Out Channel");

    

    // Draw Kernels
    var kernels = svg.selectAll(".kernel")
        .data(weights)
        .enter().append("g")
        .attr("class", "kernel")
        .attr("transform", (d, i) => "translate(" + (d.in_channel * (kernelWidth + margin) + xMargin) + ", " + (d.out_channel * (kernelHeight + margin) + yMargin) + ")")
        .each(drawKernels)

    // Draw X-Axis Labels
    var xLabels = svg.selectAll(".x_labels")
        .data(d3.range(data.data.in_channels))
        .enter().append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("x", d => xMargin + (d + 0.5) * kernelWidth + d * margin - FONT_SIZE/2)
        .attr("y", xAxisY)
        .text(d => d+1)

    // Draw Y-Axis Labels
    var xLabels = svg.selectAll(".y_labels")
        .data(d3.range(data.data.out_channels))
        .enter().append("text")
        .attr("font-size", FONT_SIZE + "px")
        .attr("x", FONT_SIZE * 2)
        .attr("y", d => yMargin + (d + 0.5) * kernelHeight + d * margin + FONT_SIZE/2)
        .text(d => d+1)

    function drawKernels(data) {
        // Inject Meta Data
        kernelMeta = [];
        data.kernel.forEach((row, i) => {
            kernelMeta.push({
                in_channel : data.in_channel,
                out_channel : data.out_channel,
                row : row,
                row_i : i
            })
        });

        // Kernel Row
        var cell = d3.select(this).selectAll(".kernel_row")
            .data(kernelMeta)
            .enter().append("g")
            .attr("class", "kernel_row")
            .attr("transform", (d, i) => "translate(0, " + (i * (cellSize + (cellBorder * 2))) + ")")
            .each(drawKernelCells);
    }

    function drawKernelCells(data) {
        // Inject Meta Data
        rowMeta = [];
        data.row.forEach((col, j) => {
            rowMeta.push({
                in_channel : data.in_channel,
                out_channel : data.out_channel,
                value : col,
                row_i : data.row_i,
                col_j : j
            })
        });
        // Kernel Cell
        d3.select(this).selectAll(".kernel_cell")
            .data(rowMeta)
            .enter().append("rect")
            .attr("class", "kernel_cell")
            .attr("x", (d, i) => i * (cellSize + (cellBorder * 2)))
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("rx", borderRadius)
            .attr("ry", borderRadius)
            .style("fill", d => COLORS(d.value))
            .style("stroke", borderColor)
            .style("stroke-width", cellBorder)
            .on("mouseover", (evt, d) => {
                evt.target.id = "active"
                evt.target.style.strokeWidth = 1;
                text = "<strong>Value</strong>: " + d.value + "<br>"
                    + "<strong>Kernel Position</strong>: (" + d.row_i + ", " + d.col_j + ") <br>"
                    + "<strong>In Channel</strong>: " + (d.in_channel + 1) + "<br>"
                    + "<strong>Out Channel</strong>: " + (d.out_channel + 1)
                createToolTip(evt, text)
            })
            .on("mouseout", (evt, d) => {
                evt.target.id = ""
                evt.target.style.strokeWidth = cellBorder;
                removeToolTip()
            });
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
    if (modelData === null) {
        modelData = await getData();
    }

    let containers = modelData[0];
    let leaves = modelData[1];
    let arrows = modelData[2];
    
    //Toggle Loading Image
    toggleLoadingImage();

    let bottomPadding = 20;
    var svg = d3.select('#' + SVG_ID)
        .append("svg")
        .attr("width", containers[0].drawVars.width)
        .attr("height", containers[0].drawVars.height + bottomPadding);
        
    let borderRadius = 4;

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
        .attr("rx", borderRadius)
        .attr("ry", borderRadius)
        .append("title").text((d, i) => d.name);

    // Draw Container text
    svg.selectAll("rect_container_text")
        .data(containers)
        .enter().append("text")
        .attr("x", (d, i) => d.drawVars.x)
        .attr("y", (d, i) => d.drawVars.y - 4)
        .attr("font-size", FONT_SIZE + "px")
        .text((d, i) => d.name)
    
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
        .attr("rx", borderRadius)
        .attr("ry", borderRadius)
        .on('click', (evt, d) => {
            currentDesign = getDesignFromString(d.name);
            if (currentDesign === DESIGNS.INVALID) {
                currentDesign = DESIGNS.ARCHITECTURE;
            } else {
                // handle current highlighting
                elements = document.getElementsByClassName(CURRENT_ID);
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove(CURRENT_ID);
                }
                evt.target.classList.add(CURRENT_ID);

                // Draw visualization
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
function createLegend(svg, x, y, height, width, domain, range, numOfRects=10, borderWidth=2, labelSpace=10, borderRadius=0) {
    const SIGNIFICANT_DIGITS = 4;
    var xScale = d3.scaleLinear().domain([0, numOfRects]).range([x, x+width])
    var spread = []
    for (var i = 0; i < domain.length; ++i) {
        var ratio = i / (domain.length - 1);
        spread.push(Math.round(ratio * (numOfRects-1)))
    }
    var domainScale = d3.scaleLinear().domain(spread).range(domain)
    var colorScale = d3.scaleLinear()
        .domain(domain)
        .range(range);
    
    // Set Rect positions
    var rects = svg.selectAll(".rect")
        .data(d3.range(numOfRects))
        .enter().append("g")
        .attr("transform", "translate(" + x + ", " + y + ")");

    // Create rect and fill
    rects.append("rect")
        .attr("x", d => xScale(d) + borderWidth)
        .attr("y", borderWidth + labelSpace)
        .attr("rx", borderRadius)
        .attr("ry", borderRadius)
        .attr("width", d => xScale(1)-(borderWidth*2))
        .attr("height", height - (borderWidth*2) - labelSpace)
        .attr("fill", d => colorScale(domainScale(d)))
        .style("stroke", "black")
        .style("stroke-width", borderWidth)

    // Add scale values to beginning, middle, and end
    rects.append("text")
        .attr("x", d => xScale(d) + xScale(1)/2 - SIGNIFICANT_DIGITS*FONT_SIZE/2)
        .attr("y", 0)
        .attr("font-size", FONT_SIZE + "px")
        .text(d => domainScale(d).toFixed(SIGNIFICANT_DIGITS))
}

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
    xOffset = 10;
    yOffset = 10;
    if (screen.height - evt.y < 220) {
        yOffset = -100;
    }
    if (screen.width - evt.x < 220) {
        xOffset = -200;
    }
    div.style.top = (evt.y + window.scrollY + yOffset) + "px";
    div.style.left = (evt.x + window.scrollX + xOffset) + "px";
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
    drawArea = document.getElementById(VIS_ID);
    drawArea.innerHTML = ''; //TODO: optimize later
}

/****************************************************** 
 *!               Initial Draw Call
*******************************************************/
draw(null);