import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HaloInputParentComponent } from '../_general/parent.component';


@Component({
    selector: 'halo-input-password',
    templateUrl: './password.component.html',
    styleUrls: ['../_styles/icons.scss']
})

export class HaloInputPasswordComponent extends HaloInputParentComponent<string> {

    passwordIcon = 'icon-password-show';
    passwordType = 'password';

    @Input() pattern: string;

    @ViewChild('input', {static: false}) input: ElementRef;

    showPassword(): void {

        this.passwordType = 'text';
        this.passwordIcon = 'icon-password-hide';

    }

    hidePassword(): void {

        this.passwordType = 'password';
        this.passwordIcon = 'icon-password-show';

    }

    focus(): void {

        if (this.input) {

            this.input.nativeElement.focus();

        }

    }

    viewInitiated(): void {}

    valueInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

}
