"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clean = (value, sqlBlacklist) => {
    console.log(value, typeof value);
    if (typeof value === "string") {
        sqlBlacklist.forEach((token) => {
            value = value.replace(new RegExp(token, "gi"), "");
        });
        return value;
    }
    else if (typeof value === "object" && value !== null) {
        for (const key in value) {
            value[key] = clean(value[key], sqlBlacklist);
        }
    }
    return value;
};
exports.default = clean;
