export interface StopWordApiItem {
  id: string;
  bot: string;
  bot_id: string;
  text: string;
  equal_include: boolean;
  created_on: string;
  updated_on: string;
}

export interface StopWord {
  id: string;
  botId: string;
  text: string;
  equalInclude: boolean;
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
  text: string;
  equal_include: boolean;
}

export interface CreateStopWordsRequest {
  bot_id: string;
  stopwords: StopWordCreateItem[];
}

export interface UpdateStopWordRequest {
  text: string;
  equal_include: boolean;
}
