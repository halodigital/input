import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatChipList } from '@angular/material/chips';
import { HaloInputOption } from '../input';
import { HaloInputAutoCompleteComponent } from '../_general/autocomplete.component';


@Component({
    selector: 'halo-input-chips',
    templateUrl: './chips.component.html',
    styleUrls: ['./chips.component.scss']
})

export class HaloInputChipsComponent extends HaloInputAutoCompleteComponent<any[]> {

    chips: string[];
    separators: number[];

    private typingValue: any;

    @ViewChild(MatChipList, {static: false}) input: MatChipList;

    get deletable(): boolean {

        return !this.disabled && !this.readonly;

    }

    constructor(http: HttpClient) {

        super(http);

    }

    valueInitiated(): void {

        this.typingLabel = '';
        this.typingValue = null;
        this.chips = [];
        this.separators = [ENTER, COMMA];

        if (!this.value || !Array.isArray(this.value)) {
            this.value = [];
        }

        this.loadOptions(false, this.chips);

        if (this.value.length > 0) {

            if (this.forceValueInOptions) {

                if (this.optionsEndpoint) {

                    this.chips = this.formatInitialLabels();

                } else if (this.options) {

                    this.chips = this.value.filter((v: any) => this.options.find(o => o.value === v)).map((v: any) => this.formatInitialLabel(v));

                    // loading again after updating chips
                    this.loadOptions(false, this.chips);

                }

            } else {

                this.chips = this.value;

            }

        }

    }

    valueBlured(): void {

        if (this.forceValueInOptions && (this.typingValue === null || this.typingValue === undefined)) {

            this.typingLabel = '';

        } else {

            this.createChip();

        }

        setTimeout(this.loadOptions.bind(this, false, this.chips), 200);

    }

    valueFocused(): void {

        this.loadOptions(true, this.chips);

    }

    valueTyped(label: string): void {

        this.typingLabel = label;
        this.typingValue = null;

        this.loadOptions(true, this.chips);

    }

    valueSelected(selectedOption: HaloInputOption): void {

        this.typingLabel = selectedOption.label;
        this.typingValue = selectedOption.value;

        this.createChip();

    }

    initLabelsLoaded(): void {

        if (this.optionsEndpoint) {

            this.chips = this.formatInitialLabels();

        } else if (this.options && Array.isArray(this.value)) {

            this.chips = this.value.filter((v: any) => this.options.find(o => o.value === v)).map((v: any) => this.formatInitialLabel(v));

            // loading again after updating chips
            this.loadOptions(false, this.chips);

        }

    }

    createChip(): void {

        const typingLabel = this.typingLabel.trim();
        const typingValue = this.forceValueInOptions ? this.typingValue : typingLabel;
        const existInChips = this.chips.includes(typingLabel);

        if (typingLabel && !existInChips && (this.typingValue || !this.forceValueInOptions)) {

            if (!Array.isArray(this.value)) {
                this.value = [];
            }

            this.chips.push(typingLabel);

            if (!this.value.includes(typingValue)) {
                this.value.push(typingValue);
            }

            this.changeValue(this.value);

        }

        this.typingLabel = '';
        this.typingValue = null;

        this.loadOptions(false, this.chips);

    }

    removeChip(chip: string): void {

        const index = this.chips.indexOf(chip);

        if (index > -1) {

            this.chips.splice(index, 1);
            this.value.splice(index, 1);

            this.changeValue(this.value);

            this.loadOptions(false, this.chips);

        }

    }

    checkForMatch(): void {

        const selectedOption = this.typingOptions.find(option => option.label.toLowerCase() === this.typingLabel.toLowerCase());

        if (selectedOption) {

            this.typingLabel = selectedOption.label; // for option with upercase
            this.typingValue = selectedOption.value;

        }

    }

    focus(): void {

        this.input.focus();

    }

}
