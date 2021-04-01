import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Dataset, UserApi, User, Job, Attachment, Sample } from "shared/sdk";
import {
  getCurrentDataset,
  getCurrentDatasetWithoutFileInfo,
  getCurrentOrigDatablocks,
  getCurrentDatablocks,
  getCurrentAttachments,
  getPublicViewMode,
} from "state-management/selectors/datasets.selectors";
import {
  getIsAdmin,
  getCurrentUser,
} from "state-management/selectors/user.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { pluck, take } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import {
  clearFacetsAction,
  addKeywordFilterAction,
  updatePropertyAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  fetchDatasetAction,
  addAttachmentAction,
} from "state-management/actions/datasets.actions";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { ReadFile } from "ngx-file-helpers";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { clearLogbookAction, fetchLogbookAction } from "state-management/actions/logbooks.actions";
import { fetchProposalAction } from "state-management/actions/proposals.actions";
import { getCurrentProposal } from "state-management/selectors/proposals.selectors";
import { fetchSampleAction } from "state-management/actions/samples.actions";
import { getCurrentSample } from "state-management/selectors/samples.selectors";

import {HancockService} from '../hancock.service';
import {DownloadService} from '../download.service';
import { saveAs } from 'file-saver';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { asLiteral } from "@angular/compiler/src/render3/view/util";


