  extend(prototype, {
    build: function () {
      var options = this.options;
      var element = this.element;
      var image = this.image;
      var template;
      var cropper;
      var canvas;
      var dragBox;
      var cropBox;
      var face;

      if (!this.ready) {
        return;
      }

      // Unbuild first when replace
      if (this.built) {
        this.unbuild();
      }

      template = document.createElement('div');
      template.innerHTML = Cropper.TEMPLATE;

      // Create cropper elements
      this.container = element.parentNode;
      this.cropper = cropper = querySelector(template, '.cropper-container');
      this.canvas = canvas = querySelector(cropper, '.cropper-canvas');
      this.dragBox = dragBox = querySelector(cropper, '.cropper-drag-box');
      this.cropBox = cropBox = querySelector(cropper, '.cropper-crop-box');
      this.viewBox = querySelector(cropper, '.cropper-view-box');
      this.face = face = querySelector(cropBox, '.cropper-face');

      appendChild(canvas, image);

      // Hide the original image
      addClass(element, CLASS_HIDDEN);
      insertBefore(element, cropper);

      // Show the image if is hidden
      if (!this.isImg) {
        removeClass(image, CLASS_HIDE);
      }

      this.initPreview();
      this.bind();

      // Format aspect ratio (0 -> NaN)
      options.aspectRatio = num(options.aspectRatio) || NaN;

      if (options.autoCrop) {
        this.cropped = true;

        if (options.modal) {
          addClass(dragBox, CLASS_MODAL);
        }
      } else {
        addClass(cropBox, CLASS_HIDDEN);
      }

      if (!options.guides) {
        addClass(querySelectorAll(cropBox, '.cropper-dashed'), CLASS_HIDDEN);
      }

      if (!options.center) {
        addClass(querySelector(cropBox, '.cropper-center'), CLASS_HIDDEN);
      }

      if (options.background) {
        addClass(cropper, CLASS_BG);
      }

      if (!options.highlight) {
        addClass(face, CLASS_INVISIBLE);
      }

      if (options.cropBoxMovable) {
        addClass(face, CLASS_MOVE);
        setData(face, DATA_ACTION, ACTION_ALL);
      }

      if (!options.cropBoxResizable) {
        addClass(querySelectorAll(cropBox, '.cropper-line'), CLASS_HIDDEN);
        addClass(querySelectorAll(cropBox, '.cropper-point'), CLASS_HIDDEN);
      }

      this.setDragMode(
        options.dragCrop ? ACTION_CROP :
        options.movable ? ACTION_MOVE :
        ACTION_NONE
      );

      this.render();
      this.built = true;
      this.setData(options.data);

      // Call the built asynchronously to keep "image.cropper" is defined
      setTimeout(proxy(function () {
        if (isFunction(options.built)) {
          options.built.call(element);
        }

        if (isFunction(options.crop)) {
          options.crop.call(element, this.getData());
        }

        this.complete = true;
      }, this), 0);
    },

    unbuild: function () {
      if (!this.built) {
        return;
      }

      this.built = false;
      this.initialImageData = null;

      // Clear `initialCanvasData` is necessary when replace
      this.initialCanvasData = null;
      this.initialCropBoxData = null;
      this.containerData = null;
      this.canvasData = null;

      // Clear `cropBoxData` is necessary when replace
      this.cropBoxData = null;
      this.unbind();

      this.resetPreview();
      this.previews = null;

      this.viewBox = null;
      this.cropBox = null;
      this.dragBox = null;
      this.canvas = null;
      this.container = null;

      removeChild(this.cropper);
      this.cropper = null;
    }
  });
