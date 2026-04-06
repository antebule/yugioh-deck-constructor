/**
 * Creates a .ydk deck file for a deck.
 *
 * @param deck Deck to create a file for.
 * @return Deck file.
 */
function toYdkFile(deck) {
  // string array
  const fileLines = [];

  fileLines.push("#main");
  fileLines.push(...deck.main.map((card) => card.id));
  fileLines.push("");
  fileLines.push("#extra");
  fileLines.push(...deck.side.map((card) => card.id));
  fileLines.push("");
  fileLines.push("!side");
  fileLines.push(...deck.extra.map((card) => card.id));
  fileLines.push("");

  // for (const deckPart of DECK_PART_ARR) {
  //     const deckPartCards = deck.parts[deckPart];
  //     fileLines.push(DefaultDeckPartConfig[deckPart].indicator);
  //     fileLines.push(...deckPartCards.map((card) => card.passcode));
  //     fileLines.push("");
  // }
  const content = fileLines.join("\n");
  const file = new File([content], deck.name, { type: "text/ydk" });

  return file;
}

function downloadFile(file, document) {
  const objectUrl = URL.createObjectURL(file);

  const el = document.createElement("a");
  el.href = objectUrl;
  el.download = file.name;

  document.body.appendChild(el);
  el.click();

  el.remove();
  URL.revokeObjectURL(objectUrl);
}

export { toYdkFile, downloadFile };
