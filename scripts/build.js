
export default function createItem(tagItem, classNamesItems, child, parent, ...dataAttribute) {
  let item = null;

  item = document.createElement(tagItem);

  if (classNamesItems) {
    item.classList.add(...classNamesItems.split(" "));
  };

  if (child && Array.isArray(child)) {
    child.forEach((el) => {
      el && item.appendChild(el);
    });
  } else if (child && typeof child === "object") {
    item.appendChild(child);
  } else if (child && typeof child === "string") {
    item.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(item);
  }

  if (dataAttribute.length) {
    dataAttribute.forEach(([name, value]) => {
      if (value === "") {
        item.setAttribute(name, "");
      }
      if (
        name.match(/value|id|placeholder|cols|rows/)
      ) {
        item.setAttribute(name, value);
      } else {
        item.dataset[name] = value;
      }
    });
  }
  return item;
}
