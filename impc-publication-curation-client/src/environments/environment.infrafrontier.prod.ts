// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: "/mi/infrafrontier/publications/",
  publicationsApiUrl: "/mi/infrafrontier/publications/api/graphql",
  alleleApiUrl: "/mi/infrafrontier/publications/api/alleles",
  authUrl: "/mi/infrafrontier/publications/api/token/generate-token",
  harvesterUrl: "/mi/infrafrontier/publications/api/harvest",
  submissionUrl: "/mi/infrafrontier/publications/api/submit",
  exploreApiUrl: "/mi/infrafrontier/publications/api/explore",
  adminApiUrl: "/mi/infrafrontier/publications/api/admin",
  tokenKey: "AuthToken",
  title: "INFRAFRONTIER - Publications Curation",
  confirmViaEmail: true,
  consortiumPaperMarker: false,
  showOrderID: true,
  harvestAlleles: true,
  filters: [
    {
      field: "publicationYear",
      name: "Publication year",
      values: [1990, 2019],
      type: "range",
    },
  ],
  categories: [
    {
      name: "Pending",
      status: "pending",
      icon: "assignment",
      color: "warn",
    },
    {
      name: "Waiting for email confirmation",
      status: "pendingEmailConfirmation",
      icon: "markunread_mailbox",
      color: "primary",
    },
    {
      name: "False positive",
      status: "falsePositive",
      icon: "assignment_late",
      color: "warn",
    },
    {
      name: "Reviewed",
      status: "reviewed",
      icon: "assignment_turned_in",
      color: "accent",
    },
  ],
  copyRightNotice: "2021 INFRAFRONTIER",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/dist/zone-error"; // Included with Angular CLI.
