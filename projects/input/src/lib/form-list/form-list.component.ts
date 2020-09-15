import { Component, Inject, Input, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as moment_ from 'moment-timezone';
import { HaloInputOption, HaloInputTimezone, HaloInputType } from '../input';
import { HaloInputComponent } from '../input.component';
import { HaloInputParentComponent } from '../_general/parent.component';
import { HaloInputFormListField, HaloInputFormListMode } from './form-list';

const moment = moment_;


@Component({
    selector: 'halo-input-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})

export class HaloInputFormListComponent extends HaloInputParentComponent<object[]> {

    form: FormArray;
    groups: boolean[];
    titles: string[];

    private _fields: HaloInputFormListField[];
    private _formSubmitted: boolean;
    private _focusGroupIndex: number;

    @ViewChildren(HaloInputComponent) inputs: QueryList<HaloInputComponent>;

    @Input() creatable: boolean;
    @Input() deletable: boolean;
    @Input() selectable: boolean | 'disabled';
    @Input() emptyLabel: string;
    @Input() titleFieldId: string;

    @Input()
    get fields(): HaloInputFormListField[] {

        return this._fields;

    }
    set fields(fields: HaloInputFormListField[]) {

        this._fields = fields;

        if (this.allParamsLoaded) {
            this.buildForm();
        }

    }

    @Input()
    get formSubmitted(): boolean {

        return this._formSubmitted;

    }
    set formSubmitted(formSubmitted: boolean) {

        this._formSubmitted = formSubmitted;

        if (formSubmitted) {
            this.validate();
        }

    }

    @Input()
    get focusGroupIndex(): number {

        return this._focusGroupIndex;

    }
    set focusGroupIndex(focusGroupIndex: number) {

        this._focusGroupIndex = focusGroupIndex;

        if (this.allParamsLoaded) {

            if (focusGroupIndex !== null && focusGroupIndex !== undefined) {

                this.groups = this.groups.map(() => false);

                if (focusGroupIndex > -1) {
                    this.groups[focusGroupIndex] = true;
                }

            } else {

                this.groups = this.groups.map(() => true);

            }

        }

    }

    get selectAllMode(): HaloInputFormListMode {

        let count = 0;

        this.form.controls.forEach((controlGroup: FormGroup) => {

            if (controlGroup.controls.isSelected.value) {
                count++;
            }

        });

        if (count === 0) {
            return HaloInputFormListMode.None;
        }

        if (count === this.groups.length) {
            return HaloInputFormListMode.All;
        }

        return HaloInputFormListMode.Partial;

    }

    get expandAllMode(): HaloInputFormListMode {

        let count = 0;

        this.groups.forEach(g => {

            if (g) {
                count++;
            }

        });

        if (count === 0) {
            return HaloInputFormListMode.None;
        }

        if (count === this.groups.length) {
            return HaloInputFormListMode.All;
        }

        return HaloInputFormListMode.Partial;

    }

    get expandAllIcon(): string {

        if (this.expandAllMode === HaloInputFormListMode.All) {

            return 'icon-form-list-collapse-all';

        }

        return 'icon-form-list-expand-all';

    }

    get selectAllIcon(): string {

        if (this.selectAllMode === HaloInputFormListMode.All) {

            return 'icon-form-list-uncheck-all';

        }

        return 'icon-form-list-check-all';

    }

    get dateFormat(): string {

        return this.haloInputDateFormat || 'DD/MM/YYYY';

    }

    get timezone(): string {

        return this.haloInputTimezone || 'UTC';

    }

    constructor(@Inject('haloInputDateFormat') private haloInputDateFormat: string,
                @Inject('haloInputTimezone') private haloInputTimezone: HaloInputTimezone) {

        super();

    }

    valueInitiated(): void {

        if (!this.fields || !Array.isArray(this.fields)) {
            this.fields = [];
        }

        if (!this.value || !Array.isArray(this.value)) {
            this.value = [];
        }

        this.buildForm();
        this.buildTitles();
        this.fieldsChanged();

    }

    valueChanged(): void {

        if (!this.value || !Array.isArray(this.value)) {
            this.value = [];
        }

        this.validate();

    }

    create(): void {

        if (!this.creatable || this.disabled || this.readonly) {
            return;
        }

        const newValue = {};

        this.form.push(new FormGroup({}));
        this.groups.push(true);

        const newValueIndex = this.form.controls.length - 1;

        this.fields.forEach(field => {

            if (this.groups.length > 1 || !field.hideFromFirstGroup) {

                const validators = this.getValidators(field);

                newValue[field.id] = field.type === HaloInputType.Checkbox ? false : null;

                (this.form.controls[newValueIndex] as FormGroup).addControl(
                    field.id,
                    new FormControl(newValue[field.id], validators)
                );

                if (field.onChange) {
                    field.onChange(newValue[field.id], field.id, newValueIndex, this.form, this.value);
                }

                field.typePerGroup?.push(HaloInputType.Text);

            }

        });

        this.changeValue(this.form.getRawValue());

    }

    delete(index: number): void {

        if (!this.deletable || this.disabled || this.readonly) {
            return;
        }

        this.form.removeAt(index);

        this.groups.splice(index, 1);

        this.fields.forEach(field => field.typePerGroup?.splice(index, 1));

        this.changeValue(this.form.getRawValue());

    }

    update(field: HaloInputFormListField, index: number): void {

        if (field.onChange) {
            field.onChange(this.form.getRawValue()[index][field.id], field.id, index, this.form, this.form.getRawValue());
        }

        this.changeValue(this.form.getRawValue());

        this.buildTitles();

    }

    select(isSelected: boolean, index: number): void {

        this.fields.forEach(field => {

            if (isSelected && !field.disabled && !field.readonly) {

                (this.form.controls[index] as FormGroup).controls[field.id].enable();

            } else {

                (this.form.controls[index] as FormGroup).controls[field.id].disable();

            }

        });

        (this.form.controls[index] as FormGroup).controls.isSelected.setValue(isSelected);

        this.changeValue(this.form.getRawValue());

    }

    optionsEndpointLoaded(options: HaloInputOption[], field: HaloInputFormListField, index: number): void {

        if (field.id === this.titleFieldId) {

            field.options = options;

            const option = options.find(o => o.value === this.form.getRawValue()[index][field.id]);

            this.titles[index] = option && option.label;

        }

    }

    toggleSelectAll(): void {

        if (this.selectable === 'disabled') {

            return;

        }

        if (this.selectAllMode === HaloInputFormListMode.All) {

            this.form.getRawValue().forEach((v: object, i: number) => this.select(false, i));

        } else {

            this.form.getRawValue().forEach((v: object, i: number) => this.select(true, i));

        }

    }

    toggleExpandAll(): void {

        if (this.expandAllMode === HaloInputFormListMode.All) {

            this.groups = this.groups.map(g => false);

        } else {

            this.groups = this.groups.map(g => true);

        }

    }

    getFieldType(field: HaloInputFormListField, index: number): HaloInputType {

        return field.typePerGroup?.[index] || field.type;

    }

    focus(): void {}

    viewInitiated(): void {}

    valueBlured(): void {}

    private buildForm(): void {

        this.form = new FormArray([]);

        this.groups = [];

        if (this.fields.length > 0) {

            this.value.forEach(valueItem => {

                this.groups.push(!this.focusGroupIndex);

                this.form.push(new FormGroup({}));

                if (this.selectable) {

                    (this.form.controls[this.form.controls.length - 1] as FormGroup).addControl(
                        'isSelected',
                        new FormControl({value: valueItem['isSelected'] || false, disabled: this.selectable === 'disabled'})
                    );

                }

                this.fields.forEach(field => {

                    if (this.groups.length > 1 || !field.hideFromFirstGroup) {

                        let value = valueItem[field.id] || null;
                        const notSelected = this.selectable && !valueItem['isSelected'];
                        const disabled = this.disabled || field.disabled || notSelected;
                        const validators = this.getValidators(field);

                        if (!value && field.type === HaloInputType.Checkbox) {
                            value = false;
                        }

                        (this.form.controls[this.form.controls.length - 1] as FormGroup).addControl(
                            field.id,
                            new FormControl({value, disabled}, validators)
                        );

                    }

                });

            });

            if (this.focusGroupIndex !== null && this.focusGroupIndex !== undefined && this.focusGroupIndex > -1) {
                this.groups[this.focusGroupIndex] = true;
            }

            setTimeout(() => {

                this.inputs.forEach(input => {

                    const idString = input.id.replace('form-list-', '');
                    const fieldIndex = +idString.substring(0, idString.indexOf('-'));
                    const fieldId = input.id.replace('form-list-' + fieldIndex + '-', '');
                    const value = this.value[fieldIndex][fieldId];

                    input.innerComponent.initValue(value);

                });

            }, 0);

        }

    }

    private getValidators(field: HaloInputFormListField): ValidatorFn[] {

        if (field.disabled || field.readonly) {
            return [];
        }


        const validators = [];

        if (field.required) {

            validators.push(Validators.required);

        }

        if (field.pattern) {

            validators.push(Validators.pattern(field.pattern));

        }

        if (field.type === HaloInputType.Number) {

            if (field.min !== undefined && field.min !== null) {
                validators.push(Validators.min(field.min));
            }

            if (field.max !== undefined && field.max !== null) {
                validators.push(Validators.max(field.max));
            }

        }

        return validators;

    }

    private buildTitles(): void {

        this.titles = [];

        const titleField = this.fields.find(f => f.id === this.titleFieldId);

        this.form.controls.forEach((control, index) => {

            if (!titleField) {

                this.titles[index] = null;

            } else if (titleField.type === HaloInputType.Date) {

                this.titles[index] = moment(this.value[index][titleField.id]).tz(this.timezone).format(this.dateFormat);

            } else if (titleField.type === HaloInputType.Select && titleField.options) {

                setTimeout(() => {

                    const option = titleField.options.find(o => o === this.value[index][titleField.id] || o.value === this.value[index][titleField.id]);

                    this.titles[index] = option?.label || option;

                }, 200);

            } else {

                this.titles[index] = this.value[index][titleField.id];

            }

        });

    }

    private fieldsChanged(): void {

        this.form.controls.forEach((control, index) => {

            this.fields.forEach(field => {

                if (field.onChange) {
                    field.onChange(this.form.getRawValue()[index][field.id], field.id, index, this.form, this.form.getRawValue());
                }

            });

        });

    }

    private validate(): void {

        const errors = [];

        this.form.controls.forEach((controlGroup: FormGroup) => {

            Object.keys(controlGroup.controls).forEach(controlKey => {

                if (controlGroup.controls[controlKey].errors) {

                    errors.push(controlGroup.controls[controlKey].errors);

                }

            });

        });

        if (this.hostControl) {

            if (errors.length > 0) {

                if (this.hostControl.errors) {

                    Object.assign(this.hostControl.errors, {list: errors});

                } else {

                    this.hostControl.setErrors({list: errors});

                }

            } else if (this.hostControl.errors) {

                delete this.hostControl.errors.list;

            }

        }

    }

}
