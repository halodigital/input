import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HaloTooltipPosition } from '@halodigital/tooltip';
import { HaloInputFormListField } from './form-list/form-list';
import { HaloInputDirection, HaloInputErrorMessages, HaloInputType, HaloInputOption } from './input';
import { HaloInputParentComponent } from './_general/parent.component';


@Component({
    selector: 'halo-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: HaloInputComponent,
        multi: true
    }]
})

export class HaloInputComponent implements ControlValueAccessor, OnInit, OnChanges {

    value: any;
    errorMessage: string;
    changed: (value: any) => void;
    blured: () => void;

    private allInputsLoaded: boolean;
    private defaultErrorMessages: HaloInputErrorMessages;

    private _type: HaloInputType;
    private _required: boolean;

    @ViewChild('innerComponent', {static: false}) innerComponent: HaloInputParentComponent<any>;

    @HostBinding('class.halo-input-disabled')
    get disabledClass(): boolean {

        return this.disabled;

    }

    @HostBinding('class.halo-input-readonly')
    get readonlyClass(): boolean {

        return this.readonly;

    }

    @HostBinding('class.halo-input-empty')
    get emptyClass(): boolean {

        return this.value === null || this.value === undefined;

    }

    @Input() noValidate: boolean;
    @Input() placeholder: string;
    @Input() hint: string;
    @Input() disabled: boolean;
    @Input() readonly: boolean;
    @Input() hostControl: FormControl;
    @Input() formSubmitted: boolean;
    @Input() errorMessages: HaloInputErrorMessages;
    @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() valueBlured: EventEmitter<void> = new EventEmitter<void>();

    // checkboxList
    @Input() direction: HaloInputDirection;
    @Input() readonlyOptions: any[];
    @Input() emptyLabel: string;
    @Input() options: any[];
    @Input() optionsEndpoint: string;
    @Input() optionsCaching: boolean;
    @Input() optionsExcludeValues: any[];
    @Output() optionsEndpointLoaded: EventEmitter<HaloInputOption[]> = new EventEmitter<HaloInputOption[]>();

    // chips
    // @Input() options: any[];
    // @Input() optionsEndpoint: string;
    @Input() optionsEndpointParam: string;
    @Input() initLabels: string[];
    @Input() forceValueInOptions: boolean;

    // date
    @Input() range: boolean;

    // formList
    // @Input() emptyLabel: string;
    @Input() creatable: boolean;
    @Input() deletable: boolean;
    @Input() selectable: boolean | 'disabled';
    @Input() titleFieldId: string;
    @Input() fields: HaloInputFormListField[];
    @Input() focusGroupIndex: number;

    // image
    @Input() uploadEndpoint: string;

    // number
    // @Input() range: boolean;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;

    // password
    @Input() pattern: string;
    @Input() minlength: number;
    @Input() maxlength: number;

    // radio
    @Input() outputValue: any;
    @Input() groupName: string;

    // radioList
    // @Input() emptyLabel: string;
    // @Input() direction: Direction;
    // @Input() options: any[];
    // @Input() optionsEndpoint: string;
    // @Input() optionsCaching: boolean;
    // @Input() optionsExcludeValues: any[];
    // @Output() optionsEndpointLoaded: EventEmitter<Option[]> = new EventEmitter<Option[]>();

    // select
    // @Input() options: any[];
    // @Input() optionsEndpoint: string;
    // @Input() optionsCaching: boolean;
    // @Input() optionsExcludeValues: any[];
    // @Output() optionsEndpointLoaded: EventEmitter<Option[]> = new EventEmitter<Option[]>();
    @Input() multiple: boolean;
    @Input() tooltipPosition: HaloTooltipPosition;

    // text
    // @Input() pattern: string;
    // @Input() minlength: number;
    // @Input() maxlength: number;
    // @Input() initLabels: string[];
    // @Input() options: any[];
    // @Input() optionsEndpoint: string;
    // @Input() optionsEndpointParam: string;
    // @Input() forceValueInOptions: boolean;

    // textarea
    @Input() disableExpand: boolean;

    @Input()
    get type(): HaloInputType {

        return this._type || HaloInputType.Text;

    }
    set type(type: HaloInputType) {

        this._type = type;

    }

    @Input()
    get required(): boolean {

        if (this.disabled || this.readonly) {
            return false;
        }

        const templateFormRequired = this._required;

        const reactiveFormRequired = this.hostControl &&
                                     this.hostControl.validator &&
                                     this.hostControl.validator({} as AbstractControl) &&
                                     this.hostControl.validator({} as AbstractControl).required;

        return !!templateFormRequired || !!reactiveFormRequired;

    }
    set required(required: boolean) {

        this._required = required;

        this.validate(true);

    }

    constructor(private host: ElementRef) {

        this.defaultErrorMessages = {
            required: 'This field is required',
            min: 'Value must be greater than [var]',
            max: 'Value must be lower than [var]',
            minlength: 'Value must contain at least [var] characters',
            maxlength: 'Value must contain at most [var] characters',
            pattern: 'Not a valid value'
        };

    }

