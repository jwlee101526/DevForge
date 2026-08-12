package com.rmrdo.devforge.application.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SparringMessage {

    public enum Type {
        JOIN,
        MATCHED,
        QUESTION,
        ANSWER,
        FOLLOW_UP_RECOMMEND,
        FOLLOW_UP_SELECT,
        EVALUATION,
        LEAVE
    }

    private Type type;
    private String roomId;
    private String senderId;
    private String senderName;
    private String role; // "INTERVIEWER" | "CANDIDATE"
    private int currentRound;
    
    // Content payload
    private String questionText;
    private String answerText;
    private List<String> recommendedFollowUps;
    private String selectedFollowUp;
    
    // Scorecard Evaluation
    private int score;
    private String feedbackText;
}
