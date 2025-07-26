let modalItem = "";
let gemCounter = 5;
const fileInput = document.getElementById("fileInput");

//#region Load
window.onload = async () => {
  await DB.openDB();

  //Nombre
  loadSimpleStat("name");

  //Class
  loadSimpleStat("class");

  //Role
  loadImgStat("role");

  //Level
  loadSimpleStat("level");

  //HP
  loadMaxStat("hp");

  //Resources
  loadMaxStat("resource");

  //Inventory
  loadInventory();

  //Outfit
  loadImgStat("outfit");
  
  //Stats
  loadModStat("fue");
  loadModStat("agi");
  loadModStat("int");
  loadModStat("con");
  loadModStat("car");
  loadModStat("esp");
  loadModStat("agu");


  //Stats Defensivas
  loadSimpleStat("resf");
  loadSimpleStat("resm");
  loadSimpleStat("vblo");
  loadSimpleStat("pblo");
  loadSimpleStat("esq");
  loadSimpleStat("par");
  loadSimpleStat("ref");

  //Gema
  loadImgStat("gem");

  //Acciones - Feats
  loadActionsAndFeats();

  //Crones
  loadSimpleStat("cron");
  loadSimpleStat("eras");
  loadSimpleStat("eons");

  //Skills
  loadSkills();

  //Notas
  loadSimpleStat("notes");
};

async function loadSimpleStat(name){
  var response = await DB.getItem(name, DB.TABLES.STATS);
  if(response) {
    const item = document.getElementById("character-" + name);
    item.value = response.text;
  }
}

async function loadMaxStat(name){
  var response = await DB.getItem(name, DB.TABLES.STATS);
  if(response) {
    const current = document.getElementById("character-" + name + "-current");
    const max = document.getElementById("character-" + name + "-max");
    current.value = response.current;
    max.value = response.max;
  }
}

async function loadModStat(name){
  var response = await DB.getItem(name, DB.TABLES.STATS);
  if(response) {
    const mod = document.getElementById("character-" + name + "-mod");
    const die = document.getElementById("character-" + name + "-die");
    mod.value = response.mod;
    die.value = response.die;
  }
}

async function loadImgStat(name){
  var response = await DB.getItem(name, DB.TABLES.STATS);

  if(response) {
    switch (name) {
      case "outfit":
          var img = document.getElementById("Magic-Girl-Photo");
          img.src = response.img;
          img.title = response.title;
        break;
      case "role":
          var img = document.getElementById("role-icon");
          img.src = response.img;
          img.title = response.title;
        break;
      case "gem":
          var img = document.getElementById("Gem");
          img.src = response.img;
          var text = document.getElementById("Gem-Text");
          text.innerHTML = response.title;
          gemCounter = +response.counter;
        break;
      default:
          var img = document.getElementById("character-" + name);
          img.src = response.src;
          img.title = response.title;
        break;
    }
  }
}

async function loadActionsAndFeats () {
  var response = await DB.getAllItems(DB.TABLES.FEATS);
  
  if(response){
    response.forEach(async (item) => {
      var div = document.getElementById(item.id + "-div");
      var label = document.getElementById(item.id + "-label");

      var classes = item.classes.split(" ");
      div.classList.remove(...div.classList);
      div.classList.add(...classes);
      label.textContent = item.text;
    });
  }
}

async function loadSkills() {
  var response = await DB.getAllItems(DB.TABLES.SKILLS);
  
  if(response) {
    response.forEach(async (skill) => {
      var name = document.getElementById(skill.id + "-name");
      name.value = skill.name;
      var cost = document.getElementById(skill.id + "-cost");
      cost.value = skill.cost;
      var desc = document.getElementById(skill.id + "-desc");
      desc.value = skill.desc;
    });
  }
}

async function loadInventory() {
  loadFrameImg("Head");
  loadFrameImg("Shoulder");
  loadFrameImg("Cloak");
  loadFrameImg("Torso");
  loadFrameImg("Legs");
  loadFrameImg("Shoes");
  loadFrameImg("Shadow");
}

async function loadFrameImg(name) {
  var img = await DB.getItem(name, DB.TABLES.IMAGES);
  if (img) {
    var fichaImg = document.getElementById(name + "-slot-img");
    var blobUrl = URL.createObjectURL(img.file);

    fichaImg.src = blobUrl;
  }
}
//#endregion

//#region Carousel Eras
const trackEras = document.querySelector('.carousel-track.carousel-eras');
const slidesEras = document.querySelectorAll('.carousel-item.carousel-eras');
const nextBtnEras = document.querySelector('.carousel-btn.next.carousel-eras');
const prevBtnEras = document.querySelector('.carousel-btn.prev.carousel-eras');
let carouelErasIndex = 0;

