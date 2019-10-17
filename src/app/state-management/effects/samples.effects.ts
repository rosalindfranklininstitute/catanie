import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatasetApi, SampleApi, Sample, Dataset } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  getFullqueryParams,
  getDatasetsQueryParams
} from "state-management/selectors/samples.selectors";
import * as fromActions from "state-management/actions/samples.actions";
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap
} from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class SampleEffects {
  private fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  private datasetsQueryParams$ = this.store.pipe(
    select(getDatasetsQueryParams)
  );

  fetchSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchSamplesAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.setTextFilterAction
      ),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.sampleApi.fullquery(query, limits).pipe(
          mergeMap(samples => [
            fromActions.fetchSamplesCompleteAction({ samples }),
            fromActions.fetchSamplesCountAction()
          ]),
          catchError(() => of(fromActions.fetchSamplesFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchSamplesCountAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query }) =>
        this.sampleApi.fullquery(query).pipe(
          map(samples =>
            fromActions.fetchSamplesCountCompleteAction({
              count: samples.length
            })
          ),
          catchError(() => of(fromActions.fetchSamplesCountFailedAction()))
        )
      )
    )
  );

  fetchSample$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchSampleAction),
      switchMap(({ sampleId }) =>
        this.sampleApi.findById(sampleId).pipe(
          map((sample: Sample) =>
            fromActions.fetchSampleCompleteAction({ sample })
          ),
          catchError(() => of(fromActions.fetchSampleFailedAction()))
        )
      )
    )
  );

  fetchSampleDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchSampleDatasetsAction),
      withLatestFrom(this.datasetsQueryParams$),
      mergeMap(([{ sampleId }, { order, skip, limit }]) =>
        this.datasetApi.find({ where: { sampleId }, order, skip, limit }).pipe(
          mergeMap((datasets: Dataset[]) => [
            fromActions.fetchSampleDatasetsCompleteAction({ datasets }),
            fromActions.fetchSampleDatasetsCountAction({ sampleId })
          ]),
          catchError(() => of(fromActions.fetchSampleDatasetsFailedAction()))
        )
      )
    )
  );

  fetchSampleDatasetsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchSampleDatasetsCountAction),
      switchMap(({ sampleId }) =>
        this.datasetApi.find({ where: { sampleId } }).pipe(
          map(datasets =>
            fromActions.fetchSampleDatasetsCountCompleteAction({
              count: datasets.length
            })
          ),
          catchError(() =>
            of(fromActions.fetchSampleDatasetsCountFailedAction())
          )
        )
      )
    )
  );

  addSample$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.addSampleAction),
      mergeMap(({ sample }) =>
        this.sampleApi.create(sample).pipe(
          map(res => fromActions.addSampleCompleteAction({ sample: res })),
          catchError(() => of(fromActions.addSampleFailedAction()))
        )
      )
    )
  );

  addAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        delete attachment.id;
        delete attachment.rawDatasetId;
        delete attachment.derivedDatasetId;
        delete attachment.proposalId;
        return this.sampleApi
          .createAttachments(
            encodeURIComponent(attachment.sampleId),
            attachment
          )
          .pipe(
            map(res =>
              fromActions.addAttachmentCompleteAction({ attachment: res })
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction()))
          );
      })
    )
  );

  updateAttachmentCaption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.updateAttachmentCaptionAction),
      switchMap(({ sampleId, attachmentId, caption }) => {
        const newCaption = { caption };
        return this.sampleApi
          .updateByIdAttachments(
            encodeURIComponent(sampleId),
            encodeURIComponent(attachmentId),
            newCaption
          )
          .pipe(
            map(res =>
              fromActions.updateAttachmentCaptionCompleteAction({
                attachment: res
              })
            ),
            catchError(() =>
              of(fromActions.updateAttachmentCaptionFailedAction())
            )
          );
      })
    )
  );

  removeAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ sampleId, attachmentId }) =>
        this.sampleApi
          .destroyByIdAttachments(
            encodeURIComponent(sampleId),
            encodeURIComponent(attachmentId)
          )
          .pipe(
            map(res =>
              fromActions.removeAttachmentCompleteAction({ attachmentId: res })
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction()))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private sampleApi: SampleApi,
    private store: Store<any>
  ) {}
}
