// Based on ngx-daterangepicker-material
// MIT license

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment_ from 'moment-timezone';
import { HaloInputTimezone } from '../../input';
import { HaloInputDateCalendarDirective } from './calendar.directive';

const moment = moment_;

export enum SideEnum {
    left = 'left',
    right = 'right'
}


@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})

export class HaloInputDateCalendarComponent implements OnInit {

    _old: {start: any, end: any} = {start: null, end: null};
    _locale = {};
    _ranges: any = {};
    chosenLabel: string;
    calendarVariables: {left: any, right: any} = {left: {}, right: {}};
    timepickerVariables: {left: any, right: any} = {left: {}, right: {}};
    daterangepicker: {start: FormControl, end: FormControl} = {start: new FormControl(), end: new FormControl()};
    applyBtn: {disabled: boolean} = {disabled: false};
    startDate = moment().startOf('day');
    endDate = moment().endOf('day');
    dateLimit = null;
    sideEnum = SideEnum;
    chosenRange: string;
    rangesArray: Array<any> = [];
    leftCalendar: any = {};
    rightCalendar: any = {};
    showCalInRanges = false;
    options: any = {};
    host: HaloInputDateCalendarDirective;
    hostElement: ElementRef;
    locale = {
        direction: 'ltr',
        separator: ' - ',
        weekLabel: 'W',
        applyLabel: 'Apply',
        cancelLabel: 'Reset',
        customRangeLabel: 'Custom range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek(),
        format: null
    };

    @Input() minDate: any = null;
    @Input() maxDate: any = null;
    @Input() autoApply = false;
    @Input() singleDatePicker = false;
    @Input() showDropdowns = false;
    @Input() showWeekNumbers = false;
    @Input() showISOWeekNumbers = false;
    @Input() linkedCalendars = false;
    @Input() autoUpdateInput = true;
    @Input() alwaysShowCalendars = true;
    @Input() maxSpan = false;
    @Input() timePicker = false;
    @Input() timePicker24Hour = false;
    @Input() timePickerIncrement = 1;
    @Input() timePickerSeconds = false;
    @Input() showClearButton = true;
    @Input() firstMonthDayClass: string = null;
    @Input() lastMonthDayClass: string = null;
    @Input() emptyWeekRowClass: string = null;
    @Input() firstDayOfNextMonthClass: string = null;
    @Input() lastDayOfPreviousMonthClass: string = null;
    @Input() showCustomRangeLabel: boolean;
    @Input() showCancel = true;
    @Input() keepCalendarOpeningWithRange = false;
    @Input() showRangeLabelOnInput = false;
    @Input() drops: string;
    @Input() opens: string;
    @Input() calendarValue: number | number[];

    @Input()
    get ranges(): any {

        return this._ranges;

    }
    set ranges(value) {

        this._ranges = value;
        this.renderRanges();

    }

    get dateFormat(): string {

        return this.haloInputDateFormat || 'DD/MM/YYYY';

    }

    @Output() choosedDate: EventEmitter<object>;
    @Output() rangeClicked: EventEmitter<object>;
    @Output() datesUpdated: EventEmitter<number | number[]>;

    @ViewChild('pickerContainer', {static: true}) pickerContainer: ElementRef;

    @HostListener('click')
    onClick(): void {

        this.close();

    }

    constructor(@Inject('haloInputDateFormat') private haloInputDateFormat: string, @Inject('haloInputTimezone') private haloInputTimezone: HaloInputTimezone, private _ref: ChangeDetectorRef, hostElement: ElementRef) {

        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();

        this.hostElement = hostElement;

        this.updateMonthsInView();

    }

    ngOnInit(): void {

        moment.tz.setDefault(this.haloInputTimezone);

        if (this.dateFormat.includes('hh')) {

            this.timePicker = true;

        } else if (this.dateFormat.includes('HH')) {

            this.timePicker = true;
            this.timePicker24Hour = true;

        }

        if (this.dateFormat.includes('ss')) {

            this.timePickerSeconds = true;

        }

        if (+this.locale.firstDay !== 0) {

            let iterator = this.locale.firstDay;

            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }

        }

        if (this.timePicker) {
            this.locale.format = moment.localeData().longDateFormat('lll');
        } else {
            this.locale.format = moment.localeData().longDateFormat('L');
        }

        if (!this.singleDatePicker) {

            this._ranges = {
                Today: [moment().startOf('day'), moment().endOf('day')],
                Yesterday: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            };

        }

        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();

