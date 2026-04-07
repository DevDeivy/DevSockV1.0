package com.example.email.controller;

import com.example.email.dto.EmailDTO;
import com.example.email.dto.EmailResetPasswordDTO;
import com.example.email.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailDTO emailDTO){
        emailService.sendEmail(emailDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("email sended to: " + emailDTO.getSendEmailTo());
    }

    @PostMapping("/password/code")
    public ResponseEntity<String> sendEmailResetPassword(@Valid @RequestBody EmailResetPasswordDTO emailResetPasswordDTO){
        emailService.sendEmailResetPassword(emailResetPasswordDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("email send to reset your password");
    }

    @PostMapping("/password/validate")
    public ResponseEntity<?> validateCode(@RequestParam String recipient, String code){
        emailService.validateCode(recipient, code);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("coded validated");
    }
}
