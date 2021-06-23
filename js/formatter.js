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
    bCloseTag = "/"
  ) {
    this._indent = indent;
    this.compact = compact;
    this._bKey = bKey;
    this._aKey = aKey;
    this._bAttributeName = bAttributeName;
    this._aAttributeName = aAttributeName;
    this._bAttributeValue = bAttributeValue;
    this._aAttributeValue = aAttributeValue;
    this._bContent = bContent;
    this._aContent = aContent;
    this._bCloseTag = bCloseTag;

    // TEST START
    let testString = `sosis`;

    console.log(this.surround("giorgio", testString, ["nomeAttributo"], ["valoreAttributo"]));
    // TEST END
  }

  get beforeOpenKey() {
    return this._bOpenKey;
  }

  surroundAttribute(attrName, attrValue) {
    return (
      this._surround(attrName, this._bAttributeName, this._aAttributeName) +
      "=" +
      this._surround(attrValue, this._bAttributeValue, this._aAttributeValue)
    );
  }

  get afterOpenKey() {
    let returnValue = this._aOpenKey;
    if (!this.compact) {
      returnValue += "\n";
    }
    return returnValue;
  }

  surroundContent(content) {
    if (content == "") return "";
    if (this.compact) {
      if (content.trimLeft().startsWith(this.bOpenKey)) {
        //if (new RegExp("^\s+" + this.bOpenKey).test(content)) {

        let indentedContent = content.replaceAll(/\n/g, "\n" + this.indent);
        let returnValue =
          "\n" +
          this._surround(
            indentedContent,//.slice(0, indentedContent.length - this.indent.length),
            this._bContent + this.indent,
            this._aContent
          );
        return returnValue;
      } else {

        return this._surround(content, this._bContent, this._aContent);
      }
    } else {
      let indentedContent = content.replaceAll(/\n/g, "\n" + this.indent);
      let returnValue =
        "\n" +
        this._surround(
          indentedContent.slice(0, indentedContent.length - this.indent.length) + "\n",
          this._bContent + this.indent,
          this._aContent
        );
      return returnValue;
    }
  }

  surroundCloseKey(key) {
    return this._surround(key, this._bCloseKey, this._aCloseKey);
  }

  _surround(inner, lx, rx) {
    return "" + lx + inner + rx;
  }

  surround(key, content, attributeNames, attributeValues, isLast = true) {
    let returnValue = "";
    //if (isFirst) returnValue += "\n";
    returnValue += this._bKey + key;
    returnValue += this._attributes(attributeNames, attributeValues);

    // autofinishing tag
    if (content == "") {
      returnValue += " " + this._bCloseTag + this._aKey;
      return returnValue;
    }

    // tag containing another tag
    returnValue += this._aKey;

    if (new RegExp("^\s*" + this._bKey).test(content.trimLeft())) {
      returnValue += this._indentContent("\n" + content);
    }
    else {
      returnValue += content;
    }

    returnValue += this._bKey + this._bCloseTag + key + this._aKey + "\n";
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
    //TODO: change regex to replace all occurrences except the last one
    return content.replaceAll(/\n/g, "\n" + this._indent);
  }
}

function multiplyChar(char, times) {
  let result = "";
  for (let i = 0; i < times; i++) result += char;

  return result;
}
