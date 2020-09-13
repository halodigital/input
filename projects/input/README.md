# Input by Halo-Digital

This package contains an input field element with the following features:

- Auto complete

- Checkbox

- Checkboxes list

- Chips

- Date

- Date range

- Sub-forms list

- Hidden

- Image uploader

- Number

- Number range

- Password

- Radio button

- radio buttons list

- Select

- Multi select

- Text

- Textarea

* Based on Angular Material components

* All the fields that gets an options list as parameter (i.e: autocomplete, select etc.), supports getting the options from API endpoint

Enjoy!


## Attributes of All Input Types

##### type
<sub>Declare the field input type</sub>  
<sub>**Type:** 'checkbox' | 'checkboxList' | 'chips' | 'date' | 'list' | 'hidden' | 'image' | 'number' | 'password' | 'radio' | 'radioList' | 'select' | 'text' | 'textarea'</sub>  
<sub>**Default:** 'text'</sub>
<br />

##### placeholder
<sub>The field placeholder</sub>  
<sub>**Type:** string</sub>
<sub>**Default:** null</sub>
<br />

##### hint
<sub>An help text that appear below the field</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### disabled
<sub>Declare if the field is disabled</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### readonly
<sub>Declare if the field is read only</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### required
<sub>Declare if the field is required (for template driven forms)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### hostControl
<sub>A reference to the FormControl that the field represent (inside the FormGroup or FormArray)</sub>  
<sub>**Type:** FormControl</sub>  
<sub>**Default:** null</sub>
<br />

##### formSubmitted
<sub>Declare if the form that contains the field was submitted (to display an error message etc.)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### errorMessages
<sub>Custom messages for various error states</sub>  
<sub>**Type:** {
    required?: string;
    min?: string;
    max?: string;
    minlength?: string;
    maxlength?: string;
    pattern?: string;
}</sub>  
<sub>**Default:** <i>Each error state has a default message if nothing declared</i></sub>
<br />

##### noValidate
<sub>Set the field to not display any error message</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />


## Attributes of 'checkboxList' Input Type

##### options
<sub>Declare the options</sub>  
<sub>**Type:** string[] | {label: string; value: any}[]</sub>  
<sub>**Default:** []</sub>
<br />

##### optionsEndpoint
<sub>Declare the API endpoint for fetching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### optionsCaching
<sub>Declare if caching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** true</sub>
<br />

##### optionsExcludeValues
<sub>Declare a options that should not appear (in case of fetching the options from an API)</sub>  
<sub>**Type:** any[] (array of options value)</sub>  
<sub>**Default:** []</sub>
<br />

##### readonlyOptions
<sub>Declare which of the checkboxes is read only</sub>  
<sub>**Type:** any[] (array of options value)</sub>  
<sub>**Default:** []</sub>
<br />

##### direction
<sub>Declare the iteration direction</sub>  
<sub>**Type:** 'horizontal' | 'vertical'</sub>  
<sub>**Default:** 'vertical'</sub>
<br />

##### emptyLabel
<sub>Declare a text that appear when there are no checkboxes</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'chips' Input Type

##### options
<sub>Declare the options (for 'autocomplete' mode)</sub>  
<sub>**Type:** string[] | {label: string; value: any}[]</sub>  
<sub>**Default:** []</sub>
<br />

