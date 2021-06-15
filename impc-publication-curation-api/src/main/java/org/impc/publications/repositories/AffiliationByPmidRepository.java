package org.impc.publications.repositories;

import org.bson.types.ObjectId;
import org.impc.publications.models.AffiliationByPmid;
import org.impc.publications.models.Configuration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AffiliationByPmidRepository extends MongoRepository<AffiliationByPmid, ObjectId> {
    List<AffiliationByPmid> findAllByPmidIn(Iterable<String> pmidList);
}
