import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HaloDialogModule } from '@halodigital/dialog';
import { HaloLoadingModule } from '@halodigital/loading-animation';
import { HaloTooltipModule } from '@halodigital/tooltip';
import { HaloInputCheckboxListComponent } from './checkbox-list/checkbox-list.component';
import { HaloInputCheckboxComponent } from './checkbox/checkbox.component';
import { HaloInputChipsComponent } from './chips/chips.component';
import { HaloInputDateCalendarComponent } from './date/calendar/calendar.component';
import { HaloInputDateCalendarDirective } from './date/calendar/calendar.directive';
import { HaloInputDateComponent } from './date/date.component';
import { HaloInputFormListComponent } from './form-list/form-list.component';
import { HaloInputHiddenComponent } from './hidden/hidden.component';
import { HaloInputImageComponent } from './image/image.component';
import { ImageUploaderComponent } from './image/uploader/uploader.component';
import { HaloInputTimezone } from './input';
import { HaloInputComponent } from './input.component';
import { HaloInputNumberComponent } from './number/number.component';
import { HaloInputPasswordComponent } from './password/password.component';
import { HaloInputRadioListComponent } from './radio-list/radio-list.component';
import { HaloInputRadioComponent } from './radio/radio.component';
import { HaloInputSelectComponent } from './select/select.component';
import { HaloInputTextComponent } from './text/text.component';
import { HaloInputTextAreaDialogComponent } from './textarea/dialog/dialog.component';
import { HaloInputTextAreaComponent } from './textarea/textarea.component';


@NgModule({
    declarations: [
        HaloInputComponent,
        HaloInputCheckboxComponent,
        HaloInputCheckboxListComponent,
        HaloInputChipsComponent,
        HaloInputDateComponent,
        HaloInputDateCalendarDirective,
        HaloInputDateCalendarComponent,
        HaloInputFormListComponent,
        HaloInputHiddenComponent,
        HaloInputImageComponent,
        ImageUploaderComponent,
        HaloInputNumberComponent,
        HaloInputPasswordComponent,
        HaloInputRadioComponent,
        HaloInputRadioListComponent,
        HaloInputSelectComponent,
        HaloInputTextComponent,
        HaloInputTextAreaComponent,
        HaloInputTextAreaDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatChipsModule,
        MatRadioModule,
        MatIconModule,
        HaloDialogModule,
        HaloLoadingModule,
        HaloTooltipModule
    ],
    exports: [
        HaloInputComponent
    ]
})

export class HaloInputModule {

    static forRoot(dateFormat?: string, timezone?: HaloInputTimezone): ModuleWithProviders<HaloInputModule> {

        return {
            ngModule: HaloInputModule,
            providers: [
                {provide: 'haloInputDateFormat', useValue: dateFormat},
                {provide: 'haloInputTimezone', useValue: timezone}
            ]
        };

    }

}
