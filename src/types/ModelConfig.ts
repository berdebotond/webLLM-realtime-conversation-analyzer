import { prebuiltAppConfig } from '@mlc-ai/web-llm';

export const SUPPORTED_MODELS = prebuiltAppConfig.model_list.map(model => ({
  id: model.model_id,
  name: model.model_lib,
}));

export type SupportedModelId = typeof SUPPORTED_MODELS[number]['id']; 