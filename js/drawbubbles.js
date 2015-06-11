function drawBubbles (data)
{
    //Width and height
    var w = window.innerWidth;
    //FIXME: Can't I do this by simple DOM traversal?? Yuck!
    var h = window.innerHeight - $('h1').height();

    //Original data
    var dataset = {
        nodes: data,
        edges: []
    };

    var values = [];
    for (var i = 0; i < dataset.nodes.length; i++) {
        values.push (dataset.nodes[i].value);
    }

    var scale = d3.scale.pow().exponent(0.3).domain ([d3.min (values), d3.max (values)]);

    //Initialize a default force layout, using the nodes and edges in dataset
    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w, h])
        .linkDistance([50])
        .charge([-500])
        .start();

    var colors = d3.scale.category20();

    //Create SVG element
    var svg = d3.select("#bubbles")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Create edges as lines
    var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 0);

    
    //Create nodes as circles
    var nodes = svg.selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d, i) {
            var rad = 100 * scale(d.value);
            return (rad < 30) ? 30+rad : rad;
        })
        .style("fill", function(d, i) {
	    return colors(i);
        })
        .call(force.drag);

    nodes.on ("dragend", function () {
        d3.event.sourceEvent.stopPropagation();
    });

    nodes.on ("click",
              function (d) {
                  if (d3.event.defaultPrevented)
                      return;
                  window.open (d.link);
              });

    var text = svg.selectAll ("text")
        .data (dataset.nodes)
        .enter()
        .append ("text");

    var textLabels = text
                         .attr ("x", function (d) { return d.x - 25; })
                         .attr ("y", function (d) { return d.y; })
                         .text (function (d) {return d.label;})
                         .attr ('font-family', "sans-serif")
                         .attr ("font-size", "14px")
                         .attr ("font-weight", "bold")
                         .attr ("fill","black");

    //Every time the simulation "ticks", this will be called
    force.on("tick", function() {

        edges.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });

        var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

        while (++i < n) q.visit(collide(nodes[i]));
        svg.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        nodes.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
        textLabels = text
                         .attr ("x", function (d) { return d.x - 25; })
                         .attr ("y", function (d) { return d.y; })
                         .text (function (d) {return d.label;})
                         .attr ('font-family', "sans-serif")
                         .attr ("font-size", "14px")
                         .attr ("font-weight", "bold")
                         .attr ("fill","black");
    });

}

function collide(node) {
    var r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}
