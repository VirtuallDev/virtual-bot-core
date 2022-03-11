import Discord, { ApplicationCommandDataResolvable, ClientEvents, CommandInteractionOptionResolver } from 'discord.js';
import { ClientCommandHandler } from '../typings/Client';
import { CommandType, NewInteraction } from '../typings/Command';

import glob from 'glob';
import { promisify } from 'util';
import utils from '../utils';
import { Event } from './Event';
import { PERMISSION_TYPES } from '../utils/Constants';
const globPromise = promisify(glob);


export default class Client extends Discord.Client {

    #commands: Discord.Collection<String, CommandType> = new Discord.Collection(); 

    #options: {token: string, commandFilePath: string, eventFilePath: string, guildIds?: string[]};
    constructor(options: {token: string, commandFilePath: string, eventFilePath: string, guildIds?: string[]}){

        super({intents: 32767});

        this.#options = options;
    }

    initialize = (): void =>  {
        
        this.#handle();
        this.login(this.#options.token);
    }

    RegisterCommands = ({commands, guildId}: ClientCommandHandler): void => {
        if(!guildId){
            this.application?.commands.set(commands);
        } else {
            this.guilds.cache.get(guildId)?.commands.set(commands);
        }
    }


    #handle = async () => {
        /* Command Handler */
        const commands: ApplicationCommandDataResolvable[] = [];
        (await globPromise(`${this.#options.commandFilePath}/*/*{.ts,.js}`)).forEach(async file => {
            const command: CommandType = await utils.importFile(file); 
            if(!command.name) return console.error("Missed name argument in command " + file);
            this.#commands.set(command.name, command);
            commands.push(command);
        })

        if(this.#options.guildIds && this.#options.guildIds.length > 0){

            this.on("ready", () => {
                this.#options.guildIds.forEach(guildId => {
                    this.RegisterCommands({
                        commands,
                        guildId
                    })
                })
            })
        }

        /* Event Handler */
        (await globPromise(`${this.#options.eventFilePath}/*{.ts,.js}`)).forEach(async file => {
            const event: Event <keyof ClientEvents> = await utils.importFile(file);
            this.on(event.event, event.callback);
        })

        this.on('interactionCreate', async (interaction) => {
            if(interaction.isCommand()){
                let canUseCommand: boolean = true;
                let access: boolean = false;
                const command: CommandType = this.#commands.get(interaction.commandName)
                await interaction.deferReply({ephemeral:command.forceEphemeral });
                if(!command){
                    await interaction.editReply({content: "Invalid Command."});
                    canUseCommand = false;
                }

                if(canUseCommand){
                    switch(command.perm_type){
                        case PERMISSION_TYPES.USER:
                            access = true;
                        break;

                        case PERMISSION_TYPES.ADMIN:
                            if(interaction.memberPermissions.has("ADMINISTRATOR"))
                                access = true;
                            break;
                        
                        case PERMISSION_TYPES.OWNER:
                            if(interaction.user.id == interaction.guild.ownerId)
                                access = true;
                        break;
                    }

                    if (access){
                        command.callback({
                            args: interaction.options as CommandInteractionOptionResolver,
                            client: this,
                            interaction: interaction as NewInteraction
                        })
                    } else {
                        await interaction.editReply({content: "You have no permissions to use this command!"});
                    }
                }


            }
        })
    }
}
