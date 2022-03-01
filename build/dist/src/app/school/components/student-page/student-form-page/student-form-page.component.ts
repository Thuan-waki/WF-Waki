import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { IParent } from '@portal/school/models/parent.model';
import { IStudent } from '@portal/school/models/student.model';
import { SchoolService } from '@portal/school/services/school.service';
import { StudentService } from '@portal/school/services/student.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { UserService } from '@portal/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-student-form-page',
    templateUrl: './student-form-page.component.html',
    styleUrls: ['./student-form-page.component.scss']
})
export class StudentFormPageComponent extends ComponentBase implements OnInit {
    form: FormGroup | undefined;
    student: IStudent | undefined;
    parent: IParent | undefined;
    isLoading: boolean = true;
    isEditing: boolean = false;
    isTogglingCardStatus: boolean = false;
    origin: string;
    cardStatus: 'ACTIVE' | 'INACTIVE' | undefined = undefined;
    schoolOptions: ISelectOption[] = [];
    gradeOptions: ISelectOption[] = [];

    constructor(
        private studentService: StudentService,
        private userService: UserService,
        private authService: AuthService,
        private schoolService: SchoolService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private decimalPipe: DecimalPipe
    ) {
        super();

        const id = this.route.snapshot.params.id;
        this.origin = this.router.getCurrentNavigation()?.extras.state?.origin;
        const isAdmin = this.authService.isAdminOrSuperAdmin();

        if (id) {
            if (isAdmin) {
                this.getStudent(id);
                this.isEditing = true;
            } else {
                this.toastr.error('Unauthorized', 'Student Form');
                this.goToStudentList();
            }
        } else {
            this.createForm();
            this.isEditing = false;
        }

        this.getSchools();
    }

    getStudent = (studentId: string) => {
        this.studentService
            .getStudent(studentId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.student) {
                        this.student = result.student;
                        this.cardStatus = result.student?.cardStatus;
                        this.createForm(this.student);
                        this.getParent(studentId);
                        if (result.student.school) {
                            this.getGrades();
                        }
                    } else {
                        this.toastr.error('Failed to retrieve student', 'Get student');
                        this.goToStudentList();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error('Failed to retrieve student', 'Get student');
                    this.goToStudentList();
                    return of();
                })
            )
            .subscribe();
    };

    getParent = (studentId: string) => {
        if (!studentId || !studentId.length) {
            return;
        }

        this.studentService
            .getParent(studentId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.parents?.length) {
                        this.parent = result.parents[0] || undefined;
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

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
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getGrades = () => {
        const schoolId = this.form?.get('school')?.value;

        if (!schoolId || !schoolId.length) {
            return;
        }

        this.schoolService
            .getSelectGrades(schoolId, ['id', 'grade'])
            .pipe(
                tap((res: IApiResult) => {
                    if (res.grades?.length) {
                        this.gradeOptions = (res.grades || []).map((grade) => {
                            return {
                                label: grade.grade,
                                value: grade._id
                            };
                        });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    return of();
                })
            )
            .subscribe();
    };

    createForm = (student?: IStudent) => {
        const parent = student?.parents?.length ? student.parents[0].user : undefined;

        const formGroup = this.fb.group({
            studentId: [student?.studentId || ''],
            translations: this.fb.group({
                ar: [student?.translations?.ar || '', [Validators.required]],
                en: [student?.translations?.en || '', [Validators.required]]
            }),
            nationalId: [student?.nationalId || '', [Validators.required]],
            sex: [student?.sex || '', [Validators.required]],
            class: [student?.grade?._id || ''],
            section: [student?.section || ''],
            email: [student?.user?.email || ''],
            mobileNo: [student?.user?.mobileNo || ''],
            cardId: [student?.user?.cardId || ''],
            cardSerialNo: [student?.user?.cardSerialNo || ''],
            dailyLimit: [this.decimalPipe.transform(student?.dailyLimit || 0, '1.2-2')],
            school: [student?.school?._id || ''],
            dob: [student?.dob ? GetDisplayDate(new Date(student.dob)) : new Date(), [Validators.required]],
            parents: this.fb.group({
                fullName: [parent?.fullName || ''],
                mobileNo: [parent?.mobileNo || ''],
                currentBalance: [parent?.currentBalance || 0]
            })
        });

        this.form = formGroup;

        this.form
            ?.get('school')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.getGrades());
    };

    map = () => {
        const formValue = this.form?.getRawValue();

        if (!formValue) {
            return;
        }

        let student: any = {
            studentId: formValue.studentId,
            studentName: formValue.translations?.en,
            grade: formValue.class,
            school: formValue.school,
            dailyLimit: formValue.dailyLimit,
            section: formValue.section,
            user: {
                translations: formValue.translations,
                nationalId: formValue.nationalId,
                mobileNo: formValue.mobileNo,
                email: formValue.email,
                dob: formValue.dob,
                sex: formValue.sex,
                cardStatus: this.student?.cardStatus,
                cardSerialNo: formValue.cardSerialNo,
                cardId: formValue.cardId
            }
        };

        return student;
    };

    save = () => {
        if (!this.form?.valid) {
            return;
        }

        this.isLoading = true;

        const student = this.map();

        const obs = this.isEditing ? this.editStudent(this.student!._id, student) : this.createStudent(student);

        obs.pipe(
            tap((result) => {
                this.toastr.success('Student save successful', 'Student Save');
                this.goToStudentList();
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.toastr.error('Student Save failed', 'Student Save');
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    createStudent = (student: IStudent) => {
        return this.studentService.postStudent(student);
    };

    editStudent = (studentId: string, student: IStudent) => {
        return this.studentService.patchStudent(studentId, student);
    };

    toggleCardStatus = () => {
        if (!this.student?.user || !this.cardStatus) {
            return;
        }

        this.isTogglingCardStatus = true;

        const cardStatus = this.cardStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        this.userService
            .toggleCardStatus(this.student?.user?._id || '', cardStatus)
            .pipe(
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to toggle Card Status', 'Toggle Card Status');
                    this.isTogglingCardStatus = false;
                    return of();
                })
            )
            .subscribe((res) => {
                this.cardStatus = cardStatus;
                this.isTogglingCardStatus = false;
            });
    };

    goToStudentList = () => {
        this.router.navigate([this.origin && this.origin === 'dependants' ? '/dependants' : `/schools/students`]);
    };

    get shouldDisableSaveButton() {
        return !this.form?.valid || this.isLoading;
    }
}
