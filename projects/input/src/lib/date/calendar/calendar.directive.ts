// Based on ngx-daterangepicker-material
// MIT license

import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, EmbeddedViewRef, EventEmitter, HostListener, Injector, Input, OnChanges, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import * as moment_ from 'moment-timezone';
import { HaloInputDateCalendarComponent } from './calendar.component';

const moment = moment_;


@Directive({
    selector: 'input[datepicker]',
})

export class HaloInputDateCalendarDirective implements OnChanges {

    notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey'];
    pickerComponent: ComponentRef<HaloInputDateCalendarComponent>;

    private _onChange = Function.prototype;
    private _onTouched = Function.prototype;
    private _value: any;

    @Input() minDate: moment.Moment;
    @Input() maxDate: moment.Moment;
    @Input() autoApply: boolean;
    @Input() alwaysShowCalendars: boolean;
    @Input() showCustomRangeLabel: boolean;
    @Input() linkedCalendars: boolean;
    @Input() singleDatePicker: boolean;
    @Input() showWeekNumbers: boolean;
    @Input() showISOWeekNumbers: boolean;
    @Input() showDropdowns: boolean;
    @Input() showClearButton: boolean;
    @Input() ranges: any;
    @Input() opens: string;
    @Input() drops: string;
    @Input() firstMonthDayClass: string;
    @Input() lastMonthDayClass: string;
    @Input() emptyWeekRowClass: string;
    @Input() firstDayOfNextMonthClass: string;
    @Input() lastDayOfPreviousMonthClass: string;
    @Input() keepCalendarOpeningWithRange: boolean;
    @Input() showRangeLabelOnInput: boolean;
    @Input() showCancel = true;
    @Input() timePicker = false;
    @Input() timePicker24Hour = false;
    @Input() timePickerIncrement = 1;
    @Input() timePickerSeconds = false;
    @Input() calendarValue: number | number[];

    get value(): any {

        return this._value || null;

    }
    set value(val) {

        this._value = val;
        this._onChange(val);
        this.changeDetectorRef.markForCheck();

    }

    // tslint:disable-next-line: no-output-native
    @Output() change: EventEmitter<object> = new EventEmitter();
    @Output() rangeClicked: EventEmitter<object> = new EventEmitter();
    @Output() datesUpdated: EventEmitter<object | number> = new EventEmitter();

    @HostListener('keyup.esc')
    hostHide(): void {

        this.closePicker();

    }

    @HostListener('window:resize')
    windowResize(): void {

        this.closePicker();

    }

    constructor(public viewContainerRef: ViewContainerRef,
                public changeDetectorRef: ChangeDetectorRef,
                private componentFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector) {}

    ngOnChanges(changes: SimpleChanges): void {

        for (const change in changes) {

            if (changes.hasOwnProperty(change)) {

                if (this.pickerComponent && this.notForChangesProperty.indexOf(change) === -1) {
                    this.pickerComponent.instance[change] = changes[change].currentValue;
                }

            }

        }

    }

    onBlur(): void {

        this._onTouched();

    }

    openPicker(relatedElement: HTMLElement): void {

        const factory = this.componentFactoryResolver.resolveComponentFactory(HaloInputDateCalendarComponent);
        const ref = factory.create(this.injector);
        const element = (ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        this.pickerComponent = ref;
        this.pickerComponent.instance.host = this;
        this.pickerComponent.instance.calendarValue = this.calendarValue;
        this.pickerComponent.instance.rangeClicked.asObservable().subscribe(range => this.rangeClicked.emit(range));
        this.pickerComponent.instance.datesUpdated.asObservable().subscribe(range => this.datesUpdated.emit(range));
        this.pickerComponent.instance.firstMonthDayClass = this.firstMonthDayClass;
        this.pickerComponent.instance.lastMonthDayClass = this.lastMonthDayClass;
        this.pickerComponent.instance.emptyWeekRowClass = this.emptyWeekRowClass;
        this.pickerComponent.instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.pickerComponent.instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.pickerComponent.instance.singleDatePicker = this.singleDatePicker;
        this.pickerComponent.instance.drops = this.drops;
        this.pickerComponent.instance.opens = this.opens;

        this.appRef.attachView(ref.hostView);

        document.body.appendChild(element);

        setTimeout(() => {
            this.setPickerPosition(relatedElement);
        }, 100);

    }

    closePicker(): void {

        if (this.pickerComponent) {

            this.pickerComponent.destroy();
            this.pickerComponent = null;

        }

    }

    writeValue(value: any): void {

        this.value = value;

    }

    registerOnChange(fn: () => void): void {

        this._onChange = fn;

    }

    registerOnTouched(fn: () => void): void {

        this._onTouched = fn;

    }

    private setPickerPosition(relatedInput: HTMLElement): void {

        const calendarBackdrop = this.pickerComponent.instance.hostElement.nativeElement;
        const calendar = this.pickerComponent.instance.pickerContainer.nativeElement;

        calendar.style.visiblity = 'hidden';
        calendar.style.display = '';
        calendarBackdrop.style.visiblity = 'hidden';
        calendarBackdrop.style.display = '';

        const inputPosition = relatedInput.getBoundingClientRect();
        const screenWidth = document.body.clientWidth;
        const screenHeight = document.body.clientHeight;
        const calendarWidth = calendar.clientWidth;
        const calendarHeight = calendar.clientHeight;
        const inputWidth = inputPosition.width;
        const inputHeight = inputPosition.height;
        const inputPositionLeft = inputPosition.left;
        const inputPositionTop = inputPosition.top;

        this.opens = ((inputPositionLeft + calendarWidth) > (screenWidth - 10) ? 'right' : 'left');
        this.drops = ((inputPositionTop + calendarHeight) > (screenHeight - 25) ? 'up' : 'down');

        calendar.style.top = 'unset';
        calendar.style.left = 'unset';

        if (this.drops === 'up') {
            calendar.style.top = (inputPositionTop - inputHeight - calendarHeight - 12) + 'px';
        } else {
            calendar.style.top = (inputPositionTop + inputHeight + 5) + 'px';
        }

        if (this.opens === 'right') {
            calendar.style.left = (inputPositionLeft + inputWidth + 12 - calendarWidth) + 'px';
        } else {
            calendar.style.left = inputPositionLeft + 'px';
        }

        calendar.style.visiblity = 'visible';
        calendar.style.opacity = 1;
        calendarBackdrop.style.visiblity = 'visible';

    }

}
