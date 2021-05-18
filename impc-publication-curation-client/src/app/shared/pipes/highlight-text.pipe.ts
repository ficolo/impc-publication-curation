import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlightText',
})
export class HighlightTextPipe implements PipeTransform {
  static SINGLE_MATCH = 'singleMatch';
  static SINGLE_AND_STARTS_WITH_MATCH = 'singleAndStartsWithMatch';
  static MULTI_MATCH = 'multiMatch';

  constructor(private domSanitizer: DomSanitizer) {}
  transform(
    contentString: string = '',
    stringToHighlight: string = '',
    option: string = 'singleAndStartsWithMatch',
    caseSensitive: boolean = false,
    highlightStyleName: string = 'search-highlight'
  ): SafeHtml {
    if (stringToHighlight && contentString && option) {
      contentString = this.unescapeHtml(contentString);
      stringToHighlight = stringToHighlight.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        '\\$&'
      );
      if (
        stringToHighlight.indexOf('<') < 0 &&
        stringToHighlight.indexOf('>') < 0
      ) {
        contentString = this.escapeHtml(contentString);
      }
      let regex: any = '';
      const caseFlag: string = !caseSensitive ? 'i' : '';
      switch (option) {
        case 'singleMatch': {
          regex = new RegExp(stringToHighlight, caseFlag);
          break;
        }
        case 'singleAndStartsWithMatch': {
          regex = new RegExp('^' + stringToHighlight, caseFlag);
          break;
        }
        case 'multiMatch': {
          regex = new RegExp(stringToHighlight, 'g' + caseFlag);
          break;
        }
        default: {
          regex = new RegExp(stringToHighlight, 'gi');
        }
      }
      const replaced = contentString.replace(
        regex,
        (match) =>
          `<span class="${highlightStyleName}">${this.escapeHtml(match)}</span>`
      );
      return this.domSanitizer.bypassSecurityTrustHtml(replaced);
    } else {
      return this.domSanitizer.bypassSecurityTrustHtml(contentString);
    }
  }

  escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  unescapeHtml(unsafe: string) {
    return unsafe
      .replace(/\&amp\;/g, '&')
      .replace(/\&lt\;/g, '<')
      .replace(/\&gt\;/g, '>')
      .replace(/\&quot\;/g, '"')
      .replace(/\&\#039\;/g, "'");
  }
}
