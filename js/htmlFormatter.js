class HTMLFormatter extends Formatter {
  constructor(
    baseColor,
    tagColor,
    attributeNameColor,
    attributeValueColor,
    bracketsColor,
    compact = true
  ) {
    super(
      "    ",
      compact,
      `<code style="color:${bracketsColor};">&lt;</code><code style="color:${tagColor}">`,
      `</code> <code style="color:${attributeNameColor};">`,
      `</code>`,
      `<code style="color:${attributeValueColor};">"`,
      `"</code>`,
      `<code style="color:${bracketsColor};">&gt;</code>`,
      `<code style="color:${baseColor};">`,
      `</code>`,
      `<code style="color:${bracketsColor};">&lt;/</code><code style="color:${tagColor}">`,
      `</code><code style="color:${bracketsColor};">&gt;</code>`
    );
  }
}
