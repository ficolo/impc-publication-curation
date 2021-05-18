import { Observable } from 'rxjs';

export interface Filter {
  field?: any;
  values?: any;
  type?: string;
  url?: string;
  from?: any;
  to?: any;
  status?: string;
  name?: string;
}

export interface FilterValue {
  field: string;
}
