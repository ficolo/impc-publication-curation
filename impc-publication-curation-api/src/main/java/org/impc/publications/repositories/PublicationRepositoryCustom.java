package org.impc.publications.repositories;

import org.impc.publications.models.AlleleRef;
import org.impc.publications.models.PublicationCount;
import org.impc.publications.models.Publication;
import org.impc.publications.models.PublicationGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public interface PublicationRepositoryCustom {

    Page<Publication> findPublications(Pageable pageable, String status, ArrayList<String> keywords,
                                       Boolean consortiumPaper, Boolean hasAlleles, Boolean citeConsortiumPaper,
                                       Integer pubYearFrom, Integer pubYearTo, String search);
    Long countPublications(String status, ArrayList<String> keywords, Boolean consortiumPaper,
                           Boolean hasAlleles, Boolean citeConsortiumPaper,
                           Integer pubYearFrom, Integer pubYearTo, String search);
    List<String> getJournalNames();
    List<String> getCitedGenes();
    List<String> getReviewedPmids();
    boolean updatedStatus(String pmid, String status, ArrayList<AlleleRef> alleles,
                          boolean consortiumPaper, ArrayList<AlleleRef> alleleCandidates, String comment, ArrayList<String> tags);
    String insertPublicationJson(String pmid, String publicationJson);

    Page<PublicationCount> getCountBy(String fieldName, String textFilter, String fieldType, PageRequest pageRequest);

    Page<PublicationGroup> getGroupBy(String fieldName, String textFilter, String fieldType, PageRequest pageRequest);


}
