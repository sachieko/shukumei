import { Interaction, CacheType, CommandInteraction } from "discord.js";

export const fetchNickname = async (interaction: Interaction<CacheType> | CommandInteraction) => {
  const member = await interaction.guild?.members.cache.get(
    interaction.user.id
  );
  return member?.nickname;
};
