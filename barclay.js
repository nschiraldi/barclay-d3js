var parentDiv = document.getElementById("viz");
    //var width = 800;
    //var height = 650;
    var width = parentDiv.clientWidth;
    var height = parentDiv.clientHeight;
      
    //slider start year
    var selectedYear = 1733;
    $("#selected-year").change(function(){
      selectedYear = $(this).val();
      showLinkLines();
      showText();
    });
    
    // label year slider
    $('.slider').on('input change', function(){
          $(this).next($('.slider_label')).html(this.value);
        });
      $('.slider_label').each(function(){
          var value = $(this).prev().attr('value');
          $(this).html(value);
        }); 
    
    // variable to store button coloring
    var colorFillCategory = ['race'];
    var colorStrokeCategory = ['race'];
    var colorFillLegend = ['race'];
    var colorStrokeLegend = ['race'];
    
    // filter based on gender or color
    $("#filter-fill").change(function(){
      colorFillCategory = $(this).val();
      colorFillLegend = $(this).val();
      updateLegend();
      console.log(legendDomain);
      updateNodeColor()
    });
    
    $("#filter-stroke").change(function(){
      colorStrokeCategory = $(this).val();
      colorStrokeLegend = $(this).val();
      updateLegend();
      console.log(legendDomain);
      updateNodeOutline()
    });
    
    // preallocate linkedbyindex
    let linkedByIndex = {};
    
    // build the svg for the viz
    var svg = d3.select("#viz")
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
    var genderDomain = ["Male", "Female"];
    var clanDomain = ["Wolf", "Turtle", "Bear", "Wolf or Bear", "Turtle or Wolf", "Bear or Turtle", "Unknown or NA"];
    var modularityDomain = ["Canasteje-Oseragighte", "Kaghtereni-Uttijagaroondi", "Kenderago", "Bridge", "English", "Dutch-English", "Scots-Irish", "Palatine", "NA"];
    var roleDomain = ["Baptized", "Parent", "Sponsor"];
    var legendDomain = raceDomain;
    var fillLegend = ['race'];
    var strokeLegend = ['race'];
    
    //set color scale
    //how to update legend to reflect changing labels on color select?
    var color = d3.scaleOrdinal()
      .domain(legendDomain)
      .range(["#ea5f5f", "#ffb14e", "#fff200", "#75fa7a", "#009b7b", "#2c15b2", "#9d02d7", "#000000", "#9a9a9a"]);
    
    var legend = d3.select("svg");
    
    legend.append("g")
      .attr("class", "legendOrdinal")
      .attr("id", "legend")
      .attr("transform", "translate(20,20)");
    
    var legendOrdinal = d3.legendColor()
      .shapePadding(10)
      .scale(color);
    
    legend.select(".legendOrdinal")
      .call(legendOrdinal);
    
    // use force simulation
    var simulation = d3.forceSimulation()
      .force("collide", d3.forceCollide().radius(function(d) { return d.betweenesscentrality/3000 + 15; }))
      .force("link", d3.forceLink().id(function(d) {
        return d.name;
      }).strength(0.5))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip");
    var toggle = 0;
    
    // load the data, pass in error, graph variables
    d3.json("force-revised.json", function(error, graph) {
      if (error) throw error;
      
      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });
      
      var node = svg.selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.betweenesscentrality/3000 + 5; })
        .attr("fill", function(d) {
          return color(d[colorFillCategory]);
        })
        .attr("stroke", function(d) {
          return color(d[colorStrokeCategory]);
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
      graph.links.forEach(function (d) {
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
              node.style("opacity", function (o) {
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
      
      if (colorStrokeLegend == ['race']) {
        var strokeLegend = raceDomain
      } else if (colorStrokeLegend == ['gender']) {
        var strokeLegend = genderDomain
      } else if (colorStrokeLegend == ['clan']) {
        var strokeLegend = clanDomain
      } else if (colorStrokeLegend == ['modularity_class']) {
        var strokeLegend = modularityDomain
      } else if (colorStrokeLegend == ['role']) {
        var strokeLegend = roleDomain
      }
      
      if (typeof fillLegend == 'undefined') {
        fillLegend = raceDomain
      }
      if (typeof strokeLegend == 'undefined') {
        strokeLegend = raceDomain
      }
      
      if (fillLegend == strokeLegend) {
        legendDomain = fillLegend
      } else {
        legendDomain = fillLegend.concat(strokeLegend)
      }
    };
    
    /* ------------ Update Node Color --------------*/
    // function to get all nodes, and change the color. Follow the general update pattern
    // https://bl.ocks.org/mbostock/3808218
    
    function updateNodeColor(){
      var allCircles = svg.selectAll('circle')
      
      // loop over each node, and update color attribute
      allCircles.attr("fill", function(d,i){
        return color(d[colorFillCategory])
      });
      allCircles.exit().remove()
      
      //update legend
      var selection = legend.select(".legendOrdinal");
      console.log(selection);
      selection.exit().remove();
      legend.select(".legendOrdinal").call(legendOrdinal);
    };
    
    function updateNodeOutline(){
      var allCircles = svg.selectAll('circle')
      
      // loop over each node, and update color attribute
      allCircles.attr("stroke", function(d,i){
        return color(d[colorStrokeCategory])
      });
      allCircles.exit().remove()
      
      //update legend
      var selection = legend.select(".legendOrdinal");
      console.log(selection);
      selection.exit().remove();
      legend.select(".legendOrdinal").call(legendOrdinal);
    };
    
    function showLinkLines(){
      var filterId = [];
      var allLines = svg.selectAll('line');
      var allNodes = svg.selectAll('circle');
      // loop over each node, and update color attribute
      allLines.style("stroke-opacity", function(d,i){
        return d.year <= parseInt(selectedYear) ? 0.7 : 0
      });
      allLines.exit().remove()
      allNodes.style('opacity',function(d,i){
        return (d.year <= parseInt(selectedYear))? 1 : 0
      });
      allNodes.exit().remove()
    };
    
    function showText(){
      $("#text").empty();
      var essayText
      $.getJSON('https://api.myjson.com/bins/5yegs', function(data){
        for (var i = 0; i < data.length; i++){
          if (data[i].year == selectedYear) {
            essayText = data[i].text
          }
        }
        $("#text").append(essayText)
      });
    };
