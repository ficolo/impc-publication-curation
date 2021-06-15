package org.impc.publications.repositories;

import com.mongodb.BasicDBObject;
import org.bson.Document;
import org.impc.publications.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.repository.support.PageableExecutionUtils;
import org.springframework.security.access.prepost.PreAuthorize;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class PublicationRepositoryCustomImpl implements PublicationRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public PublicationRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    @Override
    public Page<Publication> findPublications(Pageable pageable, String status, ArrayList<String> keywords, Boolean consortiumPaper, Boolean hasAlleles, Boolean citeConsortiumPaper, Integer pubYearFrom, Integer pubYearTo, String search) {
        Query query = generateQuery(status, keywords, consortiumPaper, hasAlleles, citeConsortiumPaper, pubYearFrom, pubYearTo, search);
        query.with(pageable.getSort());
        List<Publication> publications = mongoTemplate.find(query.limit(pageable.getPageSize()).skip(pageable.getOffset()), Publication.class);
        return PageableExecutionUtils.getPage(publications, pageable, () -> mongoTemplate.count(query, Publication.class));
    }

    private Query generateQuery(String status, ArrayList<String> keywords, Boolean consortiumPaper, Boolean hasAlleles, Boolean citeConsortiumPaper, Integer pubYearFrom, Integer pubYearTo, String search) {
        final Query query = new Query();
        final List<Criteria> criteria = new ArrayList<>();
        if (status != null) {
            criteria.add(Criteria.where("status").is(status));
        }

        if (keywords != null) {
            criteria.add(Criteria.where("keyword").in(keywords));
        }
        if (consortiumPaper != null) {
            criteria.add(Criteria.where("consortiumPaper").is(consortiumPaper));
        }
        if (hasAlleles != null) {
            criteria.add(new Criteria().orOperator(Criteria.where("alleles").gt(new ArrayList<Allele>()), Criteria.where("alleleCandidates").gt(new ArrayList<Allele>())));
        }
        if (citeConsortiumPaper != null) {
            criteria.add(Criteria.where("cites").gt(new ArrayList<Allele>()));
        }
        if (search != null) {
            criteria.add(new Criteria().orOperator(
                    Criteria.where("title").regex(search),
                    Criteria.where("fragments.mentions").regex(search),
                    Criteria.where("authorString").regex(search),
                    Criteria.where("journalInfo.journal.title").regex(search),
                    Criteria.where("pmid").is(search)
                    )
            );
        }
        if (pubYearFrom != null) {
            criteria.add(Criteria.where("pubYear").gte(pubYearFrom));
        }
        if (pubYearTo != null && pubYearTo != 0) {
            criteria.add(Criteria.where("pubYear").lte(pubYearTo));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }
        return query;
    }

    @Override
    public Long countPublications(String status, ArrayList<String> keywords, Boolean consortiumPaper, Boolean hasAlleles, Boolean citeConsortiumPaper, Integer pubYearFrom, Integer pubYearTo, String search) {
        Query query = generateQuery(status, keywords, consortiumPaper, hasAlleles, citeConsortiumPaper, pubYearFrom, pubYearTo, search);
        return this.mongoTemplate.count(query, Publication.class);
    }

    @Override
    public List<String> getJournalNames() {
        return this.mongoTemplate.findDistinct("journalInfo.journal.title", Publication.class, String.class);
    }

    @Override
    public List<String> getCitedGenes() {
        return this.mongoTemplate.findDistinct("alleles.geneSymbol", Publication.class, String.class);
    }

    public List<String> getReviewedPmids() {
        return this.mongoTemplate.findDistinct("pmid", Publication.class, String.class);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @Override
    public boolean updatedStatus(String pmid, String status, ArrayList<AlleleRef> alleles,
                                 boolean consortiumPaper, ArrayList<AlleleRef> alleleCandidates, String comment, ArrayList<String> tags) {
        System.out.println(alleles);
        Query query = new Query(new Criteria("pmid").is(pmid));
        Update update = new Update().set("status", status)
                .set("alleles", alleles)
                .set("consortiumPaper", consortiumPaper)
                .set("alleleCandidates", alleleCandidates)
                .set("comment", comment)
                .set("tags", tags);
        return mongoTemplate.updateFirst(query, update, "references").getModifiedCount() == 1;
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @Override
    public String insertPublicationJson(String pmid, String publicationJson) {
        String response = "";
        if (!this.mongoTemplate.exists(new Query(new Criteria("pmid").is(pmid)), "references")) {
            Document doc = Document.parse(publicationJson);
            String publicationDateStr = (String) doc.remove("firstPublicationDate");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            try {
                doc.put("firstPublicationDate", df.parse(publicationDateStr));
                mongoTemplate.insert(doc, "references");
                response = "created";
            } catch (ParseException e) {
                e.printStackTrace();
                response = "failed";
            }
        } else {
            response = "exists";
        }
        return response;
    }

    private static class NumberOfResults {
        private int count;

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    public Page<PublicationCount> getCountBy(String fieldName, String textFilter, String fieldType, PageRequest pageRequest) {
        textFilter = textFilter == null ? "" : textFilter;
        MatchOperation reviewedCheck = Aggregation.match(new Criteria("status").is("reviewed"));
        ProjectionOperation projectionOperation = Aggregation.project("pmid").andExpression("$" + fieldName).as("value");
        UnwindOperation unwindOperation = Aggregation.unwind("value");
        ProjectionOperation projectionOperation1 = Aggregation.project("pmid").andExpression("substr(value, 0, -1)").as("value");
        MatchOperation matchOperation = Aggregation.match(Criteria.where("value").regex(".*" + textFilter + ".*", "i"));

        GroupOperation groupOperation = Aggregation.group("value").count().as("count");

        SortOperation sortOperation = Aggregation.sort(Sort.by(Sort.Direction.DESC, "count"));
        SkipOperation skip = Aggregation.skip(pageRequest.getPageNumber() * pageRequest.getPageSize());
        LimitOperation limitOperation = Aggregation.limit(pageRequest.getPageSize());

        ArrayList<AggregationOperation> aggregationOperations = new ArrayList<>();
        Collections.addAll(aggregationOperations, reviewedCheck, projectionOperation);
        if (fieldType.equalsIgnoreCase("multiple"))
            aggregationOperations.add(unwindOperation);
        if (!textFilter.equals("")) {
            aggregationOperations.add(projectionOperation1);
            aggregationOperations.add(matchOperation);
        }

        aggregationOperations.add(groupOperation);

        ArrayList<AggregationOperation> aggregationCountOperations = new ArrayList<>();
        Collections.addAll(aggregationCountOperations, aggregationOperations.toArray(new AggregationOperation[aggregationOperations.size()]));
        Collections.addAll(aggregationOperations, sortOperation, skip, limitOperation);
        aggregationCountOperations.add(Aggregation.count().as("count"));

        Aggregation aggregation = Aggregation.newAggregation(aggregationOperations);
        Aggregation aggregationCount = Aggregation.newAggregation(aggregationCountOperations);
        AggregationResults<PublicationCount> aggregationResults = mongoTemplate.aggregate(aggregation, "references", PublicationCount.class);
        AggregationResults<NumberOfResults> aggregationCountResults = mongoTemplate.aggregate(aggregationCount, "references", NumberOfResults.class);
        return PageableExecutionUtils.getPage(aggregationResults.getMappedResults(), pageRequest, () -> aggregationCountResults.getMappedResults().get(0).getCount());
    }


    public Page<PublicationGroup> getGroupBy(String fieldName, String textFilter, String fieldType, PageRequest pageRequest) {
        textFilter = textFilter == null ? "" : textFilter;
        MatchOperation reviewedCheck = Aggregation.match(new Criteria("status").is("reviewed"));
        ProjectionOperation projectionOperation = Aggregation.project("pmid", "title", "authorString", "firstPublicationDate").andExpression("$" + fieldName).as("value");
        UnwindOperation unwindOperation = Aggregation.unwind("value");
        GroupOperation groupOperation = Aggregation.group("value").count().as("count").addToSet(new BasicDBObject() {
            {
                put("pmid", "$pmid");
                put("title", "$title");
                put("authorString", "$authorString");
                put("firstPublicationDate", "$firstPublicationDate");
            }
        }).as("publications");
        SortOperation sortOperation = Aggregation.sort(Sort.by(Sort.Direction.DESC, "count"));
        MatchOperation matchOperation = Aggregation.match(Criteria.where("value").regex(".*" + textFilter + ".*", "i"));
        SkipOperation skip = Aggregation.skip(pageRequest.getPageNumber() * pageRequest.getPageSize());
        LimitOperation limitOperation = Aggregation.limit(pageRequest.getPageSize());
        Aggregation aggregation = Aggregation.newAggregation(reviewedCheck, projectionOperation, unwindOperation, matchOperation, groupOperation, sortOperation, skip, limitOperation);
        Aggregation aggregationCount = Aggregation.newAggregation(reviewedCheck, projectionOperation, unwindOperation, matchOperation, groupOperation, Aggregation.count().as("count"));
        AggregationResults<PublicationGroup> aggregationResults = mongoTemplate.aggregate(aggregation, "references", PublicationGroup.class);
        AggregationResults<NumberOfResults> aggregationCountResults = mongoTemplate.aggregate(aggregationCount, "references", NumberOfResults.class);
        return PageableExecutionUtils.getPage(aggregationResults.getMappedResults(), pageRequest, () -> aggregationCountResults.getMappedResults().get(0).getCount());
    }


}

