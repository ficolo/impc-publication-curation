package org.impc.publications.services;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.GraphQLError;
import lombok.AllArgsConstructor;
import org.impc.publications.models.AlleleRef;
import org.impc.publications.models.Publication;
import org.impc.publications.repositories.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;

@Component
@AllArgsConstructor
public class GraphQLMutation implements GraphQLMutationResolver {

    @Autowired
    private PublicationRepository publicationRepository;

    public Publication updateReviewed(String pmid, String status, ArrayList<AlleleRef> alleles,
                                      boolean consortiumPaper,
                                      ArrayList<AlleleRef> alleleCandidates,
                                      String comment, ArrayList<String> tags) {
        System.out.println(tags);
        this.publicationRepository.updatedStatus(pmid, status, alleles, consortiumPaper, alleleCandidates, comment, tags);
        return publicationRepository.findPublicationByPmid(pmid);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public GraphQLError exception(AccessDeniedException exception) {
        return new GraphQLAccessDeniedError();
    }

}
