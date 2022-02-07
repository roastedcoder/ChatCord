


const socket = io(); // bcoz of script tag in custom_info.html
const generateIDBtn = document.getElementById('generateID-btn');
const copyBtn = document.getElementById('copy-btn');
const hoverText = document.getElementById('hover-text');

generateIDBtn.addEventListener('click', () => {
    console.log('hi');
    socket.emit('getNanoID');
    socket.on('generate-id', NANO_ID => {
        copyBtn.innerText = NANO_ID;
        generateIDBtn.disabled = true;
        copyBtn.style.display = 'inline';
    });
});

copyBtn.addEventListener('mouseover', () => {
    hoverText.style.display = 'inline';
});

copyBtn.addEventListener('mouseout', () => {
    hoverText.style.display = 'none';
});