    ngOnInit(): void {

        this.allInputsLoaded = true;
        this.host.nativeElement.classList.add('halo-input-' + this.type);

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.allInputsLoaded && changes.type && changes.type.previousValue !== changes.type.currentValue) {

            this.changeValue(null);

        }

        if (changes.disabled && changes.disabled.previousValue !== changes.disabled.currentValue) {

            this.setDisabledState(changes.disabled.currentValue);

        }

        if (changes.readonly && changes.readonly.previousValue !== changes.readonly.currentValue) {

            this.validate(true);

        }

        if (changes.formSubmitted && changes.formSubmitted.previousValue !== changes.formSubmitted.currentValue) {

            this.validate();

        }

    }

    focus(): void {

        this.innerComponent.focus();

    }

    changeValue(value: any): void {

        this.value = value;

        if (this.changed) {
            this.changed(value);
        }

        this.valueChanged.emit(value);

        this.validate();

    }

    blurValue(): void {

        if (this.blured) {
            this.blured();
        }

        this.valueBlured.emit();

        this.validate();

    }

    optionsEndpointLoadedCall(options: HaloInputOption[]): void {

        this.optionsEndpointLoaded.emit(options);

    }

    writeValue(initialValue: any): void {

        this.value = initialValue;

        setTimeout(() => {

            if (this.innerComponent) {
                this.innerComponent.initValue(initialValue);
            }

        }, 200);

        this.validate(true);

    }

    setDisabledState(disabled: boolean): void {

        this.disabled = disabled;

        this.validate(true);

    }

    registerOnChange(fn: (value: any) => void): void {

        this.changed = fn;

    }

    registerOnTouched(fn: () => void): void {

        this.blured = fn;

    }

    private validate(onlyAfterSubmit: boolean = false): void {

        if (this.disabled || this.readonly || this.noValidate  || (onlyAfterSubmit && !this.formSubmitted)) {

            this.errorMessage = null;

        } else if (!onlyAfterSubmit || (onlyAfterSubmit && this.formSubmitted)) {

            this.errorMessage = this.getErrorMessage();

        }

    }

    private getErrorMessage(): string {

        const hasValue = (this.type !== HaloInputType.Checkbox && (this.value || this.value === 0)) || (this.type === HaloInputType.Checkbox && this.value === true);
        const hasHostErrors = !!this.hostControl && this.hostControl.errors;

        if ((this.required && !hasValue) || (hasHostErrors && this.hostControl.errors.required)) {

            return (this.errorMessages && this.errorMessages.required || this.defaultErrorMessages.required);

        }

        if (this.type === HaloInputType.Number) {

            const minMessage = (this.errorMessages && this.errorMessages.min || this.defaultErrorMessages.min);
            const maxMessage = (this.errorMessages && this.errorMessages.max || this.defaultErrorMessages.max);

            if ((this.min || this.min === 0) && (this.value || this.value === 0) && (this.value < this.min)) {

                return minMessage.replace('[var]', (this.min - 1).toString());

            }

            if ((this.max || this.max === 0) && (this.value || this.value === 0) && (this.value > this.max)) {

                return maxMessage.replace('[var]', (this.max + 1).toString());

            }

            if (hasHostErrors && this.hostControl.errors.min) {

                return minMessage.replace('[var]', (+this.hostControl.errors.min.min - 1).toString());

            }

            if (hasHostErrors && this.hostControl.errors.max) {

                return maxMessage.replace('[var]', (+this.hostControl.errors.max.max + 1).toString());

            }

        }

        if (this.type === HaloInputType.Text || this.type === HaloInputType.Password) {

            const value = this.value || '';
            const minMessage = (this.errorMessages && this.errorMessages.minlength || this.defaultErrorMessages.minlength);
            const maxMessage = (this.errorMessages && this.errorMessages.maxlength || this.defaultErrorMessages.maxlength);

            if ((this.minlength || this.minlength === 0) && (value.length < this.minlength)) {

                return minMessage.replace('[var]', this.minlength.toString());

            }

            if ((this.maxlength || this.maxlength === 0) && (value.length > this.maxlength)) {

                return maxMessage.replace('[var]', this.maxlength.toString());

            }

            if (hasHostErrors && this.hostControl.errors.minlength) {

                return minMessage.replace('[var]', (+this.hostControl.errors.minlength.requiredLength).toString());

            }

            if (hasHostErrors && this.hostControl.errors.maxlength) {

                return maxMessage.replace('[var]', (+this.hostControl.errors.maxlength.requiredLength).toString());

            }

            if ((this.pattern && !(RegExp(this.pattern)).test(this.value)) ||
                (hasHostErrors && this.hostControl.errors.pattern)) {

                return (this.errorMessages && this.errorMessages.pattern || this.defaultErrorMessages.pattern);

            }

            if (hasHostErrors && this.hostControl.errors.email) {

                return (this.errorMessages && this.errorMessages.pattern || this.defaultErrorMessages.pattern);

            }

        }

        if (hasHostErrors && this.hostControl.errors.custom) {

            return this.hostControl.errors.custom;

        }

        if (hasHostErrors && this.hostControl.errors.server) {

            if (Array.isArray(this.hostControl.errors.server)) {

                return this.hostControl.errors.server[0];

            }

            return this.hostControl.errors.server;

        }

        return null;

    }

}
