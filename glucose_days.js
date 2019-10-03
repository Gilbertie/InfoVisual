(function (d3) {
  'use strict';

  const svg = d3.select('#svg_glucouse_days');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  // 将白色矩形放在此svg底层，否则放大后不能遮住其他svg
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

  // 输入data，完成svg渲染
  const render = data => {
    // constants
    const title = 'Glucose vs Days on PKT';
    const margin = { top: 60, right: 160, bottom: 88, left: 105 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);

    // axis
    const xValue = d => d.Days_on_PKT;
    const xAxisLabel = 'Days on PKT';

    const yValue = d => d.Blood_glucose_mg_per_dL;
    const yAxisLabel = 'Glucose (mg/dL)';

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);

    // line
        // line color
    const colorValue = d => d.Patient_ID;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    const lastYValue = d =>
      yValue(d.values[d.values.length - 1]);

    const nested = d3.nest()
      .key(colorValue)
      .entries(data)
      .sort((a, b) =>
        d3.descending(lastYValue(a), lastYValue(b))
      );

    colorScale.domain(nested.map(d => d.key));

        //
     const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    g.selectAll('.line-path').data(nested)
      .enter().append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key));

    // 放大与缩小
    var zoomed = false;
    svg.on("click", function () {
      if (!zoomed) { // 放大
        svg.transition().duration(900)
            // 系数是试出来的
            .attr("transform", "scale(" + 2.2 + ") translate(" + width/3.6 + "," + height/4 + ")");
        zoomed = true;
        // 图层置顶，遮盖其他svg
        svg.raise();
      } else { // 缩小
        svg.transition().duration(900)
            .attr("transform", "scale(" + 1 + ") translate(" + 0 + "," + 0 + ")");
        zoomed = false;
      }
    })

  };

  // 读取数据，调用render()
  d3.csv("./test.csv")
    .then(data => {
      data.forEach(d => {
        d.Days_on_PKT = +d.Days_on_PKT;
        d.Blood_glucose_mg_per_dL = +d.Blood_glucose_mg_per_dL;
      });
      render(data);
    });

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2NvbG9yTGVnZW5kLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGNvbG9yTGVnZW5kID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbG9yU2NhbGUsXG4gICAgY2lyY2xlUmFkaXVzLFxuICAgIHNwYWNpbmcsXG4gICAgdGV4dE9mZnNldFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgZ3JvdXBzID0gc2VsZWN0aW9uLnNlbGVjdEFsbCgnZycpXG4gICAgLmRhdGEoY29sb3JTY2FsZS5kb21haW4oKSk7XG4gIGNvbnN0IGdyb3Vwc0VudGVyID0gZ3JvdXBzXG4gICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aWNrJyk7XG4gIGdyb3Vwc0VudGVyXG4gICAgLm1lcmdlKGdyb3VwcylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT5cbiAgICAgICAgYHRyYW5zbGF0ZSgwLCAke2kgKiBzcGFjaW5nfSlgXG4gICAgICApO1xuICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIGdyb3Vwc0VudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgnY2lyY2xlJykpXG4gICAgICAuYXR0cigncicsIGNpcmNsZVJhZGl1cylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3JTY2FsZSk7XG5cbiAgZ3JvdXBzRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgndGV4dCcpKVxuICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAuYXR0cigneCcsIHRleHRPZmZzZXQpO1xufSIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgY3N2LFxuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVUaW1lLFxuICBzY2FsZU9yZGluYWwsXG4gIGV4dGVudCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIGxpbmUsXG4gIGN1cnZlQmFzaXMsXG4gIG5lc3QsXG4gIHNjaGVtZUNhdGVnb3J5MTAsXG4gIGRlc2NlbmRpbmdcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBjb2xvckxlZ2VuZCB9IGZyb20gJy4vY29sb3JMZWdlbmQnO1xuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcblxuY29uc3Qgd2lkdGggPSArc3ZnLmF0dHIoJ3dpZHRoJyk7XG5jb25zdCBoZWlnaHQgPSArc3ZnLmF0dHIoJ2hlaWdodCcpO1xuXG5jb25zdCByZW5kZXIgPSBkYXRhID0+IHtcbiAgY29uc3QgdGl0bGUgPSAnQSBXZWVrIG9mIFRlbXBlcmF0dXJlIEFyb3VuZCB0aGUgV29ybGQnO1xuICBcbiAgY29uc3QgeFZhbHVlID0gZCA9PiBkLnRpbWVzdGFtcDtcbiAgY29uc3QgeEF4aXNMYWJlbCA9ICdUaW1lJztcbiAgXG4gIGNvbnN0IHlWYWx1ZSA9IGQgPT4gZC50ZW1wZXJhdHVyZTtcbiAgY29uc3QgY2lyY2xlUmFkaXVzID0gNjtcbiAgY29uc3QgeUF4aXNMYWJlbCA9ICdUZW1wZXJhdHVyZSc7XG4gIFxuICBjb25zdCBjb2xvclZhbHVlID0gZCA9PiBkLmNpdHk7XG4gIFxuICBjb25zdCBtYXJnaW4gPSB7IHRvcDogNjAsIHJpZ2h0OiAxNjAsIGJvdHRvbTogODgsIGxlZnQ6IDEwNSB9O1xuICBjb25zdCBpbm5lcldpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgY29uc3QgaW5uZXJIZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgXG4gIGNvbnN0IHhTY2FsZSA9IHNjYWxlVGltZSgpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICAgIC5uaWNlKCk7XG4gIFxuICBjb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeVZhbHVlKSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSlcbiAgICAubmljZSgpO1xuICBcbiAgY29uc3QgY29sb3JTY2FsZSA9IHNjYWxlT3JkaW5hbChzY2hlbWVDYXRlZ29yeTEwKTtcbiAgXG4gIGNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuICBcbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVySGVpZ2h0KVxuICAgIC50aWNrUGFkZGluZygxNSk7XG4gIFxuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVyV2lkdGgpXG4gICAgLnRpY2tQYWRkaW5nKDEwKTtcbiAgXG4gIGNvbnN0IHlBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh5QXhpcyk7XG4gIHlBeGlzRy5zZWxlY3RBbGwoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHlBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCAtNjApXG4gICAgICAuYXR0cigneCcsIC1pbm5lckhlaWdodCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHJvdGF0ZSgtOTApYClcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnRleHQoeUF4aXNMYWJlbCk7XG4gIFxuICBjb25zdCB4QXhpc0cgPSBnLmFwcGVuZCgnZycpLmNhbGwoeEF4aXMpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke2lubmVySGVpZ2h0fSlgKTtcbiAgXG4gIHhBeGlzRy5zZWxlY3QoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHhBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCA4MClcbiAgICAgIC5hdHRyKCd4JywgaW5uZXJXaWR0aCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAudGV4dCh4QXhpc0xhYmVsKTtcbiAgXG4gIGNvbnN0IGxpbmVHZW5lcmF0b3IgPSBsaW5lKClcbiAgICAueChkID0+IHhTY2FsZSh4VmFsdWUoZCkpKVxuICAgIC55KGQgPT4geVNjYWxlKHlWYWx1ZShkKSkpXG4gICAgLmN1cnZlKGN1cnZlQmFzaXMpO1xuICBcbiAgY29uc3QgbGFzdFlWYWx1ZSA9IGQgPT5cbiAgICB5VmFsdWUoZC52YWx1ZXNbZC52YWx1ZXMubGVuZ3RoIC0gMV0pO1xuICBcbiAgY29uc3QgbmVzdGVkID0gbmVzdCgpXG4gICAgLmtleShjb2xvclZhbHVlKVxuICAgIC5lbnRyaWVzKGRhdGEpXG4gICAgLnNvcnQoKGEsIGIpID0+XG4gICAgICBkZXNjZW5kaW5nKGxhc3RZVmFsdWUoYSksIGxhc3RZVmFsdWUoYikpXG4gICAgKTtcbiAgXG4gIGNvbnNvbGUubG9nKG5lc3RlZCk7XG4gIFxuICBjb2xvclNjYWxlLmRvbWFpbihuZXN0ZWQubWFwKGQgPT4gZC5rZXkpKTtcbiAgXG4gIGcuc2VsZWN0QWxsKCcubGluZS1wYXRoJykuZGF0YShuZXN0ZWQpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLXBhdGgnKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IGxpbmVHZW5lcmF0b3IoZC52YWx1ZXMpKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsIGQgPT4gY29sb3JTY2FsZShkLmtleSkpO1xuICBcbiAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlJylcbiAgICAgIC5hdHRyKCd5JywgLTEwKVxuICAgICAgLnRleHQodGl0bGUpO1xuICBcbiAgc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoNzkwLDEyMSlgKVxuICAgIC5jYWxsKGNvbG9yTGVnZW5kLCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY2lyY2xlUmFkaXVzOiAxMyxcbiAgICAgIHNwYWNpbmc6IDMwLFxuICAgICAgdGV4dE9mZnNldDogMTVcbiAgICB9KTtcbn07XG5cbmNzdignaHR0cHM6Ly92aXpodWIuY29tL2N1cnJhbi9kYXRhc2V0cy9kYXRhLWNhbnZhcy1zZW5zZS15b3VyLWNpdHktb25lLXdlZWsuY3N2JylcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgZGF0YS5mb3JFYWNoKGQgPT4ge1xuICAgICAgZC50ZW1wZXJhdHVyZSA9ICtkLnRlbXBlcmF0dXJlO1xuICAgICAgZC50aW1lc3RhbXAgPSBuZXcgRGF0ZShkLnRpbWVzdGFtcCk7XG4gICAgfSk7XG4gICAgcmVuZGVyKGRhdGEpO1xuICB9KTsiXSwibmFtZXMiOlsic2VsZWN0Iiwic2NhbGVUaW1lIiwiZXh0ZW50Iiwic2NhbGVMaW5lYXIiLCJzY2FsZU9yZGluYWwiLCJzY2hlbWVDYXRlZ29yeTEwIiwiYXhpc0JvdHRvbSIsImF4aXNMZWZ0IiwibGluZSIsImN1cnZlQmFzaXMiLCJuZXN0IiwiZGVzY2VuZGluZyIsImNzdiJdLCJtYXBwaW5ncyI6Ijs7O0VBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ2pELEVBQUUsTUFBTTtFQUNSLElBQUksVUFBVTtFQUNkLElBQUksWUFBWTtFQUNoQixJQUFJLE9BQU87RUFDWCxJQUFJLFVBQVU7RUFDZCxHQUFHLEdBQUcsS0FBSyxDQUFDOztFQUVaLEVBQUUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFDekMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLE1B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
