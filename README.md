# d3-source-sink

D3 (v3) plugin for generating a source-sink graph.

## Usage

```javascript
var nodes = [
    { "id": 0, "name": "0", "rootIds": [0] },
    { "id": 1, "name": "1", "rootIds": [0, 26] },
    { "id": 2, "name": "2", "rootIds": [0, 26] },
    { "id": 3, "name": "3", "rootIds": [0, 26] },
    { "id": 4, "name": "4", "rootIds": [0, 26] },
    { "id": 5, "name": "5", "rootIds": [0, 26] },
    { "id": 6, "name": "6", "rootIds": [0, 26] },
    { "id": 7, "name": "7", "rootIds": [0, 26] },
    { "id": 8, "name": "8", "rootIds": [0] },
    { "id": 9, "name": "9", "rootIds": [0] },
    { "id": 10, "name": "10", "rootIds": [0] },
    { "id": 11, "name": "11", "rootIds": [0] },
    { "id": 12, "name": "12", "rootIds": [12] },
    { "id": 13, "name": "13", "rootIds": [12] },
    { "id": 14, "name": "14", "rootIds": [12] },
    { "id": 15, "name": "15", "rootIds": [12] },
    { "id": 16, "name": "16", "rootIds": [12] },
    { "id": 17, "name": "17", "rootIds": [12] },
    { "id": 18, "name": "18", "rootIds": [12] },
    { "id": 19, "name": "19", "rootIds": [12] },
    { "id": 20, "name": "20", "rootIds": [12] },
    { "id": 21, "name": "21", "rootIds": [21] },
    { "id": 22, "name": "22", "rootIds": [21] },
    { "id": 23, "name": "23", "rootIds": [21] },
    { "id": 24, "name": "24", "rootIds": [21] },
    { "id": 25, "name": "25", "rootIds": [21] },
    { "id": 26, "name": "26", "rootIds": [26] },
    { "id": 27, "name": "27", "rootIds": [26] },
    { "id": 28, "name": "28", "rootIds": [26] },
    { "id": 29, "name": "29", "rootIds": [26] },
    { "id": 30, "name": "30", "rootIds": [26] }];

var links = [
    { "source": 0, "sink": 1, },
    { "source": 1, "sink": 2, },
    { "source": 2, "sink": 3, },
    { "source": 3, "sink": 4, },
    { "source": 4, "sink": 5, },
    { "source": 5, "sink": 6, },
    { "source": 6, "sink": 7, },
    { "source": 7, "sink": 8, },
    { "source": 8, "sink": 9, },
    { "source": 9, "sink": 10, },
    { "source": 10, "sink": 11, },
    { "source": 12, "sink": 13, },
    { "source": 13, "sink": 14, },
    { "source": 14, "sink": 15, },
    { "source": 15, "sink": 16, },
    { "source": 16, "sink": 17, },
    { "source": 17, "sink": 18, },
    { "source": 18, "sink": 19, },
    { "source": 19, "sink": 20, },
    { "source": 21, "sink": 22, },
    { "source": 22, "sink": 23, },
    { "source": 23, "sink": 24, },
    { "source": 24, "sink": 25, },
    { "source": 26, "sink": 1, },
    { "source": 7, "sink": 27, },
    { "source": 27, "sink": 28, },
    { "source": 28, "sink": 29, },
    { "source": 29, "sink": 30, }];

var sourcesink = d3.sourceSink()
    .nodeHeight(25)
    .nodeWidth(100)
    .nodePadding(10)
    .nodes(nodes)
    .links(links)
    .layout();

var chart = d3.select("#chart")
    .append('svg')
    .append('g');

var link = chart.append('g')
    .selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('d', sourcesink.link());

var node = chart.append('g')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    })
    .append('rect')
    .attr('height', function (d) { return d.dy; })
    .attr('width', function (d) { return d.dx; });
```
