import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGrade } from '@portal/school/models/grade.model';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-class-form-page',
    templateUrl: './class-form-page.component.html',
    styleUrls: ['./class-form-page.component.scss']
})
export class ClassFormPageComponent extends ComponentBase {
    form: FormGroup = this.fb.group({
        grade: [null, [Validators.required]],
        schoolId: [null, [Validators.required]]
    });
    schoolOptions: any = [];
    isLoading = true;
    isEditing = false;
    gradeId: string;

    constructor(
        private schoolService: SchoolService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super();

        const schoolId = this.route.snapshot.queryParams.schoolId;
        this.gradeId = this.route.snapshot.queryParams.gradeId;

        if (schoolId && this.gradeId) {
            this.isEditing = true;
            this.getGrade(schoolId, this.gradeId);
        } else {
            this.isEditing = false;
            this.getSchools();
        }
    }

    getSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.schoolOptions = (result.schools || []).map((school) => {
                            return {
                                label: translationLang(school?.translations),
                                value: school?._id
                            };
                        });

                        this.isLoading = false;
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getGrade = (schoolId: string, gradeId: string) => {
        this.isLoading = true;

        this.schoolService
            .getGrade(schoolId, gradeId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.form.get('grade')?.setValue(result.grade?.grade);
                        this.form.get('schoolId')?.setValue((result.grade?.school as ISchool)._id);
                        this.form.updateValueAndValidity();
                        this.getSchools();
                    } else {
                        this.toastr.error('Failed to retrieve grade', 'Get Grade');
                        this.goToClassList();
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve grade', 'Get Grade');
                    this.goToClassList();
                    return of();
                })
            )
            .subscribe();
    };

    map = () => {
        const formValue = this.form.getRawValue();

        return {
            grade: formValue.grade,
            schoolId: formValue.schoolId
        };
    };

    save = () => {
        if (!this.form.valid) {
            return;
        }

        this.isLoading = true;
        const grade = this.map();

        const obs = this.isEditing
            ? this.schoolService.patchGrade(grade.schoolId, this.gradeId, grade.grade)
            : this.schoolService.createGrade(grade.schoolId, grade.grade);

        obs.pipe(
            tap((result: IApiResult) => {
                this.toastr.success('Grade Saved', 'Grade');

                this.goToClassList();
            }),
            takeUntil(this.destroyed$),
            catchError(() => {
                this.toastr.error('Grade Save Failed', 'Grade');
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    goToClassList = () => {
        this.router.navigate([`schools/classes`]);
    };

    get shouldDisableSaveButton() {
        return this.isLoading || !this.form.valid;
    }
}
