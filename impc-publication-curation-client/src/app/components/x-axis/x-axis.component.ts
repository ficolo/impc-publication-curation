import {
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { ViewDimensions, XAxisTicksComponent } from "@swimlane/ngx-charts";

@Component({
  selector: "g[impc-x-axis]",
  template: `
    <svg:g [attr.class]="xAxisClassName" [attr.transform]="transform">
      <svg:g
        ngx-charts-x-axis-ticks
        *ngIf="xScale"
        [trimTicks]="trimTicks"
        [rotateTicks]="rotateTicks"
        [maxTickLength]="maxTickLength"
        [tickFormatting]="tickFormatting"
        [tickArguments]="tickArguments"
        [tickStroke]="tickStroke"
        [scale]="xScale"
        orient="top"
        [showGridLines]="showGridLines"
        [gridLineHeight]="dims.height"
        [width]="dims.width"
        [tickValues]="ticks"
        (dimensionsChanged)="emitTicksHeight($event)"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XAxisComponent implements OnChanges {
  @Input() xScale: any;
  @Input() dims: any;
  @Input() trimTicks!: boolean;
  @Input() rotateTicks: boolean = true;
  @Input() maxTickLength!: number;
  @Input() tickFormatting!: any;
  @Input() showGridLines = false;
  @Input() showLabel!: boolean;
  @Input() labelText!: string;
  @Input() ticks!: any[];
  @Input() xAxisTickCount!: number;
  @Input() xOrient = "top";
  @Input() xAxisOffset: number = 0;

  @Output() dimensionsChanged = new EventEmitter();

  xAxisClassName: string = "x axis";

  tickArguments: number[] = [];
  transform: string = "";
  labelOffset: number = 0;
  fill: string = "none";
  stroke: string = "stroke";
  tickStroke: string = "#ccc";
  strokeWidth: string = "none";
  padding: number = 5;

  @ViewChild(XAxisTicksComponent) ticksComponent!: XAxisTicksComponent;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.transform = `translate(0,${this.xAxisOffset})`;

    if (typeof this.xAxisTickCount !== "undefined") {
      this.tickArguments = [this.xAxisTickCount];
    }
  }

  emitTicksHeight({ height }: { height: number }): void {
    const newLabelOffset = height + 25 + 5;
    if (newLabelOffset !== this.labelOffset) {
      this.labelOffset = newLabelOffset;
      setTimeout(() => {
        this.dimensionsChanged.emit({ height });
      }, 0);
    }
  }
}
