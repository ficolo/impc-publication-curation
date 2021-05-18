import {
  AfterContentChecked,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ExploreService } from "src/app/shared/services/explore.service";
import { CountByField } from "../explore-table/explore-table.component";

@Component({
  selector: "impc-explore-bar",
  templateUrl: "./explore-bar.component.html",
  styleUrls: ["./explore-bar.component.scss"],
})
export class ExploreBarComponent implements OnInit {
  @Input() fieldToVisualize!: string;
  @Input() fieldDisplayName!: string;
  @ViewChild("chart") chart: any;
  single!: any[];
  multi!: any[];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Number of publications";
  showYAxisLabel = true;
  yAxisLabel = "";

  colorScheme = { domain: ["#004b9b"] };
  constructor(private exploreService: ExploreService) {}

  ngOnInit(): void {
    this.yAxisLabel = this.fieldDisplayName;
    this.exploreService.listCounts(this.fieldToVisualize, "", 20, 0).subscribe(
      (data) =>
        (this.single = data.content.map((item: CountByField) => {
          return { name: item.value, value: item.count };
        }))
    );
  }

  onSelect(event: any) {
    console.log(event);
  }
}
