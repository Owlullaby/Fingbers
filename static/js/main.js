//immediate invoke function expression
(function(){
    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

    navigator.getMedia({
        video:true, audio:false
        },
        function(stream){
            var video = document.getElementById("videoElement");
			video.srcObject=stream;
            video.play();
		},
        function(error){
            console.log(error);
        });
})();

document.addEventListener('DOMContentLoaded', function() {
	const modelParams = {
		flipHorizontal: false,
		imageScalarFactor: 1,
		maxNumBoxes: 1,
		iouThreshold: 0.8,
		scoreThreshold: 0.9,
	}

	handTrack.load(modelParams).then(lmodel => {
		model = lmodel
		console.log("handtrack loaded")
	
		setInterval(function detecthand(){
			var video = document.getElementById("videoElement");
			var canvas = document.getElementById("canvasElement");
			width = 300;
			height = 300;
			context = canvas.getContext("2d");
			canvas.width = width;
			canvas.height = height;
			context.translate(canvas.width, 0);
			context.scale(-1, 1);
			context.drawImage(video, 0, 0, width, height);
			model.detect(canvas).then(predictions => {
				console.log('Predictions: ', predictions);
				document.getElementById("message").innerHTML = "";
				var list = document.getElementById("numbers");
				if(list.hasChildNodes()){
					list.removeChild(list.childNodes[0]);
				};
				var list2 = document.getElementById("dogs");
				if(list2.hasChildNodes()){
					list2.removeChild(list2.childNodes[0]);
				};
				if(predictions.length > 0){
				sendSnapShot();
				};
			});
		}, 1000);
	});

	function sendSnapShot(){
			var canvas = document.getElementById("canvasElement");
			let namespace = "/fingbers";
			let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
			let dataURL = canvas.toDataURL("image/jpeg");
			socket.emit('input image', dataURL);
			console.log('sent');
	
		socket.on('message', function(msg){
			document.getElementById("message").innerHTML = msg;
			// for numbers
			if(document.getElementById("message").textContent == "0"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/zero.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "1"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/one.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "2"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/two.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "3"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/three.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "4"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/four.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "5"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/five.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "6"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/six.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "7"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/seven.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "8"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/eight.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "9"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/nine.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "10"){
				var img = document.createElement("img");
				img.src = "../static/image/numbers/ten.png";
				var insert = document.getElementById("numbers");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}
			// for number of dogs
			if(document.getElementById("message").textContent == "0"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/zero.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "1"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/one.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "2"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/two.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "3"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/three.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "4"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/four.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "5"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/five.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "6"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/six.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "7"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/seven.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};	insert.appendChild(img);
			}else if(document.getElementById("message").textContent == "8"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/eight.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "9"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/nine.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}else if(document.getElementById("message").textContent == "10"){
				var img = document.createElement("img");
				img.src = "../static/image/dogs/ten.png";
				var insert = document.getElementById("dogs");
				if(insert.childNodes.length < 1){
					insert.appendChild(img);};
			}
		});
	};
});