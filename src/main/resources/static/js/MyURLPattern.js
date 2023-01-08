export default class MyURLPattern {
    constructor(pattern) {
        this.pattern = pattern;
        this.regex = this.createRegex();
    }

    createRegex() {
        let regexString = "^";
        let variableNames = [];

        // Split the pattern into individual path segments
        let segments = this.pattern.split("/");
        for (let segment of segments) {
            // If the segment is a variable, add it to the list of variable names and
            // create a capturing group in the regex
            if (segment.startsWith(":")) {
                let variableName = segment.slice(1);
                variableNames.push(variableName);
                regexString += "/([^/]+)";
            } else {
                // If the segment is a literal string, escape any special characters and add
                // it to the regex
                regexString += "/" + segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
        }

        regexString += "$";

        // Create the regex and store it in the object
        return new RegExp(regexString);
    }

    match(url) {
        // Attempt to match the URL against the regex
        let match = this.regex.exec(url);
        if (match) {
            // If the URL matches, extract the values of the variables and return them as an object
            let params = {};
            for (let i = 0; i < this.variableNames.length; i++) {
                let variableName = this.variableNames[i];
                params[variableName] = match[i + 1];
            }
            return params;
        } else {
            // If the URL doesn't match, return null
            return null;
        }
    }
}
