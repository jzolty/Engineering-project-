package com.zolty.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.zolty.app.model.Person;

@RepositoryRestResource
public interface PersonRepo extends JpaRepository<Person, Long> {
}
