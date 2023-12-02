type DayArgs = string[]

export default function main(args: DayArgs) {
    const numberChar = /^\d$/
    return args.map((arg, i) => {
        const numericChars = arg.split("").filter(char => numberChar.test(char));
        const calibrationValue = parseInt(`${numericChars[0]}${numericChars[numericChars.length - 1]}`);
        if (!calibrationValue || typeof calibrationValue !== "number" ) {
            console.log({arg, i})
        }
        return calibrationValue;
    }).reduce((sum, val) => sum + val);
}
