/* ######################## Specify default stuff here ###############*/
// colorbar palletes
var defaultPalette = ["rgb(234,95,95)", "rgb(58,32,154)", "rgb(255,177,78)", "rgb(255,242,0)", "rgb(117,250,122)", "rgb(0,155,123)", "rgb(140,62,174)", "rgb(154,154,154)", "rgb(0,0,0)"]
var CBPalette = ["#c57b5e", "#15387f", "#f6b752", "#ffed86", "#cce59d", "#649084", "#595aa9", "#a69a9e", "#000000"]
var raceDomain = ["Native", "White", "Black", "Unknown"];
var genderDomain = ["Male", "Female", "Unknown"];
var clanDomain = ["Wolf", "Turtle", "Bear", "Wolf or Bear", "Turtle or Wolf", "Bear or Turtle", "Mahican", "Unknown or NA"];
var modularityDomain = ["Canasteje-Oseragighte", "Kaghtereni-Uttijagaroondi", "Kenderago-Canostens", "Bridge", "English", "Dutch-English", "Scots-Irish", "Palatine", "NA"];
var roleDomain = ["Baptized", "Parent", "Sponsor"];
var legendDomain = raceDomain;
var fillLegend = ['race'];
var strokeLegend = ['race'];
var allDomains = raceDomain.concat(genderDomain).concat(clanDomain).concat(modularityDomain).concat(roleDomain);

/* Global variable that stores all chart configurations. Anytime a filter is selected,
we update the global configuration. This will allow the ability to have interactive
updates as necessary.

This is a good example http://languagenetwork.cotrino.com/
*/
var networkChart = {
  vis: null,
  nodes: null,
  links: null,
  force: null,
  selectedYear: 1745,
  selectedColorPalette: defaultPalette,
  nodeSize: 'betweeness',
  colorFillCategory: 'race'
};
/* ####################################################################*/

/* ###################### Data Loading Block ###################### */
// load the force data
var forceData = $.getJSON('force-revised.json',
  function(d) {
    buildNetwork(d);
    return d.responseJSON
  }
);
/* ####################################################################*/

// filter function, for year selection
function filterDataByYear(data, year) {
  var output = {
    'links': Array(),
    'nodes': Array()
  }

  // check the nodes
  for (var i = 0; i < data['nodes'].length; i++) {
    if (data['nodes'][i].year <= year) {
      output['nodes'].push(data['nodes'][i])
    };
  };

  // Extract sources that were kept
  sources = output['nodes'].map(x => x['name'])

  // take only the links to a given source
  for (var i = 0; i < data['links'].length; i++) {
    if ((sources.includes(data['links'][i]['source'])) && (sources.includes(data['links'][i]['target']))) {
      output['links'].push(data['links'][i])
    }
  }
  return output
};

// Write a function to build the network, based on input data
function buildNetwork(data) {

  data = filterDataByYear(data, networkChart['selectedYear']);

  networkChart.nodes = data['nodes']
  networkChart.links = data['links']

};

// $.when(forceData).done(
//   function(x){
//     buildNetwork(x)
//     // mouse double click highlight is taken from this example:
//     // http://www.coppelia.io/2014/06/finding-neighbours-in-a-d3-force-directed-layout-2/
//     // we need to create an array of "connections" for quick lookup
//
//   });

/* ------------ Network Generation Block ----------*/
//set color scale
var color = d3.scaleOrdinal()
  .domain(allDomains)
  .range(networkChart.selectedColorPalette);

function updateColorPalette() {
  var color = d3.scaleOrdinal()
    .domain(allDomains)
    .range(networkChart.selectedColorPalette);
}

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

function refresh(nodes) {

  // transition
  var t = d3.transition()
    .duration(750);

  // JOIN new nodes with old nodes
  node = node.data(nodes, function(d) {
    return d.name;
  });
  node.exit()
    .style("fill", "#b26745")
    .transition(t)
    .attr("r", 1e-6)
    .remove();

  node
    .transition(t);

  node.enter().append("circle")
    .attr("id", function(d) {
      return d.name + "-1"
    })
    .attr("r", function(d) {
      return d.betweenesscentrality_1745 * 150 + 8;
    })
    .attr("fill", function(d) {
      return color(d[networkChart.colorFillCategory]);
    })
    .on("mouseover", function(d) {
      div.html("<h6>" + d.name + "</h6><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender + "</br><strong>Clan:</strong> " + d.clan + "</br><strong>First appeared as:</strong> " + d.role +
          "</br><strong>Subcommunity:</strong> " + d.modularity_class)
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

  console.log(node)

  text = svg.selectAll("text")
    .data(node)
    .enter()
    .append("text");

  labels = text
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
    .nodes(networkChart.nodes)
    .on("tick", ticked);
  simulation.force("link")
    .links(networkChart.links);

    for (i = 0; i < networkChart.nodes.length; i++) {
      linkedByIndex[i + "," + i] = 1;
    };

    // Loop over each "link" and determine if they are connectioned
    networkChart.links.forEach(function(d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
}
