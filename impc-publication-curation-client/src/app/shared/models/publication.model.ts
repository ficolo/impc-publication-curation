export interface Allele {
  acc?: string;
  gacc?: string;
  geneSymbol?: string;
  project?: string;
  alleleName?: string;
  alleleSymbol: string;
  orderId?: string;
  emmaId?: string;
  name?: string;
}

export interface FullTextUrlList {
  url: string;
  documentStyle?: string;
}

export interface GrantsList {
  grantId: string;
  agency: string;
}

export interface Journal {
  title: string;
}

export interface JournalInfo {
  dateOfPublication: string;
  journal: Journal;
}

export interface Fragments {
  EUCOMM: string[];
  KOMP: string[];
  INFRAFRONTIER: any[];
  JAX: any[];
  IMPC: any[];
  EMMA: string[];
  alleles: any[];
}

export interface Fragment {
  keyword: string;
  mentions: Array<string>;
}

export interface Correspondence {
  authors: string[];
  emails: string[];
}

export interface Publication {
  title: string;
  authorString: string;
  pmid: string;
  pmcid: string;
  datasource: string;
  consortiumPaper: boolean;
  status: string;
  alleles: Allele[];
  fullTextUrlList: FullTextUrlList[];
  grantsList: GrantsList[];
  journalInfo: JournalInfo;
  fragments: Array<Fragment>;
  cites: any[];
  citations: any[];
  keyword: string;
  firstPublicationDate: string;
  alleleCandidates: any[];
  correspondence: Correspondence[];
  comment: string;
}

export interface GraphQLResponse {
  data: any;
  error: any;
}
