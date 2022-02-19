
function checkSkinType(url, callback) {
	var dataFromUrl = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	var inferModelType = function(context) {
		var hasTransparency = function(ctx, x0, y0, w, h) {
			const imgData = ctx.getImageData(x0, y0, w, h);
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					const offset = (x + y * w) * 4;
					if (imgData.data[offset + 3] !== 0xff) {
						return true;
					}
				}
			}
			return false;
		}

		var isAreaBlack = function(ctx, x0, y0, w, h) {
			const imgData = ctx.getImageData(x0, y0, w, h);
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					const offset = (x + y * w) * 4;
					if (!(
						imgData.data[offset + 0] === 0 &&
						imgData.data[offset + 1] === 0 &&
						imgData.data[offset + 2] === 0 &&
						imgData.data[offset + 3] === 0xff
					)) {
						return false;
					}
				}
			}
			return true;
		}

		var isAreaWhite = function(ctx, x0, y0, w, h) {
			const imgData = ctx.getImageData(x0, y0, w, h);
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					const offset = (x + y * w) * 4;
					if (!(
						imgData.data[offset + 0] === 0xff &&
						imgData.data[offset + 1] === 0xff &&
						imgData.data[offset + 2] === 0xff &&
						imgData.data[offset + 3] === 0xff
					)) {
						return false;
					}
				}
			}
			return true;
		}

		var isSlim =
			(
				hasTransparency(context, 50, 16, 2, 4)  ||
				hasTransparency(context, 54, 20, 2, 12) ||
				hasTransparency(context, 42, 48, 2, 4)  ||
				hasTransparency(context, 46, 52, 2, 12)
			) ||
			(
				isAreaBlack(context, 50, 16, 2, 4)  &&
				isAreaBlack(context, 54, 20, 2, 12) &&
				isAreaBlack(context, 42, 48, 2, 4)  &&
				isAreaBlack(context, 46, 52, 2, 12)
			) ||
			(
				isAreaWhite(context, 50, 16, 2, 4)  &&
				isAreaWhite(context, 54, 20, 2, 12) &&
				isAreaWhite(context, 42, 48, 2, 4)  &&
				isAreaWhite(context, 46, 52, 2, 12)
			);

		return isSlim;
	}


	dataFromUrl(url, function(base64) {
		texture = base64;
		
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');

		var image = new Image();
		image.onload = function() {
			ctx.drawImage(image, 0, 0);
			callback(inferModelType(ctx));
		};
		image.src = texture;
	});
}