@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"],
})
export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  private subscriptions: Subscription[] = [];
  datasetWithout$ = this.store.pipe(select(getCurrentDatasetWithoutFileInfo));
  origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  attachments$ = this.store.pipe(select(getCurrentAttachments));
  proposal$ = this.store.pipe(select(getCurrentProposal));
  sample$ = this.store.pipe(select(getCurrentSample));
  isAdmin$ = this.store.pipe(select(getIsAdmin));
  jwt$: Observable<any>;

  dataset: Dataset;
  user: User;
  pickedFile: ReadFile;
  attachment: Attachment;

  hidden ?: boolean = false;
  presignedURL ?: string ="";

  getPresignedURL() : void {
    let token : string ="";
    //for parsing URL to get the bucket name
    let url_prefix_length : number = "https://".length;
    // key for s3 datastore
    const key = this.dataset.sourceFolder; 

    //buckct name for datastore
    //const bucket = this.dataset.sourceFolderHost.split('.')[0].substr(url_prefix_length,);
    const bucket = this.dataset.sourceFolderHost;

    //The value below be check at the matching html file. If it's the (.txt), a getpresigned button will appear.
    const dataFormat :string =this.dataset['dataFormat'];

    //instrument location
    const location  = this.dataset['creationLocation'];

    
  
    this.hancockservice.getToekn().then( res => { token = res["access_token"];
                                                                        console.log("Catanie get token from the server");
                                                                       },
                                                                  error => console.error(error));   
                                                                                                                            
    //setTimeout(( ) => {this.hancockservice.getToekn().subscribe( res => { token = res["access_token"];
    //                                                                    console.log("Catanie get token from the server");
    //                                                                    },
    //                                                              error => console.error(error));                                                   
    //                  }, 2500);
    //alert(token);
    let temp : string =""
    setTimeout(( ) =>{this.hancockservice.getPresignedURL(bucket, key, location, token).subscribe( url =>{temp = url["presigned_url"].trim();
                                                     console.log("Get URL " + temp)},
                                                     error => console.error(error));},1500);

    //let url_length = this.presignedURL.length;
     

    //this.hancockservice.getPresignedURL(bucket, key, token).subscribe( url =>this.presignedURL = JSON.stringify(url));
    
    //rep.then(res => this.presignedURL =res['presignedURL']);
  
    //alert(this.presignedURL);
    //this.presignedURL = this.presignedURL.substr(2, url_length - 2);

    //The returned presigned URL only have ONE item. Multitple items be dealt with retrieve button.
    //So the parsing way is fixed beneath.
    setTimeout(( ) => { this.presignedURL = temp.substring(2, temp.length-2);
                          console.log(this.presignedURL);
                          this.hidden =true;
                      } ,  2000);
    
    //window.alert("Do you want to download the file at: \n"+this.presignedURL);

    //window.alert(this.presignedURL);
    
  }

  download() :void{
    let fname = this.dataset.sourceFolder;
    
    let dummy_url : string = this.presignedURL[0].replace("https://s3.echo.stfc.ac.uk/", "/download/");
    alert(dummy_url);
    this.downloadservice.download(dummy_url).subscribe(blob => saveAs(blob, fname));
  }

  openLink() :void{
    window.open(this.presignedURL, "a_blank")
  }

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private hancockservice : HancockService,
    private downloadservice : DownloadService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Dataset>,
    private userApi: UserApi
  ) {}

  isPI(): boolean {
    if (this.user.username === "admin") {
      return true;
    }
    if (this.dataset.type === "raw") {
      return (
        this.user.email.toLowerCase() ===
        this.dataset["principalInvestigator"].toLowerCase()
      );
    }
    if (this.dataset.type === "derived") {
      return (
        this.user.email.toLowerCase() ===
        this.dataset["investigator"].toLowerCase()
      );
    }
    return false;
  }

  onSlidePublic(event: MatSlideToggleChange) {
    const pid = this.dataset.pid;
    const property = { isPublished: event.checked };
    this.store.dispatch(updatePropertyAction({ pid, property }));
  }

  onClickKeyword(keyword: string) {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/datasets");
  }

  onAddKeyword(keyword: string) {
    if (!this.dataset.hasOwnProperty("keywords")) {
      const keywords: Array<string> = [];
      this.dataset.keywords = keywords;
    }
    if (this.dataset.keywords.indexOf(keyword) === -1) {
      const pid = this.dataset.pid;
      const keywords = [...this.dataset.keywords].concat(keyword);
      const property = { keywords };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onRemoveKeyword(keyword: string) {
    const index = this.dataset.keywords.indexOf(keyword);
    if (index >= 0) {
      const pid = this.dataset.pid;
      const keywords = [...this.dataset.keywords];
      keywords.splice(index, 1);
      const property = { keywords };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onClickProposal(proposalId: string) {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(sampleId: string) {
    const id = encodeURIComponent(sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  onSampleChange(sample: Sample) {
    const pid = this.dataset.pid;
    const property = { sampleId: sample.sampleId };
    this.store.dispatch(updatePropertyAction({ pid, property }));
  }

  onSaveMetadata(metadata: object) {
    const pid = this.dataset.pid;
    const property = { scientificMetadata: metadata };
    this.store.dispatch(updatePropertyAction({ pid, property }));
  }

  resetDataset(dataset: Dataset) {
    if (!confirm("Reset datablocks?")) {
      return null;
    }
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user: User) => {
      const job = new Job();
      job.emailJobInitiator = user.email;
      job.jobParams = {};
      job.jobParams["username"] = user.username;
      job.creationTime = new Date();
      job.type = "reset";
      const fileObj = {};
      const fileList = [];
      fileObj["pid"] = dataset["pid"];
      if (dataset["datablocks"]) {
        dataset["datablocks"].map((d) => {
          fileList.push(d["archiveId"]);
        });
      }
      fileObj["files"] = fileList;
      job.datasetList = [fileObj];
      console.log(job);
      this.store.dispatch(submitJobAction({ job }));
    });
  }

  onFileUploaderFilePicked(file: ReadFile) {
    this.pickedFile = file;
  }

  onFileUploaderReadEnd(fileCount: number) {
    if (fileCount > 0) {
      this.attachment = {
        thumbnail: this.pickedFile.content,
        caption: this.pickedFile.name,
        ownerGroup: this.dataset.ownerGroup,
        accessGroups: this.dataset.accessGroups,
        createdBy: this.user.username,
        updatedBy: this.user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: null,
        dataset: this.dataset,
        datasetId: this.dataset.pid,
        rawDatasetId: null,
        derivedDatasetId: null,
        proposal: null,
        proposalId: null,
        sample: null,
        sampleId: null,
      };
      this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
    }
  }

  updateCaption(event: SubmitCaptionEvent) {
    this.store.dispatch(
      updateAttachmentCaptionAction({
        datasetId: this.dataset.pid,
        attachmentId: event.attachmentId,
        caption: event.caption,
      })
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(
      removeAttachmentAction({ datasetId: this.dataset.pid, attachmentId })
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        if (id) {
          this.store
            .pipe(select(getPublicViewMode))
            .subscribe((viewPublic) => {
              if (viewPublic) {
                this.store.dispatch(
                  fetchDatasetAction({
                    pid: id,
                    filters: { isPublished: viewPublic },
                  })
                );
              } else {
                this.store.dispatch(fetchDatasetAction({ pid: id }));
              }
            })
            .unsubscribe();
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getCurrentDataset)).subscribe((dataset) => {
        if (dataset) {
          this.dataset = dataset;
          if ("proposalId" in dataset) {
            this.store.dispatch(
              fetchProposalAction({ proposalId: dataset["proposalId"] })
            );
            this.store.dispatch(
              fetchLogbookAction({ name: dataset["proposalId"] })
            );
          } else {
            this.store.dispatch(clearLogbookAction());
          }
          if ("sampleId" in dataset) {
            this.store.dispatch(
              fetchSampleAction({ sampleId: dataset["sampleId"] })
            );
          }
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getCurrentUser)).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      })
    );

    this.jwt$ = this.userApi.jwt();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
