package org.impc.publications.services;

import org.impc.publications.models.Allele;
import org.impc.publications.models.Journal;
import org.impc.publications.repositories.AlleleRepository;
import org.impc.publications.repositories.AlleleRepositoryCustom;
import org.impc.publications.repositories.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AlleleService {

    private AlleleRepository alleleRepository;
    private PublicationRepository publicationRepository;

    @Autowired
    AlleleService(AlleleRepository alleleRepository, PublicationRepository publicationRepository) {
        assert(alleleRepository != null);
        assert(publicationRepository != null);
        this.alleleRepository = alleleRepository;
        this.publicationRepository = publicationRepository;
    }

    public Iterable<Allele> findAll(){
        return alleleRepository.findAll(new PageRequest(0, 100));
    }
    public Iterable<Allele> findAll(int page, int size){
        return alleleRepository.findAll(new PageRequest(page, size));
    }
    public Page<Allele> findBySymbol(String text) { return alleleRepository.findAllelesByAlleleSymbolContaining(text, new PageRequest(0, 100)); }
    public Page<Allele> findBySymbol(String text, int page, int size) { return alleleRepository.findAllelesByAlleleSymbolContaining(text, new PageRequest(page, size)); }
    public List<String> getAlljournals() { return publicationRepository.getJournalNames(); }
    public List<String> getCitedGenes() { return publicationRepository.getCitedGenes(); }


}
