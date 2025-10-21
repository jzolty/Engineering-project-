package com.zolty.app.mapper;

import com.zolty.app.dto.UserResponse;
import com.zolty.app.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toDto(User user);
}
