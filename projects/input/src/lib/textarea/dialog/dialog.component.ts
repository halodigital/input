import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HaloDialogConfirmOutput, HaloDialogContentComponent } from '@halodigital/dialog';
import { HaloInputComponent } from '../../input.component';
import { HaloInputTextService } from '../textarea.service';


@Component({
    selector: 'input-text-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss', '../../input.component.scss']
})

export class HaloInputTextAreaDialogComponent extends HaloDialogContentComponent implements AfterViewInit {

    placeholder: string;

    @ViewChild(HaloInputComponent) textElement: HaloInputComponent;

    constructor(private textService: HaloInputTextService) {

        super();

        this.title = 'Edit ' + this.textService.dialogTitle;
        this.placeholder = this.textService.dialogTitle;

        this.form = new FormGroup({
            text: new FormControl(this.textService.dialogValue, Validators.maxLength(2000))
        });

    }

    ngAfterViewInit(): void {

        setTimeout(() => {
            this.textElement.focus();
        }, 300);

    }

    onConfirm(): HaloDialogConfirmOutput {

        if (this.form.valid) {

            this.textService.dialogValue = this.form.value.text;

            return true;

        }

        return false;

    }

    onCancel(): void {}

    onCustomAction(): void {}

}
