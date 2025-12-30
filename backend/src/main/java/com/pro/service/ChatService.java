package com.pro.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final SimpMessagingTemplate messaging;

    public void send(String roomId, String sender, String content) {
        messaging.convertAndSend(
                "/topic/room/" + roomId,
                new ChatMessage(sender, content)
        );
    }

    public record ChatMessage(String sender, String content) {}
}
