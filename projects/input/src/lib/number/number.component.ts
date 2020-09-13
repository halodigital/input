import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HaloInputParentComponent } from '../_general/parent.component';


@Component({
    selector: 'halo-input-number',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss']
})

export class HaloInputNumberComponent extends HaloInputParentComponent<number | number[]> {

    inputValue: number | number[];

    private isFocused: boolean;
    private focusMoved: boolean;

    @ViewChild('input', {static: false}) input: ElementRef;
    @ViewChild('inputFrom', {static: false}) inputFrom: ElementRef;
    @ViewChild('inputTo', {static: false}) inputTo: ElementRef;

    @Input() range: boolean;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;

    get isRange(): boolean {

        return this.range && (!!this.value || this.isFocused);

    }

    valueInitiated(): void {

        if (!this.range) {

            this.inputValue = this.value;

            if (isNaN((this.inputValue as number))) {
                this.inputValue = null;
            }

        } else {

            this.inputValue = this.value;

            if (!this.value || !Array.isArray(this.value)) {

                this.inputValue = [null, null];

            } else {

                this.inputValue = (this.value as number[]).map(v => isNaN(v) ? null : v);

            }

        }

    }

    valueBlured(): void {

        this.isFocused = false;

    }

    valueTyped(typedValue: string, index?: number): void {

        let formatedTypedValue: number | number[];

        if (typedValue && !isNaN(typedValue as any)) {

            formatedTypedValue = +typedValue;

        } else {

            formatedTypedValue = null;

        }


        if (!this.range) {

            this.inputValue = formatedTypedValue;

            this.changeValue(formatedTypedValue);

        } else {

            if (!Array.isArray(this.inputValue)) {
                this.valueInitiated();
            }

            this.inputValue[index] = formatedTypedValue;

            this.changeValue(this.inputValue);

        }

    }

    singleValueFocused(): void {

        setTimeout(() => {
            this.isFocused = true;
        }, 200);

        if (this.range) {

            setTimeout(() => {
                this.inputFrom.nativeElement.focus();
            }, 300);

        }

    }

    rangeValueFocused(): void {

        this.focusMoved = true;

        setTimeout(() => {
            this.focusMoved = false;
        }, 200);

    }

    allBlurValue(): void {

        if (this.range) {

            setTimeout(() => {

                if (!this.focusMoved) {
                    this.blurValue();
                }

            }, 200);

        } else {

            this.blurValue();

        }

    }

    getSingleValue(): number {

        if (Array.isArray(this.inputValue)) {
            return null;
        }

        return this.inputValue;

    }

    focus(): void {

        if (this.isRange) {

            this.inputFrom.nativeElement.focus();

        } else {

            this.input.nativeElement.focus();

        }

    }

    viewInitiated(): void {}

    valueChanged(): void {}

}
