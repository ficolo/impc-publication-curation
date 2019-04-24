package org.impc.publications.repositories;

import org.impc.publications.models.Allele;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.solr.repository.SolrCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlleleRepository extends SolrCrudRepository<Allele, String> {

    public Page<Allele> findAll();
    public Page<Allele> findAllelesByAlleleSymbolContaining(String text, Pageable pageRequest);

}
