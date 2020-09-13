import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { HaloInputOption } from '../input';
import { HaloInputOptionsService } from './options.service';
import { HaloInputParentComponent } from './parent.component';


@Component({
    template: ''
})

export abstract class HaloInputAutoCompleteComponent<T> extends HaloInputParentComponent<T> {

    typingLabel: string;
    typingOptions: HaloInputOption[];

    protected timeout: any;

    private _options: HaloInputOption[];
    private _optionsEndpointParam: string;
    private _initLabels: string[];

    @Input() optionsEndpoint: string;
    @Input() forceValueInOptions: boolean;

    @Input()
    get options(): any[] {

        return this._options || [];

    }
    set options(options: any[]) {

        this._options = HaloInputOptionsService.formatOptions(options);

    }

    @Input()
    get optionsEndpointParam(): string {

        return this._optionsEndpointParam || 'q';

    }
    set optionsEndpointParam(labelParam: string) {

        this._optionsEndpointParam = labelParam;

    }

    @Input()
    get initLabels(): string[] {

        if (Array.isArray(this._initLabels)) {

            return this._initLabels;

        }

        return [];

    }
    set initLabels(initLabels: string[]) {

        this._initLabels = initLabels;

        this.initLabelsLoaded();

    }

    constructor(protected http: HttpClient) {

        super();

    }

    viewInitiated(): void {}

    valueChanged(): void {}

    protected loadOptions(isTyping: boolean, currentLabels: string[] = []): void {

        if (!this.optionsEndpoint && (!this.options || !Array.isArray(this.options))) {

            this.typingOptions = [];

        } else if (this.options && Array.isArray(this.options) && this.options.length > 0) {

            this.typingOptions = this.options.map(o => ({label: o.label, value: o.value})).filter(o => {

                if (currentLabels.includes(o.label)) {
                    return false;
                }

                if (!this.typingLabel) {
                    return true;
                }

                return o.label.toLowerCase().includes(this.typingLabel.toLowerCase());

            });

            if (isTyping) {
                this.checkForMatch();
            }

        } else if (this.optionsEndpoint && isTyping) {

            clearTimeout(this.timeout);

            if (this.subscriptions['autocomplete']) {
                this.subscriptions['autocomplete'].unsubscribe();
            }

            this.timeout = setTimeout(() => {

                const endpoint = this.getEndpoint();

                this.subscriptions['autocomplete'] = this.http.get<any[]>(endpoint).subscribe(

                    (response) => {

                        this.typingOptions = HaloInputOptionsService.formatOptions(response).filter(o => !currentLabels.includes(o.label));

                        this.checkForMatch();

                    },
                    () => {

                        this.typingOptions = [];

                    }

                );

            }, 200);

        }

    }

    protected getEndpoint(): string {

        if (this.typingLabel) {

            const sep = this.optionsEndpoint.includes('?') ? '&' : '?';

            return this.optionsEndpoint + sep + this.optionsEndpointParam + '=' + this.typingLabel;

        }

        return this.optionsEndpoint;

    }

    protected formatInitialLabel(option?: any): string {

        if (this.initLabels.length > 0) {

            return this.initLabels[0];

        }

        if (option && typeof option === 'object' && option['label'] !== undefined) {

            return (option['label'] || '').toString();

        }

        if (option && typeof option === 'object' && option['name'] !== undefined) {

            return (option['name'] || '').toString();

        }

        if (option) {

            return option.toString() || '';

        }

        return '';

    }

    protected formatInitialLabels(): string[] {

        if (!this.value || !Array.isArray(this.value)) {

            return [];

        }

        return this.initLabels.slice(0, this.value.length);

    }

    protected abstract checkForMatch(): void;
    protected abstract initLabelsLoaded(): void;

}
