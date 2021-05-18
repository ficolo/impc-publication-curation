import { Component, Input, OnInit } from "@angular/core";
import { ExploreService } from "src/app/shared/services/explore.service";
import { CountByField } from "../explore-table/explore-table.component";
import { multi } from "./data";

@Component({
  selector: "impc-explore-line",
  templateUrl: "./explore-line.component.html",
  styleUrls: ["./explore-line.component.scss"],
})
export class ExploreLineComponent implements OnInit {
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

  colorScheme = "cool";

  constructor(private exploreService: ExploreService) {}

  ngOnInit() {
    this.xAxisLabel = this.fieldDisplayName;
    this.exploreService
      .listCounts(this.fieldToVisualize, "", 40, 0, false)
      .subscribe((data) => {
        data.content.reverse();
        const series = data.content.map((item: CountByField) => {
          return { name: item.value, value: item.count };
        });
        this.single = [{ name: "Publications by year", series }];
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
