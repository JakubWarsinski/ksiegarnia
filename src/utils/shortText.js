exports.shortText = (text, length) => {
    return text.length > length ? text.substring(0, (length - 3)) + "..." : text;
}