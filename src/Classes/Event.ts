import { ClientEvents } from "discord.js";

export class Event <Key extends keyof ClientEvents> {
    constructor(public event: Key, public callback: (...args: ClientEvents[Key]) => any){}
}