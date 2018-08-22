var parentDiv = document.getElementById("viz-2");
    //var width = 800;
    //var height = 650;
    var widthTwo = parentDiv.clientWidth;
    var heightTwo = parentDiv.clientHeight;
      
    //slider start year
    var selectedYearTwo = 1745;
    $("#selected-year-2").change(function(){
      selectedYearTwo = $(this).val();
      showLinkLinesTwo();
      updateNodeSizeTwo();
      //showText();
    });
    
    // label year slider
    $('#selected-year-2').on('input change', function(){
          $(this).next($('.slider_label-2')).html(this.value);
        });
      $('.slider_label-2').each(function(){
          var value = $(this).prev().attr('value');
          $(this).html(value);
        });
      
    // variable to store node size
    var nodeSizeTwo = ['betweenness']; 
    
    // select node size
    $("#node-size-2").change(function(){
      nodeSizeTwo = $(this).val();
      updateNodeSizeTwo()
    });
    
    // variable to store button coloring
    var colorFillCategoryTwo = ['race'];
    var colorStrokeCategoryTwo = ['race'];
    var colorFillLegendTwo = ['race'];
    var colorStrokeLegendTwo = ['race'];
    
    // filter based on gender or color
    $("#filter-fill-2").change(function(){
      colorFillCategoryTwo = $(this).val();
      colorFillLegendTwo = $(this).val();
      updateLegendTwo();
      updateNodeColorTwo();
    });
    
    $("#filter-stroke-2").change(function(){
      colorStrokeCategoryTwo = $(this).val();
      colorStrokeLegendTwo = $(this).val();
      updateLegendTwo();
      updateNodeOutlineTwo()
    });
    
    // preallocate linkedbyindex
    let linkedByIndexTwo = {};
    
    // build the svg for the viz
    var svgTwo = d3.select("#viz-2")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + widthTwo + " " + heightTwo)
      .call(d3.zoom().on("zoom", function() {
        svgTwo.attr("transform", d3.event.transform)
      }))
      .on("dblclick.zoom", null)
      .append("g");
      
    //domains for updating the legend    
    var raceDomain = ["Native", "White", "Black", "Unknown"];
    var genderDomain = ["Male", "Female", "Unknown"];
    var clanDomain = ["Wolf", "Turtle", "Bear", "Wolf or Bear", "Turtle or Wolf", "Bear or Turtle", "Mahican", "Unknown or NA"];
    var modularityDomain = ["Canasteje-Oseragighte", "Kaghtereni-Uttijagaroondi", "Kenderago-Canostens", "Bridge", "English", "Dutch-English", "Scots-Irish", "Palatine", "NA"];
    var roleDomain = ["Baptized", "Parent", "Sponsor"];
    var legendDomainTwo = raceDomain;
    var fillLegend = ['race'];
    var strokeLegend = ['race'];
    var allDomains = raceDomain.concat(genderDomain).concat(clanDomain).concat(modularityDomain).concat(roleDomain);
    
    //set color scale
    var defaultPalette = ["rgb(234,95,95)","rgb(58,32,154)","rgb(255,177,78)","rgb(255,242,0)","rgb(117,250,122)","rgb(0,155,123)","rgb(140,62,174)","rgb(154,154,154)","rgb(0,0,0)"]
    
    var CBPalette = ["#c57b5e", "#15387f", "#f6b752", "#ffed86", "#cce59d", "#649084", "#595aa9", "#a69a9e", "#000000"]
    var selectedColorPalette = defaultPalette
    
    //set color scale
    var color = d3.scaleOrdinal()
      .domain(allDomains)
      .range(selectedColorPalette);
    
    function updateColorPalette() {
      var color = d3.scaleOrdinal()
      .domain(allDomains)
      .range(selectedColorPalette);
    }
    
    var legendTwo = d3.select("#viz-2").select("svg");
    
    legendTwo.append("g")
      .attr("class", "legendOrdinal-2")
      .attr("id", "legend-2")
      .attr("transform", "translate(20,20)");
    
    var legendOrdinalTwo = d3.legendColor()
      .shapePadding(10)
      .cellFilter(function(d){
        var filterOut = $(allDomains).not(legendDomainTwo).get();
        return !filterOut.includes(d.label)
        })
      .scale(color);
    
    legendTwo.select(".legendOrdinal-2")
      .call(legendOrdinalTwo);
      
    function redrawLegendTwo() {
      var color = d3.scaleOrdinal()
      .domain(allDomains)
      .range(selectedColorPalette);
      svgTwo.selectAll(".legendOrdinal-2").remove();
      legendTwo.select(".legendOrdinal-2").call(legendOrdinalTwo);
    }
    
    // use force simulation
    // is there a way to change the collision distance on radius change?
    var simulationTwo = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.name;
      }).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(widthTwo / 2, heightTwo / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return (d.betweenesscentrality_1745 * 150 + d.degree_1745) / 2 + 15
      }));
    
    // Define the div for the tooltip
    var divTwo = d3.select("body").append("div")
      .attr("class", "tooltip-2");
    var toggleTwo = 0;
    
    // load the data, pass in error, graph variables
    d3.json("force-revised.json", function(error, graph) {
      if (error) throw error;
      
      var linkTwo = svgTwo.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });
      
      var nodeTwo = svgTwo.selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id", function(d) { return d.name + "-2"})
        .attr("r", function(d) { return d.betweenesscentrality_1745 * 150 + 5; })
        .attr("fill", function(d) {
          return color(d[colorFillCategoryTwo]);
        })
        .attr("stroke", function(d) {
          return color(d[colorStrokeCategoryTwo]);
        })
        .on("mouseover", function(d) {
          divTwo.html("<h6>" + d.name + "</h6><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender + "</br><strong>Clan:</strong> " + d.clan + "</br><strong>First appeared as:</strong> " + d.role + "</br><strong>Subcommunity:</strong> " + d.modularity_class)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("opacity", 1);
        })
        .on("mouseout", function(d) {
          divTwo.transition()
            .duration(50) // duration is critical for mouse over.. if a user is moving the mouse fast the tooltip is not responsive
            .style("opacity", 0);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on('dblclick', connectedNodesTwo);
      
      var textTwo = svgTwo.selectAll("text")
        .data(nodeTwo)
        .enter()
        .append("text");
      
      var labelsTwo = textTwo
        .attr("x", function(d) {
          return d.cx
        })
        .attr("y", function(d) {
          return d.cy
        })
        .text(function(d) {
          return "( " + d.cx + ", " + d.cy + " )"
        })
      simulationTwo
        .nodes(graph.nodes)
        .on("tick", tickedTwo);
      simulationTwo.force("link")
        .links(graph.links);
      function tickedTwo() {
        linkTwo
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        nodeTwo
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      }
      
      // mouse double click highlight is taken from this example:
      // http://www.coppelia.io/2014/06/finding-neighbours-in-a-d3-force-directed-layout-2/
      // we need to create an array of "connections" for quick lookup
      var linkedByIndexTwo = {};
      for (i = 0; i < graph.nodes.length; i++) {
          linkedByIndexTwo[i + "," + i] = 1;
      };
      
      // Loop over each "link" and determine if they are connectioned
      graph.links.forEach(function (d) {
          linkedByIndexTwo[d.source.index + "," + d.target.index] = 1;
      });
      
      // define a "lookup" function to get connections
      function neighboringTwo(a, b) {
          return linkedByIndexTwo[a.index + "," + b.index];
      };
      linksTwo = d3.selectAll('line');
      
      // set opacity based on connections
      function connectedNodesTwo() {
          if (toggleTwo == 0) {
              // select the nodes
              d = d3.select(this).node().__data__;
              // loop over each node and style
              node.style("opacity", function (o) {
                  // ? is a conditional operator of the form condition ? value-if-true : value-if-false
                  return neighboringTwo(d, o) | neighboringTwo(o, d) ? 1 : 0.15;
              });
              toggleTwo = 1;
          } else {
              node.style("opacity", 1);;
              toggleTwo = 0;
          }
      };
    });
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    
    //update legend domains
    
    function updateLegendTwo() {
      legendDomainTwo = [];
      
      if (colorFillLegendTwo == ['race']) {
        var fillLegendTwo = raceDomain
      } else if (colorFillLegendTwo == ['gender']) {
        var fillLegendTwo = genderDomain
      } else if (colorFillLegendTwo == ['clan']) {
        var fillLegendTwo = clanDomain
      } else if (colorFillLegendTwo == ['modularity_class']) {
        var fillLegendTwo = modularityDomain
      } else if (colorFillLegendTwo == ['role']) {
        var fillLegendTwo = roleDomain
      }
      
      if (colorStrokeLegendTwo == ['race']) {
        var strokeLegendTwo = raceDomain
      } else if (colorStrokeLegendTwo == ['gender']) {
        var strokeLegendTwo = genderDomain
      } else if (colorStrokeLegendTwo== ['clan']) {
        var strokeLegendTwo = clanDomain
      } else if (colorStrokeLegendTwo == ['modularity_class']) {
        var strokeLegendTwo = modularityDomain
      } else if (colorStrokeLegendTwo == ['role']) {
        var strokeLegendTwo = roleDomain
      }
      
      if (typeof fillLegendTwo == 'undefined') {
        fillLegendTwo = raceDomain
      }
      if (typeof strokeLegendTwo == 'undefined') {
        strokeLegendTwo = raceDomain
      }
      
      if (fillLegendTwo == strokeLegendTwo) {
        legendDomainTwo = fillLegendTwo
      } else {
        legendDomainTwo = fillLegendTwo.concat(strokeLegendTwo)
      }
    };
    
    // Update node size
    
    function updateNodeSizeTwo(){
      var allCirclesTwo = svgTwo.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesTwo.transition().duration(300).attr("r", function(d) {
        if (nodeSizeTwo == 'betweenness') {
          nodeSizeValueTwo = d["betweenesscentrality_" + selectedYearTwo] * 150 + 5
        } else {
          nodeSizeValueTwo = d["degree_" + selectedYearTwo] + 2
        }
        return nodeSizeValueTwo;
        })
      allCirclesTwo.exit().remove()
    };
    
    /* ------------ Update Node Color --------------*/
    // function to get all nodes, and change the color. Follow the general update pattern
    // https://bl.ocks.org/mbostock/3808218
    
    function updateNodeColorTwo(){
      var color = d3.scaleOrdinal()
      .domain(allDomains)
      .range(selectedColorPalette);
      var allCirclesTwo = svgTwo.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesTwo.transition().duration(300).attr("fill", function(d,i){
        return color(d[colorFillCategoryTwo])
      });
      allCirclesTwo.exit().remove();
      ////update legend
      redrawLegendTwo();
    };
    
    function updateNodeOutlineTwo(){
      var color = d3.scaleOrdinal()
      .domain(allDomains)
      .range(selectedColorPalette);
      var allCirclesTwo = svgTwo.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesTwo.transition().duration(300).attr("stroke", function(d,i){
        return color(d[colorStrokeCategoryTwo])
      });
      allCirclesTwo.exit().remove();
      ////update legend
      redrawLegendTwo();

    };
    
    function showLinkLinesTwo(){
      var filterIdTwo = [];
      var allLinesTwo = svgTwo.selectAll('line');
      var allNodesTwo = svgTwo.selectAll('circle');
      // loop over each node, and update color attribute
      allLinesTwo.style("stroke-opacity", function(d,i){
        return d.year <= parseInt(selectedYearTwo) ? 0.7 : 0
      });
      allLinesTwo.exit().remove()
      allNodesTwo.style('opacity',function(d,i){
        return (d.year <= parseInt(selectedYearTwo))? 1 : 0
      });
      allNodesTwo.exit().remove()
    };