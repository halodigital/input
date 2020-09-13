import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { HaloInputParentComponent } from '../_general/parent.component';


@Component({
    selector: 'halo-input-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})

export class HaloInputCheckboxComponent extends HaloInputParentComponent<boolean> {

    hasContentPlaceholder: boolean;

    @ViewChild(MatCheckbox, {static: false}) input: MatCheckbox;
    @ViewChild('contentPlaceholder', {static: true}) contentPlaceholder: ElementRef;

    valueInitiated(): void {

        this.hasContentPlaceholder = !!this.contentPlaceholder.nativeElement.innerHTML;
        this.value = !!this.value;

    }

    focus(): void {

        this.input.focus();

    }

    viewInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