##### optionsEndpoint
<sub>Declare the API endpoint for fetching the options (for 'autocomplete' mode, in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### optionsEndpointParam
<sub>Declare the API endpoint param for fetching the options (for 'autocomplete' mode, in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### forceValueInOptions
<sub>Declare if the value must appear in the options list (for 'autocomplete' mode)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### initLabels
<sub>The initial chips (for 'autocomplete' mode)</sub>  
<sub>**Type:** string[]</sub>  
<sub>**Default:** []</sub>
<br />


## Attributes of 'date' Input Type

##### range
<sub>Declare if the input will contain a range of dates or a single date</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />


## Attributes of 'formList' Input Type

##### fields
<sub>Declare if sub-forms can be added to the list</sub>  
<sub>**Type:** HaloInputFormListField[] <i>(Declared below)</i></sub>  
<br />

##### creatable
<sub>Declare if sub-forms can be added to the list</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### deletable
<sub>Declare if sub-forms can be removed from the list</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### selectable
<sub>Declare if to display a checkbox in each sub-form.
If 'disabled' the checkbox will apear but won't be checkable.
If true, every object in the value will contain 'isSelected': boolean.</sub>  
<sub>**Type:** boolean | 'disabled'</sub>  
<sub>**Default:** false</sub>
<br />

##### titleFieldId
<sub>Declare which field's value will be used as the sub-form title</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### focusGroupIndex
<sub>Declare which sub-form to be focus on</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### emptyLabel
<sub>Declare a text that appear when there are no sub-forms</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'image' Input Type

##### uploadEndpoint
<sub>Declare the API endpoint for uploading the image</sub>  
<sub>**Type:** string</sub>  
<br />


## Attributes of 'number' Input Type

##### range
<sub>Declare if the input will contain a range of numbers or a single number</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### min
<sub>Declare minimum number that the field can contain</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### max
<sub>Declare maximum number that the field can contain</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### step
<sub>Declare the interval between legal numbers</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'password' Input Type

##### pattern
<sub>Declare a regular expression that the field's value is checked against</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### minlength
<sub>Declare the minimum number of characters required in the field</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### maxlength
<sub>Declare the maximum number of characters required in the field</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'radio' Input Type

##### outputValue
<sub>Declare for which value the field will return true</sub>  
<sub>**Type:** any</sub>  
<sub>**Default:** null</sub>
<br />

##### groupName
<sub>Declare the group of the radio buttons that the field associated with</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'radioList' Input Type

##### options
<sub>Declare the options</sub>  
<sub>**Type:** string[] | {label: string; value: any}[]</sub>  
<sub>**Default:** []</sub>
<br />

##### optionsEndpoint
<sub>Declare the API endpoint for fetching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### optionsCaching
<sub>Declare if caching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** true</sub>
<br />

##### optionsExcludeValues
<sub>Declare a options that should not appear (in case of fetching the options from an API)</sub>  
<sub>**Type:** any[] (array of options value)</sub>  
<sub>**Default:** []</sub>
<br />

##### direction
<sub>Declare the iteration direction</sub>  
<sub>**Type:** 'horizontal' | 'vertical'</sub>  
<sub>**Default:** 'vertical'</sub>
<br />

##### emptyLabel
<sub>Declare a text that appear when there are no radio buttons</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of 'select' Input Type

##### options
<sub>Declare the options</sub>  
<sub>**Type:** string[] | {label: string; value: any}[]</sub>  
<sub>**Default:** []</sub>
<br />

##### optionsEndpoint
<sub>Declare the API endpoint for fetching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### optionsCaching
<sub>Declare if caching the options (in case of fetching the options from an API)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** true</sub>
<br />

##### optionsExcludeValues
<sub>Declare a options that should not appear (in case of fetching the options from an API)</sub>  
<sub>**Type:** any[] (array of options value)</sub>  
<sub>**Default:** []</sub>
<br />

##### multiple
<sub>Declare if the field is a multi select field</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### tooltipPosition
<sub>Declare if to display a tooltip when the options are too long (and where to place it)</sub>  
<sub>**Type:** 'bottom-center' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right' | 'top-center' | 'top-left' | 'top-right'</sub>  
<sub>**Default:** 'middle-left'</sub>
<br />


## Attributes of 'text' Input Type

##### pattern
<sub>Declare a regular expression that the field's value is checked against</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### minlength
<sub>Declare the minimum number of characters required in the field</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### maxlength
<sub>Declare the maximum number of characters required in the field</sub>  
<sub>**Type:** number</sub>  
<sub>**Default:** null</sub>
<br />

##### options
<sub>Declare the options (for 'autocomplete' mode)</sub>  
<sub>**Type:** string[] | {label: string; value: any}[]</sub>  
<sub>**Default:** []</sub>
<br />

##### optionsEndpoint
<sub>Declare the API endpoint for fetching the options (for 'autocomplete' mode, in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### optionsEndpointParam
<sub>Declare the API endpoint param for fetching the options (for 'autocomplete' mode, in case of fetching the options from an API)</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### forceValueInOptions
<sub>Declare if the value must appear in the options list (for 'autocomplete' mode)</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />


## Attributes of 'textarea' Input Type

##### disableExpand
<sub>Declare if disable the option to open the textarea as a dialog</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />


## Events of all Input Types

##### valueBlured
<sub>Triggers on field lost focus</sub>  
<sub>**Event Parameter Type:** any</sub>
<br />

##### valueChanged
<sub>Triggers on field's value change</sub>  
<sub>**Event Parameter Type:** void</sub>
<br />


## Event of 'checkboxList', 'radioList' and 'select' Input Types

##### optionsEndpointLoaded
<sub>Triggers when options were fetched from an API endpoint</sub>  
<sub>**Event Parameter Type:** {label: string; value: any;}[]</sub>
<br />


## Few More Things

##### HaloInputModule forRoot Parameters
<sub>DATE_FORMAT</sub>  
<sub>String that represent the date format. i.e: 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss' etc.</sub>
<br />

<sub>DATE_TIMEZONE</sub>  
<sub>String that represent the timezone. i.e: 'UTC', 'Europe/Athens', 'US/Hawaii' etc.</sub>
<br />


##### HaloInputFormListField Declaration
```
{
    id: string;
    type: 'checkbox' | 'checkboxList' | 'chips' | 'date' | 'list' | 'hidden' | 'image' | 'number' | 'password' | 'radio' | 'radioList' | 'select' | 'text' | 'textarea';
    noValidate?: boolean;
    placeholder?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    range?: boolean;
    multiple?: boolean;
    direction?: 'horizontal' | 'vertical';
    initLabels?: string[][];
    options?: any[];
    optionsEndpoint?: string;
    optionsEndpointParam?: string;
    optionsCaching?: boolean;
    optionsExcludeValues?: any[];
    optionsPerGroup?: any[][];
    forceValueInOptions?: boolean;
    uploadEndpoint?: string;
    min?: number;
    max?: number;
    pattern?: string;
    groupName?: string;
    tooltipPosition?: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right' | 'top-center' | 'top-left' | 'top-right';
    hideFromFirstGroup?: boolean;
    typePerGroup?: ('checkbox' | 'checkboxList' | 'chips' | 'date' | 'list' | 'hidden' | 'image' | 'number' | 'password' | 'radio' | 'radioList' | 'select' | 'text' | 'textarea')[];
    onChange?: (fieldValue: any, fieldId: string, fieldIndex: number, form: FormArray, entireListValue: object[]) => void;
}
```


## Examples

```
<halo-input type="checkbox" formControlName="status_is_active" (valueChanged)="checkboxChanged($event)">
    <div checkboxContent>
        <div class="caption">Is Active</div>
        <div class="help-text">(some help text)</div>
    </div>
</halo-input>

<!------------->

<halo-input type="radio" formControlName="status_is_active" groupName="group" outputValue="yes" (valueChanged)="checkboxChanged($event)">
    <div radioContent>
        <div class="caption">Is Active</div>
        <div class="help-text">(some help text)</div>
    </div>
</halo-input>

<halo-input type="radio" formControlName="status_is_not_active" groupName="group" outputValue="no" (valueChanged)="checkboxChanged($event)">
    <div radioContent>
        <div class="caption">Is Not Active</div>
        <div class="help-text">(some help text)</div>
    </div>
</halo-input>

<!------------->

<halo-input
    formControlName="selectControl"
    type="select"
    placeholder="Select an option..."
    [hostControl]="form.controls.selectControl"
    [formSubmitted]="isFormSubmitted"
    optionsEndpoint="http://url.com/endpoint/options">
</halo-input>

<!------------->

<halo-input
    [(ngModel)]="searchPhrase"
    placeholder="Search..."
    (valueChanged)="searchPhraseChanged()">
</halo-input>
```
