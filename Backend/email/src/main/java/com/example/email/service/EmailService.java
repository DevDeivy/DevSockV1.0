package com.example.email.service;

import com.example.email.dto.EmailDTO;
import com.example.email.dto.EmailResetPasswordDTO;
import com.example.email.model.Email;
import com.example.email.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailRepository emailRepository;

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
        Optional<Email> recipientDetails = emailRepository.findByRecipient(recipientEmail);
        if (recipientDetails.isPresent()){
            Email e = recipientDetails.get();
        if (codeUsed(e)) throw new IllegalArgumentException("the code was used");
        }

        Email email = new Email();
        String code = String.valueOf(ThreadLocalRandom.current().nextInt(1000, 10000));
        email.setRecipient(recipientEmail);
        email.setCode(code);
        email.setExpirationCodeTime(LocalDateTime.now().plusMinutes(3));
        email.setUsed(false);
        emailRepository.save(email);
        return code;
    }

    private Boolean codeUsed(Email email){
        return false;
    }

    private Boolean codeExpired(Email email){
        if(email.getUsed()) throw new IllegalArgumentException("the code was used");
        if (email.getExpirationCodeTime().isBefore(LocalDateTime.now())){
            email.setUsed(false);
            emailRepository.save(email);
            return true;
        }
        return false;
    }

    public void validateCode(String recipient, String code){
        if (recipient == null || code == null) throw new IllegalCallerException("please enter valid credentials");
        Email email = emailRepository.findByRecipient(recipient).orElseThrow(()-> new IllegalArgumentException(recipient + "not found"));
        if (codeExpired(email)) throw new IllegalArgumentException("the code expired");
        if (codeUsed(email)) throw new IllegalArgumentException("the code was used");
        if (!email.getCode().equals(code)) throw new IllegalArgumentException("code invalid please try again");
        email.setUsed(true);
        emailRepository.save(email);
    }

}
























