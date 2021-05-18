import { Component, Input, OnInit } from "@angular/core";
import { ExploreService } from "src/app/shared/services/explore.service";
import { CountByField } from "../explore-table/explore-table.component";

@Component({
  selector: "impc-explore-pie",
  templateUrl: "./explore-pie.component.html",
  styleUrls: ["./explore-pie.component.scss"],
})
export class ExplorePieComponent implements OnInit {
  @Input() fieldToVisualize!: string;
  @Input() fieldDisplayName!: string;
  single: any[] = [];
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "";
  yAxisLabel: string = "Publication count";
  timeline: boolean = true;

  colorScheme = {
    domain: [
      "#4e79a7",
      "#f28e2c",
      "#e15759",
      "#76b7b2",
      "#59a14f",
      "#edc949",
      "#af7aa1",
      "#ff9da7",
      "#9c755f",
      "#bab0ab",
    ],
  };

  constructor(private exploreService: ExploreService) {}

  ngOnInit() {
    this.xAxisLabel = this.fieldDisplayName;
    this.exploreService
      .listCounts(this.fieldToVisualize, "", 40, 0, false)
      .subscribe((data) => {
        const series = data.content.map((item: CountByField) => {
          return { name: item.value, value: item.count };
        });
        this.single = series;
        console.log(this.single);
        // this.single = multi;
      });
  }

  onSelect(data: any): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
