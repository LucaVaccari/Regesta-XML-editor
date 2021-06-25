const KEY_LABEL_INDEX = 0,
  KEY_INPUT_INDEX = 1,
  VALUE_LABEL_INDEX = 2,
  VALUE_INPUT_INDEX = 3,
  MOVE_UP_BUTTON_INDEX = 5,
  MOVE_DOWN_BUTTON_INDEX = 6;

let jsonModel, view, originalTree, root, popoverView, attributesShown = true;
let lastKeyInput, lastKeyLabel, lastValueInput, lastValueLabel;

function getRecordElement(event) {
    let id = event.getSource().getId();
    return sap.ui.getCore().getElementById(id).oParent.oParent;
}

function getCustomIdFromRecord(record) {
    if (record == undefined) return -1;
    return record.mAggregations.content[0].mAggregations.customData[2].mProperties.value;
}

function findSubTreeById(tree, id) {
    if (tree == undefined) return;

    if (Array.isArray(tree)) {
        for (let el of tree)
            if (id == el.id) return el;
            else {
                let searchResult = findSubTreeById(el, id);
                if (searchResult != undefined) return searchResult;
            }
    } else {
        if (id == tree.id) return tree;
        else return findSubTreeById(tree.value, id);
    }
}

function findParentFromId(tree, id) {
    if (tree == undefined || tree.value == undefined) return;

    if (Array.isArray(tree.value)) {
        for (let el of tree.value) {
            if (id == el.id) return tree;
            else {
                let searchResult = findParentFromId(el, id);
                if (searchResult != undefined) return searchResult;
            }
        }
    } else {
        if (id == tree.value.id) return tree;
        else return findParentFromId(tree.value, id);
    }
}

function clearTree(tree) {
    if (typeof tree == "string") return;

    for (let k in tree) {
        if (!tree[k] || typeof tree[k] !== "object") {
            continue; // If null or not an object, skip to the next iteration
        }

        // The property is an object
        if (Object.keys(tree[k]).length === 0) {
            delete tree[k]; // The object had no properties, so delete that property
        }

        if (Array.isArray(tree[k])) {
            arr = [];
            for (let el of tree[k]) {
                if (
                    el != undefined &&
                    el != null &&
                    el != {} &&
                    Object.keys(el).length != 0
                )
                    arr.push(el);
            }
            tree[k] = (typeof arr[0] != "object") ? arr[0] : arr;
        }

        clearTree(tree[k]);
    }
}

function replaceIds(tree) {
    let obj = [];

    if (typeof tree != "object") return tree;

    if (typeof tree.value != "object" && tree.value != undefined) {
        return {
            key: tree.key,
            value: tree.value,
            id: lastElementId++,
        };
    }

    if (Array.isArray(tree)) {
        for (let el of tree) {
            obj.push(replaceIds(el));
        }
    } else {
        console.warn("You shouldn't reach this point replaceIds");
        return tree;
    }
    return obj;
}

function onModify() {
    let currentData = {
        noAttributes: model.data,
        attributes: model.allAttributes
    };
    let currentDataString = JSON.stringify(currentData);
    let previousData = JSON.stringify(dataQueue[dataQueueIndex]);
    if (currentDataString != previousData) {
        dataQueue = dataQueue.slice(0, ++dataQueueIndex);
        let dataCopy = JSON.parse(currentDataString);
        dataQueue.push(dataCopy);
    }
}

function closeKeyValueInputs() {
    lastKeyInput?.setVisible(false);
    lastValueInput?.setVisible(false);
    lastKeyLabel?.setVisible(true);

    update();
}

function updateModel() {
    clearTree(model.data);

    // attributes
    model.allAttributes.forEach((originalAttribute, originalAttributeIndex) => {
        for (let attribute of model.selectedAttributes) {
            if (originalAttribute.id == attribute.id) {
                this[originalAttributeIndex] = attribute;
                break;
            }
        }
    })
    for (let attr of model.allAttributes) {
        attr.attributeKey = attr.attributeKey || "attributeName";
    }
}

function updatePreview() {
    let attributes = attributesShown ? model.allAttributes : [];
    let fontSize = view.byId("fontSizeSlider").getValue();
    model.preview = HTMLtoFormatted(
        CustomJSONToXML(model.data, attributes, formatter),
        fontSize
    );
}

function updateGraphics() {
    view.byId("undoButton").setEnabled(dataQueueIndex > 0);
    view.byId("redoButton").setEnabled(dataQueueIndex < dataQueue.length - 1);

    let currentData = JSON.stringify({ noAttributes: model.data, attributes: model.allAttributes });
    let originalData = JSON.stringify(dataQueue[0]);
    view.byId("resetButton").setEnabled(currentData != originalData);

    jsonModel.updateBindings(true);
    for (let node of originalTree.getItems()) {
        let id = getCustomIdFromRecord(node);
        let subTree = findSubTreeById(model.data, id);
        if (subTree != undefined) {
            node.getContent()[0].getContent()
            [VALUE_LABEL_INDEX].setVisible(!Array.isArray(subTree.value));
        }
        else
            console.error(
                "You shouldn't reach this point. subtree.value is undefined"
            );

        // disable move up and move down buttons
        let parent = findParentFromId(model.data[0], id);
        if (parent != undefined) {
            node.getContent()[0].getContent()
            [MOVE_UP_BUTTON_INDEX].setEnabled(parent.value[0].id != id);
            node.getContent()[0].getContent()
            [MOVE_DOWN_BUTTON_INDEX].setEnabled(parent.value[parent.value.length - 1].id != id);
        }

        let keyLabel = node.getContent()[0].getContent()[KEY_LABEL_INDEX];
        // keyLabel.setWidth(keyLabel.getText().length + 6 + "em");

        let valueLabel = node.getContent()[0].getContent()[VALUE_LABEL_INDEX];
        // valueLabel.setWidth(valueLabel.getText().length + 6 + "em");
    }

    let selected = originalTree.getSelectedItems()[0];
    if (!selected) {
        view.byId("removeButton").setEnabled(false);
        view.byId("duplicateButton").setEnabled(false);
        view.byId("addButton").setEnabled(false);
        view.byId("editButton").setEnabled(false);
        view.byId("editAttributesButton").setEnabled(false);
    }

    jsonModel.updateBindings(true);
}

function update() {
    updateModel();
    updatePreview();  
    updateGraphics();
}