import { environment } from './../../../environments/environment';
import { PublicationService } from './../../shared/services/publication.service';
import {
  Publication,
  Correspondence,
} from './../../shared/models/publication.model';
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'impc-publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.scss'],
})
export class PublicationCardComponent implements OnInit {
  @Input()
  publication: any = {};

  @Input()
  showActions = false;

  showConsortiumCheck = true;
  showOrderId = false;
  categories: Array<Category> = [];

  constructor(
    private publicationService: PublicationService,
    private snackBar: MatSnackBar
  ) {
    this.showConsortiumCheck = environment.consortiumPaperMarker;
    this.showOrderId = environment.showOrderID;
  }

  ngOnInit() {
    this.categories = environment.categories.filter(
      (cat: any) => cat.status !== this.publication?.status
    );
  }

  setStatus(publicationStatus: string, status = '', undoing = false) {
    if (this.publication) {
      this.publicationService
        .setPublicationStatus(
          this.publication.pmid,
          publicationStatus,
          this.publication.alleles,
          this.publication.consortiumPaper,
          this.publication.comment
        )
        .pipe(
          map(() => observableOf(true)),
          catchError(() => observableOf(false))
        )
        .subscribe((done) => {
          if (done) {
            this.openSnackBar(
              `${undoing ? 'un' : ''}${
                status === 'updated' ? '' : 'marked as '
              }${status}`,
              status === 'updated' || undoing,
              status
            );
          } else {
            this.openSnackBar(
              'there was an error processing your request',
              true,
              status
            );
          }
        });
    }
  }

  getMailTo(correspondence: Correspondence) {
    const emails = correspondence.emails.join(',');
    return `mailto:${emails}?subject=INFRAFRONTIER resource usage confirmation`;
  }

  openSnackBar(message: string, hideAction: boolean, status: string) {
    const action = hideAction ? undefined : 'UNDO';
    message = message.charAt(0).toUpperCase() + message.slice(1);
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 2000,
    });
    snackBarRef.onAction().subscribe((_) => {
      if (this.publication && !hideAction) {
        this.setStatus(this.publication.status, status, true);
      }
    });
  }
}
