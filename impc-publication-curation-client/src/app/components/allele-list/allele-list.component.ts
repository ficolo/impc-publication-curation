import { AlleleAutocompleteService } from './../../shared/services/allele-autocomplete.service';
import { Component, OnInit, Input } from '@angular/core';
import { ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, mergeMap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Allele } from 'src/app/shared/models/publication.model';

@Component({
  selector: 'impc-allele-list',
  templateUrl: './allele-list.component.html',
  styleUrls: ['./allele-list.component.scss'],
})
export class AlleleListComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  options: Array<string> = [];
  @Input()
  editable = false;
  private _alleles: Array<Allele> = [];

  filteredOptions: Observable<any[]> = of([]);
  myControl: FormControl = new FormControl();

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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      mergeMap((val) => {
        val = typeof val === 'string' ? val : '';
        return this.filter(val);
      })
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value: string = event.value;
    if ((value || '').trim() && this.options.indexOf(value.trim())) {
      this._alleles.push({ alleleSymbol: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  addFromAutcomplete(
    event: MatAutocompleteSelectedEvent,
    textInput: any
  ): void {
    const value = event.option.value;
    if (value) {
      this.myControl.setValue('');
      textInput.value = '';
      this._alleles.push(value);
    }
  }

  remove(allele: any): void {
    const index = this._alleles.indexOf(allele);

    if (index >= 0) {
      this._alleles.splice(index, 1);
      this.myControl.setValue('');
    }
  }

  filter(val: string) {
    return this.allelesService.getAlleles(val);
  }

  pasteEvent(event: any) {
    event.preventDefault();
    const text = event.clipboardData.getData('Text');
    this.myControl.setValue('', { emitEvent: false });
    text.split(';').forEach((newAllele: string) => {
      this._alleles.push({ alleleSymbol: newAllele });
    });
  }
}
