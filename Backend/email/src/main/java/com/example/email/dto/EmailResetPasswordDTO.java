package com.example.email.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailResetPasswordDTO {
    @NotBlank
    private String sendEmailTo;
    private String sender;
}