function updateCarouselEras() {
  trackEras.style.transform = `translateX(-${carouelErasIndex * 100}%)`;
}

nextBtnEras.addEventListener('click', () => {
  carouelErasIndex = (carouelErasIndex + 1) % slidesEras.length;
  updateCarouselEras();
});

prevBtnEras.addEventListener('click', () => {
  carouelErasIndex = (carouelErasIndex - 1 + slidesEras.length) % slidesEras.length;
  updateCarouselEras();
});
//#endregion

//#region Carousel Skills
const trackSkills = document.querySelector('.carousel-track.carousel-skills');
const slidesSkills = document.querySelectorAll('.carousel-item.carousel-skills');
const nextBtnSkills = document.querySelector('.carousel-btn.next.carousel-skills');
const prevBtnSkills = document.querySelector('.carousel-btn.prev.carousel-skills');
const pageSkills = document.querySelector('.carousel-page.carousel-skills');
let carouelSkillsIndex = 0;

function updateCarouselSkills() {
  trackSkills.style.transform = `translateX(-${carouelSkillsIndex * 100}%)`;
  pageSkills.textContent = carouelSkillsIndex + 1;
}

nextBtnSkills.addEventListener('click', () => {
  carouelSkillsIndex = (carouelSkillsIndex + 1) % slidesSkills.length;
  updateCarouselSkills();
});

prevBtnSkills.addEventListener('click', () => {
  carouelSkillsIndex = (carouelSkillsIndex - 1 + slidesSkills.length) % slidesSkills.length;
  updateCarouselSkills();
});
//#endregion

//#region Carousel Stats
const trackStats = document.querySelector('.carousel-track.carousel-stats');
const slidesStats = document.querySelectorAll('.carousel-item.carousel-stats');
const nextBtnStats = document.querySelector('.carousel-btn.next.carousel-stats');
const prevBtnStats = document.querySelector('.carousel-btn.prev.carousel-stats');
let carouelStatsIndex = 0;

function updateCarouselStats() {
  trackStats.style.transform = `translateX(-${carouelStatsIndex * 100}%)`;
}

nextBtnStats.addEventListener('click', () => {
  carouelStatsIndex = (carouelStatsIndex + 1) % slidesStats.length;
  updateCarouselStats();
});
//#endregion

function changeRole() {
  const icon = document.getElementById("role-icon");

  switch(icon.title){
    case "Sin Especialización":
      icon.src = "../Images/TankRole.png";
      icon.title = "Tanque"
      break;
    case "Tanque":
      icon.src = "../Images/DPSRole.png";
      icon.title = "DPS"
      break;
    case "DPS":
      icon.src = "../Images/HealerRole.png";
      icon.title = "Soporte"
      break;
    case "Soporte":
      icon.src = "../Images/UtilityRole.png";
      icon.title = "Utilidad"
      break;
    case "Utilidad":
      icon.src = "../Images/NoRole.png";
      icon.title = "Sin Especialización"
      break;
    default:
      icon.src = "../Images/TankRole.png";
      icon.title = "Tanque"
  }

  DB.addOrUpdateItem({id: "role", img: icon.src, title: icon.title}, DB.TABLES.STATS);      
}

function updateSheetColors(theme) {
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
}

function editLabel(id) {
  const label = document.getElementById(id);
  
  var labelText = "";
  
  if (id == "labelRecurso") {
    labelText = prompt("¿Qué recurso usas?", "MP");
    labelText = labelText.length > 0 ? labelText + ":" : "Recurso:";
    DB.addOrUpdateItem({id: id, text: labelText}, DB.TABLES.STATS);   
  } else {
    labelText = prompt("Nombra tu Item", "");
    labelText = labelText.length > 0 ? labelText : "Desocupado";
  }
  
  label.textContent = labelText;
}

function featFill(element) {
  const div = document.getElementById(element + "-div");
  const label = document.getElementById(element + "-label");

  var labelText = prompt("Nombra tu Rasgo", "");
  if (labelText.length > 0) {
    div.classList.remove("feat-empty");
    div.classList.add("feat-full");
    labelText = labelText.length > 13 ? labelText.slice(0, 10) + "..." : labelText;
    label.textContent = labelText;
  } else {
    div.classList.remove("feat-full");
    div.classList.add("feat-empty");
    label.textContent = "- - - ⨁ - - -";
  }

  DB.addOrUpdateItem({id: element, classes: div.classList.toString(), text: label.textContent}, DB.TABLES.FEATS);
}

function clearAcciones(){
  const divs = Array.from(document.getElementsByClassName("feat-selected"));
  
  divs.forEach((div) => {
    div.classList.remove("feat-selected");
    div.classList.add("feat-full");
  }); 
}

