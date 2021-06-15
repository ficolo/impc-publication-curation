import { AlleleAutocompleteService } from "./../../shared/services/allele-autocomplete.service";
import { Component, OnInit, Input } from "@angular/core";
import { ENTER, SEMICOLON } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import { FormControl, FormArray, FormGroup } from "@angular/forms";
import { startWith, mergeMap } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Allele } from "src/app/shared/models/publication.model";
@Component({
  selector: "impc-infrafrontier-allele-list",
  templateUrl: "./infrafrontier-allele-list.component.html",
  styleUrls: ["./infrafrontier-allele-list.component.scss"],
})
export class InfrafrontierAlleleListComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  options = [];
  @Input()
  editable = false;
  private _alleles: Array<Allele> = [];

  filterListerners: Observable<any[]>[] = [];

  formFields: FormArray = new FormArray([]);
  formGroup: FormGroup = new FormGroup({ alleles: this.formFields });

  @Input()
  set alleles(alleles) {
    this._alleles = alleles;
  }

  get alleles(): Array<any> {
    return this._alleles;
  }

  separatorKeysCodes = [ENTER, SEMICOLON];

  constructor(private allelesService: AlleleAutocompleteService) {}

  ngOnInit() {
    if (this.alleles.length > 0) {
      this.alleles.forEach((allele) => {
        this.addFormFields(allele, allele.orderId, allele.emmaId);
      });
    } else {
      this.addFormFields();
    }
    this.formFields.valueChanges.subscribe((value) => {
      this.alleles.length = 0;
      this.alleles.push(
        ...value
          .map((alleleForm: any) => {
            const newAllele: Allele =
              typeof alleleForm.alleleControl == "string"
                ? { alleleSymbol: alleleForm.alleleControl }
                : alleleForm.alleleControl;
            return {
              ...newAllele,
              orderId: alleleForm.orderIdControl,
              emmaId: alleleForm.emmaIdControl,
            };
          })
          .filter(
            (allele: Allele) =>
              allele.alleleSymbol || allele.orderId || allele.emmaId
          )
      );
      value.forEach((val: any, index: any) => {
        console.log(val, index);
        console.log(this.formFields.at(index).value);

        if (val.orderIdControl) {
          this.formFields
            .at(index)
            ?.get("emmaIdControl")
            ?.disable({ emitEvent: false });
        } else {
          this.formFields
            .at(index)
            ?.get("emmaIdControl")
            ?.enable({ emitEvent: false });
        }
        if (val.emmaIdControl) {
          this.formFields
            .at(index)
            ?.get("orderIdControl")
            ?.disable({ emitEvent: false });
        } else {
          this.formFields
            .at(index)
            ?.get("orderIdControl")
            ?.enable({ emitEvent: false });
        }
      });
    });
  }

  filter(val: string) {
    return this.allelesService.getAlleles(val);
  }

  displayAllele(option: Allele) {
    return option ? option.alleleSymbol : "";
  }
  addFormFields(allele = null, orderId = "", emmaId = "") {
    const alleleControl = new FormControl(allele);
    const newForm = new FormGroup({
      alleleControl,
      orderIdControl: new FormControl(orderId),
      emmaIdControl: new FormControl(emmaId),
    });
    if (orderId) newForm.get("emmaIdControl")?.disable();
    if (emmaId) newForm.get("orderIdControl")?.disable();
    this.formFields.push(newForm);

    this.filterListerners.push(
      alleleControl.valueChanges.pipe(
        startWith(""),
        mergeMap((val) => {
          val = typeof val === "string" ? val : "";
          return this.filter(val);
        })
      )
    );
  }

  removeFormField(index: number) {
    this.filterListerners.splice(index);
    this.formFields.removeAt(index);
  }

  hasValue(index: any, controlName: string) {
    console.log(!!this.formGroup?.value.alleles[index][controlName]);
    return !!this.formGroup?.value.alleles[index][controlName];
  }
}
