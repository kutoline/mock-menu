import { writeFile, readFile } from 'fs/promises';
import { slugify } from 'transliteration';
import 'dotenv/config';

const generateFileWithData = (fileName, data)  => {
  writeFile(`./menu_data/${fileName}.json`, JSON.stringify(data))
  console.log(fileName)
}

const formatSubmenu = (submenu) => {
  return submenu.map((item) => {
    if ('subitems' in item) {

      item.subitems = Object.values(item.subitems).slice(0,3)

      item.subitems.forEach((el) => {
        el.subitems = [];
        el.image = "";
        el.subitems_count = 0;
      })

      if (item.subitems.length > 3) {
        item.subitems_path = `${process.env.MENU_STORAGE_URL}/${name}.json`
      }
    }

    return item;
  });
}

const generatePartMenu = (data, skip_item_data = false) => {
  data.forEach((item) => {
    if (('subitems' in item)) {
      const submenuData = Object.values(item.subitems);
      item.subitems = formatSubmenu(submenuData);

      const name= slugify(item.item) + '-' + item.param_id;

      if (skip_item_data) {
        item = item.subitems
      }
      generatePartMenu(submenuData);
      generateFileWithData(name, item);
    }
  });
}

readFile('./menu.json', 'utf8').then((res) => {
  const parsedJson = JSON.parse(res);
  const menuItems = [];

  for (const key in parsedJson) {
    menuItems.push(parsedJson[key]);
  }

  generatePartMenu(menuItems, true);
});
