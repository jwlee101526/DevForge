package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.dto.websocket.SparringMessage;
import com.rmrdo.devforge.application.service.SparringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
/** 1:1 라이브 면접 스파링 WebSocket STOMP 메시지 컨트롤러 명세 구현 */
public class SparringController {

    private final SparringService sparringService;

    @MessageMapping("/sparring/join")
    public void handleJoin(SparringMessage message) {
        log.info("STOMP /pub/sparring/join received: {}", message);
        sparringService.processJoin(message);
    }

    @MessageMapping("/sparring/answer")
    public void handleAnswer(SparringMessage message) {
        log.info("STOMP /pub/sparring/answer received: {}", message);
        sparringService.processAnswer(message);
    }

    @MessageMapping("/sparring/follow-up")
    public void handleFollowUp(SparringMessage message) {
        log.info("STOMP /pub/sparring/follow-up received: {}", message);
        sparringService.processFollowUp(message);
    }
}
