const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let currentPickerMode = 'date'; 

function populateWheel(columnElement, start, end, formatFunc) {
    columnElement.innerHTML = '';
    for(let i = start; i <= end; i++) {
        const item = document.createElement('div');
        item.className = 'roller-item';
        item.innerText = formatFunc ? formatFunc(i) : i;
        columnElement.appendChild(item);
    }
}

function handleColumnScroll(col) {
    const index = Math.round(col.scrollTop / 40);
    const items = col.querySelectorAll('.roller-item');
    items.forEach((item, idx) => {
        if(idx === index) item.classList.add('selected');
        else item.classList.remove('selected');
    });
}

function scrollToValue(columnElement, value) {
    const items = columnElement.querySelectorAll('.roller-item');
    let targetIndex = 0;
    items.forEach((item, idx) => {
        if(item.innerText === String(value)) targetIndex = idx;
    });
    setTimeout(() => { columnElement.scrollTop = targetIndex * 40; }, 10);
}

function openWheelPicker(mode) {
    currentPickerMode = mode;
    const leftCol = document.getElementById('colLeft');
    const middleCol = document.getElementById('colMiddle');
    const rightCol = document.getElementById('colRight');
    
    document.getElementById('sheetOverlay').style.display = 'block';
    document.getElementById('wheelBottomSheet').classList.add('open');

    if (mode === 'date') {
        document.getElementById('sheetTitleDisplay').innerText = "Job Commence Date";
        rightCol.style.display = 'block'; 

        populateWheel(leftCol, 1, 31, i => String(i).padStart(2, '0'));
        populateWheel(middleCol, 0, 11, i => months[i]);
        populateWheel(rightCol, 2025, 2030);

        const currentDisplay = document.getElementById('dateValueDisplay').innerText.split(' ');
        scrollToValue(leftCol, currentDisplay[0] || '10');
        scrollToValue(middleCol, currentDisplay[1] || 'Jul');
        scrollToValue(rightCol, currentDisplay[2] || '2026');
    } else {
        document.getElementById('sheetTitleDisplay').innerText = "Pickup Time";
        rightCol.style.display = 'none'; 

        populateWheel(leftCol, 0, 23, i => String(i).padStart(2, '0'));
        populateWheel(middleCol, 0, 59, i => String(i).padStart(2, '0'));

        const timeDisplay = document.getElementById('timeValueDisplay');
        if(!timeDisplay.classList.contains('picker-placeholder')) {
            const parts = timeDisplay.innerText.split(':');
            scrollToValue(leftCol, parts[0]);
            scrollToValue(middleCol, parts[1]);
        } else {
            scrollToValue(leftCol, '08');
            scrollToValue(middleCol, '30');
        }
    }
}

function closeWheelPicker() {
    document.getElementById('sheetOverlay').style.display = 'none';
    document.getElementById('wheelBottomSheet').classList.remove('open');
}

function confirmWheelSelection() {
    const leftVal = document.querySelector('#colLeft .roller-item.selected')?.innerText || "00";
    const middleVal = document.querySelector('#colMiddle .roller-item.selected')?.innerText || "00";
    
    if (currentPickerMode === 'date') {
        const rightVal = document.querySelector('#colRight .roller-item.selected')?.innerText || "2026";
        document.getElementById('dateValueDisplay').innerText = `${leftVal} ${middleVal} ${rightVal}`;
    } else {
        const displayField = document.getElementById('timeValueDisplay');
        displayField.innerText = `${leftVal}:${middleVal}`;
        displayField.classList.remove('picker-placeholder');
    }
    closeWheelPicker();
}

function toggleExtraJobPanel(toggleInput) {
    const panel = document.getElementById('extraJobPanel');
    panel.style.display = toggleInput.checked ? 'block' : 'none';
    if(!toggleInput.checked) {
        document.getElementById('extraEarnings').value = '';
        document.getElementById('claimJG').value = '';
        document.getElementById('extraNote').value = '';
    }
}