function action_OnClick(element) {
  const div = document.getElementById(element + "-div");
  const label = document.getElementById(element + "-label");
  const select = document.getElementById("check-acciones").checked;

  if(select) {
    if (div.classList.contains("feat-full")) {
      div.classList.remove("feat-full");
      div.classList.add("feat-selected");
    } else if (div.classList.contains("feat-selected")) {
      div.classList.remove("feat-selected");
      div.classList.add("feat-full");
    }

  } else {
    var labelText = prompt("Escribe tu acción", "");

    if (labelText.length > 0) {
      
      if(div.classList.contains("feat-empty")) {
        div.classList.remove("feat-empty");
        div.classList.add("feat-full");
      }

      labelText = labelText.length > 13 ? labelText.slice(0, 10) + "..." : labelText;
      label.textContent = labelText;

    } else {
      div.classList.remove("feat-full");
      div.classList.remove("feat-selected");
      div.classList.add("feat-empty");
      label.textContent = "- - - ⨁ - - -";

    }
  }

  DB.addOrUpdateItem({id: element, classes:  div.classList.toString(), text: label.textContent}, DB.TABLES.FEATS);
}

function Transformacion() {
  const img = document.getElementById("Magic-Girl-Photo");

  const shine = document.createElement('div');
  shine.classList.add('shine-effect');
  img.parentElement.appendChild(shine);

  setTimeout(() => {
    shine.remove();
    if (img.title == "Una Chica Normal") {
      img.title = "¡Chica Mágica!";
      img.src = "../../Outfit - Magical.png";
    } else {
      img.title = "Una Chica Normal";
      img.src = "../../Outfit - Normal.png";
    }
    
    DB.addOrUpdateItem({id: "outfit", img: img.src, title: img.title}, DB.TABLES.STATS);
  }, 250);


}

function gemBreak() {
  const img = document.getElementById("Gem");
  const text = document.getElementById("Gem-Text");
  
  gemCounter = gemCounter == 0 ? 5 : gemCounter - 1;

  switch (gemCounter) {
    case 5:
      text.innerHTML = "Mira, ¡eres tú!";
      break;
    case 4:
      text.innerHTML = "Puede que estés maltrecha,<br> pero aún así floreces.";
      break;
    case 3:
      text.innerHTML = "¿Qué es el dolor, si no<br> la prueba de que sigues viva?";
      break;
    case 2:
      text.innerHTML = "Ni siquiera la adversidad<br> puede apagarte de verdad.";
      break;
    case 1:
      text.innerHTML = "Mientras puedas seguir sonriendo,<br> la magia brillará en tu corazón.";
      break;
    case 0:
      text.innerHTML = "A pesar de todo, sigues siendo tú.";
      break;
    default:
      break;
  }
  img.style.opacity = 0;

  setTimeout(() => {
    img.src = "../Images/Gema " + gemCounter + ".png"
    img.style.opacity = 1;
    
    DB.addOrUpdateItem({id: "gem", img: img.src, title: text.innerHTML, counter: gemCounter}, DB.TABLES.STATS);
  }, 250);
}

async function openModal(name) {
  modalItem = name;
  const modal = document.getElementById("item-modal");
  const itemImg = document.getElementById("item-img");
  const fichaImg = document.getElementById(name + "-slot-img");
  const itemLabel = document.getElementById("item-label");
  const itemSlot = document.getElementById("item-slot-label");
  const itemStats = document.getElementById("item-stats");
  const itemDesc = document.getElementById("item-desc");
  
  var item = await DB.getItem(name, DB.TABLES.ITEMS);
  var img = await DB.getItem(name, DB.TABLES.IMAGES);
  
  itemSlot.textContent = "Slot: " + name + ".";
  if (item) {
    try {
      const blobUrl = URL.createObjectURL(img.file);
      itemImg.src = blobUrl;
      fichaImg.src = blobUrl;
    } catch {
      itemImg.src = "../Icons/Inventario/" + name + "-Slot.png";
      fichaImg.src = "../Icons/Inventario/" + name + "-Slot.png";
    }
    
    itemLabel.textContent = item.name;
    itemStats.value = item.stats;
    itemDesc.value = item.desc;
  } else {
    itemImg.src = "../Icons/Inventario/" + name + "-Slot.png";
    fichaImg.src = "../Icons/Inventario/" + name + "-Slot.png";
    itemLabel.textContent = "Desocupado";
    itemStats.value = "";
    itemDesc.value = "";
  }
  
  itemImg.title = "item-" + name + "-img";
  itemLabel.title = "item-" + name + "-label";
  itemStats.title = "item-" + name + "-stats";
  itemDesc.title = "item-" + name + "-desc";
  
  modal.style.display = "block";
}

