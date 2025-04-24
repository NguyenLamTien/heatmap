const datasetUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
fetch(datasetUrl)
    .then(response => response.json())
    .then(data => {
        const margin = { top: 40, right: 40, bottom: 80, left: 100 },
            width = 1000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        const svg = d3.select("#heatmap")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleBand()
            .domain(d3.range(1754, 2016))
            .range([0, width])
            .padding(0.01);

        const yScale = d3.scaleBand()
            .domain(d3.range(1, 13))
            .range([0, height])
            .padding(0.01);

        const colorScale = d3.scaleQuantize()
            .domain([data.monthlyVariance[0].variance, data.monthlyVariance[data.monthlyVariance.length - 1].variance])
            .range(["#d73027", "#fc8d59", "#fee08b", "#91bfdb", "#4575b4"]);

        svg.selectAll(".cell")
            .data(data.monthlyVariance)
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.month))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => colorScale(d.variance))
            .attr("data-year", d => d.year)
            .attr("data-month", d => d.month - 1)
            .attr("data-temp", d => d.variance)
            .on("mouseover", function(event, d) {
                const tooltip = d3.select("#tooltip");
                tooltip.style("visibility", "visible")
                    .html(`Year: ${d.year}<br>Month: ${d.month}<br>Temperature: ${d.variance}`)
                    .attr("data-year", d.year)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("visibility", "hidden");
            });

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .attr("id", "y-axis")
            .call(d3.axisLeft(yScale).tickFormat(d => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d - 1]));

        const legend = d3.select("#legend")
            .selectAll("rect")
            .data(colorScale.range())
            .enter().append("rect")
            .style("fill", d => d)
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => i * 30)
            .attr("y", 0);

        const legendText = d3.select("#legend")
            .selectAll("text")
            .data(colorScale.range())
            .enter().append("text")
            .attr("x", (d, i) => i * 30)
            .attr("y", 35)
            .text((d, i) => `${i * 5}°`);
    });