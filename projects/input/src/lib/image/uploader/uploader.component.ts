import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'input-image-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})

export class ImageUploaderComponent implements OnInit, OnDestroy {

    // come from image.component
    hint: string;
    imagePath: string;
    emptyImagePath: string;
    uploadEndpoint: string;
    uploaderCallback: (state: 'approved' | 'deleted' | 'canceled', approvedImagePath?: string) => void;
    close: () => void;
    ////////////////////////

    initialImagePath: string;
    error: string;
    loading: boolean;

    private subUpload: Subscription;

    @ViewChild('image', {static: true}) image: ElementRef;
    @ViewChild('inputFile', {static: true}) inputFile: ElementRef;

    get isPreventDelete(): boolean {

        return !this.initialImagePath;

    }

    get isPreventOK(): boolean {

        return !this.imagePath || this.initialImagePath === this.imagePath;

    }

    constructor(private http: HttpClient) {}

    ngOnInit(): void {

        this.initialImagePath = this.imagePath;

        this.setImage(this.imagePath);

    }

    ngOnDestroy(): void {

        if (this.subUpload) {
            this.subUpload.unsubscribe();
        }

    }

    browse(): void {

        this.inputFile.nativeElement.click();

    }

    delete(): void {

        this.uploaderCallback('deleted');
        this.close();

    }

    confirm(): void {

        this.uploaderCallback('approved', this.imagePath);
        this.close();

    }

    cancel(): void {

        this.uploaderCallback('canceled');
        this.close();

    }

    load(event: Event): void {

        const selectedFile = (event.target as HTMLInputElement).files[0];

        if (!selectedFile) { return; }

        if (selectedFile.type.indexOf('image/jpeg') === -1) {

            this.error = 'You can only upload a jpeg file';

        } else if (selectedFile.size > 5000000) {

            this.error = 'You can only upload up to 5MB';

        } else {

            const reader = new FileReader();

            reader.readAsDataURL(selectedFile);

            reader.onload = (readerEvent: object) => {

                this.loading = true;

                const uploadFile = new FormData();

                uploadFile.append('file', selectedFile);

                if (this.uploadEndpoint) {

                    this.subUpload = this.http.post<string>(this.uploadEndpoint, uploadFile).subscribe(

                        (imagePath) => {

                            this.setImage(imagePath);

                        },
                        () => {

                            this.error = 'Upload error';
                            this.loading = false;

                        }

                    );

                } else {

                    this.error = 'Upload error';
                    this.loading = false;

                }

            };

        }

    }

    private setImage(imagePath: string): void {

        if (!imagePath) {

            this.image.nativeElement.style.backgroundImage = 'url(' + this.emptyImagePath + ')';

        } else {

            const imageLoader = new Image();

            this.loading = true;

            imageLoader.src = imagePath;

            imageLoader.onload = () => {

                this.imagePath = imagePath;
                this.image.nativeElement.style.backgroundImage = 'url(' + imagePath + ')';
                this.loading = false;

            };

            imageLoader.onerror = () => {

                this.imagePath = null;
                this.image.nativeElement.style.backgroundImage = 'url(' + this.emptyImagePath + ')';
                this.loading = false;
                this.error = 'Image corrupted';

            };

        }

    }

}
