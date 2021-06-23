// b = before, a = after
class Formatter {
  constructor(
    indent = "\t",
    compact = true,
    bOpenKey = "<",
    bAttributeName = " ",
    aAttributeName = "",
    bAttributeValue = '"',
    aAttributeValue = '"',
    aOpenKey = ">",
    bContent = "",
    aContent = "",
    bCloseKey = "</",
    aCloseKey = ">\n"
  ) {
    this.indent = indent;
    this.compact = compact;
    this._bOpenKey = bOpenKey;
    this._bAttributeName = bAttributeName;
    this._aAttributeName = aAttributeName;
    this._bAttributeValue = bAttributeValue;
    this._aAttributeValue = aAttributeValue;
    this._aOpenKey = aOpenKey;
    this._bContent = bContent;
    this._aContent = aContent;
    this._aCloseKey = aCloseKey;
    this._bCloseKey = bCloseKey;
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
      if (content.startsWith(this._bOpenKey)) {
        let returnValue =
          "\n" +
          this._surround(
            content.replaceAll(/\n/g, "\n" + this.indent),
            this._bContent + this.indent,
            this._aContent
          );
        return returnValue.slice(0, returnValue.length - 1);
      } else {
        return this._surround(content, this._bContent, this._aContent);
      }
    } else {
      let returnValue =
        // "\n" +
        this._surround(
          content.replaceAll(/\n/g, "\n" + this.indent),
          this._bContent + this.indent,
          this._aContent
        ) + "\n";
      return returnValue//.slice(0, returnValue.length - 1);
    }
  }

  surroundCloseKey(key) {
    return this._surround(key, this._bCloseKey, this._aCloseKey);
  }

  _surround(inner, lx, rx) {
    return "" + lx + inner + rx;
  }
}

function multiplyChar(char, times) {
  let result = "";
  for (let i = 0; i < times; i++) result += char;

  return result;
}
