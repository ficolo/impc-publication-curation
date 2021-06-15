package org.impc.publications.services;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import lombok.AllArgsConstructor;
import org.impc.publications.models.Configuration;
import org.impc.publications.models.Publication;
import org.impc.publications.models.PublicationOrderBy;
import org.impc.publications.repositories.ConfigurationRepository;
import org.impc.publications.repositories.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class GraphQLQuery implements GraphQLQueryResolver {

    @Autowired
    private PublicationRepository publicationRepository;


    @Autowired
    private ConfigurationRepository configurationRepository;

    public List<Publication> getPublications(int start, int size, String status,
                                             ArrayList<String> keywords, Boolean consortiumPaper,
                                             Boolean alleles, Boolean cites, PublicationOrderBy publicationOrderBy,
                                             String search, int publicationYearFrom, int publicationYearTo) {
        List<Publication> target = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(start, size, new Sort(this.getDirection(publicationOrderBy), this.getProperty(publicationOrderBy)));
        publicationRepository.findPublications(pageRequest, status, keywords, consortiumPaper, alleles, cites, publicationYearFrom, publicationYearTo, search).forEach(target::add);
        return target;
    }

    public List<Publication> getPublicationsByReviewed(int start, int size, String status) {
        List<Publication> target = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(start, size, new Sort(Sort.Direction.DESC, "firstPublicationDate"));
        publicationRepository.findPublicationsByStatus(status, pageRequest).forEach(target::add);
        return target;
    }

    public int getCount(String status, ArrayList<String> keywords, Boolean consortiumPaper, Boolean alleles, Boolean cites, String search, int publicationYearFrom, int publicationYearTo) {
        return java.lang.Math.toIntExact(publicationRepository.countPublications(status, keywords, consortiumPaper, alleles, cites, publicationYearFrom, publicationYearTo, search));
    }

    public Publication getPublication(String id) {
        return publicationRepository.findPublicationById(id);
    }

    public Publication getPublicationByPmid(String pmid) {
        return publicationRepository.findPublicationByPmid(pmid);
    }

    public Configuration getConfiguration() {
        return configurationRepository.findFirstByOrderByCreationDateDesc();
    }

    private Sort.Direction getDirection(PublicationOrderBy publicationOrderBy) {
        if(publicationOrderBy.toString().contains("DESC")){
            return Sort.Direction.DESC;
        } else {
            return Sort.Direction.ASC;
        }

    }

    private String getProperty(PublicationOrderBy publicationOrderBy) {
        String publicationOrderByStr = publicationOrderBy.toString();
        publicationOrderByStr = publicationOrderByStr.substring(0, publicationOrderByStr.indexOf("_"));
        publicationOrderByStr = publicationOrderByStr.equals("authorList") ? "authorList.0.lastName" : publicationOrderByStr;
        publicationOrderByStr = publicationOrderByStr.equals("journal") ? "journalInfo.journal.title" : publicationOrderByStr;
        return publicationOrderByStr;
    }

}
