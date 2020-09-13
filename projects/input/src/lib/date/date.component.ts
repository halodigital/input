import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import * as moment_ from 'moment-timezone';
import { HaloInputTimezone } from '../input';
import { HaloInputParentComponent } from '../_general/parent.component';
import { HaloInputDateCalendarDirective } from './calendar/calendar.directive';

const moment = moment_;


@Component({
    selector: 'halo-input-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss']
})

export class HaloInputDateComponent extends HaloInputParentComponent<number | number[]> {

    @Input() range: boolean;

    @ViewChild('input', {static: false}) input: ElementRef;
    @ViewChild(HaloInputDateCalendarDirective, {static: true}) picker: HaloInputDateCalendarDirective;

    get dateFormat(): string {

        return this.haloInputDateFormat || 'DD/MM/YYYY';

    }

    constructor(@Inject('haloInputDateFormat') private haloInputDateFormat: string,
                @Inject('haloInputTimezone') private haloInputTimezone: HaloInputTimezone) {

        super();

    }

    viewInitiated(): void {

        moment.tz.setDefault(this.haloInputTimezone);

        this.updateInput(this.value);

    }

    valueInitiated(): void {

        this.updateInput(this.value);

    }

    valueChanged(): void {

        this.updateInput(this.value);

    }

    openPicker(): void {

        if (!this.disabled && !this.readonly) {
            this.picker.openPicker(this.input.nativeElement);
        }

    }

    focus(): void {

        this.openPicker();

    }

    valueBlured(): void {}

    private updateInput(value: number | number[]): void {

        if (!this.input) { return; }

        let inputValue: string;

        if (!value) {

            inputValue = null;

        } else if (!this.range) {

            inputValue = moment(value).format(this.dateFormat);

        } else {

            inputValue = moment(value[0]).format(this.dateFormat) + ' - ' + moment(value[1]).format(this.dateFormat);

        }

        this.input.nativeElement.value = inputValue;

    }

}
