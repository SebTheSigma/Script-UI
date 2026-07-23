
export function utf8Bytes(str: string): number[] {
    const bytes: number[] = [];

    for (let i = 0; i < str.length; i++) {
        let cp = str.codePointAt(i)!;

        // Skip the second half of surrogate pairs
        if (cp > 0xffff) i++;

        if (cp <= 0x7f) {
            bytes.push(cp);
        } else if (cp <= 0x7ff) {
            bytes.push(
                0xc0 | (cp >> 6),
                0x80 | (cp & 0x3f)
            );
        } else if (cp <= 0xffff) {
            bytes.push(
                0xe0 | (cp >> 12),
                0x80 | ((cp >> 6) & 0x3f),
                0x80 | (cp & 0x3f)
            );
        } else {
            bytes.push(
                0xf0 | (cp >> 18),
                0x80 | ((cp >> 12) & 0x3f),
                0x80 | ((cp >> 6) & 0x3f),
                0x80 | (cp & 0x3f)
            );
        }
    }

    return bytes;
}
