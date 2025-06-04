package com.openclassrooms.starterjwt.jwtUtils.TU;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@SpringBootTest
public class JwtUtilsUniTests {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    @DisplayName("Génère un token et vérifie la validité")
    public void givenAuthentication_whenGenerateJwtToken_thenRetrieveToken() {
        
    	// ARRANGE : un userDetailsImpl
        UserDetailsImpl userDetailsImpl = new UserDetailsImpl(2L, "test1@gmail.com", "test1", "test1", false, "test1test1");
        
        // ACT : appel à generateJwtToken de jwtUtils
        String token = jwtUtils.generateJwtToken(new UsernamePasswordAuthenticationToken(userDetailsImpl, null));
        
        // ASSERT : on veux un token valide
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Invalidation d'un token avec un mauvais JwtSecret")
    public void givenWrongJwtSecret_whenValidateJwtToken_thenTokenNotValid() {
        
    	// ARRANGE : un token avec un mauvais JwtSecret
        String token = Jwts.builder()
                		   .setSubject(("test1@gmail.com"))
                		   .setIssuedAt(new Date())
                		   .setExpiration(new Date((new Date()).getTime() + 86400000))
                		   .signWith(SignatureAlgorithm.HS512, "wrongJwtSecret")
                		   .compact();
        
        // ASERT : on veux un token invalide
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Invalidation d'un token avec avec une date d'expiration dépassée")
    public void givenExpiredToken_whenValidateJwtToken_thenTokenNotValid() {
        
    	// ARRANGE : un token avec une date d'expiration dépassée
        String token = Jwts.builder()
                		   .setSubject(("test1@gmail.com"))
                		   .setIssuedAt(new Date())
                		   .setExpiration(new Date((new Date()).getTime() - 1))
                		   .signWith(SignatureAlgorithm.HS512, "openclassrooms")
                		   .compact();
        
        // ASERT : on veux un token invalide
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Invalidation d'un token malformé")
    public void givenMalformedToken_whenValidateJwtToken_thenTokenNotValid() {
        
    	// ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken("malformedToken"));
    }

    @Test
    @DisplayName("Invalidation d'un token vide")
    public void givenEmptyToken_whenValidateJwtToken_thenTokenNotValid() {
       
    	// ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken(""));
    }

}
