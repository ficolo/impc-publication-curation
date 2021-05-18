import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { mapChart } from "./vega-chart";

@Component({
  selector: "impc-explore-collaboration-map",
  templateUrl: "./explore-collaboration-map.component.html",
  styleUrls: ["./explore-collaboration-map.component.scss"],
})
export class ExploreCollaborationMapComponent implements AfterViewInit {
  @ViewChild("map") map!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    mapChart(this.map.nativeElement, []);
  }
}
