/**
 * Represents the expected response from the Brainy Tutor API when step_by_step is false (summary mode).
 */
export interface SummaryResponse {
  /**
   * A brief, consistent answer (max. 3 sentences).
   */
  answer: string;
  /**
   * An example to illustrate the answer.
   */
  example: {
    /**
     * The title of the example.
     */
    title: string;
    /**
     * Steps describing the example.
     */
    steps: string[];
  };
  /**
   * A clear analogy in one sentence.
   */
  analogy: string;
  /**
   * Question and answer for Anki flashcards.
   */
  anki: { front: string; back: string };
}

/**
 * Represents a clue in step-by-step mode.
 */
export interface Clue {
  /**
   * The order of the clue.
   */
  order: number;
  /**
   * The title of the clue.
   */
  title: string;
  /**
   * The content of the clue, may include simple markdown.
   */
  content: string;
  /**
   * Indicates whether the clue has been revealed.
   */
  revealed: boolean;
}

/**
 * Represents the expected response from the Brainy Tutor API when step_by_step is true (step-by-step clue mode).
 */
export interface StepByStepResponse {
  /**
   * An array of clues.
   */
  clues: Clue[];
  /**
   * Question and answer for Anki flashcards.
   */
  anki: { front: string; back: string };
}

/**
 * Represents the input parameters for the Brainy Tutor API.
 */
export interface BrainyTutorParams {
  /**
   * The user's search query.
   */
  user_query: string;
  /**
   * Indicates whether step-by-step mode is enabled.
   */
  step_by_step: boolean;
}

/**
 * Asynchronously retrieves a response from the Brainy Tutor API.
 *
 * @param params The parameters to send to the API.
 * @returns A promise that resolves to either a SummaryResponse or a StepByStepResponse.
 */
export async function getBrainyTutorResponse(
  params: BrainyTutorParams
): Promise<SummaryResponse | StepByStepResponse> {
  // TODO: Implement this by calling an external API.

  if (params.step_by_step) {
    return {
      clues: [
        { order: 1, title: 'First clue', content: 'Clue 1 content', revealed: false },
        { order: 2, title: 'Second clue', content: 'Clue 2 content', revealed: false },
        { order: 3, title: 'Third clue', content: 'Clue 3 content', revealed: false },
      ],
      anki: { front: 'Anki question', back: 'Anki answer' },
    };
  } else {
    return {
      answer: 'Brief answer.',
      example: {
        title: 'Practical Example',
        steps: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'],
      },
      analogy: 'Clear analogy.',
      anki: { front: 'Anki question', back: 'Anki answer' },
    };
  }
}
