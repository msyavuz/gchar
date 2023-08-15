#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import clipboard from "clipboardy";
import { ExecFileException } from "child_process";

const program = new Command();

const specialChars = {
    "c": ["Ç", "ç"],
    "g": ["Ğ", "ğ"],
    "i": ["İ", "ı"],
    "o": ["Ö", "ö"],
    "s": ["Ş", "ş"],
    "u": ["Ü", "ü"],
};
async function copy(char: keyof typeof specialChars) {
    if (!Object.keys(specialChars).includes(char)) {
        throw new Error("No special chars for that");
    }

    clipboard.write(await getPrompt(specialChars[char]));
}

async function getPrompt(opts: string[]): Promise<string> {
    return (await prompts({
        type: "select",
        name: "selected",
        message: "Select a special character to copy",
        instructions: false,
        choices: opts.map((opt) => ({
            title: opt,
            value: opt,
        })),
    })).selected;
}

program
    .name("gchar")
    .action(async (char: keyof typeof specialChars) => {
        char = char.toLowerCase() as keyof typeof specialChars;
        copy(char).catch((error) => {
            console.log(error.message);
        });
    })
    .argument("char", "character to get special versions of")
    .description("Get special versions of a character");

program.parse(process.argv);
