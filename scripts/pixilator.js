var pixilator = function (elem, b_size) {
	
	var element = elem;

	if((element && element.tagName) !== "CANVAS"){
		console.log("Element select is not a Canvas!");
		return;
	}

	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    d_width = w.innerWidth || e.clientWidth || g.clientWidth,
	    d_height = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var ctx = element.getContext("2d");
	
	element.width = d_width;
	element.height = d_height;

	//get start vertex of the new pixel box
	var box_it = function (wBox,hBox){
		var all_boxs = [];

    	for(var height = 0; height < d_height; height += hBox ){
    		for(var width = 0; width < d_width; width += wBox){
	    		all_boxs.push([width, height]);
    		}
    	}

    	return all_boxs;
	}


	var pixilate = function(all_boxs, imgDt, wBox, hBox) {

		var colorR = 0, 
			colorG = 0, 
			colorB = 0, 
			len = all_boxs.length,
			startPix = 0,
			pixl = [],
			pixel = 0,pixNum = (hBox * wBox); 

		for(var index = 0; index < len; index++){ 

			for(var h = all_boxs[index][1]; h < (all_boxs[index][1] + hBox); h++){

				startPix = (all_boxs[index][0] + h * d_width);

	    		for(var w = startPix; w < (startPix + wBox); w++){
	    		   	pixel = w * 4;
	    			colorR += imgDt[pixel];
	    			colorG += imgDt[pixel + 1];
	    			colorB += imgDt[pixel + 2];
	    		}
	    	}

	    	pixl[index] = "rgb("+ Math.floor(colorR / pixNum) +","+ Math.floor(colorG / pixNum) +","+ Math.floor(colorB / pixNum)  +")";
			colorR = 0, colorG = 0, colorB = 0;
		}

		return pixl;
	}

	var redoPixel = function(pixl, all_boxs, numbers, length, index, counter, b_size){
		ctx.fillStyle = pixl[index];
		try { 
			ctx.fillRect(all_boxs[index][0], all_boxs[index][1] , b_size[0], b_size[1]);
		} catch(err) {
			console.log("err "+ index);
		}

		if(++counter < length){
			setTimeout(function() { 
				var number = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]; 
				redoPixel(pixl, all_boxs, numbers, length, number, counter, b_size) }, 0);
		}
	}

	return {
		start: function (imgObj){

			ctx.drawImage(imgObj, 0, 0, d_width, d_height);

			var numbers = [];
			var all_boxs = box_it(b_size[0], b_size[1]);
			var pixel_list = pixilate(all_boxs, ctx.getImageData(0, 0, d_width, d_height).data, b_size[0], b_size[1]);
			
			for (var i = 0; i < pixel_list.length; i++) {
				numbers.push(i);
			};

			setTimeout(function() { 
				var number = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]; 
				redoPixel(pixel_list, all_boxs, numbers, pixel_list.length, number, 0, b_size) }, 0);
		},
		rePixilate: function(){

		}
	}
} 