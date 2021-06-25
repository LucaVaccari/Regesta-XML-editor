// b = before, a = after
class Formatter {
  constructor(
    indent = "\t",
    compact = true,
    bKey = "<",
    aKey = ">",
    bAttributeName = " ",
    aAttributeName = "",
    bAttributeValue = '"',
    aAttributeValue = '"',
    bContent = "",
    aContent = "",
    bCloseTag = "/",
    bSelectedContent = "",
    aSelectedContent = ""
  ) {
    this._indent = indent;
    this.isCompact = compact;
    this._bKey = bKey;
    this._aKey = aKey;
    this._bAttributeName = bAttributeName;
    this._aAttributeName = aAttributeName;
    this._bAttributeValue = bAttributeValue;
    this._aAttributeValue = aAttributeValue;
    this._bContent = bContent;
    this._aContent = aContent;
    this._bCloseTag = bCloseTag;
    this._bSelectedContent = bSelectedContent;
    this._aSelectedContent = aSelectedContent;
  }

  surround(key, content, attributeNames, attributeValues, isLast = true) {
    let returnValue = "";
    //if (isFirst) returnValue += "\n";
    returnValue += this._bKey + key;
    returnValue += this._attributes(attributeNames, attributeValues);

    // autofinishing tag
    if (content == "") {
      returnValue += " " + this._bCloseTag + this._aKey;
      if (!isLast) returnValue += "\n";
      return returnValue;
    }

    // tag containing something
    returnValue += this._aKey;

    if (new RegExp("^\s*" + this._bKey).test(content.trimLeft()) || new RegExp("^\s*" + this._bSelectedContent + this._bKey).test(content.trimLeft())) {
      // tag containing a tag
      returnValue += this._indentContent("\n" + content) + "\n";
    }
    else {
      // tag containing text
      if (this.isCompact) {
        returnValue += content;
      }
      else {
        returnValue += this._indentContent("\n" + content) + "\n";
      }
    }

    returnValue += this._bKey + this._bCloseTag + key + this._aKey;
    if (!isLast) returnValue += "\n";
    return returnValue;
  }

  _attributes(attributeNames, attributeValues) {
    let returnValue = "";
    for (let index in attributeNames) {
      returnValue += this._bAttributeName + attributeNames[index] + this._aAttributeName + "=" + this._bAttributeValue + attributeValues[index] + this._aAttributeValue;
    }
    return returnValue;
  }

  _indentContent(content) {
    return content.replaceAll(/\n/g, "\n" + this._indent);
  }

  setBold(content) {
    return this._bSelectedContent + content + this._aSelectedContent;
  }
}
