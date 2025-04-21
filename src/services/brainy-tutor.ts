export interface Clue {
  order: number;
  title: string;
  content: string;
}

export interface BrainyTutorParams {
  user_query: string;
  step_by_step: boolean;
}
/**
 * Asynchronously retrieves a response from the Brainy Tutor API.
 *
 * @param params The parameters to send to the API.
 * @returns A promise that resolves to either a SummaryResponse or a StepByStepResponse.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBrainyTutorResponse(
  params: BrainyTutorParams
){
  if (!API_BASE) {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  }

  if (params.user_query == "") {
    throw new Error("Missing User Question")
  }

  console.log('Fetching Brainy Tutor response with params:', params);

  const res = await fetch(`${API_BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: params.user_query }),
  });

  console.log('Response status:', res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return await res.json();
}