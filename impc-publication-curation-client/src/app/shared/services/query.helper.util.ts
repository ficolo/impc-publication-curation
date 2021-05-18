export class QueryHelper {
  publicationsQuery = (
    start = 1,
    size = 20,
    filter = {},
    orderByField = "firstPublicationDate",
    orderByDirection = "DESC"
  ) => `{
    publications(start: ${start}, size: ${size}, orderBy: ${orderByField}_${orderByDirection}, ${filter}){
      title
      authorString
      pmid
      pmcid
      datasource
      consortiumPaper
      status
      comment
      meshHeadingList
      correspondence {
        authors
        emails
      }
      alleles{
        acc
        gacc
        geneSymbol
        project
        alleleName
        alleleSymbol
        orderId
        emmaId
      }
      fullTextUrlList{
        url
        documentStyle
      }
      grantsList{
        grantId
        agency
      }
      journalInfo{
        dateOfPublication
        journal{
          title
        }
      }
      fragments{
        keyword
        mentions
      }
      cites
      citations {
        pmid
        references
      }
      keyword
      firstPublicationDate
      alleleCandidates {
        acc
        gacc
        geneSymbol
        project
        alleleName
        alleleSymbol
      }
    }
  }`;

  setStatusQuery = (
    pmid: string,
    status = "pending",
    consortiumPaper = false,
    allelesString = "",
    comment = ""
  ) => `
  mutation {
    updateReviewed(
    pmid: \\"${pmid}\\",
    status: \\"${status}\\",
    alleles: ${allelesString},
    consortiumPaper: ${consortiumPaper},
    comment: \\"${comment ? comment.replace(/\"/gi, '\\\\\\"') : ""}\\",
    alleleCandidates: []
    ){
      title
      status
    },
  }`;

  configurationQuery = () => `
  configuration {
    creationDate
    startYear
    endYear
    searchTerms
    textKeywords
    tags
  }
  `;
}
