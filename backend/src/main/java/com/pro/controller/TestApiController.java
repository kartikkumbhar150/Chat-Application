package com.pro.controller;

import com.pro.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TestApiController {

    private final MatchService matchService;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "OK");
    }

    // join matchmaking (WebSocket will notify result)
    @PostMapping("/queue")
    public Map<String, String> queue(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        matchService.join(userId);
        return Map.of("status", "JOINED", "userId", userId);
    }

    // skip / next
    @PostMapping("/next")
    public Map<String, String> next(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        matchService.next(userId);
        return Map.of("status", "NEXT", "userId", userId);
    }

    // leave fully
    @PostMapping("/leave")
    public Map<String, String> leave(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        matchService.leave(userId);
        return Map.of("status", "LEFT", "userId", userId);
    }

    // debug endpoint
    @GetMapping("/room/{userId}")
    public Map<String, String> room(@PathVariable String userId) {
        String room = matchService.getRoom(userId);
        return Map.of("userId", userId, "roomId", room == null ? "NONE" : room);
    }
}
