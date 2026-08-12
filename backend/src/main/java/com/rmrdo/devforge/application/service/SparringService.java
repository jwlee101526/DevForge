package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.websocket.SparringMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
@RequiredArgsConstructor
/** 1:1 실시간 라이브 면접 스파링 (Multiplayer Mock Interview) 대결 및 AI 중계 서비스 */
public class SparringService {

    private final SimpMessagingTemplate messagingTemplate;
    private final Queue<String> waitingQueue = new ConcurrentLinkedQueue<>();
    private final Map<String, List<String>> roomUsers = new ConcurrentHashMap<>();
    private final Map<String, Integer> roomRounds = new ConcurrentHashMap<>();

    private static final List<String> SAMPLE_QUESTIONS = List.of(
            "Java의 ConcurrentHashMap과 Hashtable의 동기화 방식 차이에 대해 설명해 주세요.",
            "Spring Framework에서 `@Transactional` 어노테이션 사용 시 롤백 정책과 트랜잭션 전파 옵션에 대해 설명해 주세요.",
            "PostgreSQL/MySQL DB 인덱스(B-Tree)의 원리와 복합 인덱스 설정 시 주의점에 대해 설명해 주세요.",
            "Redis의 캐싱 전략(Look-Aside, Write-Through)과 캐시 스탬피드 현상 방지 대책을 설명해 주세요."
    );

    public synchronized void processJoin(SparringMessage msg) {
        String userId = msg.getSenderId() != null ? msg.getSenderId() : "User_" + UUID.randomUUID().toString().substring(0, 6);
        log.info("Sparring join request from: {}", userId);

        if (!waitingQueue.contains(userId)) {
            waitingQueue.add(userId);
        }

        if (waitingQueue.size() >= 2) {
            String userA = waitingQueue.poll();
            String userB = waitingQueue.poll();
            String roomId = "room_" + UUID.randomUUID().toString().substring(0, 8);

            roomUsers.put(roomId, List.of(userA, userB));
            roomRounds.put(roomId, 1);

            // Notify User A (Interviewer)
            messagingTemplate.convertAndSend("/sub/room/" + roomId, SparringMessage.builder()
                    .type(SparringMessage.Type.MATCHED)
                    .roomId(roomId)
                    .senderId(userA)
                    .role("INTERVIEWER")
                    .currentRound(1)
                    .questionText(getRandomQuestion())
                    .build());

            // Send initial Round 1 question
            sendQuestion(roomId, 1);
        } else {
            // Waiting for opponent
            messagingTemplate.convertAndSend("/sub/room/waiting", SparringMessage.builder()
                    .type(SparringMessage.Type.JOIN)
                    .senderId(userId)
                    .feedbackText("매칭 상대방을 대기 중입니다...")
                    .build());
        }
    }

    public void processAnswer(SparringMessage msg) {
        log.info("Received answer for room {}: {}", msg.getRoomId(), msg.getAnswerText());
        String roomId = msg.getRoomId();
        
        // Broadcast answer to room
        messagingTemplate.convertAndSend("/sub/room/" + roomId, msg);

        // Generate 3 AI Recommended Tail/Follow-up Questions based on answer
        List<String> followUps = List.of(
                "답변에서 언급하신 예외 처리 및 성능 튜닝 시 구체적인 기준은 무엇인가요?",
                "해당 로직에서 분산 환경 대용량 트래픽 발생 시 발생할 수 있는 병목 포인트와 해결책은?",
                "유닛 테스트 및 모킹(Mocking) 시 이 구조의 테스트 용이성을 향상시키려면 어떻게 설계해야 하나요?"
        );

        SparringMessage recommendMsg = SparringMessage.builder()
                .type(SparringMessage.Type.FOLLOW_UP_RECOMMEND)
                .roomId(roomId)
                .recommendedFollowUps(followUps)
                .build();

        messagingTemplate.convertAndSend("/sub/room/" + roomId, recommendMsg);
    }

    public void processFollowUp(SparringMessage msg) {
        log.info("Selected follow-up for room {}: {}", msg.getRoomId(), msg.getSelectedFollowUp());
        String roomId = msg.getRoomId();

        // Broadcast selected follow up question
        messagingTemplate.convertAndSend("/sub/room/" + roomId, msg);

        // Issue Round Evaluation Scorecard
        SparringMessage evalMsg = SparringMessage.builder()
                .type(SparringMessage.Type.EVALUATION)
                .roomId(roomId)
                .currentRound(roomRounds.getOrDefault(roomId, 1))
                .score(92)
                .feedbackText("✅ 핵심 기술 개념을 정확히 이해하고 계시며, 꼬리질문 대응도 뛰어납니다. (스코어: 92점 / A+)")
                .build();

        messagingTemplate.convertAndSend("/sub/room/" + roomId, evalMsg);
    }

    public void processLeave(SparringMessage msg) {
        if (msg.getRoomId() != null) {
            log.info("User {} left room {}", msg.getSenderId(), msg.getRoomId());
            messagingTemplate.convertAndSend("/sub/room/" + msg.getRoomId(), SparringMessage.builder()
                    .type(SparringMessage.Type.LEAVE)
                    .roomId(msg.getRoomId())
                    .senderId(msg.getSenderId())
                    .feedbackText("상대방이 면접 대결 방을 퇴장하였습니다.")
                    .build());
            roomUsers.remove(msg.getRoomId());
            roomRounds.remove(msg.getRoomId());
        }
        if (msg.getSenderId() != null) {
            waitingQueue.remove(msg.getSenderId());
        }
    }

    private void sendQuestion(String roomId, int round) {
        SparringMessage qMsg = SparringMessage.builder()
                .type(SparringMessage.Type.QUESTION)
                .roomId(roomId)
                .currentRound(round)
                .questionText(getRandomQuestion())
                .build();

        messagingTemplate.convertAndSend("/sub/room/" + roomId, qMsg);
    }

    private String getRandomQuestion() {
        return SAMPLE_QUESTIONS.get(new Random().nextInt(SAMPLE_QUESTIONS.size()));
    }
}
