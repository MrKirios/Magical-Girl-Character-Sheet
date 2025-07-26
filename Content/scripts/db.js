const DB = (() => {
  const DB_NAME = "MagicalDB"; // Which translates to "I hope this works"
  const DB_VERSION = 1;
  const TABLES = Object.freeze({
    STATS: "Stats",
    FEATS: "Feats",
    IMAGES: "Imgs",
    ITEMS: "Items",
    SKILLS: "Skills"
  });

  let db = null;

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        db = event.target.result;
        Object.values(TABLES).forEach((table) => {
        if (!db.objectStoreNames.contains(table)) {
            db.createObjectStore(table, { keyPath: "id" });
        }
        });
      };
    });
  }

  function getAllItems(table) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readonly");
      const store = transaction.objectStore(table);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function getItem(id, table) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readonly");
      const store = transaction.objectStore(table);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  function addItem(item, table) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readwrite");
      const store = transaction.objectStore(table);
      const request = store.add(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function updateItem(item, table) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readwrite");
      const store = transaction.objectStore(table);
      const request = store.put(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function deleteItem(id, table) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readwrite");
      const store = transaction.objectStore(table);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function addOrUpdateItem (item, table) {
    var response = await getItem(item.id, table);
    if(response) {
        await updateItem(item, table);
    } else {
        await addItem(item, table);
    }
  }

  async function saveDB(){
    const backup = {};

    for (const table of Object.values(DB.TABLES)) {
      backup[table] = await DB.getAllItems(table);
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    var name = document.getElementById("character-name");
    a.download = name.value + " - Character Sheet.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function loadDB (){
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const text = await file.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("Invalid JSON file.");
        return;
      }

      for (const table of Object.values(DB.TABLES)) {
        const tx = db.transaction(table, "readwrite");
        const store = tx.objectStore(table);
        store.clear();
      }

      for (const [table, items] of Object.entries(data)) {
        if (!DB.TABLES || !Object.values(DB.TABLES).includes(table)) continue;

        for (const item of items) {
          await DB.addItem(item, table);
        }
      }

      alert("Database restored successfully!");
      location.reload();
    };
    input.click();
  }

  return {
    TABLES,
    openDB,
    getAllItems,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    addOrUpdateItem,
    saveDB,
    loadDB
  };
})();