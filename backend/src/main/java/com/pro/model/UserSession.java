package com.pro.model;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSession {
    private String userId;
    private String username;
}
