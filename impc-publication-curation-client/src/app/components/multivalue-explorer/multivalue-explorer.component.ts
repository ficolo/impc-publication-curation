import { Component, Input, OnInit } from "@angular/core";

export interface VisualizationButton {
  label: string;
  icon: string;
  value: string;
}

const visualizationButtonOptions = [
  {
    label: "Bar chart view",
    icon: "bar_chart",
    value: "bar-chart",
  },
  {
    label: "Pie chart view",
    icon: "pie_chart",
    value: "pie",
  },
  {
    label: "Line chart view",
    icon: "timeline",
    value: "line",
  },
  {
    label: "Table view",
    icon: "table_view",
    value: "table",
  },
  {
    label: "Heatmap view",
    icon: "apps",
    value: "heatmap",
  },
  {
    label: "Network view",
    icon: "account_tree",
    value: "network",
  },
  {
    label: "Collaboration map view",
    icon: "public",
    value: "map",
  },
];

@Component({
  selector: "impc-multivalue-explorer",
  templateUrl: "./multivalue-explorer.component.html",
  styleUrls: ["./multivalue-explorer.component.scss"],
})
export class MultivalueExplorerComponent implements OnInit {
  @Input() fieldToVisualize = "";
  @Input() fieldDisplayName = "";
  @Input() visualizationTypes: Array<string> = [
    "bar-chart",
    "table",
    "heatmap",
    "network",
  ];
  selectedView = "bar-chart";
  visualizationButtons: Array<VisualizationButton> = [];

  constructor() {}

  ngOnInit(): void {
    this.visualizationButtons = visualizationButtonOptions.filter((b) =>
      this.visualizationTypes.includes(b.value)
    );
  }
}
