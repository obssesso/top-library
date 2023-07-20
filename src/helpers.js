export default function createEnumPOJO(enumValues) {
  const enumPOJO = {};
  for (const enumValue of enumValues) {
    const key = camelCase(enumValue);
    enumPOJO[key] = enumValue;
  }
  return Object.freeze(enumPOJO);
}

function camelCase(string) {
  return string
    .split(" ")
    .map((word, index) => {
      const wordLowerCase = word.toLowerCase();
      return index != 0
        ? `${wordLowerCase.charAt(0).toUpperCase()}${wordLowerCase.slice(1)}`
        : wordLowerCase;
    })
    .join("");
}
