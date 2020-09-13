import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { HaloInputParentComponent } from '../_general/parent.component';


@Component({
    selector: 'halo-input-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss']
})

export class HaloInputRadioComponent extends HaloInputParentComponent<any> {

    hasContentPlaceholder: boolean;

    @Input() outputValue: any;
    @Input() groupName: string;

    @ViewChild(MatRadioButton, {static: false}) input: MatRadioButton;
    @ViewChild('contentPlaceholder', {static: true}) contentPlaceholder: ElementRef;

    valueInitiated(): void {

        this.hasContentPlaceholder = !!this.contentPlaceholder.nativeElement.innerHTML;
        this.value = this.outputValue ? (this.value === this.outputValue) : !!this.value;

    }

    focus(): void {

        this.input.focus();

    }

    viewInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
