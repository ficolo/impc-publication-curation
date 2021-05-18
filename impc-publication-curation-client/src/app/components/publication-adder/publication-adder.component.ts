import { environment } from './../../../environments/environment';
import { PublicationService } from './../../shared/services/publication.service';
import { HarvesterService } from './../../shared/services/harvester.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { flatMap, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'impc-publication-adder',
  templateUrl: './publication-adder.component.html',
  styleUrls: ['./publication-adder.component.scss'],
})
export class PublicationAdderComponent {
  harvesting = false;
  response = { pmid: '', error: '', status: '' };

  constructor(
    public dialogRef: MatDialogRef<PublicationAdderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private harvester: HarvesterService,
    private publications: PublicationService
  ) {}

  submit(pmid: string) {
    this.harvesting = true;
    this.dialogRef.disableClose = true;
    this.response.pmid = pmid;
    this.harvester
      .harvestReference(pmid, environment.harvestAlleles)
      .pipe(
        flatMap((reference) =>
          this.publications.submitPublication(pmid, reference)
        ),
        catchError((result) => {
          console.log(result.error);
          this.response.status = 'failed';
          return observableOf(result.error.message);
        })
      )
      .subscribe((result) => {
        if (this.response.status === 'failed') {
          this.response.error = result;
        } else {
          this.response.status = result.status;
        }
        this.harvesting = false;
        this.dialogRef.disableClose = false;
        this.dialogRef.close(this.response);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
