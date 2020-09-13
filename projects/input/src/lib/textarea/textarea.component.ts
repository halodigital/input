import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HaloDialogService } from '@halodigital/dialog';
import { HaloInputParentComponent } from '../_general/parent.component';
import { HaloInputTextAreaDialogComponent } from './dialog/dialog.component';
import { HaloInputTextService } from './textarea.service';


@Component({
    selector: 'halo-input-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})

export class HaloInputTextAreaComponent extends HaloInputParentComponent<string> {

    @Input() pattern: string;
    @Input() disableExpand: boolean;

    @ViewChild('input', {static: false}) input: ElementRef;
    @ViewChild('cdkInput', {static: false}) cdkInput: CdkTextareaAutosize;

    constructor(private dialogService: HaloDialogService,
                private textService: HaloInputTextService) {

        super();

    }

    get showExpandIcon(): boolean {

        return !this.disabled && !this.readonly && !this.disableExpand;

    }

    valueInitiated(): void {

        setTimeout(() => {
            this.cdkInput?.resizeToFitContent(true);
        }, 200);

    }

    expand(): void {

        this.textService.dialogTitle = this.placeholder;
        this.textService.dialogValue = this.value;

        this.subscriptions.textarea = this.dialogService.open(HaloInputTextAreaDialogComponent).subscribe(output => {

            if (output === 'confirmed') {

                this.value = this.textService.dialogValue;
                this.hostControl.setValue(this.textService.dialogValue);

                setTimeout(() => {
                    this.cdkInput.resizeToFitContent(true);
                }, 200);

            }

        });

    }

    focus(): void {

        if (this.input) {

            this.input.nativeElement.focus();

        }

    }

    enterPressed(event: KeyboardEvent): void {

        event.stopPropagation();

    }

    viewInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
