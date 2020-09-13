import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { HaloTooltipPosition } from '@halodigital/tooltip';
import { HaloInputOptionsComponent } from '../_general/options.component';
import { HaloInputOptionsService } from '../_general/options.service';


@Component({
    selector: 'halo-input-select',
    templateUrl: './select.component.html'
})

export class HaloInputSelectComponent extends HaloInputOptionsComponent implements OnChanges {

    private _tooltipPosition: HaloTooltipPosition;

    @ViewChild(MatSelect, {static: false}) input: MatSelect;

    @Input() multiple: boolean;

    @Input()
    get tooltipPosition(): HaloTooltipPosition {

        return this._tooltipPosition || HaloTooltipPosition.MiddleLeft;

    }

    set tooltipPosition(tooltipPosition: HaloTooltipPosition) {

        this._tooltipPosition = tooltipPosition;

    }

    constructor(optionsService: HaloInputOptionsService) {

        super(optionsService);

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.allParamsLoaded && changes.multiple && changes.multiple.previousValue !== changes.multiple.currentValue) {

            this.changeValue(null);

        }

    }

    selectionChanged(value: any): void {

        if (this.multiple && value.includes(null)) {

            value = null;

        }

        this.changeValue(value);

    }

    focus(): void {

        this.input.focus();

    }

}
