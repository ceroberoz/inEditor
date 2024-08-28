import {
  boldUnicodeMap,
  italicUnicodeMap,
  underlineUnicodeMap,
  strikeThroughMap,
  orderedListUnicodeMap,
} from "./unicodeMaps.js";

// Initialize Quill editor
var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      // ["link", "image"],
      // ["clean"], // add other buttons as needed
    ],
  },
});

// Helper function to replace selected text with bold Unicode
function replaceWithBoldUnicode(text) {
  return text
    .split("")
    .map((char) => boldUnicodeMap[char] || char)
    .join("");
}

// Helper function to replace selected text with italic Unicode
function replaceWithItalicUnicode(text) {
  return text
    .split("")
    .map((char) => italicUnicodeMap[char] || char)
    .join("");
}

// Helper function to replace selected text with underline Unicode
function replaceWithUnderlineUnicode(text) {
  return text
    .split("")
    .map((char) => underlineUnicodeMap[char] || char + "\u0332")
    .join("");
}

// Helper function to replace selected text with strikethrough Unicode
function replaceWithStrikeTextUnicode(text) {
  return text
    .split("")
    .map((char) => strikeThroughMap[char] || char + "\u0335")
    .join("");
}

// Helper function to replace selected text with ordered list Unicode
function replaceWithOrderedListUnicode(text) {
  return text
    .split("")
    .map((char) => orderedListUnicodeMap[char] || char)
    .join("");
}

// Helper function to replace selected text with bullet list Unicode
function replaceWithBulletListUnicode(text) {
  const bulletUnicode = "•";
  return bulletUnicode + " " + text;
}

// Override the bold button behavior
const toolbar = quill.getModule("toolbar");
toolbar.addHandler("bold", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const boldText = replaceWithBoldUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, boldText, "bold");
  }
});

// Override the italic button behavior
toolbar.addHandler("italic", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const italicText = replaceWithItalicUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, italicText, "italic");
  }
});

// Override the underline button behavior
toolbar.addHandler("underline", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const underlineText = replaceWithUnderlineUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, underlineText, "underline");
  }
});

// Override the strikethrough button behavior
toolbar.addHandler("strike", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const strikeText = replaceWithStrikeTextUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, strikeText, "strike");
  }
});

// Override the ordered list button behavior
toolbar.addHandler("list", function (value) {
  if (value === "ordered") {
    const selection = quill.getSelection();
    if (selection) {
      const selectedText = quill.getText(selection.index, selection.length);
      const lines = selectedText.split("\n");
      const orderedListText = lines
        .map((line, index) =>
          replaceWithOrderedListUnicode(`${index + 1}. ${line}`),
        )
        .join("\n");
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, orderedListText);
    }
  } else if (value === "bullet") {
    const selection = quill.getSelection();
    if (selection) {
      const selectedText = quill.getText(selection.index, selection.length);
      const lines = selectedText.split("\n");
      const bulletListText = lines
        .map((line) => replaceWithBulletListUnicode(line))
        .join("\n");
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, bulletListText);
    }
  }
});

// Add text counter
const textCounter = document.getElementById("text-counter");

quill.on("text-change", (delta, oldDelta, source) => {
  const text = quill.getText();
  const length = text.length;

  if (length > 3000 && source === "user") {
    // Check if the change is an insertion
    if (delta.ops[0].insert) {
      // Prevent the insertion
      quill.history.undo();
    }
  }

  // Update the text counter
  if (length > 3000) {
    textCounter.style.color = "red";
    textCounter.textContent = `${length} / 3000 (Maximum reached)`;
  } else {
    textCounter.style.color = "#666";
    textCounter.textContent = `${length} / 3000`;
  }
});

// Function to copy formatted text with line breaks from Quill editor to clipboard
async function copyToClipboard() {
  try {
    const plainText = quill.getText();
    await navigator.clipboard.writeText(plainText);
    alert("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
    alert("Failed to copy text. Please try again.");
  }
}

// Add event listener to the copy button
document.getElementById("copy-button").addEventListener("click", () => {
  copyToClipboard().catch(console.error);
});
