const dropArea = document.getElementById('drop-area');
const downloadBtn = document.getElementById('download-btn');
let modifiedJson = '';
let originalFileName = '';
let animation;

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('hover');
    handleFiles(e.dataTransfer.files);
});

document.getElementById('fileElem').addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const file = files[0];
    if (file && file.type === 'application/json') {
        originalFileName = file.name;
        const reader = new FileReader();
        reader.onload = function(event) {
            const jsonContent = JSON.parse(event.target.result);
            jsonContent.layers = jsonContent.layers.filter(layer => layer.nm !== 'Group Layer 8');
            modifiedJson = JSON.stringify(jsonContent);
            downloadBtn.style.display = 'inline-block';
            startLottieAnimation();
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
}

downloadBtn.addEventListener('click', () => {
    const blob = new Blob([modifiedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const newFileName = 'clean_' + originalFileName;
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

const container = document.getElementById('lottie-container');


function startLottieAnimation() {
     fetch('json/hand.json')
        .then(response => response.json())
        .then(animationData => {
            animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: animationData
            });
        });
}

window.addEventListener('resize', moveLottieContainer);
