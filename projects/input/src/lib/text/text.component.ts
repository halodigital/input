import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HaloInputAutoCompleteComponent } from '../_general/autocomplete.component';


@Component({
    selector: 'halo-input-text',
    templateUrl: './text.component.html'
})

export class HaloInputTextComponent extends HaloInputAutoCompleteComponent<any> {

    @Input() pattern: string;

    @ViewChild('input', {static: false}) input: ElementRef;

    get mode(): 'autocomplete' | 'text' {

        if ((this.options && this.options.length > 0) || this.optionsEndpoint) {
            return 'autocomplete';
        }

        return 'text';

    }

    constructor(http: HttpClient) {

        super(http);

    }

    valueInitiated(): void {

        if (this.mode === 'autocomplete') {

            this.typingLabel = '';

            this.loadOptions(false);

            if (this.value !== null) {

                if (this.optionsEndpoint) {

                    this.typingLabel = this.formatInitialLabel();

                } else if (this.options) {

                    const selectedOption = this.options.find(o => o.value === this.value);

                    if (selectedOption) {
                        this.typingLabel = this.formatInitialLabel(selectedOption.label);
                    }

                }

            }

        }

    }

    valueBlured(): void {

        if (this.mode === 'autocomplete' && this.forceValueInOptions && (this.value === null || this.value === undefined)) {

            this.typingLabel = '';

        }

    }

    valueTyped(label: string): void {

        this.typingLabel = label;
        this.value = null;

        this.loadOptions(true);

    }

    valueSelected(selectedValue: any): void {

        const selectedOption = this.typingOptions.find(o => o.value === selectedValue);

        if (selectedOption !== null && selectedOption !== undefined) {

            this.typingLabel = selectedOption.label;

        }

        this.changeValue(selectedValue);

    }

    checkForMatch(): void {

        const selectedOption = this.typingOptions.find(option => option.label.toLowerCase() === this.typingLabel.toLowerCase());

        if (selectedOption) {

            this.typingLabel = selectedOption.label; // for option with upercase

            this.changeValue(selectedOption.value);

        } else if (!this.forceValueInOptions) {

            this.changeValue(this.typingLabel);

        } else {

            this.changeValue(null);

        }

    }

    focus(): void {

        if (this.input) {

            this.input.nativeElement.focus();

        }

    }

    initLabelsLoaded(): void {}

}
