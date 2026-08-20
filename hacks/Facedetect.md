---
layout: default
title: Face Detection
permalink: /hacks/facedetect/
---
<div>Teachable Machine Image Model</div>
<button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
<script type="text/javascript">
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "/portfolio/assets/tm-model/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            const wrapper = document.createElement("div");
            wrapper.style.cssText = "margin: 6px 0; font-size: 14px;";
            const label = document.createElement("span");
            const bar = document.createElement("div");
            bar.style.cssText = "height: 18px; width: 0%; border-radius: 4px; transition: width 0.1s;";
            wrapper.appendChild(label);
            wrapper.appendChild(bar);
            labelContainer.appendChild(wrapper);
        }
    }

    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const prob = prediction[i].probability;
            const name = prediction[i].className;
            const wrapper = labelContainer.childNodes[i];
            wrapper.childNodes[0].textContent = name + ": " + prob.toFixed(2) + " ";
            const bar = wrapper.childNodes[1];
            bar.style.width = (prob * 100).toFixed(1) + "%";
            bar.style.backgroundColor = name.toLowerCase() === "green" ? "#22c55e" : "#ef4444";
        }
    }
</script>
