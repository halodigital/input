import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HaloInputOption } from '../input';
import { HaloInputOptionsService } from './options.service';
import { HaloInputParentComponent } from './parent.component';


@Component({
    template: ''
})

export abstract class HaloInputOptionsComponent extends HaloInputParentComponent<any | any[]> {

    isOptionsLoading: boolean;

    private endpointOptions: HaloInputOption[];
    private preDefinedOptions: HaloInputOption[];

    private _options: any[];
    private _optionsEndpoint: string;

    @Output() optionsEndpointLoaded: EventEmitter<HaloInputOption[]> = new EventEmitter<HaloInputOption[]>();

    @Input() optionsCaching: boolean;
    @Input() optionsExcludeValues: any[];
    @Input() emptyLabel: string;

    @Input()
    set options(options: any[]) {

        this._options = options;

        this.setPreDefinedOptions(options);

    }

    @Input()
    set optionsEndpoint(endpoint: string) {

        this._optionsEndpoint = endpoint;

        this.setEndpointOptions(endpoint);

    }

    get UIOptions(): HaloInputOption[] {

        return this.preDefinedOptions.concat(this.endpointOptions).filter(o => !this.optionsExcludeValues?.includes(o.value));

    }

    constructor(private optionsService: HaloInputOptionsService) {

        super();

        this.isOptionsLoading = false;
        this.preDefinedOptions = [];
        this.endpointOptions = [];

    }

    viewInitiated(): void {

        this.setPreDefinedOptions(this._options);
        this.setEndpointOptions(this._optionsEndpoint);

    }

    private setPreDefinedOptions(options: any[]): void {

        if (Array.isArray(options)) {

            this.preDefinedOptions = options.map(o => HaloInputOptionsService.formatOption(o));

        } else {

            this.preDefinedOptions = [];

        }

    }

    private setEndpointOptions(endpoint: string): void {

        if (endpoint) {

            if (this.optionsCaching === undefined || this.optionsCaching === null) {
                this.optionsCaching = true;
            }

            this.isOptionsLoading = true;

            this.endpointOptions = this.optionsService.getEndpointOptions(endpoint, this.optionsCaching);

            this.subscriptions.options = this.optionsService.endpointOptionsChanges.subscribe(([loadedEndpoint, options]) => {

                if (endpoint === loadedEndpoint) {

                    this.optionsEndpointLoaded.emit(options);

                    this.endpointOptions.forEach(eo => {

                        const i = this.preDefinedOptions.findIndex(po => po.value === eo.value);

                        if (i > -1) {
                            this.preDefinedOptions.splice(i, 1);
                        }

                    });

                    this.isOptionsLoading = false;

                }

            });

            if (this.endpointOptions.length > 0) {

                this.isOptionsLoading = false;

            }

        } else {

            this.endpointOptions = [];

        }

    }

    valueInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
