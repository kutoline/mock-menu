import { writeFile, readFile } from 'fs/promises';
import { slugify } from 'transliteration';
import 'dotenv/config';

const generateFileWithData = (fileName, data)  => {
  writeFile(`./menu_data/${fileName}.json`, JSON.stringify(data))
  console.log(fileName)
}

const formatSubmenu = (submenu) => {
  return submenu.map(({ param_id, item, href, image, subitems = [] , subitems_count = 0}) => {
    return { param_id, item, href, image: '', subitems }
  });
}

const generatePartMenu = (data) => {
  data.forEach((item) => {
    if (('subitems' in item)) {
      const submenuData = Object.values(item.subitems);
      const submenuPart = submenuData.slice(0, 3);
      item.subitems = formatSubmenu(submenuPart);

      const name= slugify(item.item) + '-' + item.param_id;

      if (item.subitems.length) {
        data.subitems_path = `${process.env.MENU_STORAGE_URL}/${name}.json`
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

  generatePartMenu(menuItems);
});
