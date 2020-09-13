import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { HaloInputDirection } from '../input';
import { HaloInputOptionsComponent } from '../_general/options.component';
import { HaloInputOptionsService } from '../_general/options.service';


@Component({
    selector: 'halo-input-radio-list',
    templateUrl: './radio-list.component.html',
    styleUrls: ['./radio-list.component.scss']
})

export class HaloInputRadioListComponent extends HaloInputOptionsComponent {

    private _direction: HaloInputDirection;

    @ViewChildren(MatRadioButton) input: QueryList<MatRadioButton>;

    @Input()
    get direction(): HaloInputDirection {

        return this._direction || HaloInputDirection.Vertical;

    }
    set direction(direction: HaloInputDirection) {

        this._direction = direction;

    }

    constructor(optionsService: HaloInputOptionsService) {

        super(optionsService);

    }

    focus(): void {

        this.input.first.focus();

    }

}
