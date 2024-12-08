const useNode = () => {
  const insertNode = function (tree, sectionId, item) {
    if (tree.id === sectionId) {
      tree.subsections.push({
        id: new Date().getTime(),
        title: item,
        subsections: [],
      });

      return tree;
    }

    let latestNode = [];
    latestNode = tree.subsections.map((ob) => {
      return insertNode(ob, sectionId, item);
    });

    return { ...tree, subsections: latestNode };
  };

  const editNode = (tree, sectionId, value) => {
    if (tree.id === sectionId) {
      tree.title = value;
      return tree;
    }

    tree.subsections.map((ob) => {
      return editNode(ob, sectionId, value);
    });

    return { ...tree };
  };

  const deleteNode = (tree, id) => {
    for (let i = 0; i < tree.items.length; i++) {
      const currentItem = tree.items[i];
      if (currentItem.id === id) {
        tree.items.splice(i, 1);
        return tree;
      } else {
        deleteNode(currentItem, id);
      }
    }
    return tree;
  };

  return { insertNode, editNode, deleteNode };
};

export default useNode;
