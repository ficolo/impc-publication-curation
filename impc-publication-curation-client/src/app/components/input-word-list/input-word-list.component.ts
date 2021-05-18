import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "impc-input-word-list",
  templateUrl: "./input-word-list.component.html",
  styleUrls: ["./input-word-list.component.scss"],
})
export class InputWordListComponent implements OnInit {
  @Input()
  chipInput: any;

  @Input()
  formControl: any;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() {}

  ngOnInit(): void {}

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || "").trim() && this.formControl) {
      this.formControl.setValue([...this.formControl.value, value.trim()]);
      this.formControl.updateValueAndValidity();
    }

    if (input) {
      input.value = "";
    }
  }

  remove(value: string): void {
    const index = this.formControl?.value.indexOf(value);

    if (index >= 0 && this.formControl) {
      this.formControl.value.splice(index, 1);
      this.formControl.updateValueAndValidity();
    }
  }
}
