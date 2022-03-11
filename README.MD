# Virtual's Typescript Bot Core

This is a core for lazy people who don't want to create them from zero.

example:

```ts
import Client from "./Classes/Client";

const client = new Client({ token: *TOKEN* commandFilePath: *COMMANDFILEPATH*, eventFilePath: *EVENTFILEPATH*, guildIds: [*YOURGUILDS*]});

```

- TOKEN - your token
- COMMANDFILEPATH - your command file path, for example: `${__dirname}/commands/` _THIS MUST CONTAIN SUB DIRECTORIES [moderation, info, etc]_
- EVENTFILEPATH - your events files path, for example: `${__dirname}/events/`

**Command Example**

```ts
import { Command } from "../../Classes/Command"; //
import { PERMISSION_TYPES } from "../../utils/Constants";

export default new Command({
  name: "ping",
  perm_type: PERMISSION_TYPES.PERM_OWNER, // default set to PERMISSION_TYPES.PERM_USER, so you don't have to set it if you dont want a special permission
  description: "replies with pong",
  userPermissions: ["ADMINISTRATOR"], // currently not working.
  forceEphemeral: true, // check wether you want to use ephemeral in your replies or not.
  callback: async ({ client, args, interaction }) => {
    // you don't have to pick those 3 arguments, you can pick.
    /* The function uses deferReply, so you need to use the editReply or create a new message or it will just crush. */
    interaction.editReply({ content: "Pong!" });
  },
});
```

**Event Example**

```ts
import { Event } from "../Classes/Event";

export default new Event("ready", () => {
  // pretty much you got every event as an option, and automatically get the argument of the event callback.
  console.log(`The bot is online.`);
});
```
