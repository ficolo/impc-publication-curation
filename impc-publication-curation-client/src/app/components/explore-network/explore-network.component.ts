import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as cytoscape from "cytoscape";

import { ExploreService } from "src/app/shared/services/explore.service";

@Component({
  selector: "impc-explore-network",
  templateUrl: "./explore-network.component.html",
  styleUrls: ["./explore-network.component.scss"],
})
export class ExploreNetworkComponent implements OnDestroy, AfterViewInit {
  @Input() fieldToVisualize!: string;
  @Input() fieldDisplayName!: string;
  @ViewChild("container", { static: false }) container!: ElementRef;
  network: Array<any> = [];
  cy!: cytoscape.Core;

  constructor(private exploreService: ExploreService) {}

  ngOnDestroy() {
    console.log(this.cy);
    this.cy?.destroy();
  }

  ngAfterViewInit(): void {
    this.exploreService
      .listGroups(this.fieldToVisualize, "", 40, 0)
      .subscribe(({ content }) => {
        const elements: Array<any> = [];
        const maxCount = content[0].count;
        const linkIds: Array<any> = [];
        content.reverse();
        content.forEach((element: any) => {
          const name: string = element.value;
          const publications = element.publications.map((p: any) => p.pmid);
          elements.push({
            data: {
              id: name.toLowerCase(),
              weight: 50 * (publications.length / maxCount),
            },
          });
          content.forEach((otherElement: any) => {
            const otherName = otherElement.value;
            const otherPublications = otherElement.publications.map(
              (p: any) => p.pmid
            );
            const linkIdA = name.toLowerCase() + "_" + otherName.toLowerCase();
            const linkIdB = otherName.toLowerCase() + "_" + name.toLowerCase();

            if (
              name !== otherName &&
              !linkIds.includes(linkIdA) &&
              !linkIds.includes(linkIdB) &&
              publications.filter((value: any) =>
                otherPublications.includes(value)
              ).length > 0
            ) {
              linkIds.push(linkIdA);
              elements.push({
                data: {
                  id: linkIdA,
                  source: name.toLowerCase(),
                  target: otherName.toLowerCase(),
                },
              });
            }
          });
        });
        this.network = elements;
        console.log(this.network);

        let cy = cytoscape({
          container: this.container.nativeElement, // container to render in

          elements: this.network,

          style: [
            // the stylesheet for the graph
            {
              selector: "node",
              style: {
                "background-color": "#666",
                label: "data(id)",
                width: "data(weight)",
                height: "data(weight)",
              },
            },

            {
              selector: "edge",
              style: {
                width: 1,
                "line-color": "#ccc",
                "target-arrow-color": "#ccc",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
              },
            },
          ],
          layout: {
            name: "cose",
            animate: false,
            idealEdgeLength: () => 100,
            nodeDimensionsIncludeLabels: true,
            randomize: true,
            nodeRepulsion: (node) => {
              return 2048 * 4;
            },
          },
        });
      });
  }
}
