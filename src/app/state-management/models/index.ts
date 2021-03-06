import {
  User,
  UserIdentity,
  UserSetting,
  Job,
  Dataset,
  RawDataset,
  Proposal,
  Policy,
  Sample,
  Logbook,
  PublishedData,
  Attachment,
  Instrument
} from "shared/sdk/models";
export {
  User,
  UserIdentity,
  UserSetting,
  Job,
  Dataset,
  RawDataset,
  Proposal,
  Policy,
  Sample,
  Logbook,
  PublishedData,
  Attachment,
  Instrument
};

import { DatasetInterface } from "shared/sdk";
export { DatasetInterface };

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
}

export interface TableColumn {
  name: string;
  order: number;
  type: "standard" | "custom";
  enabled: boolean;
}

export enum MessageType {
  Success = "success",
  Error = "error"
}

export class Message {
  content: string;
  type: MessageType;
  duration: number;
}

export enum ArchViewMode {
  all = "all",
  archivable = "archivable",
  retrievable = "retrievable",
  work_in_progress = "work in progress",
  system_error = "system error",
  user_error = "user error"
}
export enum JobViewMode {
  myJobs = "my jobs",
  allJobs = "all jobs"
}

type ScientificConditionRelation =
  | "EQUAL_TO_NUMERIC"
  | "EQUAL_TO_STRING"
  | "GREATER_THAN"
  | "LESS_THAN";

export interface ScientificCondition {
  lhs: string;
  relation: ScientificConditionRelation;
  rhs: string | number;
  unit: string;
}

export interface DatasetFilters {
  modeToggle: ArchViewMode;
  text: string;
  ownerGroup: string[];
  type: string[];
  creationTime: { begin: string; end: string };
  creationLocation: string[];
  skip: number;
  limit: number;
  keywords: string[];
  sortField: string;
  mode: {};
  scientific: ScientificCondition[];
  isPublished: boolean;
}

export interface SampleFilters {
  text: string;
  sortField: string;
  skip: number;
  limit: number;
}

export interface PublishedDataFilters {
  sortField: string;
  skip: number;
  limit: number;
}

export interface PolicyFilters {
  sortField: string;
  skip: number;
  limit: number;
}

export interface LogbookFilters {
  textSearch: string;
  showBotMessages: boolean;
  showUserMessages: boolean;
  showImages: boolean;
  sortField: string;
  skip: number;
  limit: number;
}

export interface JobFilters {
  mode: object;
  sortField: string;
  skip: number;
  limit: number;
}

export interface InstrumentFilters {
  sortField: string;
  skip: number;
  limit: number;
}
