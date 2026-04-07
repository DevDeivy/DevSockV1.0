package com.example.email.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String sender;
    @NotBlank
    private String sendEmailTo;
    @NotBlank
    private String bodyContext;
}