async function closeModal() {
  const modal = document.getElementById("item-modal");
  modal.style.display = "none";

  const itemImg = document.getElementById("item-img");
  const itemLabel = document.getElementById("item-label");
  const itemSlot = document.getElementById("item-slot-label");
  const itemStats = document.getElementById("item-stats");
  const itemDesc = document.getElementById("item-desc");
  
  await DB.addOrUpdateItem({id: modalItem, name: itemLabel.textContent, stats: itemStats.value, img: itemImg.src, desc: itemDesc.value}, DB.TABLES.ITEMS);
  
  itemSlot.textContent = "";
  itemImg.src = "";
  itemLabel.textContent = "";
  itemStats.value = "";
  itemDesc.value = "";
  itemImg.title = "";
  itemLabel.title = "";
  itemStats.title = "";
  itemDesc.title = "";
  modalItem = "";
}

function clearImgItem() {
  const itemImg = document.getElementById("item-img");
  const fichaImg = document.getElementById(modalItem + "-slot-img");

  DB.deleteItem(modalItem, DB.TABLES.IMAGES);

  itemImg.src = "../Icons/Inventario/" + modalItem + "-Slot.png";
  fichaImg.src = "../Icons/Inventario/" + modalItem + "-Slot.png";
}

function inputImg() {
  fileInput.click();
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  const itemImg = document.getElementById("item-img");
  const fichaImg = document.getElementById(modalItem + "-slot-img");

  if (file && file.type.startsWith("image/")) {
    const blobUrl = URL.createObjectURL(file);
    itemImg.src = blobUrl;
    fichaImg.src = blobUrl;

    await DB.addOrUpdateItem({id: modalItem, file: file}, DB.TABLES.IMAGES);
  } else {
    alert("Please select an image file!");
  }
});

document.addEventListener("focusout", async(event) => {
  switch(true) {
    case event.target.title === "name":
    case event.target.title === "class":
    case event.target.title === "level":
    case event.target.title === "resf":
    case event.target.title === "resm":
    case event.target.title === "vblo":
    case event.target.title === "pblo":
    case event.target.title === "esq":
    case event.target.title === "par":
    case event.target.title === "ref":
    case event.target.title === "cron":
    case event.target.title === "eras":
    case event.target.title === "eons":
    case event.target.title === "notes":
      await DB.addOrUpdateItem({id: event.target.title, text: event.target.value}, DB.TABLES.STATS);
      break;
    case event.target.title === "hp":
    case event.target.title === "resource":
      var item = await calcularStat(event.target.title);
      console.log(item)
      await DB.addOrUpdateItem({id: event.target.title, current: item.current, max: item.max}, DB.TABLES.STATS);
      break;
    case event.target.title === "fue":
    case event.target.title === "agi":
    case event.target.title === "int":
    case event.target.title === "con":
    case event.target.title === "car":
    case event.target.title === "esp":
    case event.target.title === "agu":
      var mod = document.getElementById("character-" + event.target.title + "-mod");
      var dice = document.getElementById("character-" + event.target.title + "-die");
      await DB.addOrUpdateItem({id: event.target.title, mod: mod.value, die: dice.value}, DB.TABLES.STATS);
      break;
    case event.target.title.startsWith("skill-"):
      var name = document.getElementById(event.target.title + "-name");
      var cost = document.getElementById(event.target.title + "-cost");
      var desc = document.getElementById(event.target.title + "-desc");
      await DB.addOrUpdateItem({id: event.target.title, name: name.value, cost: cost.value, desc: desc.value}, DB.TABLES.SKILLS);
      break;
    case event.target.title.startsWith("item-"):
      var img = document.getElementById("item-img");
      var label = document.getElementById("item-label");
      var stats = document.getElementById("item-stats");
      var desc = document.getElementById("item-desc");
      await DB.addOrUpdateItem({id: modalItem, name: label.textContent, stats: stats.value, img: img.src, desc: desc.value}, DB.TABLES.ITEMS);
      break;
    default:
      console.log(event.target.title);
      break;
  }
});

async function calcularStat(stat){
  var current = document.getElementById("character-" + stat + "-current");
  var max = document.getElementById("character-" + stat + "-max");

  var response = await DB.getItem(stat, DB.TABLES.STATS);

  if(response) {
    if (current.value.startsWith("-") || current.value.startsWith("+")) {
      response.current = +response.current + +current.value;
    } else {
      response.current = current.value;
    }

    response.max = max.value;

    if (+response.current < 0) {
      response.current = "0";
    }

    if (+response.current > +response.max) {
      response.current = response.max;
    }

    current.value = response.current;

    return {current: response.current, max: response.max};
  }

  return {current: current.value, max: max.value};
}

async function Save() {
  await DB.saveDB();
}

async function Load() {
  await DB.loadDB();
}