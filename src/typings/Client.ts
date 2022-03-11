import { ApplicationCommandDataResolvable } from "discord.js";

export type ClientCommandHandler = {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[]; 
}