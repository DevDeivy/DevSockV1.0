package com.example.email.service;

import com.example.email.dto.EmailDTO;
import com.example.email.dto.EmailResetPasswordDTO;
import com.example.email.model.Email;
import com.example.email.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailRepository emailRepository;
    private final Pattern regexCode = Pattern.compile("^[0-9]{4}$");

    public void sendEmail(EmailDTO emailDTO){
        if (emailDTO == null) throw new IllegalArgumentException("Email can´t be null");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(emailDTO.getTitle());
        message.setFrom(emailDTO.getSender());
        message.setTo(emailDTO.getSendEmailTo());
        message.setText(emailDTO.getBodyContext());
        mailSender.send(message);
    }

    public void sendEmailResetPassword(EmailResetPasswordDTO emailDTO){
        if (emailDTO == null) throw new IllegalArgumentException("Email can´t be null");
        String context = "your code to reset your password is: " ;
        String title = "Reset password - DevSockV1.0";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(title);
        message.setFrom(emailDTO.getSender());
        message.setTo(emailDTO.getSendEmailTo());
        message.setText(context + generateCode(emailDTO.getSendEmailTo()));
        mailSender.send(message);
    }

    private String generateCode(String recipientEmail){
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        if (recipientEmail == null) throw new IllegalArgumentException("enter valid credentials");
        Email email = new Email();
        String code = String.valueOf(ThreadLocalRandom.current().nextInt(1000, 10000));
        email.setRecipient(recipientEmail);
        email.setCode(bCryptPasswordEncoder.encode(code));
        email.setExpirationCodeTime(LocalDateTime.now().plusMinutes(3));
        email.setUsed(false);
        emailRepository.save(email);
        return code;
    }

    private boolean codeUsed(Email email){
        return email.getUsed();
    }

    private boolean codeExpired(Email email){
        return email.getExpirationCodeTime().isBefore(LocalDateTime.now());
    }

    public void validateCode(String recipient, String code){
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        if (recipient == null || code == null || !regexCode.matcher(code).matches()) throw new IllegalCallerException("please enter valid credentials");
        Email email = emailRepository.findTopByRecipientOrderByExpirationCodeTimeDesc(recipient).orElseThrow(()-> new IllegalArgumentException(recipient + "not found"));
        if (codeExpired(email)) throw new IllegalArgumentException("the code expired");
        if (codeUsed(email)) throw new IllegalArgumentException("the code was used");
        System.out.println(email.getCode());
        System.out.println(code);
        if (!bCryptPasswordEncoder.matches(code, email.getCode())) throw new IllegalArgumentException("code invalid please try again");
        email.setUsed(true);
        emailRepository.save(email);
    }

}


















