import { TableColumn } from "state-management/models";

export const environment = {
  production: true,
  lbBaseURL: "http://localhost",
  fileserverBaseURL: "/fileserver",
  synapseBaseUrl: "https://scitest.maxiv.lu.se",
  riotBaseUrl: "http://scichat.maxiv.lu.se",
  jupyterHubUrl: "https://jupyterhub.maxiv.lu.se",
  externalAuthEndpoint: "/auth/msad",
  addDatasetEnabled: true,
  archiveWorkflowEnabled: true,
  columnSelectEnabled: true,
  csvEnabled: false,
  datasetReduceEnabled: false,
  disabledDatasetColumns: [
    "select",
    "archiveStatus",
    "retrieveStatus",
    "ownerGroup",
    "proposalId"
  ],
  editMetadataEnabled: true,
  editSampleEnabled: true,
  facility: "RFI",
  fileColorEnabled: true,
  localColumns: [
    { name: "select", order: 0, type: "standard", enabled: true },
    { name: "datasetName", order: 1, type: "standard", enabled: true },
    { name: "sourceFolder", order: 2, type: "standard", enabled: true },
    { name: "size", order: 3, type: "standard", enabled: true },
    { name: "creationTime", order: 4, type: "standard", enabled: true },
    { name: "type", order: 5, type: "standard", enabled: true },
    { name: "metadata", order: 6, type: "standard", enabled: true },
    { name: "ownerGroup", order: 7, type: "standard", enabled: false },
    { name: "dataStatus", order:8, type: "standard", enabled: false },
    // { name: "derivedDatasetsNum", order: 12, type: "standard", enabled: false },
  ] as TableColumn[],
  landingPage: "doi.esss.se/detail/",
  logbookEnabled: true,
  maxDirectDownloadSize: 5000000000,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: false,
  multipleDownloadAction: "https://scicatfileserver.maxiv.lu.se/zip",
  scienceSearchEnabled: true,
  scienceSearchUnitsEnabled: true,
  searchProposals: false,
  searchPublicDataEnabled: false,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  shoppingCartEnabled: true,
  shoppingCartOnHeader: true,
  tableSciDataEnabled: true,
  userNamePromptEnabled: true,
  userProfileImageEnabled: true,
  fileDownloadEnabled: false,
  jobsEnabled: true,
  jsonMetadataEnabled: true,
  policiesEnabled: true,
};
