import { QuizActions, QuizState } from '../states';

export function strToState(str: string): QuizState {
  return QuizState[str as keyof typeof QuizState];
}

export function strToAction(str: string): QuizActions {
  return QuizActions[str as keyof typeof QuizActions];
}

export function actionToStr(action: QuizActions): string {
  return QuizActions[action];
}

export function stateToStr(state: QuizState): string {
  return QuizState[state];
}
