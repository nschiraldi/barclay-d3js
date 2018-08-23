    //viz-block-1

    var parentDiv = document.getElementById("viz-1");
    //var width = 800;
    //var height = 650;
    var width = parentDiv.clientWidth;
    var height = parentDiv.clientHeight;

    //slider start year
    var selectedYear = 1745;
    $("#selected-year-1").change(function() {
      selectedYear = $(this).val();
      showLinkLines();
      updateNodeSize();
      //showText();
    });

    // label year slider
    $('#selected-year-1').on('input change', function() {
      $(this).next($('.slider_label-1')).html(this.value);
    });
    $('.slider_label-1').each(function() {
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    // variable to store node size
    var nodeSize = ['betweenness'];

    // select node size
    $("#node-size-1").change(function() {
      nodeSize = $(this).val();
      updateNodeSize()
    });

    $("#node-size-1").change(function() {
      nodeSize = $(this).val();
      updateNodeSize()
    });

    // variable to store button coloring
    var colorFillCategory = ['race'];
    //var colorStrokeCategory = ['race'];
    var colorFillLegend = ['race'];
    //var colorStrokeLegend = ['race'];

    //get color palette for color blindness
    $("#cb-color").change(function() {
      selectedColorPalette = CBPalette;
      //updateColorPalette();
      //redrawLegend();
      updateLegend();
      updateNodeColor();
      updateLegendTwo();
      updateNodeColorTwo();
      updateNodeOutlineTwo();
      updateNodeColorThree();
      updateLegendThree();
      //updateNodeOutline();
    });
    $("#default-color").change(function() {
      selectedColorPalette = defaultPalette;
      //updateColorPalette();
      //redrawLegend();
      updateLegend();
      updateNodeColor();
      //updateNodeOutline();
    });

    // filter based on gender or color
    $("#filter-fill-1").change(function() {
      colorFillCategory = $(this).val();
      colorFillLegend = $(this).val();
      updateLegend();
      updateNodeColor();
      //updateNodeOutline();
    });

    //$("#filter-stroke-1").change(function(){
    //  colorStrokeCategory = $(this).val();
    //  colorStrokeLegend = $(this).val();
    //  updateLegend();
    //  updateNodeOutline()
    //});

    // preallocate linkedbyindex
    let linkedByIndex = {};

    // build the svg for the viz
    var svg = d3.select("#viz-1")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .call(d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform)
      }))
      .on("dblclick.zoom", null)
      .append("g");

    //domains for updating the legend
    var raceDomain = ["Native", "White", "Black", "Unknown"];
    var genderDomain = ["Male", "Female", "Unknown"];
    var clanDomain = ["Wolf", "Turtle", "Bear", "Wolf or Bear", "Turtle or Wolf", "Bear or Turtle", "Mahican", "Unknown or NA"];
    var modularityDomain = ["Canasteje-Oseragighte", "Kaghtereni-Uttijagaroondi", "Kenderago-Canostens", "Bridge", "English", "Dutch-English", "Scots-Irish", "Palatine", "NA"];
    var roleDomain = ["Baptized", "Parent", "Sponsor"];
    var legendDomain = raceDomain;
    var fillLegend = ['race'];
    var strokeLegend = ['race'];
    var allDomains = raceDomain.concat(genderDomain).concat(clanDomain).concat(modularityDomain).concat(roleDomain);

    var defaultPalette = ["rgb(234,95,95)", "rgb(58,32,154)", "rgb(255,177,78)", "rgb(255,242,0)", "rgb(117,250,122)", "rgb(0,155,123)", "rgb(140,62,174)", "rgb(154,154,154)", "rgb(0,0,0)"]

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

    var legend = d3.select("svg");

    legend.append("g")
      .attr("class", "legendOrdinal-1")
      .attr("id", "legend-1")
      .attr("transform", "translate(20,20)");

    var legendOrdinal = d3.legendColor()
      .shapePadding(10)
      .cellFilter(function(d) {
        var filterOut = $(allDomains).not(legendDomain).get();
        return !filterOut.includes(d.label)
      })
      .scale(color);

    legend.select(".legendOrdinal-1")
      .call(legendOrdinal);

    function redrawLegend() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      svg.selectAll(".legendOrdinal-1").remove();
      legend.select(".legendOrdinal-1").call(legendOrdinal);
    }

    // use force simulation
    // is there a way to change the collision distance on radius change?
    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.name;
      }).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return (d.betweenesscentrality_1745 * 150 + d.degree_1745) / 2 + 15
      }));

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip-1");
    var toggle = 0;

    // load the data, pass in error, graph variables
    d3.json("force-revised.json", function(error, graph) {
      if (error) throw error;

      console.log(graph)

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

      var node = svg.selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id", function(d) {
          return d.name + "-1"
        })
        .attr("r", function(d) {
          return d.betweenesscentrality_1745 * 150 + 8;
        })
        .attr("fill", function(d) {
          return color(d[colorFillCategory]);
        })
        .on("mouseover", function(d) {
          div.html("<h6>" + d.name + "</h6><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender + "</br><strong>Clan:</strong> " + d.clan + "</br><strong>First appeared as:</strong> " + d.role + "</br><strong>Subcommunity:</strong> " + d.modularity_class)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("opacity", 1);
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(50) // duration is critical for mouse over.. if a user is moving the mouse fast the tooltip is not responsive
            .style("opacity", 0);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on('dblclick', connectedNodes);

      var text = svg.selectAll("text")
        .data(node)
        .enter()
        .append("text");

      var labels = text
        .attr("x", function(d) {
          return d.cx
        })
        .attr("y", function(d) {
          return d.cy
        })
        .text(function(d) {
          return "( " + d.cx + ", " + d.cy + " )"
        })
      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
      simulation.force("link")
        .links(graph.links);

      function ticked() {
        link
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
        node
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
      var linkedByIndex = {};
      for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
      };

      // Loop over each "link" and determine if they are connectioned
      graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });

      // define a "lookup" function to get connections
      function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
      };
      links = d3.selectAll('line');

      // set opacity based on connections
      function connectedNodes() {
        if (toggle == 0) {
          // select the nodes
          d = d3.select(this).node().__data__;
          // loop over each node and style
          node.style("opacity", function(o) {
            // ? is a conditional operator of the form condition ? value-if-true : value-if-false
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.15;
          });
          toggle = 1;
        } else {
          node.style("opacity", 1);;
          toggle = 0;
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

    function updateLegend() {

      legendDomain = [];

      if (colorFillLegend == ['race']) {
        var fillLegend = raceDomain
      } else if (colorFillLegend == ['gender']) {
        var fillLegend = genderDomain
      } else if (colorFillLegend == ['clan']) {
        var fillLegend = clanDomain
      } else if (colorFillLegend == ['modularity_class']) {
        var fillLegend = modularityDomain
      } else if (colorFillLegend == ['role']) {
        var fillLegend = roleDomain
      }

      //if (colorStrokeLegend == ['race']) {
      //  var strokeLegend = raceDomain
      //} else if (colorStrokeLegend == ['gender']) {
      //  var strokeLegend = genderDomain
      //} else if (colorStrokeLegend == ['clan']) {
      //  var strokeLegend = clanDomain
      //} else if (colorStrokeLegend == ['modularity_class']) {
      //  var strokeLegend = modularityDomain
      //} else if (colorStrokeLegend == ['role']) {
      //  var strokeLegend = roleDomain
      //}

      if (typeof fillLegend == 'undefined') {
        fillLegend = raceDomain
      }
      //if (typeof strokeLegend == 'undefined') {
      //  strokeLegend = raceDomain
      //}

      legendDomain = fillLegend
      //if (fillLegend == strokeLegend) {
      //  legendDomain = fillLegend
      //} else {
      //  legendDomain = fillLegend.concat(strokeLegend)
      //}
    };

    // Update node size

    function updateNodeSize() {
      var allCircles = svg.selectAll('circle')
      // loop over each node, and update color attribute
      allCircles.transition().duration(300).attr("r", function(d) {
        if (nodeSize == 'betweenness') {
          nodeSizeValue = d["betweenesscentrality_" + selectedYear] * 150 + 8
        } else {
          nodeSizeValue = d["degree_" + selectedYear] + 2
        }
        return nodeSizeValue;
      })
      allCircles.exit().remove()
    };

    /* ------------ Update Node Color --------------*/
    // function to get all nodes, and change the color. Follow the general update pattern
    // https://bl.ocks.org/mbostock/3808218

    function updateNodeColor() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      var allCircles = svg.selectAll('circle')
      // loop over each node, and update color attribute
      allCircles.transition().duration(300).attr("fill", function(d, i) {
        return color(d[colorFillCategory])
      });
      allCircles.exit().remove();
      ////update legend
      redrawLegend();
    };

    function updateNodeOutline() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      var allCircles = svg.selectAll('circle')

      // loop over each node, and update color attribute
      allCircles.transition().duration(300).attr("stroke", function(d, i) {
        return color(d[colorFillCategory]);
      });
      allCircles.exit().remove()

      //update legend
      //redrawLegend();
    };

    function showLinkLines() {
      var filterId = [];
      var allLines = svg.selectAll('line');
      var allNodes = svg.selectAll('circle');
      // loop over each node, and update color attribute
      allLines.style("stroke-opacity", function(d, i) {
        return d.year <= parseInt(selectedYear) ? 0.7 : 0
      });
      allLines.exit().remove()
      allNodes.style('opacity', function(d, i) {
        return (d.year <= parseInt(selectedYear)) ? 1 : 0
      });
      allNodes.exit().remove()
    };

    // append essay text on year change
    //function showText(){
    //  $("#text").empty();
    //  var essayText
    //  $.getJSON('https://api.myjson.com/bins/fwjzg', function(data){
    //    for (var i = 0; i < data.length; i++){
    //      if (data[i].year == selectedYear) {
    //        essayText = data[i].text
    //      }
    //    }
    //    $("#text").append(essayText)
    //  });
    //};

    // viz-block-3

    //slider start year
    var selectedYearThree = 1745;
    $("#selected-year-3").change(function() {
      selectedYearThree = $(this).val();
      showLinkLinesThree();
      updateNodeSizeThree();
      //showText();
    });

    // label year slider
    $('#selected-year-3').on('input change', function() {
      $(this).next($('.slider_label-3')).html(this.value);
    });
    $('.slider_label-3').each(function() {
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    // variable to store node size
    var nodeSizeThree = ['degree'];

    // select node size
    $("#node-size-3").change(function() {
      nodeSizeThree = $(this).val();
      updateNodeSizeThree()
    });

    // variable to store button coloring
    var colorFillCategoryThree = ['gender'];
    //var colorStrokeCategoryThree = ['gender'];
    var colorFillLegendThree = ['gender'];
    //var colorStrokeLegendThree = ['gender'];

    // filter based on gender or color
    $("#filter-fill-3").change(function() {
      colorFillCategoryThree = $(this).val();
      colorFillLegendThree = $(this).val();
      updateLegendThree();
      updateNodeColorThree();
    });

    //$("#filter-stroke-3").change(function(){
    //  colorStrokeCategoryThree = $(this).val();
    //  colorStrokeLegendThree = $(this).val();
    //  updateLegendThree();
    //  updateNodeOutlineThree()
    //});

    // preallocate linkedbyindex
    let linkedByIndexThree = {};

    // build the svg for the viz
    var svgThree = d3.select("#viz-3")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .call(d3.zoom().on("zoom", function() {
        svgThree.attr("transform", d3.event.transform)
      }))
      .on("dblclick.zoom", null)
      .append("g");

    var legendDomainThree = genderDomain;
    var fillLegendThree = ['gender'];
    //var strokeLegendThree = ['gender'];

    var legendThree = d3.select("#viz-3").select("svg");

    legendThree.append("g")
      .attr("class", "legendOrdinal-3")
      .attr("id", "legend-3")
      .attr("transform", "translate(20,20)");

    var legendOrdinalThree = d3.legendColor()
      .shapePadding(10)
      .cellFilter(function(d) {
        var filterOut = $(allDomains).not(legendDomainThree).get();
        return !filterOut.includes(d.label)
      })
      .scale(color);

    legendThree.select(".legendOrdinal-3")
      .call(legendOrdinalThree);

    function redrawLegendThree() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      svgThree.selectAll(".legendOrdinal-3").remove();
      legendThree.select(".legendOrdinal-3").call(legendOrdinalThree);
    }

    // use force simulation
    // is there a way to change the collision distance on radius change?
    var simulationThree = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.name;
      }).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return (d.betweenesscentrality_1745 * 150 + d.degree_1745) / 2 + 15
      }));

    // Define the div for the tooltip
    var divThree = d3.select("body").append("div")
      .attr("class", "tooltip-3");
    var toggleThree = 0;

    // load the data, pass in error, graph variables
    d3.json("native.json", function(error, graph) {
      if (error) throw error;

      var linkThree = svgThree.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

      var nodeThree = svgThree.selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id", function(d) {
          return d.name + "-3"
        })
        .attr("r", function(d) {
          return d.degree_1745 + 2;
        })
        .attr("fill", function(d) {
          return color(d[colorFillCategoryThree]);
        })
        .on("mouseover", function(d) {
          div.html("<h6>" + d.name + "</h6><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender + "</br><strong>Clan:</strong> " + d.clan + "</br><strong>First appeared as:</strong> " + d.role + "</br><strong>Subcommunity:</strong> " + d.modularity_class)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("opacity", 1);
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(50) // duration is critical for mouse over.. if a user is moving the mouse fast the tooltip is not responsive
            .style("opacity", 0);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on('dblclick', connectedNodesThree);

      var textThree = svgThree.selectAll("text")
        .data(nodeThree)
        .enter()
        .append("text");

      var labelsThree = textThree
        .attr("x", function(d) {
          return d.cx
        })
        .attr("y", function(d) {
          return d.cy
        })
        .text(function(d) {
          return "( " + d.cx + ", " + d.cy + " )"
        })
      simulationThree
        .nodes(graph.nodes)
        .on("tick", tickedThree);
      simulationThree.force("link")
        .links(graph.links);

      function tickedThree() {
        linkThree
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
        nodeThree
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      }

      // mouse double click highlight is taken from this example:
      // http://www.coppelia.io/2014/06/finding-neighbours-in-a-d3-force-directed-layout-3/
      // we need to create an array of "connections" for quick lookup
      var linkedByIndexThree = {};
      for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndexThree[i + "," + i] = 1;
      };

      // Loop over each "link" and determine if they are connectioned
      graph.links.forEach(function(d) {
        linkedByIndexThree[d.source.index + "," + d.target.index] = 1;
      });

      // define a "lookup" function to get connections
      function neighboringThree(a, b) {
        return linkedByIndexThree[a.index + "," + b.index];
      };
      linksThree = d3.selectAll('line');

      // set opacity based on connections
      function connectedNodesThree() {
        if (toggleThree == 0) {
          // select the nodes
          d = d3.select(this).node().__data__;
          // loop over each node and style
          node.style("opacity", function(o) {
            // ? is a conditional operator of the form condition ? value-if-true : value-if-false
            return neighboringThree(d, o) | neighboringThree(o, d) ? 1 : 0.15;
          });
          toggleThree = 1;
        } else {
          node.style("opacity", 1);;
          toggleThree = 0;
        }
      };
    });

    //update legend domains

    function updateLegendThree() {
      legendDomainThree = [];

      if (colorFillLegendThree == ['race']) {
        var fillLegendThree = raceDomain
      } else if (colorFillLegendThree == ['gender']) {
        var fillLegendThree = genderDomain
      } else if (colorFillLegendThree == ['clan']) {
        var fillLegendThree = clanDomain
      } else if (colorFillLegendThree == ['modularity_class']) {
        var fillLegendThree = modularityDomain
      } else if (colorFillLegendThree == ['role']) {
        var fillLegendThree = roleDomain
      }

      if (typeof fillLegendThree == 'undefined') {
        fillLegendThree = genderDomain
      }
      //if (typeof strokeLegendThree == 'undefined') {
      //  strokeLegendThree = raceDomain
      //}

      legendDomainThree = fillLegendThree
    };

    // Update node size

    function updateNodeSizeThree() {
      var allCirclesThree = svgThree.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesThree.transition().duration(300).attr("r", function(d) {
        if (nodeSizeThree == 'betweenness') {
          nodeSizeValueThree = d["betweenesscentrality_" + selectedYearThree] * 150 + 5
        } else {
          nodeSizeValueThree = d["degree_" + selectedYearThree] + 2
        }
        return nodeSizeValueThree;
      })
      allCirclesThree.exit().remove()
    };

    /* ------------ Update Node Color --------------*/
    // function to get all nodes, and change the color. Follow the general update pattern
    // https://bl.ocks.org/mbostock/3808218

    function updateNodeColorThree() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      var allCirclesThree = svgThree.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesThree.transition().duration(300).attr("fill", function(d, i) {
        return color(d[colorFillCategoryThree])
      });
      allCirclesThree.exit().remove();
      ////update legend
      redrawLegendThree();
    };

    function updateNodeOutlineThree() {
      var color = d3.scaleOrdinal()
        .domain(allDomains)
        .range(selectedColorPalette);
      var allCirclesThree = svgThree.selectAll('circle')
      // loop over each node, and update color attribute
      allCirclesThree.transition().duration(300).attr("stroke", function(d, i) {
        return color(d[colorStrokeCategoryThree])
      });
      allCirclesThree.exit().remove();
      ////update legend
      redrawLegendThree();

    };

    function showLinkLinesThree() {
      var filterIdThree = [];
      var allLinesThree = svgThree.selectAll('line');
      var allNodesThree = svgThree.selectAll('circle');
      // loop over each node, and update color attribute
      allLinesThree.style("stroke-opacity", function(d, i) {
        return d.year <= parseInt(selectedYearThree) ? 0.7 : 0
      });
      allLinesThree.exit().remove()
      allNodesThree.style('opacity', function(d, i) {
        return (d.year <= parseInt(selectedYearThree)) ? 1 : 0
      });
      allNodesThree.exit().remove()
    };
