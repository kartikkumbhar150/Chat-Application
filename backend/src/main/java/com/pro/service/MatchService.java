package com.pro.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate messaging;

    private static final String QUEUE = "queue";

    public void join(String userId) {

        // prevent duplicate queue joins
        String status = redis.opsForValue().get("userStatus:" + userId);
        if ("MATCHING".equals(status) || "IN_ROOM".equals(status)) {
            return;
        }

        redis.opsForValue().set("userStatus:" + userId, "MATCHING", Duration.ofMinutes(10));

        // try to match
        String waiting = redis.opsForList().leftPop(QUEUE);

        if (waiting == null || waiting.equals(userId)) {
            redis.opsForList().rightPush(QUEUE, userId);
            notify(userId, "WAIT");
            return;
        }

        String room = UUID.randomUUID().toString();

        redis.opsForValue().set("roomOf:" + userId, room);
        redis.opsForValue().set("roomOf:" + waiting, room);

        redis.opsForList().rightPush("room:" + room + ":users", userId);
        redis.opsForList().rightPush("room:" + room + ":users", waiting);

        redis.opsForValue().set("userStatus:" + userId, "IN_ROOM");
        redis.opsForValue().set("userStatus:" + waiting, "IN_ROOM");

        notify(userId, "ROOM:" + room);
        notify(waiting, "ROOM:" + room);
    }

    public void next(String userId) {
        leave(userId);
        join(userId);
    }

    public void leave(String userId) {

        String room = redis.opsForValue().get("roomOf:" + userId);
        redis.delete("roomOf:" + userId);
        redis.delete("userStatus:" + userId);

        if (room == null) return;

        List<String> users = redis.opsForList()
                .range("room:" + room + ":users", 0, -1);

        if (users == null) return;

        for (String u : users) {
            if (!u.equals(userId)) {
                notify(u, "LEFT");
                redis.delete("roomOf:" + u);
                redis.opsForValue().set("userStatus:" + u, "MATCHING");
                join(u); // requeue the remaining user
            }
        }

        redis.delete("room:" + room + ":users");
    }

    public String getRoom(String userId) {
        return redis.opsForValue().get("roomOf:" + userId);
    }

    private void notify(String userId, String payload) {
        messaging.convertAndSend("/topic/queue/" + userId, payload);
    }
}
