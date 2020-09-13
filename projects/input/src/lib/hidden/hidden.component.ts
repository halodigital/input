import { Component } from '@angular/core';
import { HaloInputParentComponent } from '../_general/parent.component';


@Component({
    selector: 'halo-input-hidden',
    templateUrl: './hidden.component.html'
})

export class HaloInputHiddenComponent extends HaloInputParentComponent<any> {

    focus(): void {}

    viewInitiated(): void {}

    valueInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
