import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { HaloInputDirection, HaloInputOption } from '../input';
import { HaloInputOptionsComponent } from '../_general/options.component';
import { HaloInputOptionsService } from '../_general/options.service';


@Component({
    selector: 'halo-input-checkbox-list',
    templateUrl: './checkbox-list.component.html',
    styleUrls: ['./checkbox-list.component.scss']
})

export class HaloInputCheckboxListComponent extends HaloInputOptionsComponent {

    private _direction: HaloInputDirection;
    private _readonlyOptions: any[]; // array of options value

    @ViewChildren(MatCheckbox) input: QueryList<MatCheckbox>;

    @Input()
    get direction(): HaloInputDirection {

        return this._direction || HaloInputDirection.Vertical;

    }
    set direction(direction: HaloInputDirection) {

        this._direction = direction;

    }

    @Input()
    get readonlyOptions(): any[] {

        return this._readonlyOptions || [];

    }
    set readonlyOptions(readonlyOptions: any[]) {

        if (Array.isArray(readonlyOptions)) {

            this._readonlyOptions = readonlyOptions;

        } else {

            this._readonlyOptions = [];

        }

    }

    constructor(optionsService: HaloInputOptionsService) {

        super(optionsService);

    }

    isChecked(option: HaloInputOption): boolean {

        if (!this.value || !Array.isArray(this.value)) {
            return false;
        }

        return this.value.includes(option.value);

    }

    isDisabled(option: HaloInputOption): boolean {

        return this.disabled || this.readonly || this.readonlyOptions.includes(option.value);

    }

    checkboxChanged(option: HaloInputOption, checked: boolean): void {

        let value = this.value;

        if (!this.value || !Array.isArray(this.value)) {

            value = [];

        }

        if (checked) {

            value.push(option.value);

        } else {

            const index = value.indexOf(option.value);

            value.splice(index, 1);

        }

        this.changeValue(value);

    }

    focus(): void {

        this.input.first.focus();

    }

}
