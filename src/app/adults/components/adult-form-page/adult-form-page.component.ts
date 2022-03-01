import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IParent } from '@portal/adults/models/parent.model';
import { ParentService } from '@portal/adults/services/parent.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { UserService } from '@portal/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-adult-form-page',
    templateUrl: './adult-form-page.component.html',
    styleUrls: ['./adult-form-page.component.scss']
})
export class AdultFormPageComponent extends ComponentBase {
    form: FormGroup | undefined;
    currentUserRoles: string[] = [];
    parent: IParent | undefined;
    schools: any[] = [];
    isLoading: boolean = true;
    isEditing: boolean = true;
    cardStatus: 'ACTIVE' | 'INACTIVE' | undefined = undefined;
    isTogglingCardStatus: boolean = false;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService,
        private parentService: ParentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();

        const id = this.route.snapshot.params.id;

        if (id) {
            this.getParent(id);
            this.isEditing = true;
        } else {
            this.toastr.error('Missing Id', 'Parent Edit');
            this.goToParentList();
        }
    }

    getParent = (id: string) => {
        this.parentService
            .getParent(id)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.parent = result.parent;

                        if (result.parent?.user?.cardId || result.parent?.user?.cardSerialNo) {
                            this.cardStatus = result.parent?.user?.isCardEnabled ? 'ACTIVE' : 'INACTIVE';
                        }
                        this.createForm(this.parent);
                    }

                    if (!result.success) {
                        this.toastr.error('Failed to retrieve canteen', 'Canteen');
                        this.isLoading = false;
                        this.goToParentList();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve canteen', 'Canteen');
                    this.isLoading = false;
                    this.goToParentList();
                    return of();
                })
            )
            .subscribe();
    };

    createForm = (parent?: IParent) => {
        this.form = this.fb.group({
            translations: this.fb.group({
                en: [parent?.user?.translations?.en || '', [Validators.required]],
                ar: [parent?.user?.translations?.ar || '', [Validators.required]]
            }),
            mobileNo: [parent?.user?.mobileNo || '', [Validators.required]],
            email: [parent?.user?.email || '', [Validators.required]],
            gender: [parent?.user?.sex || 'MALE', [Validators.required]],
            nationalId: [parent?.user?.nationalId || '', [Validators.required]],
            maxAmount: [{ value: parent?.maxAmount || 2000, disabled: true }],
            noOfChildren: [{ value: parent?.noOfChildren || 0, disabled: true }],
            availableAmount: [{ value: parent?.availableAmount || 0, disabled: true }],
            cardId: [parent?.user?.cardId || ''],
            cardSerialNo: [parent?.user?.cardSerialNo || '']
        });
    };

    map = () => {
        const formValues = this.form?.getRawValue();

        const parent: any = {
            user: {
                translations: formValues.translations,
                nationalId: formValues.nationalId,
                mobileNo: formValues.mobileNo,
                email: formValues.email,
                sex: formValues.gender,
                cardId: formValues.cardId?.length ? formValues.cardId : null,
                cardSerialNo: formValues.cardSerialNo?.length ? formValues.cardSerialNo : null
            }
        };

        return parent;
    };

    save = () => {
        if (!this.form?.valid) {
            return;
        }

        this.isLoading = true;

        const parent = this.map();

        this.parentService
            .patchParent(this.parent?._id || '', parent)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.toastr.success('Parent Saved', 'Parent');
                        this.goToParentList();
                    } else {
                        this.toastr.error('Failed to Save Parent', 'Parent');
                        this.isLoading = false;
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to Save Parent', 'Parent');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    goToChildForm = (id: string) => {
        this.router.navigateByUrl(`/schools/students/form/${id}`);
    };

    toggleCardStatus = () => {
        if (!this.parent?.user || !this.cardStatus) {
            return;
        }

        this.isTogglingCardStatus = true;

        const cardStatus = this.cardStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        this.userService
            .toggleCardStatus(this.parent?.user?._id || '', cardStatus)
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

    get shouldDisableSaveButton() {
        return !this.form?.valid;
    }

    goToParentList = () => {
        this.router.navigate(['/adults']);
    };
}
