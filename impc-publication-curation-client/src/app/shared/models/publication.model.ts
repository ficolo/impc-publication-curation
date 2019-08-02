export interface Allele {
  acc: string;
  gacc: string;
  geneSymbol: string;
  project: string;
  alleleName: string;
  alleleSymbol: string;
}

export interface FullTextUrlList {
  url: string;
  documentStyle: string;
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
  falsePositive: boolean;
  consortiumPaper: boolean;
  reviewed: boolean;
  alleles: Allele[];
  fullTextUrlList: FullTextUrlList[];
  grantsList: GrantsList[];
  journalInfo: JournalInfo;
  fragments: Fragments;
  cites: any[];
  citations: any[];
  keyword: string;
  firstPublicationDate: string;
  alleleCandidates: any[];
  correspondence: Correspondence[];
  pendingEmailConfirmation: boolean;
  orderId: string;
}

export interface GraphQLResponse {
  data: any;
  error: any;
}
