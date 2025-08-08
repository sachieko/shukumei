import { Interaction, CacheType, CommandInteraction } from "discord.js";

export const fetchNickname = async (
  interaction: Interaction<CacheType> | CommandInteraction,
  userId?: string
): Promise<string> => {
  if (!interaction.guild) return "???";
  const fetchId = userId ?? interaction.user.id;
  try {
    const cacheMember = interaction.guild.members.cache.get(fetchId);
    if (cacheMember) return cacheMember.nickname ?? cacheMember.displayName;
    const fetchMember = await interaction.guild.members.fetch(fetchId);
    return fetchMember.nickname ?? fetchMember.displayName;
  } catch (error) {
    console.error(
      `Failed fetching nickname for ${
        userId ?? interaction.user.id
      }\nError: ${error}`
    );
    return "???";
  }
};
