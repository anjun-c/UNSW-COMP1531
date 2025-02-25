export enum QuizState {
    LOBBY,
    QUESTION_COUNTDOWN,
    QUESTION_OPEN,
    QUESTION_CLOSE,
    ANSWER_SHOW,
    FINAL_RESULTS,
    END
}

export enum QuizActions {
    NEXT_QUESTION,
    SKIP_COUNTDOWN,
    GO_TO_ANSWER,
    GO_TO_FINAL_RESULTS,
    END,
    QUESTION_CLOSE
}
