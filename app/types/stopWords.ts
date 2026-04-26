export interface StopWordApiItem {
  id: string;
  bot: string;
  bot_id: string;
  function?: string | null;
  function_id?: string | null;
  text: string;
  equal_include: boolean;
  media_type?: StopWordMediaType;
  direct_function_name?: string | null;
  created_on: string;
  updated_on: string;
}

export type StopWordMediaType = 'text' | 'audio' | 'video' | 'image';

export interface StopWord {
  id: string;
  botId: string;
  functionId?: string;
  directFunctionName?: string | null;
  text: string;
  equalInclude: boolean;
  mediaType: StopWordMediaType;
  createdOn?: string;
  updatedOn?: string;
}

export interface StopWordsListResponse {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: StopWordApiItem[];
}

export interface StopWordCreateItem {
  direct_function_id?: string | null;
  text: string;
  equal_include: boolean;
  media_type: StopWordMediaType;
}

export interface CreateStopWordsRequest {
  bot_id: string;
  stopwords: StopWordCreateItem[];
}

export interface UpdateStopWordRequest {
  direct_function_id?: string | null;
  text: string;
  equal_include: boolean;
  media_type: StopWordMediaType;
}
