import { NextResponse } from 'next/server';

import { checkAuth } from '@/app/(backend)/middleware/auth';
import { ChatCompletionErrorPayload, ModelProvider } from '@/libs/agent-runtime';
import { initAgentRuntimeWithUserPayload } from '@/server/modules/AgentRuntime';
import { ChatErrorType } from '@/types/fetch';
import { createErrorResponse } from '@/utils/errorResponse';

export const runtime = 'edge';
export const preferredRegion = [
  'arn1',
  'bom1',
  'cdg1',
  'cle1',
  'cpt1',
  'dub1',
  'fra1',
  'gru1',
  /* "hkg1", Disabling hongkong edge runtime */
  'hnd1',
  'iad1',
  'icn1',
  'kix1',
  'lhr1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
];

const noNeedAPIKey = (provider: string) =>
  [ModelProvider.OpenRouter, ModelProvider.TogetherAI].includes(provider as any);

export const GET = checkAuth(async (req, { params, jwtPayload }) => {
  const { provider } = await params;

  try {
    const hasDefaultApiKey = jwtPayload.apiKey || 'dont-need-api-key-for-model-list';

    const agentRuntime = await initAgentRuntimeWithUserPayload(provider, {
      ...jwtPayload,
      apiKey: noNeedAPIKey(provider) ? hasDefaultApiKey : jwtPayload.apiKey,
    });

    const list = await agentRuntime.models();

    return NextResponse.json(list);
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;
    // track the error at server side
    console.error(`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});
