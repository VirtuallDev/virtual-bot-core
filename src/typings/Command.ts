import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable } from "discord.js";
import Client from "../Classes/Client";
import { PERMISSION_TYPES } from "../utils/Constants";


export interface NewInteraction extends CommandInteraction {
    member: GuildMember;
}

interface RunArguments {
    client: Client,
    interaction: NewInteraction,
    args: CommandInteractionOptionResolver
}

type Func = (args: RunArguments) => any;

export type CommandType = {
    perm_type?: PERMISSION_TYPES | PERMISSION_TYPES.USER;
    forceEphemeral?: boolean | false;
    userPermissions?: PermissionResolvable[];
    callback: Func;
} & ChatInputApplicationCommandData
