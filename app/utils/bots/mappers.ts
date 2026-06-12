import type { Bot, BotData } from '../../types/bot';

/**
 * Map Bot from API to BotData for UI
 */
export function mapBotToBotData(bot: Bot): BotData {
  const llmProvider = bot.llm_provider || 'openai';
  const llmModel = bot.llm_model || bot.gpt_model || '';

  return {
    id: bot.id,
    name: bot.name,
    llm_provider: llmProvider,
    llm_model: llmModel,
    gpt_model: llmModel,
    provider_resource_id: bot.provider_resource_id ?? bot.assistant_id ?? null,
    is_active: bot.is_active,
    created_on: bot.created_on,
    updated_on: bot.updated_on,
    assistant_name: bot.assistant_name,
    working: bot.working,
    // Note: usage_count and total_sessions are not in the API response
    // They would need to come from a separate endpoint if needed
  };
}

