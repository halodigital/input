import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EmbeddedViewRef, Injector, Input, ViewChild } from '@angular/core';
import { HaloInputParentComponent } from '../_general/parent.component';
import { ImageUploaderComponent } from './uploader/uploader.component';


@Component({
    selector: 'halo-input-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})

export class HaloInputImageComponent extends HaloInputParentComponent<string> {

    uploader: ComponentRef<ImageUploaderComponent>;

    @Input() uploadEndpoint: string;

    @ViewChild('input', {static: false}) input: ElementRef;
    @ViewChild('arrow', {static: false}) arrow: ElementRef;
    @ViewChild('box', {static: false}) box: ElementRef;

    get emptyImagePath(): string {

        return this.placeholder || '../../../assets/images/no-image.svg';

    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {

        super();

    }

    valueInitiated(): void {

        if (!this.value) {

            this.setImage();

        } else {

            const imageLoader = new Image();

            imageLoader.src = this.value;

            imageLoader.onload = () => {
                this.setImage();
            };

            imageLoader.onerror = () => {
                this.setImage();
            };

        }

    }

    openUploader(): void {

        if (this.disabled || this.readonly) { return; }

        const factory = this.componentFactoryResolver.resolveComponentFactory(ImageUploaderComponent);
        const ref = factory.create(this.injector);
        const element = (ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        ref.instance.hint = this.hint;
        ref.instance.imagePath = this.value;
        ref.instance.emptyImagePath = this.emptyImagePath;
        ref.instance.uploadEndpoint = this.uploadEndpoint;
        ref.instance.uploaderCallback = this.uploaderCallback.bind(this);
        ref.instance.close = this.closeUploader.bind(this);

        this.appRef.attachView(ref.hostView);

        const box = this.box.nativeElement;
        const arrow = this.arrow.nativeElement;

        box.appendChild(element);

        setTimeout(() => {
            this.setUploaderPosition(box, arrow, this.input.nativeElement, 'auto', 'auto');
            this.uploader = ref;
        }, 100);

    }

    closeUploader(): void {

        this.uploader.destroy();
        this.uploader = null;

    }

    focus(): void {}

    viewInitiated(): void {}

    valueChanged(): void {}

    valueBlured(): void {}

    private setImage(): void {

        this.input.nativeElement.style.backgroundImage = 'url(' + (this.value || this.emptyImagePath) + ')';

    }

    private setUploaderPosition(box: HTMLElement, arrow: HTMLElement, relatedElement: HTMLElement, openHorizontal: 'right' | 'left' | 'auto', openVertical: 'up' | 'down' | 'auto'): void {

        const boxHorizontalSpacing = 15;
        const arrowVerticalSpacing = 40;

        const relatedElementPosition = relatedElement.getBoundingClientRect();
        const boxWidth = box.clientWidth;
        const boxHeight = box.clientHeight;
        const arrowWidth = arrow.clientWidth;

        let boxLeft = relatedElementPosition.left - boxWidth - (arrowWidth / 2) - boxHorizontalSpacing;
        let boxTop = relatedElementPosition.top - arrowVerticalSpacing;
        let arrowLeft = boxLeft + boxWidth - (arrowWidth / 2);
        let arrowTop = boxTop + arrowVerticalSpacing;

        if (openHorizontal === 'right' || (openHorizontal === 'auto' && (boxLeft < 0))) {
            boxLeft = relatedElementPosition.left + relatedElementPosition.width + (arrowWidth / 2) + boxHorizontalSpacing;
            arrowLeft = boxLeft - (arrowWidth / 2);
        }

        if (openVertical === 'up' || (openVertical === 'auto' && (boxTop + boxHeight > document.body.clientHeight))) {
            boxTop = relatedElementPosition.top + relatedElementPosition.height - boxHeight + arrowVerticalSpacing;
            arrowTop = boxTop + boxHeight - arrowVerticalSpacing - 15;
        }

        arrow.style.left = arrowLeft + 'px';
        arrow.style.top = arrowTop + 'px';

        box.style.left = boxLeft + 'px';
        box.style.top = boxTop + 'px';
        box.style.visibility = 'visible';

    }

    private uploaderCallback(state: 'approved' | 'deleted' | 'canceled', approvedImagePath?: string): void {

        if (state === 'approved') {

            this.value = approvedImagePath;

            this.setImage();
            this.changeValue(this.value);

        } else if (state === 'deleted') {

            this.value = null;

            this.setImage();
            this.changeValue(this.value);

        } else if (state === 'canceled') {

            this.blurValue();

        }

    }

}
