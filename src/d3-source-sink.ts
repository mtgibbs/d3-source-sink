/// <reference types="d3" />

(<any>d3).sourceSink = (): SourceSink => {

    let _nodeHeight: number = 24;
    let _nodeWidth: number = 24;
    let _nodePadding: number = 10;

    let _nodes: Array<INode> = [];
    let _links: Array<ILink> = [];

    const _sourceSink: SourceSink = {};

    _sourceSink.nodeHeight = (height) => {
        if (typeof height === 'undefined')
            return _nodeHeight;
        _nodeHeight = height;
        return _sourceSink;
    };

    _sourceSink.nodeWidth = (nodewidth) => {
        if (typeof nodewidth === 'undefined')
            return _nodeWidth;
        _nodeWidth = nodewidth;
        return _sourceSink;
    };

    _sourceSink.nodePadding = (nodepadding) => {
        if (typeof nodepadding === 'undefined')
            return _nodePadding;
        _nodePadding = nodepadding;
        return _sourceSink;
    };

    _sourceSink.links = (links) => {
        if (typeof links === 'undefined')
            return _links;
        _links = links;
        return _sourceSink;
    };

    _sourceSink.nodes = (nodes) => {
        if (typeof nodes === 'undefined')
            return _nodes;
        _nodes = nodes;
        return _sourceSink;
    };

    _sourceSink.layout = () => {
        SourceSinkHelper.initializeLinks(_nodes, _links);
        SourceSinkHelper.computeNodeDepth(_nodes, _nodeHeight, _nodePadding);
        return _sourceSink;
    };

    _sourceSink.link = () => {

        let _curvature = .5;

        const _link = (link: ILink): string => {
            return SourceSinkHelper.computeLinkPath(link, _nodeHeight, _curvature);
        };

        // HACK: Find a better way to make this function in a more typescripty way
        (<any>_link).curvature = (curvature: number): any => {
            if (typeof curvature === 'undefined')
                return _curvature;
            _curvature = curvature;
            return _link;
        };

        return _link;
    };

    return _sourceSink;
};

class SourceSinkHelper {

    public static initializeLinks(nodes: Array<INode>, links: Array<ILink>): void {
        nodes.forEach(node => {
            node.sourceLinks = [];
            node.sinkLinks = [];
        });

        links.forEach(link => {
            let source = link.source;
            let sink = link.sink;

            if (typeof source === 'number')
                source = link.source = nodes[source];

            if (typeof sink === 'number')
                sink = link.sink = nodes[sink];

            (<INode>source).sinkLinks.push(link);
            (<INode>sink).sourceLinks.push(link);
        });
    }

    public static computeNodeDepth(nodes: Array<INode>, nodeHeight: number, nodePadding:number) {
        let remainingNodes = nodes;
        let y = 0;

        while (remainingNodes.length) {
            const nextNodes: Array<INode> = [];

            for (let node of remainingNodes) {
                node.y = y;
                node.dy = nodeHeight;

                for (let link of node.sourceLinks) {
                    if (nextNodes.indexOf(<INode>link.sink) < 0)
                        nextNodes.push(<INode>link.sink);
                }
            }

            remainingNodes = nextNodes;
            y++;
        }

        nodes.filter(node => {
            return !node.sourceLinks.length;
        }).forEach(node => {
            node.y = y - 1;
        });

        for (let node of nodes) {
            node.y *= nodeHeight + nodePadding;
        }
    }

    public static computeLinkPath(link: ILink, nodeHeight: number, curvature: number): string {

        const sourceNode = <INode>link.source;
        const sinkNode = <INode>link.sink;

        let x0 = 0;
        if (sourceNode.sinkLinks.length === 1)
            x0 = sourceNode.x + (sourceNode.dx / 2);
        else {
            let centerOffset = (sourceNode.dx / 2);

            const index = sourceNode.sinkLinks.indexOf(link);

            if (sourceNode.sinkLinks.length % 2 === 0) {
                const midpoint = sourceNode.sinkLinks.length / 2 - 1;
                const distanceCalc = index - midpoint;
                centerOffset = centerOffset + distanceCalc;

            } else {
                const midpoint = (sourceNode.sinkLinks.length - 1) / 2;
                const distanceCalc = index - midpoint;
                centerOffset = centerOffset + distanceCalc;
            }

            x0 = sourceNode.x + centerOffset;
        }

        const x1 = sinkNode.x + sinkNode.dx / 2,
            y0 = sourceNode.y + nodeHeight,
            y1 = sinkNode.y,
            yi = d3.interpolateNumber(y0, y1),
            y2 = yi(curvature),
            y3 = yi(1 - curvature);

        return `M${x0},${y0} C${x0},${y2} ${x1},${y3} ${x1},${y1}`;
    }

    public static computeNodeBreadths(nodes: Array<INode>, links: Array<ILink>, nodeWidth: number, nodePadding: number) {

        const nodesByDepth = d3.nest()
            .key((d: any) => { return d.y; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map((d: any) => { return d.values; });

        nodesByDepth.forEach((nodes: Array<INode>) => {
            nodes.forEach((node, i) => {
                node.x = i * (nodeWidth + nodePadding);
                node.dx = nodeWidth;
            });
        });

        links.forEach(function (link) {
            link.dx = (nodeWidth + nodePadding);
        });
    }

    public static computeLinkBreadths(nodes: Array<INode>) {
        nodes.forEach((node) => {
            node.sourceLinks.sort(SourceSinkHelper.ascendingSourceBreadth);
            node.sinkLinks.sort(SourceSinkHelper.ascendingSinkBreadth);
        });

        nodes.forEach((node) => {

            let sx = 0;
            let tx = 0;
            node.sourceLinks.forEach((link) => {
                sx += link.dx;
            });
            node.sinkLinks.forEach((link) => {
                tx += link.dx;
            });
        });
    }

    private static ascendingSourceBreadth(a: ILink, b: ILink) {
        return (<INode>a.source).x - (<INode>b.source).x;
    }

    private static ascendingSinkBreadth(a: ILink, b: ILink) {
        return (<INode>a.sink).x - (<INode>b.sink).x;
    }
}

interface SourceSink {
    nodeHeight?: (height?: number) => SourceSink | number;
    nodeWidth?: (width?: number) => SourceSink | number;
    nodePadding?: (padding?: number) => SourceSink | number;
    nodes?: (nodes?: Array<INode>) => SourceSink | Array<INode>;
    links?: (links?: Array<ILink>) => SourceSink | Array<ILink>;
    layout?: () => SourceSink;
    link?: Function;
}

interface SourceSinkLink {
    curvature: (curvature?: number) => SourceSinkLink | number;
    link: (link: ILink) => string;
}

interface INode {

    x: number;
    dx: number;
    y: number;
    dy: number;

    sourceLinks: Array<ILink>;
    sinkLinks: Array<ILink>;
};

interface ILink {
    source: INode | number;
    sink: INode | number;

    dx: number;
}
