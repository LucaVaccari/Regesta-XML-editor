class JSONFormatter extends Formatter {
    constructor(
        baseColor,
        tagColor,
        attributeNameColor,
        attributeValueColor,
        bracketsColor,
        compact = true
    ) {
        super(
            "  ",
            compact,
            `<code style="color:${tagColor};">"`,
            `"</code>`,
            `<code style="color:${attributeNameColor};">"`,
            `"</code>`,
            `<code style="color:${attributeValueColor};">"`,
            `"</code>`,
            `<code style="color:${baseColor};"> `,
            `</code>`,
            ``,
            `<strong><em>`,
            `</em></strong>`
        );
        this._bOpenObj = `<code style="color:${bracketsColor};">{</code>`;
        this._aCloseObj = `<code style="color:${bracketsColor};">}</code>`;
        this._bArray = "\\[";
        this._aArray = "\\]";
    }

    surround(key, content, attributeNames, attributeValues, isLast = true, isFirst = true) {
        let returnValue = "";
        let hasAttributes = attributeNames.length != 0;
        if (isFirst) returnValue += this._bArray.replaceAll(/\\/g, "");

        returnValue += this._bOpenObj;

        // if (new RegExp("^\s*" + this._bArray).test(content.trimLeft())) {
        if (new RegExp("^\s*" + "(" + this._bSelectedContent + ")*" + this._bArray).test(content.trimLeft())) {
            // object containing an object (inside an Array)
            // attributes start
            if (hasAttributes) {
                returnValue += this._indentContent("\n" + this._attributes(attributeNames, attributeValues))
            };

            // attributes end
            let objectContent = this._bKey + key + this._aKey;
            objectContent += ":" + this._indentContent("\n" + content);

            returnValue += this._indentContent("\n" + objectContent) + "\n";
        }
        else {
            // object containing text
            // attributes start
            if (hasAttributes) {
                returnValue += this._indentContent("\n" + this._attributes(attributeNames, attributeValues) + "\n")
            };
            // attributes end
            returnValue += this._bKey + key + this._aKey;
            returnValue += ":" + this._bContent + `"${content}"` + this._aContent;
            if (hasAttributes) returnValue += "\n";
        }

        returnValue += this._aCloseObj;
        returnValue += isLast ? this._aArray.replaceAll(/\\/g, "") : ",\n";

        return returnValue;
    }

    _indentContent(content) {
        return content.replaceAll(/\n/g, "\n" + this._indent);
    }

    _attributes(attributeNames, attributeValues) {
        let returnValue = this._bKey + `attributes` + this._aKey + ":";
        let attributes = "";
        for (let index in attributeNames) {
            attributes +=
                this._bOpenObj +
                this._bAttributeName +
                attributeNames[index] +
                this._aAttributeName +
                ": " +
                this._bAttributeValue +
                attributeValues[index] +
                this._aAttributeValue +
                this._aCloseObj;
            if (index != attributeNames.length - 1) attributes += ",\n"
        }
        return returnValue + this._indentContent("\n" + this._bArray.replaceAll(/\\/g, "") + attributes) + this._aArray.replaceAll(/\\/g, "") + ",";
    }

    setBold(content, isLast, isFirst) {
        let returnValue = "";
        // if (isFirst && !isLast) {
        //     returnValue = this._bArray.replaceAll(/\\/g, "") + this._bSelectedContent + content.replace(new RegExp("^\s*" + this._bArray), "") + this._aSelectedContent;
        // }

        if (isLast && !isFirst) {
            returnValue = this._bSelectedContent + content.replace(new RegExp(this._aArray + "$"), "") + this._aSelectedContent + this._aArray.replaceAll(/\\/g, "");
            return returnValue;
        }


        if (!isLast) {
            if (isFirst && !isLast) {
                let endTestString = content.replaceAll(/\n/g, "\n")
                returnValue = this._bArray.replaceAll(/\\/g, "") + this._bSelectedContent + content.replace(new RegExp("^\s*" + this._bArray), "");
            }
            else
            {
                returnValue = this._bSelectedContent + content;
            }
            
            returnValue = returnValue.replaceAll(/,\n$/g, "");
            returnValue += this._aSelectedContent + ",\n";
            return returnValue;

        }

        if (isFirst ^ isLast) {
            console.log(isFirst, isLast);
            return returnValue;
        }
        else
            return this._bSelectedContent + content + this._aSelectedContent;
    }
}