import type { LLMProvider } from '../types/bot';

export const PROVIDER_OPTIONS: Array<{ value: LLMProvider; label: string }> = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'mistral', label: 'Mistral' },
];

export const MISTRAL_MODELS = [
  { value: 'mistral-large-latest', label: 'Mistral Large Latest' },
  { value: 'mistral-small-latest', label: 'Mistral Small Latest' },
  { value: 'open-mistral-7b', label: 'Open Mistral 7B' },
  { value: 'open-mixtral-8x7b', label: 'Open Mixtral 8x7B' },
];

export const DEFAULT_PROVIDER: LLMProvider = 'openai';
export const DEFAULT_MISTRAL_MODEL = 'mistral-large-latest';

export function normalizeProvider(provider?: string | null): LLMProvider {
  return provider === 'mistral' ? 'mistral' : 'openai';
}

export function getDefaultModelForProvider(provider: LLMProvider): string {
  return provider === 'mistral' ? DEFAULT_MISTRAL_MODEL : '';
}

export function getModelOptionsForProvider(
  provider: LLMProvider,
  openAiModels: Array<{ value: string; label: string }>
) {
  return provider === 'mistral' ? MISTRAL_MODELS : openAiModels;
}
