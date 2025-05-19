const zoteroAnnotationLinkPattern = /[“"]([^”"]*)[”"]\s*\(\[([^\]]*)\]\((zotero\:\/\/select\/library\/items\/[A-Z0-9]+)\)\)\s*\(\[([^)]+)\]\((zotero\:\/\/open-pdf\/library\/items\/[A-Z0-9]+\?sel=.*\&annotation=[A-Z0-9]+)\)\)/;

export function parseZoteroAnnotationLink(input: string){
    // E.g.
    // input:  “text” ([Author et. al, 2022](zotero://select/library/items/SQLKEY)) ([pdf](zotero://open-pdf/library/items/SQLKEY?sel=p%3Anth-child(12)&annotation=SQLKEY))
    // return: {
    //         text: "text",
    //         itemSelectText: "Author et. al, 2022",
    //         itemSelectLink: "zotero://select/library/items/SQLKEY",
    //         annotationText: "pdf",
    //         annotationLink: "zotero://open-pdf/library/items/SQLKEY?sel=p%3Anth-child(12)&annotation=SQLKEY"
    // }
    const matches = input.trim().match(zoteroAnnotationLinkPattern);
    if (matches) {
        const text = matches[1];
        const itemSelectText = matches[2];
        const itemSelectLink = matches[3];
        const annotationText = matches[4];
        const annotationLink = matches[5];
        return {
            text,
            itemSelectText, 
            itemSelectLink,
            annotationText,
            annotationLink
        };
    } else {
        return null;
    }
}