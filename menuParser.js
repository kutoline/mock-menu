import { writeFile, readFile } from 'fs/promises';
import { slugify } from 'transliteration';
import 'dotenv/config';
import lodash from "lodash";

const {cloneDeep} = lodash;

const generateFileWithData = (fileName, data)  => {
  writeFile(`./menu_data/${fileName}.json`, JSON.stringify(data))
  console.log(fileName)
}

const formatSubmenu = (submenu) => {
  return submenu.map((item) => {
    if ('subitems' in item) {

      item.subitems = Object.values(item.subitems).slice(0,3);
      const name= slugify(item.item) + '-' + item.param_id;

      if (item.subitems_count > 3) {
        item['subitems_path'] = `${process.env.MENU_STORAGE_URL}/${name}.json`
      }

      item.subitems.forEach((el) => {
        el.subitems = el.subitems ? Object.values(el.subitems).slice(0,3) : [];
        el.subitems_count = el.subitems_count > 0 ? el.subitems_count : 0;
        el.subitems_path = el.subitems_count > 3 ? `${process.env.MENU_STORAGE_URL}/${name}.json` : ''
      })
    }

    return item;
  }, []);
}

const generatePartMenu = (data, skip_item_data = false) => {
  data.forEach((item) => {
    if (('subitems' in item)) {
      const submenuData = cloneDeep(Object.values(item.subitems));

      const formattedSubMenu = formatSubmenu(submenuData);

      const name= slugify(item.item) + '-' + item.param_id;
      generatePartMenu(Object.values(item.subitems));

      if (formattedSubMenu.length) {
        generateFileWithData(name, formattedSubMenu);
      }
    }
  });
}

readFile('./menu.json', 'utf8').then((res) => {
  const parsedJson = JSON.parse(res);
  const menuItems = [];

  for (const key in parsedJson) {
    menuItems.push(parsedJson[key]);
  }

  generatePartMenu(menuItems);
});
