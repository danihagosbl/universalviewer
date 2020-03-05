import "@google/model-viewer";
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { sanitize } from "../../Utils";
import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class ModelViewerCenterPanel extends CenterPanel {

    $modelViewer: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('modelViewerCenterPanel');

        super.create();

        const that = this;

        this.component.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (resources: IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.title = this.extension.helper.getLabel();

        this.component.publish(BaseEvents.OPENED_MEDIA);
    }

    async openMedia(resources: IExternalResource[]) {

        await this.extension.getExternalResources(resources);

        this.$content.empty();

        let mediaUri: string | null = null;
        let canvas: Canvas = this.extension.helper.getCurrentCanvas();
        const formats: AnnotationBody[] | null = this.extension.getMediaFormats(canvas);

        if (formats && formats.length) {
            mediaUri = formats[0].id;
        } else {
            mediaUri = canvas.id;
        }

        this.$modelViewer = $('<model-viewer src="' + mediaUri + '" auto-rotate camera-controls></model-viewer>');
        this.$content.append(this.$modelViewer);

        this.component.publish(BaseEvents.OPENED_MEDIA);
    }

    resize() {
        super.resize();

        if (this.title) {
            this.$title.text(sanitize(this.title));
        }
        
        if (this.$modelViewer) {
            this.$modelViewer.width(this.$content.width());
            this.$modelViewer.height(this.$content.height());
        }
        
    }
}
