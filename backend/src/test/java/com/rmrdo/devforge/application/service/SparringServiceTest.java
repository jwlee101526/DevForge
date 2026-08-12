package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.websocket.SparringMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class SparringServiceTest {

    @Test
    @DisplayName("004. WebSocket Sparring - 대결 참가 및 답변 시 AI 꼬리질문 3개 추천 방송")
    void testProcessAnswerRecommendsFollowUps() {
        SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
        SparringService sparringService = new SparringService(messagingTemplate);

        SparringMessage answerMsg = SparringMessage.builder()
                .type(SparringMessage.Type.ANSWER)
                .roomId("room_test101")
                .senderId("user_candidate")
                .answerText("Hashtable은 모든 메서드에 synchronized 키워드가 붙어 성능이 저하됩니다.")
                .build();

        sparringService.processAnswer(answerMsg);

        // Verify broadcast answer and recommendation message sent to topic
        verify(messagingTemplate, times(2)).convertAndSend(eq("/sub/room/room_test101"), any(SparringMessage.class));
    }
}
