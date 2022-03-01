import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStoreItem } from '@portal/adults/models/card-store.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UPLOAD_FILE_SIZE_LIMIT_IN_BYTE } from '@portal/shared/constants/common.constants';
import { storeItemTypeOptions } from '@portal/shared/constants/store-item-type';
import { ICardItemColor } from '@portal/shared/enums/card-item-color.enum';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent extends ComponentBase implements OnChanges {
  @Input() card: IStoreItem | undefined;
  @Input() isLoading: boolean = false;
  @Input() isEditing: boolean = false;
  @Output() save = new EventEmitter();
  @Output() exit = new EventEmitter();
  @Output() currentImage = new EventEmitter<string | ArrayBuffer | null>();

  form: FormGroup | undefined;
  storeItemTypesOpts = storeItemTypeOptions.map((st) => ({ value: st.value, label: st.translations.en }));
  image: string | ArrayBuffer | null = null;
  imageChangeEvent: any;
  originalImage: any;
  b64Image: any;
  imageServerUrl = getImageServerUrl();
  cardItemColor = ['BLUE', 'GREY', 'PINK', 'PURPLE', 'YELLOW'];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.card) {
      this.createForm();
    }
  }

  createForm = () => {
    this.form = this.fb.group({
      translations: this.fb.group({
        en: [this.card?.translations?.en || ''],
        ar: [this.card?.translations?.ar || '']
      }),
      type: [this.card?.type || '', [Validators.required]],
      theme: [this.card?.theme || this.card?.color || '', [Validators.required]],
      pricePerItem: [this.card?.pricePerItem || '', [Validators.required]],
      description: [this.card?.description || '', [Validators.required]],
    });
  };

  map = () => {
    const formValues = this.form?.getRawValue();
    const cardTheme = (formValues.theme as string).toUpperCase();

    const card: any = {
      type: formValues.type,
      theme: cardTheme,
      pricePerItem: formValues.pricePerItem,
      description: formValues.description,
      translations: {
        en: formValues.translations.en,
        ar: formValues.translations.ar
      },
      ...this.cardItemColor.includes(cardTheme) ? { color: cardTheme} : {}
    };

    return card;
  };

  saveChanges = () => {
    if (!this.form?.valid || (!this.image && !this.card?.image)) {
      return;
    }

    const cardItem = this.map();

    this.save.emit(cardItem);
  };

  onImagePicked = (event: any) => {
    if (event.target?.files?.length > 0) {
      if (!this.fileSizeAllowed(event.target?.files[0])) {
        this.toastr.error('File size must be lower than 4 MB', 'File Size Limit');
        return;
      }

      this.imageChangeEvent = event;
      this.originalImage = event.target?.files[0];

      if (this.originalImage) {
        var reader = new FileReader();

        reader.readAsDataURL(this.originalImage);
        reader.onload = () => {
          this.image = reader.result;
          this.b64Image = this.image?.toString().replace('data:', '').replace(/^.+,/, '');
          this.currentImage.emit(this.b64Image);
          this.cd.detectChanges();
        };
      }
    }
  };

  fileSizeAllowed = (file: any) => {
    return file && file.size < UPLOAD_FILE_SIZE_LIMIT_IN_BYTE;
  };

  get shouldDisableSaveButton() {
    return !this.form?.valid || (!this.image && !this.card?.image) || this.isLoading;
  }

}
