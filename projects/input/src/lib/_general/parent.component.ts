import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
    template: ''
})

export abstract class HaloInputParentComponent<T> implements OnInit, AfterViewInit, OnDestroy {

    value: T;

    protected allParamsLoaded: boolean;
    protected subscriptions: {[key: string]: Subscription} = {};

    @Output() changed = new EventEmitter<T>();
    @Output() blured = new EventEmitter<void>();

    @Input() placeholder: string;
    @Input() hint: string;
    @Input() required: boolean;
    @Input() disabled: boolean;
    @Input() readonly: boolean;
    @Input() hostControl: FormControl;

    get uniqueId(): number {

        return Math.round(Math.random() * 100000);

    }

    constructor() {}

    ngOnInit(): void {

        this.value = null;
        this.allParamsLoaded = true;

        this.valueInitiated();

    }

    ngAfterViewInit(): void {

        this.viewInitiated();

    }

    ngOnDestroy(): void {

        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());

    }

    initValue(initialValue: T): void {

        this.value = initialValue;

        if ((initialValue === undefined) ||
            (initialValue === null) ||
            (initialValue.toString() === '') ||
            (typeof initialValue === 'object' && Object.keys(initialValue).length === 0) ||
            (Array.isArray(initialValue) && initialValue.length === 0) ||
            (Array.isArray(initialValue) && initialValue.every(v => v === null || v === undefined))) {

            this.value = null;

        }

        // pass only when value changed and the component already loaded
        if (this.allParamsLoaded) {

            this.valueInitiated();

        }

    }

    changeValue(changedValue: T): void {

        this.value = changedValue;

        if ((changedValue === undefined) ||
            (changedValue === null) ||
            (changedValue.toString() === '') ||
            (typeof changedValue === 'object' && Object.keys(changedValue).length === 0) ||
            (Array.isArray(changedValue) && changedValue.length === 0) ||
            (Array.isArray(changedValue) && changedValue.every(v => v === null || v === undefined))) {

            this.value = null;

        }

        this.changed.emit(this.value);

        this.valueChanged();

    }

    blurValue(isOptionsOpened: boolean = false): void {

        if (!isOptionsOpened) {

            this.blured.emit();

            this.valueBlured();

        }

    }

    abstract focus(): void;

    protected abstract viewInitiated(): void;
    protected abstract valueInitiated(): void;
    protected abstract valueChanged(): void;
    protected abstract valueBlured(): void;

}
