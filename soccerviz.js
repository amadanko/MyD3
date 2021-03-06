


function createSoccerViz() {

  d3.csv('worldcup.csv', function(data){overallTeamViz(data);})

  function overallTeamViz(incomingData) {
    d3.select("svg")
      .append("g")
      .attr("id", "teamsG")
      .attr("transform", "translate(50,300)")
      .selectAll("g")
      .data(incomingData)
      .enter()
      .append("g")
      .attr("class", "overallG")
      .attr("transform", function (d,i) {return "translate(" + (i*50) + ",0)"});

      var teamG=d3.selectAll("g.overallG");

      teamG
        .append("circle")
        .attr("r",0)
        .transition()
        .delay(function(d,i) {return i * 100})
        .duration(500)
        .attr("r", 40)
        .transition()
        .duration(500)
        .attr("r",20);

      teamG
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", 30)
          .text(d => d.team)

      var dataKeys = d3.keys(incomingData[0]).filter(function(el) {
        return el != "team" && el !="region";
      });

      d3.select("#controls").selectAll("button.teams")
        .data(dataKeys).enter()
        .append("button")
        .on("click", buttonClick)
      .html(function(d) {return d;});

      function buttonClick(datapoint) {
        var maxValue = d3.max(incomingData, function(d) {
          return parseFloat(d[datapoint]);
        });

      var radiusScale = d3.scaleLinear()
        .domain([0,maxValue]).range([2,20]);

      d3.selectAll("g.overallG").select("circle").transition().duration(1000)
        .attr("r", function(d) {
          return radiusScale(d[datapoint]);
        });

      };

/*
      teamG.on("mouseover", highlightRegion);
      function highlightRegion(d) {
        d3.selectAll("g.overallG").select("circle")
          .style("fill", function(p) {
            return p.region == d.region ? "red" : "gray";
          });
      }
*/
    teamG.on("mouseover", highlightRegion);

      function highlightRegion (d) {
         d3.select(this).select("text").classed("active", true).attr("y", 10);

         d3.selectAll("g.overallG").select("circle")
           .each(function (p) {
             p.region == d.region ?
               d3.select(this).classed("active", true) :
               d3.select(this).classed("inactive", true);
           });

         this.parentElement.appendChild(this);
       };


       teamG.on("mouseout", unHighlight);

               function unHighlight() {
                 d3.selectAll("g.overallG").select("circle").attr("class", "");
                 d3.selectAll("g.overallG").select("text")
                   .classed("active", false).attr("y", 30);
               };



      }

  }
