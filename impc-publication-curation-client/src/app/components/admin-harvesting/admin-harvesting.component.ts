import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { PublicationService } from "src/app/shared/services/publication.service";

@Component({
  selector: "impc-admin-harvesting",
  templateUrl: "./admin-harvesting.component.html",
  styleUrls: ["./admin-harvesting.component.scss"],
})
export class AdminHarvestingComponent implements OnInit {
  harvestingForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  uploadAlleleFile: string = "";
  configuration: any = {};

  chipsInputFields = [
    {
      controlName: "searchTerms",
      title: "search term",
      hint: "List of terms used in the EuropePMC search.",
    },
    {
      controlName: "textKeywords",
      title: "text extraction keyword",
      hint: "List of keywords used to extract text fragments of interest.",
    },
    {
      controlName: "tags",
      title: "manual curation tag",
      hint: "List of tags available to be used in the manual curation process.",
    },
  ];

  constructor(private queryService: PublicationService) {
    this.harvestingForm = new FormGroup({
      startYear: new FormControl(1999),
      endYear: new FormControl(2021),
      searchTerms: new FormControl([]),
      textKeywords: new FormControl([]),
      tags: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.queryService.getConfiguration().subscribe((conf) => {
      delete conf.creationDate;
      this.harvestingForm.setValue(conf);
    });
  }

  get queryTerms(): any {
    return this.harvestingForm.get("queryTerms");
  }

  add(controlName: string, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const control = this.harvestingForm.get(controlName);

    if ((value || "").trim() && control) {
      control.setValue([...control.value, value.trim()]);
      control.updateValueAndValidity();
    }

    if (input) {
      input.value = "";
    }
  }

  remove(controlName: string, value: string): void {
    const control = this.harvestingForm.get(controlName);
    const index = control?.value.indexOf(value);

    if (index >= 0 && control) {
      control.value.splice(index, 1);
      control.updateValueAndValidity();
    }
  }

  uploadFileEvt(event: any) {
    console.log(event);
  }
}
