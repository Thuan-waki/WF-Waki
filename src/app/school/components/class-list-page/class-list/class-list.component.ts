import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultGradeFilter, IGrade, IGradeFilter } from '@portal/school/models/grade.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { RegulationDialogComponentComponent } from '../../regulation-dialog-component/regulation-dialog-component.component';

@Component({
    selector: 'app-class-list',
    templateUrl: './class-list.component.html',
    styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent extends ComponentBase implements OnChanges {
    @Input() grades: IGrade[] = [];
    @Input() schoolOptions: any[] = [];
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultGradeFilter.limit || 50;
    @Input() isAdmin: boolean = false;
    @Output() addClass = new EventEmitter();
    @Output() editClass = new EventEmitter<IGrade>();
    @Output() filter = new EventEmitter<IGradeFilter>();
    @Output() export = new EventEmitter();

    form: FormGroup = this.fb.group({
        school: [null]
    });
    currentPage = 1;

    constructor(private fb: FormBuilder, private modalService: NgbModal) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.schoolOptions) {
            this.form.get('school')?.setValue(this.schoolOptions[0]?.value || '');
        }
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();
        const filterValues: IGradeFilter = {
            page: this.currentPage,
            limit: this.pageSize,
            school: formValue.school
        };

        this.filter.emit(filterValues);
    };

    showRegulationDialog = (grade: IGrade) => {
        const modalRef = this.modalService.open(RegulationDialogComponentComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.schoolId = this.form.get('school')!.value;
        modalRef.componentInstance.gradeId = grade._id;
        modalRef.componentInstance.className = grade.grade;

        modalRef.result.then((res) => {}).catch();
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}
