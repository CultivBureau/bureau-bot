import type { Bot, BotData } from '../../types/bot';

/**
 * Map Bot from API to BotData for UI
 */
export function mapBotToBotData(bot: Bot): BotData {
  return {
    id: bot.id,
    name: bot.name,
    channel_type: bot.channel_type,
    gpt_model: bot.gpt_model,
    is_active: bot.is_active,
    created_on: bot.created_on,
    updated_on: bot.updated_on,
    assistant_name: bot.assistant_name,
    working: bot.working,
    // Note: usage_count and total_sessions are not in the API response
    // They would need to come from a separate endpoint if needed
  };
}

