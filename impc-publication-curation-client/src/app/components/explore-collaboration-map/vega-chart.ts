import { environment } from "src/environments/environment";
import embed, { Mode, VisualizationSpec } from "vega-embed";

export async function mapChart(
  container: HTMLElement,
  data: any
): Promise<void> {
  const collaborationMap: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 900,
    height: 500,
    autosize: "none",
    signals: [
      {
        name: "hover",
        value: null,
        on: [
          {
            events: "@cell:mouseover",
            update: "datum",
          },
          {
            events: "@cell:mouseout",
            update: "null",
          },
        ],
      },
      {
        name: "title",
        value: "INFRAFRONTIER - Collaboration Network",
      },
      {
        name: "tx",
        update: "width / 2",
      },
      {
        name: "ty",
        update: "height / 2",
      },
      {
        name: "scale",
        value: 150,
        on: [
          {
            events: {
              type: "wheel",
              consume: true,
            },
            update:
              "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)",
          },
        ],
      },
      {
        name: "angles",
        value: [0, 0],
        on: [
          {
            events: "mousedown",
            update: "[rotateX, centerY]",
          },
        ],
      },
      {
        name: "cloned",
        value: null,
        on: [
          {
            events: "mousedown",
            update: "copy('projection')",
          },
        ],
      },
      {
        name: "start",
        value: null,
        on: [
          {
            events: "mousedown",
            update: "invert(cloned, xy())",
          },
        ],
      },
      {
        name: "drag",
        value: null,
        on: [
          {
            events: "[mousedown, window:mouseup] > window:mousemove",
            update: "invert(cloned, xy())",
          },
        ],
      },
      {
        name: "delta",
        value: null,
        on: [
          {
            events: {
              signal: "drag",
            },
            update: "[drag[0] - start[0], start[1] - drag[1]]",
          },
        ],
      },
      {
        name: "rotateX",
        value: 0,
        on: [
          {
            events: {
              signal: "delta",
            },
            update: "angles[0] + delta[0]",
          },
        ],
      },
      {
        name: "centerY",
        value: 0,
        on: [
          {
            events: {
              signal: "delta",
            },
            update: "clamp(angles[1] + delta[1], -60, 60)",
          },
        ],
      },
    ],
    projections: [
      {
        name: "projection",
        type: "mercator",
        scale: {
          signal: "scale",
        },
        rotate: [
          {
            signal: "rotateX",
          },
          0,
          0,
        ],
        center: [
          0,
          {
            signal: "centerY",
          },
        ],
        translate: [
          {
            signal: "tx",
          },
          {
            signal: "ty",
          },
        ],
      },
    ],
    data: [
      {
        name: "world",
        url: "https://raw.githubusercontent.com/vega/vega/master/docs/data/world-110m.json",
        format: {
          type: "topojson",
          feature: "countries",
        },
      },
      {
        name: "nodes",
        format: {
          type: "json",
          property: "nodes",
        },
        transform: [
          {
            type: "geopoint",
            projection: "projection",
            fields: ["lon", "lat"],
          },
          {
            type: "voronoi",
            x: "x",
            y: "y",
          },
          {
            type: "collect",
            sort: {
              field: "count",
              order: "descending",
            },
          },
        ],
        url: `${environment.exploreApiUrl}/affiliation-network`,
      },
      {
        name: "links",
        format: {
          type: "json",
          property: "links",
        },
        transform: [
          { type: "project", fields: ["source", "target"], as: ["src", "tgt"] },
          {
            type: "filter",
            expr: "hover && (hover.id == datum.src || hover.id == datum.tgt)",
          },
          {
            type: "lookup",
            from: "nodes",
            key: "id",
            fields: ["src", "tgt"],
            as: ["source", "target"],
          },
          {
            type: "filter",
            expr: "datum.src && datum.tgt",
          },
          {
            type: "linkpath",
            shape: "curve",
          },
        ],
        url: `${environment.exploreApiUrl}/affiliation-network`,
      },
    ],
    scales: [
      {
        name: "size",
        type: "linear",
        domain: {
          data: "nodes",
          field: "count",
        },
        range: [16, 800],
      },
    ],
    marks: [
      {
        type: "shape",
        from: {
          data: "world",
        },
        encode: {
          enter: {
            strokeWidth: {
              value: 0.25,
            },
            stroke: {
              value: "#FFF",
            },
            fill: {
              value: "#004b9b",
            },
          },
        },
        transform: [
          {
            type: "geoshape",
            projection: "projection",
          },
        ],
      },
      {
        type: "symbol",
        from: {
          data: "nodes",
        },
        encode: {
          enter: {
            size: {
              scale: "size",
              field: "count",
            },
            fill: {
              value: "#eb5a07",
            },
            fillOpacity: {
              value: 0.5,
            },
            stroke: {
              value: "white",
            },
            strokeWidth: {
              value: 1.0,
            },
          },
          update: {
            x: {
              field: "x",
            },
            y: {
              field: "y",
            },
          },
        },
      },
      {
        type: "path",
        name: "cell",
        from: {
          data: "nodes",
        },
        encode: {
          enter: {
            fill: {
              value: "transparent",
            },
            tooltip: [
              {
                signal:
                  "{'Institution': datum ? datum.name : null, 'Publications': datum ? datum.count : null}",
              },
            ],
          },
          update: {
            path: {
              field: "path",
            },
          },
        },
      },
      {
        type: "path",
        interactive: false,
        from: {
          data: "links",
        },
        encode: {
          enter: {
            path: {
              field: "path",
            },
            stroke: {
              value: "black",
            },
            strokeOpacity: {
              value: 0.5,
            },
          },
          update: { path: { field: "path" } },
        },
      },
      {
        type: "text",
        interactive: false,
        encode: {
          enter: {
            x: {
              signal: "width",
              offset: -5,
            },
            y: {
              signal: "height",
              offset: -5,
            },
            fill: {
              value: "black",
            },
            fontSize: {
              value: 20,
            },
            align: {
              value: "right",
            },
            stroke: {
              value: "white",
            },
            strokeWidth: {
              value: 0.5,
            },
          },
          update: {
            text: {
              signal: "title",
            },
          },
        },
      },
    ],
  };
  const embedOpts = {
    actions: false,
    mode: "vega" as Mode,
    defaultStyle: false,
  };

  await embed(container, collaborationMap, embedOpts);
}
