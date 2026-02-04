import { useState, useCallback } from 'react';
import { botService } from '../../../services/bot';
import { mapBotToBotData } from '../../../utils/bots/mappers';
import { extractErrorMessage, getDefaultErrorMessage } from '../../../utils/bots/errorHandlers';
import type { BotData, Bot } from '../../../types/bot';

export function useBots() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [fullBots, setFullBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await botService.getBots({
        pageNumber: 1,
        pageSize: 20,
        status: 'all',
      });
      
      setFullBots(response.results);
      const botsList = response.results.map(mapBotToBotData);
      setBots(botsList);
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err) || getDefaultErrorMessage('fetch');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBotActive = useCallback(async (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return { success: false, error: 'Bot not found' };
    
    try {
      if (bot.is_active) {
        await botService.deleteBot(botId);
      } else {
        await botService.restoreBot(botId);
      }
      await fetchBots();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err) || getDefaultErrorMessage('toggle');
      return { success: false, error: errorMessage };
    }
  }, [bots, fetchBots]);

  const editBot = useCallback(async (botId: string): Promise<Bot | null> => {
    try {
      const bot = await botService.getBotById(botId);
      return bot;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err) || getDefaultErrorMessage('load');
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    bots,
    fullBots,
    loading,
    error,
    fetchBots,
    toggleBotActive,
    editBot,
    setError,
  };
}

