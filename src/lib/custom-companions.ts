import { companions, type Companion } from "./companions";

export const characterTraits = ["Caring", "Playful", "Calm", "Witty", "Creative", "Confident", "Curious", "Supportive"];
export type CustomCompanion = {
  id: string; name: string; age: number; avatarId: string; traits: string[]; interests: string;
  backstory: string; language: string; conversationStyle: string; archived: boolean;
};
export function asCompanion(character: CustomCompanion): Companion {
  const avatar = companions.find(c => c.id === character.avatarId) ?? companions[0];
  return { ...avatar, id: character.id, name: character.name, description: character.backstory || "Your private companion.",
    personality: character.traits.join(", "), conversationStyle: character.conversationStyle,
    greeting: `Hi, I'm ${character.name}. How is your day going?`, language: character.language,
    traits: character.traits, interests: character.interests.split(",").map(v => v.trim()).filter(Boolean),
    tags: character.traits, chatCount: "Private" };
}
