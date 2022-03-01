import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    defaultSchoolRegulation,
    ISchoolRegulation,
    regulationOptions
} from '@portal/school/models/school-regulation.model';
import { SchoolRegulationService } from '@portal/school/services/school-regulation.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { absentTimeValidator } from '@portal/shared/validators/absent-time-validator';
import { timeRangeValidator } from '@portal/shared/validators/time-range-validator';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-regulation-dialog-component',
    templateUrl: './regulation-dialog-component.component.html',
    styleUrls: ['./regulation-dialog-component.component.scss']
})
export class RegulationDialogComponentComponent extends ComponentBase implements AfterViewInit {
    regulation: ISchoolRegulation | undefined;
    schoolId: string = '';
    gradeId: string = '';
    className = '';
    form: FormGroup | undefined;
    isLoading = true;
    isSaving = false;
    minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2);

    constructor(
        private fb: FormBuilder,
        private schoolRegulationService: SchoolRegulationService,
        private toastr: ToastrService,
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    regulationOptions = regulationOptions;

    ngAfterViewInit(): void {
        this.getRegulations();
    }

    getRegulations = () => {
        this.schoolRegulationService
            .getRegulation(this.schoolId, this.gradeId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.grade?.regulations?.length) {
                        this.regulation = result.grade.regulations[0];
                        this.form = this.createForm(this.regulation);
                    } else {
                        this.form = this.createForm();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.form = this.createForm();
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    createForm = (regulation?: ISchoolRegulation) => {
        return this.fb.group(
            {
                checkIn: [regulation?.checkIn || defaultSchoolRegulation.checkIn, [Validators.required]],
                ciAllowedTime: [
                    regulation?.ciAllowedTime || defaultSchoolRegulation.ciAllowedTime,
                    [Validators.required]
                ],
                checkOut: [regulation?.checkOut || defaultSchoolRegulation.checkOut, [Validators.required]],
                coAllowedTime: [
                    regulation?.coAllowedTime || defaultSchoolRegulation.coAllowedTime,
                    [Validators.required]
                ],
                absentTime: [regulation?.absentTime || defaultSchoolRegulation.absentTime, [Validators.required]],
                minCheckInTime: [
                    regulation?.minCheckInTime || defaultSchoolRegulation.minCheckInTime,
                    [Validators.required]
                ],
                maxCheckOutTime: [
                    regulation?.maxCheckOutTime || defaultSchoolRegulation.maxCheckOutTime,
                    [Validators.required]
                ],
                fromDate: [
                    GetDisplayDate(regulation?.fromDate || defaultSchoolRegulation.fromDate),
                    [Validators.required]
                ],
                toDate: [GetDisplayDate(regulation?.toDate || defaultSchoolRegulation.toDate), [Validators.required]],
                monday: [regulation?.weekDays?.monday || true],
                tuesday: [regulation?.weekDays?.tuesday || true],
                wednesday: [regulation?.weekDays?.wednesday || true],
                thursday: [regulation?.weekDays?.thursday || true],
                friday: [regulation?.weekDays?.friday || false],
                saturday: [regulation?.weekDays?.saturday || false],
                sunday: [regulation?.weekDays?.sunday || true]
            },
            {
                validators: [
                    timeRangeValidator('checkIn', 'checkOut'),
                    absentTimeValidator('checkIn', 'checkOut', 'ciAllowedTime', 'coAllowedTime', 'absentTime')
                ]
            }
        );
    };

    close = () => {
        this.activeModal.close();
    };

    map = (): any => {
        const formValue = this.form?.getRawValue();

        const regulation = {
            checkIn: `${this.transformTime(formValue.checkIn)}`,
            ciAllowedTime: formValue.ciAllowedTime,
            checkOut: `${this.transformTime(formValue.checkOut)}`,
            coAllowedTime: formValue.coAllowedTime,
            absentTime: `${this.transformTime(formValue.absentTime)}`,
            fromDate: GetDisplayDate(new Date(formValue.fromDate)),
            toDate: GetDisplayDate(new Date(formValue.toDate)),
            minCheckInTime: formValue.minCheckInTime,
            maxCheckOutTime: formValue.maxCheckOutTime,
            weekDays: {
                monday: formValue.monday,
                tuesday: formValue.tuesday,
                wednesday: formValue.wednesday,
                thursday: formValue.thursday,
                friday: formValue.friday,
                saturday: formValue.saturday,
                sunday: formValue.sunday
            }
        };

        return regulation;
    };

    onSaveClick = () => {
        if (!this.form || !this.form.valid) {
            return;
        }

        this.isSaving = true;

        const regulation = this.map();

        const obs = this.regulation ? this.patchRegulation(regulation) : this.createRegulation(regulation);

        obs.pipe(
            tap(() => {
                this.toastr.success('School regulation saved', 'Save');
                this.close();
            }),
            takeUntil(this.destroyed$),
            catchError(() => {
                this.toastr.error('School regulation save failed', 'Save Failed');
                this.isSaving = false;
                return of();
            })
        ).subscribe();
    };

    createRegulation = (regulation: ISchoolRegulation): Observable<IApiResult> => {
        return this.schoolRegulationService.create(this.schoolId, this.gradeId, regulation);
    };

    patchRegulation = (regulation: ISchoolRegulation): Observable<IApiResult> => {
        return this.schoolRegulationService.patch(this.schoolId, this.gradeId, this.regulation?._id || '', regulation);
    };

    transformTime = (time: string) => {
        return `${time.slice(0, 5)}:00`;
    };

    maxFromDate = () => {};

    get shouldDisableSaveButton() {
        return !this.form || !this.form.valid || this.isLoading;
    }
}
