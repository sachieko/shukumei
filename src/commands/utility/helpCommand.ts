import {
  SlashCommandBuilder,
  MessageFlags,
  ChatInputCommandInteraction,
} from "discord.js";
import { DISCORD_DIE_EMOJI, SHAME_EMOJI } from "../../types/diceConstants";
// Update these when PRIVACYPOLICY.md or TERMSOFSERVICE.md update,
// this is the only location these are required.
const PRIVACYDATE = "8/8/2025";
const TOSDATE = "8/8/2025";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("What topic do you want help with?")
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("Choose a command or topic")
      .setRequired(true)
      .addChoices(
        { name: "Roll", value: "roll" },
        { name: "Predict", value: "predict" },
        { name: "Staredown", value: "staredown" },
        { name: "Reminder", value: "reminder" },
        { name: "Add/Mod Symbols", value: "symbols" },
        { name: "Unkeep", value: "unkeep" },
        { name: "Modify Dice", value: "modify" },
        { name: "Policies", value: "policies" }
      )
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const command = interaction.options.getString("command", true);
  let content = "";
  switch (command) {
    case "roll":
      content = `**Using Roll:**
Enter the ring and skill for your approach determined with your GM. These are the only required inputs to roll.

**Optional Inputs:**
If you have any assistance, you will have to enter the number of characters giving unskilled or skilled assist separately. If you spent a voidpent, select True for voidpoint. You may also enter the TN if you would like it displayed, as well as give the roll a label such as "Saburo's Tea Ceremony Check". To remove an optional category you did not mean to use, you can backspace to remove it.

**Choosing kept dice, dice to reroll, or dice to modify:**
The dice are displayed in a specific order, which you use to choose kept dice. Using the following dice roll: ${DISCORD_DIE_EMOJI.D6[3]}${DISCORD_DIE_EMOJI.D6[6]}${DISCORD_DIE_EMOJI.D12[6]}
You can keep 2 dice since the used Ring was 2. If you wanted to keep ${DISCORD_DIE_EMOJI.D6[6]}${DISCORD_DIE_EMOJI.D12[6]} then you need to keep the 2nd and 3rd die. To do this, click Keep under the roll and then enter "2 3" or "2,3" and you will keep the second and third dice. Using this method you can keep any number of dice up to the limit allowed for your roll based on Ring dice, assists, and void points spent. If you try to keep more than you are allowed, they are kept in order from left to right until you can't keep dice anymore.

**Explosive Rerolls:**
When you keep an explosive die, a new rolled die will be added to the original dice. Ex: if you keep an explosive in the example above, there will be 4 rolled dice.
You can always keep the results of explosive dice even if you already kept your limit.

**Meaning of Modifiers:**
:handshake_tone3: - Assistance (1 per assist)
:cyclone: - Void point spent
:folding_hand_fan: - A bonus rolled or kept die was added (1 per added die)
:anger: - An explosive was kept
:arrow_heading_down: - A dice was set to a specific result
:repeat: - Rerolls are tracked separately, used for advantages or disadvantages.`;
      break;

    case "symbols":
      content = `**Die Symbol Help:**
If adding or modifying a die to a result and you have to choose what the die shows, enter in one of the following letters:
OS - Opportunity Success on Skill die, Opportunity Strife on Ring die
SS - Success and Strife
E - Explosive, or Explosive Strife on a Ring die
ES - Explosive and Strife
O - Opportunity
S - Success`;
      break;

    case "predict":
      content = `**Prediction Help:**
To use prediction, choose the stance you predict your target will enter when using the command and choose the person in the discord server who controls that character.
      
Once chosen, a message in chat will be left with a select menu visible. Only the target chosen by the predict command will be able to select their stance.
Once they respond by selecting their stance, the bot will compare their selection with the original prediction, and give a summary of if the prediction was correct or not.
      
Note that void stance is not a valid stance to predict according to the core rules, because it represents instinct and self sacrifice. 
Therefore it is valid to enter as a stance, but cannot be predicted because you cannot predict someone's instincts or know what they are willing to sacrifice.`;
      break;

    case "unkeep":
      content = `**Unkeeping Dice:**
      To unkeep dice, simply choose to keep a dice that is already considered kept (has a green border). 
      **Be careful! This removes any dice it created if it was explosive! This will also remove any results if it resulted in explosives that were also kept!!**
      ${SHAME_EMOJI} - Shame symbol for # of times someone has unkept dice. This is so GMs can track abusers of the system.
      `;
      break;

    case "staredown":
      content = `**Staredown Help:**
To use staredown, input the number of strife you wish to bid and the player or GM in the server who controls the other opponent in the duel.
You may choose to stare yourself down, such as if you are the GM and 2 NPCs are dueling for some reason. A message will be put into chat asking them to input a bid.
      
Only the chosen target of the staredown can use the button to bid. Once clicked by the target user, they will be prompted to type a number of how much strife they would like to bid, including 0.
Once they have put their bid in, the result will be displayed in chat and previous messages will be erased. Bids cannot be greater than 12 in either case.`;
      break;

    case "reminder":
      content = `**Reminder Help:**
To use reminder, you will have to enter the reason for the reminder as the event name, the day of the month the reminder should be set for, and the hour in 24-hour time.
The day of month is the calendar day of the month, ie if you want to set a reminder for the 21st you enter '21' for the day. If it is already past the day in the current month, it will automatically assume you want a reminder for the next month.
Ex: You put '21', however it is already the 22nd. Then the reminder will be set for the 21st of the next month.
      
There are optional inputs for the minute if you would like to do 15 after the hour you can enter 15, and role if you would like to ping a role with the reminder as well.
      
**NOTE:** This bot is incapable of knowing where in the world you are, so the default timezone for this is **MST (-7 UTC)**. Keep this in mind when setting a reminder.`;
      break;

    case "modify":
      content = `Modifying dice allows you to change dice to certain results, or keep dice beyond your kept limit.
If keeping dice beyond the normal limit, it will keep only dice not already kept. The post will also denote that you have done so.
This is intended for school abilities or conditions which allow you to keep extra dice beyond usual.

If modifying a die to a result and you have to choose what the die shows, enter in one of the following letters:
OS - Opportunity Success on Skill die, Opportunity Strife on Ring die
SS - Success and Strife
E - Explosive, or Explosive Strife on a Ring die
ES - Explosive and Strife
O - Opportunity
S - Success`;
      break;

    case "policies":
      content = `**[Privacy Policy](https://github.com/sachieko/shukumei/blob/main/PRIVACYPOLICY.md) last updated on ${PRIVACYDATE}**
**[Terms of Service](https://github.com/sachieko/shukumei/blob/main/TERMSOFSERVICE.md) last updated on ${TOSDATE}**`;
      break;

    default:
      content = "Sorry that command has no help file.";
      break;
  }
  await interaction.reply({
    content: content,
    flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
  });
};
