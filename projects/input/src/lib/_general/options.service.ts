import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HaloInputOption } from '../input';


@Injectable({
    providedIn: 'root'
})

export class HaloInputOptionsService {

    endpointOptionsChanges: Subject<[string, HaloInputOption[]]>;

    private options: {[key: string]: HaloInputOption[]};
    private queue: {[key: string]: boolean};

    constructor(private http: HttpClient) {

        this.endpointOptionsChanges = new Subject<[string, HaloInputOption[]]>();
        this.options = {};
        this.queue = {};

    }

    static formatOptions(options: any[]): HaloInputOption[] {

        if (!options || !Array.isArray(options)) {

            return [];

        }

        return options.map(option => this.formatOption(option));

    }

    static formatOption(option: any): HaloInputOption {

        let label: string;
        let value: any;

        if (typeof option === 'object' && option.label !== undefined) {

            label = (option.label || '').toString();
            value = option.value;

        } else if (typeof option === 'object' && option.name !== undefined) {

            label = (option.name || '').toString();
            value = option.id;

        } else {

            label = option && option.toString() || '';
            value = option;

        }

        if (!label) {
            label = '';
        }

        if (!value && value !== 0) {
            value = null;
        }

        return {label, value};

    }

    getEndpointOptions(endpoint: string, optionsCaching: boolean): HaloInputOption[] {

        if (!this.queue[endpoint] && (!this.options[endpoint] || !optionsCaching)) {

            if (!Array.isArray(this.options[endpoint])) {
                this.options[endpoint] = [];
            }

            this.queue[endpoint] = true;

            this.http.get<any>(endpoint).subscribe(apiOptions => {

                this.options[endpoint].splice(0);

                if (apiOptions && Array.isArray(apiOptions)) {

                    apiOptions.forEach(apiOption => {

                        this.options[endpoint].push(HaloInputOptionsService.formatOption(apiOption));

                    });

                }

                delete this.queue[endpoint];

                this.endpointOptionsChanges.next([endpoint, this.options[endpoint]]);

            });

        } else if (!this.queue[endpoint]) {

            this.endpointOptionsChanges.next([endpoint, this.options[endpoint]]);

        }

        return this.options[endpoint];

    }

}
