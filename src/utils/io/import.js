/**
 * Shows the native file upload dialog.
 *
 * CAN ONLY BE USED FROM A USER-INITIATED EVENTS HANDLER.
 *
 * @param accept Accepted file types.
 * @param callback Callback to access files.
 * @param context Context to use.
 */
function uploadDeckFile(document, callback) {
  const el = document.createElement("input");

  el.type = "file";
  el.accept = ".ydk";
  el.addEventListener("input", (e) => callback(e.target.files));

  document.body.appendChild(el);
  el.click();
  el.remove();
}

/**
 * Loads deck from a.ydk file.
 *
 * @param deckFile File to load.
 * @return Deck.
 */
async function importDeckFile(file, allCards) {
  const fileContent = await file.text();
  const fileName = file.name;

  const deck = {
    name: fileName.replace(".ydk", ""),
    parts: {
      "#main": [],
      "#extra": [],
      "!side": [],
    },
  };

  const missing = [];

  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let currentDeckPart = null;
  for (const line of lines) {
    const foundDeckPart = ["#main", "#extra", "!side"].find(
      (part) => part === line,
    );
    if (foundDeckPart != null) {
      currentDeckPart = foundDeckPart;
      continue;
    }

    // Only start processing once a deck part indicator was found. This allows for arbitrary file metadata
    // as "head" of the file.
    if (currentDeckPart != null) {
      const id = line.replace(/^0+/, ""); // Some applications pad the start with zeros, remove those.
      const card = allCards.find((c) => c.id == id);
      if (card) {
        deck.parts[currentDeckPart].push(card);
      } else {
        // .ydk files can have card ids from card_images
        const cardByImageId = allCards.find((c) =>
          c.card_images.find((image) => image.id == id),
        );
        if (cardByImageId) {
          deck.parts[currentDeckPart].push(cardByImageId);
        } else {
          missing.push(id);
        }
      }
    }
  }
  return {
    deck,
    missing,
  };
}

export { uploadDeckFile, importDeckFile };
