const quill = new Quill(editor, {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image'],
      ['clean']
    ]
  },
  placeholder: 'Type here...',
  theme: 'snow'
});

const textCounter = document.getElementById('text-counter');

quill.on('text-change', (delta, oldDelta, source) => {
  const text = quill.getText();
  const length = text.length;
  textCounter.textContent = `${length} / 3000`;

  if (length > 3000) {
    quill.deleteText(3000, length - 3000);
  }
});