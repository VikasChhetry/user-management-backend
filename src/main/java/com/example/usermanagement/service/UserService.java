package com.example.usermanagement.service;

import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {

    User createUser(UserRequestDTO dto);

    Page<User> getUsers(String keyword, int page, int size);

    List<User> getAllUsers();

    User updateUser(Long id, UserRequestDTO dto);

    void deleteUser(Long id);
}
