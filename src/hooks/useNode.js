const useNode = () => {
  const insertNode = function (tree, sectionId, item) {
    if (tree.id === sectionId) {
      console.log("lajflksajfldskjflkd", tree, sectionId, item);
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

  const editNode = (tree, commentId, value) => {
    if (tree.id === commentId) {
      tree.name = value;
      return tree;
    }

    tree.items.map((ob) => {
      return editNode(ob, commentId, value);
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
