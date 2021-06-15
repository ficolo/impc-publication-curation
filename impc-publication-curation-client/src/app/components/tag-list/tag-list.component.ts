import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "impc-tag-list",
  templateUrl: "./tag-list.component.html",
  styleUrls: ["./tag-list.component.scss"],
})
export class TagListComponent {
  visible = true;
  selectable = true;
  removable = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  @Input()
  tags: string[] = [];
  @Input()
  tagOptions: string[] = [];
  @Input()
  editable = false;

  @Output() tagsChange = new EventEmitter<Array<string>>();

  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete!: MatAutocomplete;

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this._filter("")))
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    this.tags = this.tags ? this.tags : [];
    // Add our fruit
    if ((value || "").trim()) {
      this.tags.push(value.trim());
      this.tagsChange.emit(this.tags);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.tagCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags = this.tags ? this.tags : [];
    this.tags.push(event.option.viewValue);
    this.tagsChange.emit(this.tags);
    this.tagInput.nativeElement.value = "";
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagOptions.filter(
      (tag) =>
        !this.tags ||
        (!this.tags.includes(tag) &&
          tag.toLowerCase().indexOf(filterValue) === 0)
    );
  }
}
