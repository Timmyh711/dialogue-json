// Entry types: dialogue, pause, signal
const entries = [];

// DOM elements
const entryTypeSelect = document.getElementById('entry-type');
const dialogueFields = document.getElementById('dialogue-fields');
const pauseFields = document.getElementById('pause-fields');
const signalFields = document.getElementById('signal-fields');
const addEntryBtn = document.getElementById('add-entry-btn');
const entriesContainer = document.getElementById('entries-container');
const emptyMessage = document.getElementById('empty-message');
const entryCount = document.getElementById('entry-count');
const jsonPreview = document.getElementById('json-preview');
const filenameInput = document.getElementById('filename');
const downloadBtn = document.getElementById('download-btn');

// Dialogue fields
const speakerBtns = document.querySelectorAll('.speaker-btn');
const dialogueText = document.getElementById('dialogue-text');
const shakeInput = document.getElementById('shake');
const formatBtns = document.querySelectorAll('.format-btn');

// Pause fields
const pauseDuration = document.getElementById('pause-duration');

// Signal fields
const signalName = document.getElementById('signal-name');

const isNormalCheckbox = document.getElementById('is-normal');
const isAnnouncementCheckbox = document.getElementById('is-announcement');
const speakerField = document.querySelector('.speaker-field');

// Show/hide fields based on entry type
function showFieldsForType(type) {
  dialogueFields.classList.add('hidden');
  pauseFields.classList.add('hidden');
  signalFields.classList.add('hidden');

  if (type === 'dialogue') {
    dialogueFields.classList.remove('hidden');
    updateSpeakerVisibility();
  } else if (type === 'pause') pauseFields.classList.remove('hidden');
  else if (type === 'signal') signalFields.classList.remove('hidden');
}

function updateSpeakerVisibility() {
  speakerField.classList.toggle('hidden', isAnnouncementCheckbox.checked);
}

function onModeCheckboxChange() {
  if (isAnnouncementCheckbox.checked) {
    isNormalCheckbox.checked = false;
  }
  if (isNormalCheckbox.checked) {
    isAnnouncementCheckbox.checked = false;
  }
  updateSpeakerVisibility();
}

isNormalCheckbox.addEventListener('change', onModeCheckboxChange);
isAnnouncementCheckbox.addEventListener('change', onModeCheckboxChange);

entryTypeSelect.addEventListener('change', () => {
  showFieldsForType(entryTypeSelect.value);
});

// Speaker buttons
const customSpeakerInput = document.getElementById('custom-speaker');
speakerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    speakerBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    customSpeakerInput.classList.toggle('hidden', btn.dataset.speaker !== 'custom');
  });
});

// Format buttons
formatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const textarea = dialogueText;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    const wrap = btn.dataset.wrap;

    if (wrap === 'inv') {
      const name = prompt('Inventory item name:', '');
      if (name != null) insertAtCursor(textarea, `[inv name=${name}]`);
      return;
    }

    if (wrap === 'icon') {
      const name = prompt('Icon name:', '');
      if (name != null) insertAtCursor(textarea, `[icon name=${name}]`);
      return;
    }

    if (wrap === 'purple') {
      wrapSelection(textarea, `[purple]`, `[/purple]`, selected || 'text');
      return;
    }

    if (wrap === 'color=red' || wrap === 'color=orange' || wrap === 'color=purple') {
      wrapSelection(textarea, `[${wrap}]`, `[/color]`, selected || 'text');
      return;
    }

    if (wrap === 'b' || wrap === 'i') {
      wrapSelection(textarea, `[${wrap}]`, `[/${wrap}]`, selected || 'text');
    }
  });
});

function wrapSelection(textarea, open, close, fallback) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end) || fallback;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  textarea.value = before + open + selected + close + after;
  textarea.selectionStart = textarea.selectionEnd = start + open.length + selected.length + close.length;
  textarea.focus();
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(start);
  textarea.value = before + text + after;
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  textarea.focus();
}

// Add entry
addEntryBtn.addEventListener('click', () => {
  const type = entryTypeSelect.value;

  if (type === 'dialogue') {
    const text = dialogueText.value.trim();
    if (!text) {
      alert('Please enter dialogue text.');
      return;
    }
    if (isAnnouncementCheckbox.checked) {
      entries.push({ type: 'dialogue', data: { type: 'announcement', text } });
    } else {
      const activeSpeakerBtn = document.querySelector('.speaker-btn.active');
      const speakerValue = activeSpeakerBtn.dataset.speaker;
      const speaker = speakerValue === 'custom'
        ? customSpeakerInput.value.trim() || 'custom'
        : speakerValue;
      const shake = shakeInput.value ? parseInt(shakeInput.value, 10) : undefined;
      const obj = { speaker, text };
      if (shake) obj.shake = shake;
      entries.push({ type: 'dialogue', data: obj });
    }
    dialogueText.value = '';
    shakeInput.value = '';
  } else if (type === 'pause') {
    const duration = parseInt(pauseDuration.value, 10) || 1;
    entries.push({ type: 'pause', data: { pause: duration } });
  } else if (type === 'signal') {
    const name = signalName.value.trim();
    if (!name) {
      alert('Please enter a signal name.');
      return;
    }
    entries.push({ type: 'signal', data: { signal: name } });
    signalName.value = '';
  }

  renderEntries();
  updatePreview();
});

function buildJson() {
  return entries.map(entry => entry.data);
}

function renderEntries() {
  entriesContainer.innerHTML = '';
  emptyMessage.classList.toggle('hidden', entries.length > 0);
  entryCount.textContent = `(${entries.length})`;

  entries.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'entry-item';

    let typeLabel = '';
    let preview = '';

    if (entry.type === 'dialogue') {
      typeLabel = entry.data.type === 'announcement'
        ? 'Announcement'
        : `Dialogue (${entry.data.speaker})`;
      preview = entry.data.text;
    } else if (entry.type === 'pause') {
      typeLabel = 'Pause';
      preview = `${entry.data.pause}s`;
    } else if (entry.type === 'signal') {
      typeLabel = 'Signal';
      preview = entry.data.signal;
    }

    div.innerHTML = `
      <div class="entry-content">
        <div class="entry-type">${typeLabel}</div>
        <div class="entry-preview">${escapeHtml(preview)}</div>
      </div>
      <button type="button" class="btn btn-remove" data-index="${index}">Remove</button>
    `;

    div.querySelector('.btn-remove').addEventListener('click', () => {
      entries.splice(index, 1);
      renderEntries();
      updatePreview();
    });

    entriesContainer.appendChild(div);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updatePreview() {
  const json = buildJson();
  jsonPreview.textContent = JSON.stringify(json, null, '\t') || '[]';
}

function downloadJson() {
  const json = buildJson();
  const str = JSON.stringify(json, null, '\t');
  let filename = filenameInput.value.trim() || 'dialogue.json';
  if (!filename.endsWith('.json')) filename += '.json';

  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

downloadBtn.addEventListener('click', downloadJson);

// Init
showFieldsForType('dialogue');
updateSpeakerVisibility();
updatePreview();
