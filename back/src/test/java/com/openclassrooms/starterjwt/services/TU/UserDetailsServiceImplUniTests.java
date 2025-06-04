package com.openclassrooms.starterjwt.services.TU;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@SpringBootTest
public class UserDetailsServiceImplUniTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;
    
    LocalDateTime rightNow = LocalDateTime.now();
    
    @Test
    @DisplayName("Cherche un user par son userName")
    public void givenUserName_whenLoadUserByUserName_thenRetrieveUser() {
        
    	// ARRANGE : un user et mock de userRepository
		User user = new User(1L, "yoga@studio.com", "Admin", "Admin", "test!1234", true, rightNow, rightNow);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // ACT : appel à loadUserByUsername de userDetailsServiceImpl
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(user.getEmail());

        // ASSERT : on vérifie username et email
        assertEquals(user.getEmail(), userDetails.getUsername());
        assertEquals(user.getPassword(), userDetails.getPassword());
    }

    @Test
    @DisplayName("Cherche un user par un userName inconnu")
    public void givenUserNameNotFound_whenLoadUserByUserName_thenThrowUserNameNotFoundException() {
        
    	// ARRANGE : un userName inconnu et mock de userRepository
        String userName = "userNameNotFound";
        when(userRepository.findByEmail(userName)).thenReturn(Optional.empty());
        
        // ASSERT : on veux un statut UserNameNotFoundException
        assertThrows(UsernameNotFoundException.class, () -> userDetailsServiceImpl.loadUserByUsername(userName));
    }

}
