package com.pro.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.pro.service.MatchService;
import org.springframework.data.redis.core.StringRedisTemplate;

@Component
@RequiredArgsConstructor
public class DisconnectListener {

    private final StringRedisTemplate redis;
    private final MatchService match;

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {

        String sessionId = event.getSessionId();
        String userId = redis.opsForValue().get("session:" + sessionId);

        if (userId == null) return;

        redis.delete("session:" + sessionId);

        match.leave(userId);   // <-- critical
    }
}
