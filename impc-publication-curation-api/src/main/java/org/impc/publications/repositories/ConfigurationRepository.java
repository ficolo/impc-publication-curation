package org.impc.publications.repositories;

import org.bson.types.ObjectId;
import org.impc.publications.models.Configuration;
import org.impc.publications.models.Publication;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ConfigurationRepository extends MongoRepository<Configuration, ObjectId> {
    Configuration findFirstByOrderByCreationDateDesc();
}