        if (this.calendarValue) {

            if (!this.singleDatePicker) {

                if (this.calendarValue[0]) {
                    this.setStartDate(this.calendarValue[0]);
                }

                if (this.calendarValue[1]) {
                    this.setEndDate(this.calendarValue[1]);
                }

                this.calculateChosenLabel();

            } else {

                this.setStartDate(this.calendarValue);
                this.setEndDate(null);

            }

        }

        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.pickerContainer.nativeElement.focus();
        this.updateView();

    }

    setStartDate(startDate: any): void {

        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }

        if (typeof startDate === 'object' || typeof startDate === 'number') {
            this.startDate = moment(startDate);
        }

        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }


        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }

        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }

        this.updateMonthsInView();

    }

    setEndDate(endDate: any): void {

        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }

        if (typeof endDate === 'object' || typeof endDate === 'number') {
            this.endDate = moment(endDate);
        }

        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }

        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }

        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }

        if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit);
        }

        this.updateMonthsInView();

    }

    calculateChosenLabel(): void {

        let customRange = true;
        let i = 0;

        if (this.rangesArray.length > 0) {

            // tslint:disable-next-line: forin
            for (const range in this.ranges) {

                if (this.timePicker) {

                    // const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                    const format = 'YYYY-MM-DD HH:mm';

                    // ignore times when comparing dates if time picker seconds is not enabled
                    // tslint:disable-next-line: triple-equals
                    if (this.startDate.format(format) == this.ranges[range][0].format(format) && this.endDate.format(format) == this.ranges[range][1].format(format)) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i];
                        break;
                    }

                } else {

                    // ignore times when comparing dates if time picker is not enabled
                    // tslint:disable-next-line: triple-equals
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i];
                        break;
                    }

                }

                i++;
            }

            if (customRange) {

                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                } else {
                    this.chosenRange = null;
                }

                // if custom label: show calenar
                this.showCalInRanges = true;
            }

        }

    }

    apply(): void {

        let emitValue: number | number[];

        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }

        if (!this.startDate && !this.endDate) {

            emitValue = null;

        } else if (this.singleDatePicker && !this.timePicker) { // single without time

            const date = new Date(+this.startDate.valueOf());

            date.setHours(0, 0, 0, 0);

            emitValue = date.getTime();

        } else if (!this.timePicker) { // range without time

            this.startDate.startOf('day');
            this.endDate.endOf('day');

            emitValue = [
                this.startDate.valueOf(),
                this.endDate.valueOf()
            ];

        } else if (this.singleDatePicker && this.timePicker) { // single with time

            const date = new Date(+this.startDate.valueOf());

            if (this.timePickerSeconds) {
                date.setMilliseconds(0);
            } else {
                date.setSeconds(0, 0);
            }

            emitValue = date.getTime();

        } else { // range with time

            const startDate = new Date(this.startDate.valueOf());
            const endDate = new Date(this.endDate.valueOf());

            if (this.timePickerSeconds) {
                startDate.setMilliseconds(0);
                endDate.setMilliseconds(999);
            } else {
                startDate.setSeconds(0, 0);
                endDate.setSeconds(59, 999);
            }

            emitValue = [
                startDate.getTime(),
                endDate.getTime()
            ];

        }

        this.datesUpdated.emit(emitValue);

        this.close();

    }

    clear(isInit: boolean = false): void {

        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');

        if (!isInit) {
            this.datesUpdated.emit(null);
        }

        this.close();

    }

    goPrev(side: SideEnum): void {

        if (side === SideEnum.left) {

            this.leftCalendar.month.subtract(1, 'month');

            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }

        } else {

            this.rightCalendar.month.subtract(1, 'month');

        }

        this.updateCalendars();

    }

    goNext(side: SideEnum): void {

        if (side === SideEnum.left) {

            this.leftCalendar.month.add(1, 'month');

        } else {

            this.rightCalendar.month.add(1, 'month');

            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }

        }

        this.updateCalendars();

    }

    monthChanged(monthEvent: any, side: SideEnum): void {

        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);

    }

    yearChanged(yearEvent: any, side: SideEnum): void {

        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);

    }

    timeChanged(timeEvent: any, side: SideEnum): void {

        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;

        if (!this.timePicker24Hour) {

            const ampm = this.timepickerVariables[side].ampmModel;

            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }

        }

        if (side === SideEnum.left) {

            const start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);

            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            // tslint:disable-next-line: triple-equals
            } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }

        } else if (this.endDate) {

            const end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);

        }

        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();

        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);

    }

    dateChoosed(event: any, side: SideEnum, row: number, col: number): void {

        if (event.target.tagName === 'TD') {

            if (!event.target.classList.contains('available')) {
                return;
            }

        } else if (event.target.tagName === 'SPAN') {

            if (!event.target.parentElement.classList.contains('available')) {
                return;
            }

        }

        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }

        let date = side ===  SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

        if (this.endDate || date.isBefore(this.startDate, 'day')) { // picking start

            if (this.timePicker) {
                date = this.getDateWithTime(date, SideEnum.left);
            }

            this.endDate = null;
            this.setStartDate(date.clone());

        } else if (!this.endDate && date.isBefore(this.startDate)) {

            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());

        } else { // picking end

            if (this.timePicker) {
                date = this.getDateWithTime(date, SideEnum.right);
            }

            this.setEndDate(date.clone());

            if (this.autoApply) {
                this.calculateChosenLabel();
                this.apply();
            }

        }

        if (this.singleDatePicker) {

            this.setEndDate(this.startDate);

            if (this.autoApply) {
                this.apply();
            }

        }

        this.updateView();

        // this is to cancel the blur event handler if the mouse was in one of the inputs
        event.stopPropagation();

    }

    rangeChoosed(label: string): void {

        this.chosenRange = label;

        // tslint:disable-next-line: triple-equals
        if (label == this.locale.customRangeLabel) {

            this.showCalInRanges = true;

        } else {

            const dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();

            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            } else {
                this.calculateChosenLabel();
            }

            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;

            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }

            this.rangeClicked.emit({label, dates});

            if (!this.keepCalendarOpeningWithRange) {

                this.apply();

            } else {

                this.renderCalendar(SideEnum.left);
                this.renderCalendar(SideEnum.right);

                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }

            }

        }

    }

    isRangeDisable(range: string): boolean {

        if (range === this.locale.customRangeLabel) {
            return false;
        }

        const rangeMarkers = this.ranges[range];

        const areBothBefore = rangeMarkers.every((date: any) => {

            if (!this.minDate) {
                return false;
            }

            return date.isBefore(this.minDate);

        });

        const areBothAfter = rangeMarkers.every((date: any) => {

            if (!this.maxDate) {
                return false;
            }

            return date.isAfter(this.maxDate);

        });

        return (areBothBefore || areBothAfter);

    }

    private renderRanges(): void {

        this.rangesArray = [];

        let start: moment.Moment;
        let end: moment.Moment;

        if (typeof this.ranges === 'object') {

            // tslint:disable-next-line: forin
            for (const range in this.ranges) {

                if (typeof this.ranges[range][0] === 'string') {
                    start = moment(this.ranges[range][0], this.locale.format);
                } else {
                    start = moment(this.ranges[range][0]);
                }

                if (typeof this.ranges[range][1] === 'string') {
                    end = moment(this.ranges[range][1], this.locale.format);
                } else {
                    end = moment(this.ranges[range][1]);
                }

                // if the start or end date exceed those allowed by the minDate or maxSpan options
                // shorten the range to the allowable period

                if (this.minDate && start.isBefore(this.minDate)) {
                    start = this.minDate.clone();
                }

                let maxDate = this.maxDate;

                if (this.maxSpan && maxDate && start.clone().add(this.maxSpan as any).isAfter(maxDate)) {
                    maxDate = start.clone().add(this.maxSpan as any);
                }

                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }

                // if the end of the range is before the minimum or the start of the range is after the maximum
                // don't display this range option at all

                if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                    continue;
                }

                // support unicode chars in the range names.
                const elem = document.createElement('textarea');
                elem.innerHTML = range;
                const rangeHtml = elem.value;

                this.ranges[rangeHtml] = [start, end];

            }

            // tslint:disable-next-line: forin
            for (const range in this.ranges) {
                this.rangesArray.push(range);
            }

            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }

            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;

            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }

            // can't be used together for now
            if (this.timePicker && this.autoApply) {
                this.autoApply = false;
            }

        }

    }

    private renderTimePicker(side: SideEnum): void{

        // tslint:disable-next-line: triple-equals
        if (side == SideEnum.right && !this.endDate) {
            return;
        }

        let selected: moment.Moment;
        let minDate: moment.Moment;
        const maxDate = this.maxDate;

        if (side === SideEnum.left) {
            selected = this.startDate.clone(),
            minDate = this.minDate;
        } else if (side === SideEnum.right) {
            selected = this.endDate.clone(),
            minDate = this.startDate;
        }

        const start = this.timePicker24Hour ? 0 : 1;
        const end = this.timePicker24Hour ? 23 : 12;

        this.timepickerVariables[side] = {
            hours: [],
            hoursLabel: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0
        };

        // generate hours
        for (let i = start; i <= end; i++) {

            let i_in_24 = i;

            if (!this.timePicker24Hour) {
                // tslint:disable-next-line: triple-equals
                i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);
            }

            const time = selected.clone().hour(i_in_24);
            let disabled = false;

            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }

            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }

            const padded = i < 10 ? '0' + i : i;

            this.timepickerVariables[side].hours.push(i);
            this.timepickerVariables[side].hoursLabel.push(padded);

            // tslint:disable-next-line: triple-equals
            if (i_in_24 == selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            } else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }

        }

        // generate minutes
        for (let i = 0; i < 60; i += this.timePickerIncrement) {

            const padded = i < 10 ? '0' + i : i;
            const time = selected.clone().minute(i);

            let disabled = false;

            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }

            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }

            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);

            // tslint:disable-next-line: triple-equals
            if (selected.minute() == i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            } else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }

        }

        // generate seconds
        if (this.timePickerSeconds) {

            for (let i = 0; i < 60; i++) {

                const padded = i < 10 ? '0' + i : i;
                const time = selected.clone().second(i);

                let disabled = false;

                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }

                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }

                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);

                // tslint:disable-next-line: triple-equals
                if (selected.second() == i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                } else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }

            }
        }

        // generate AM/PM
        if (!this.timePicker24Hour) {

            const am_html = '';
            const pm_html = '';

            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }

            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }

            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            } else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }

        }

        // generate initial start hour
        // const startHour = new Date();
        // const startHour24 = startHour.getHours();
        // const startHour12 = startHour24 > 12 ? startHour24 - 12 : startHour24;
        // this.timepickerVariables.left.selectedHour = this.timePicker24Hour ? startHour24 : startHour12;
        // this.timepickerVariables[side].selected = selected;

    }

    private renderCalendar(side: SideEnum): void {

        const mainCalendar: any = ( side === SideEnum.left ) ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay).subtract(1, 'month').month();
        const lastYear = moment(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();

        // initialize a 6 rows x 7 columns array for the calendar
        const calendar: any = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;

        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }

        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;

        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }

        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }

        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {

            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }

            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);

            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }

            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }

        }

        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        } else {
            this.rightCalendar.calendar = calendar;
        }

        // display the calendar
        const minDate = side === 'left' ? this.minDate : this.startDate;
        let maxDate = this.maxDate;

        // adjust maxDate to reflect the dateLimit setting in order to grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }

        this.calendarVariables[side] = {
            month,
            year,
            hour,
            minute,
            second,
            daysInMonth,
            firstDay,
            lastDay,
            lastMonth,
            lastYear,
            daysInLastMonth,
            dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate,
            maxDate,
            calendar
        };

        if (this.showDropdowns) {

            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            const minYear = (minDate && minDate.year()) || (currentYear - 50);
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];

            for (let y = minYear; y <= maxYear; y++) {
                years.push(y);
            }

            this.calendarVariables[side].dropdowns = {
                currentMonth,
                currentYear,
                maxYear,
                minYear,
                inMinYear,
                inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };

        }

        this.buildCells(calendar, side);

    }

    private updateView(): void {

        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }

        this.updateMonthsInView();
        this.updateCalendars();

    }

    private updateMonthsInView(): void {

        if (this.endDate) {

            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))
                ) {
                return;
            }

            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                } else {
                        this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }

        } else {

            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }

        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }

    }

    private updateCalendars(): void {

        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);

        if (this.endDate !== null) {
            this.calculateChosenLabel();
        }

    }

    private monthOrYearChanged(month: number, year: number, side: SideEnum): void {

        const isLeft = side === SideEnum.left;

        if (!isLeft) {

            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }

        }

        if (this.minDate) {

            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }

        }

        if (this.maxDate) {

            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }

        }

        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;

        if (isLeft) {

            this.leftCalendar.month.month(month).year(year);

            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }

        } else {

            this.rightCalendar.month.month(month).year(year);

            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }

        }

        this.updateCalendars();

    }

    private close(): void {

        if (!this.endDate) {

            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }

            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }

        }

        this._ref.detectChanges();

        this.host.closePicker();

    }

    private getDateWithTime(date: any, side: SideEnum): moment.Moment {

        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);

        if (!this.timePicker24Hour) {

            const ampm = this.timepickerVariables[side].ampmModel;

            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }

            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }

        }

        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;

        return date.clone().hour(hour).minute(minute).second(second);

    }

    private buildCells(calendar: any, side: SideEnum): void {

        for (let row = 0; row < 6; row++) {

            this.calendarVariables[side].classes[row] = {};
            const rowClasses = [];

            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }

            for (let col = 0; col < 7; col++) {

                const classes = [];

                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }

                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }

                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {

                    classes.push('off');

                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }

                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }

                }

                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }

                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }

                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }

                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }

                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }

                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }

                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }

                // store classes let
                let cname = '';
                let disabled = false;

                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }

                if (!disabled) {
                    cname += 'available';
                }

                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }

            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');

        }

    }

    private hasCurrentMonthDays(currentMonth: any, row: any): boolean {

        for (let day = 0; day < 7; day++) {

            if (row[day].month() === currentMonth) {
                return true;
            }

        }

        return false;

    }

}
