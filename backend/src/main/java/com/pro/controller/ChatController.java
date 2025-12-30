package com.pro.controller;

import com.pro.service.ChatService;
import com.pro.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.Message;


@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MatchService match;
    private final ChatService chat;
    private final StringRedisTemplate redis; 

    @MessageMapping("/queue/{userId}")
public void join(@DestinationVariable String userId, Message<?> msg) {

    String sessionId = (String) msg.getHeaders().get("simpSessionId");

    // map session -> user (so disconnect works)
    redis.opsForValue().set("session:" + sessionId, userId);

    match.join(userId);
}


    @MessageMapping("/next/{userId}")
    public void next(@DestinationVariable String userId) {
        match.next(userId);
    }

    @MessageMapping("/room/{roomId}")
    public void send(
            @DestinationVariable String roomId,
            @Payload ChatMessageReq req
    ) {
        chat.send(roomId, req.sender(), req.content());
    }

    public record ChatMessageReq(String sender, String content) {}
}
