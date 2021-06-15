package org.impc.publications.controllers;

import org.impc.publications.models.*;
import org.impc.publications.repositories.AffiliationByPmidRepository;
import org.impc.publications.repositories.ConfigurationRepository;
import org.impc.publications.repositories.PublicationRepository;
import org.impc.publications.services.AlleleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sun.nio.ch.Net;

import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
public class
PublicationController {

    private AlleleService alleleService;
    private PublicationRepository publicationRepository;
    private AffiliationByPmidRepository affiliationByPmidRepository;
    private ConfigurationRepository configurationRepository;

    @Autowired
    public PublicationController(AlleleService alleleService, PublicationRepository publicationRepository, AffiliationByPmidRepository affiliationByPmidRepository, ConfigurationRepository configurationRepository) {
        assert (alleleService != null);
        assert (publicationRepository != null);
        this.alleleService = alleleService;
        this.publicationRepository = publicationRepository;
        this.affiliationByPmidRepository = affiliationByPmidRepository;
        this.configurationRepository = configurationRepository;
    }

    @CrossOrigin
    @RequestMapping(value = "/submit/{pmid}", method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public Map<String, String> submitPublication(@PathVariable("pmid") String pmid, HttpEntity<String> httpEntity) {
        HashMap<String, String> response = new HashMap<>();
        response.put("status", publicationRepository.insertPublicationJson(pmid, httpEntity.getBody()));
        return response;
    }

    @CrossOrigin
    @RequestMapping("/alleles")
    public Iterable<Allele> getAllAlleles(@RequestParam(name = "page", required = false) Integer page, @RequestParam(name = "size", required = false) Integer size) {
        if (page != null && size != null) {
            return alleleService.findAll(page, size);
        } else {
            return alleleService.findAll();
        }
    }

    @CrossOrigin
    @RequestMapping("/alleles/{text}")
    public Iterable<Allele> getAllelesBySymbolPaginated(
            @PathVariable("text") String text,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        if (page != null && size != null) {
            return alleleService.findBySymbol(text, page, size);
        } else {
            return alleleService.findBySymbol(text);
        }
    }


    @CrossOrigin
    @RequestMapping("/genes")
    public Iterable<String> getAllCitedAlleles() {
        return alleleService.getCitedGenes();
    }


    @CrossOrigin
    @RequestMapping("/journals")
    public Iterable<String> getAllJournals() {
        return this.alleleService.getAlljournals();
    }

    @CrossOrigin
    @RequestMapping("/explore/{fieldType}/countBy/{fieldName}")
    public Page<PublicationCount> countByMultivalued(
            @PathVariable("fieldType") String fieldType,
            @PathVariable("fieldName") String fieldName,
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        return this.publicationRepository.getCountBy(fieldName, text, fieldType, PageRequest.of(page, size));
    }

    @CrossOrigin
    @RequestMapping("/explore/{fieldType}/groupBy/{fieldName}")
    public Page<PublicationGroup> groupByMultivalued(
            @PathVariable("fieldType") String fieldType,
            @PathVariable("fieldName") String fieldName,
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        return this.publicationRepository.getGroupBy(fieldName, text, fieldType, PageRequest.of(page, size));
    }


    @CrossOrigin
    @Cacheable("network")
    @RequestMapping("/explore/affiliation-network")
    public HashMap<String, Object> getAffiliationNetwork() {
        HashMap<String, Object> network = new HashMap<>();
        List<String> reviewedPmids = this.publicationRepository.getReviewedPmids();
        ArrayList<AffiliationByPmid> affiliationByPmids = (ArrayList<AffiliationByPmid>) this.affiliationByPmidRepository.findAllByPmidIn(reviewedPmids);
        HashMap<String, NetworkNode> networkNodeHashMap = new HashMap<>();
        ArrayList<NetworkLink> links = new ArrayList<>();
        affiliationByPmids.forEach(
                affiliationByPmid -> {
                    ArrayList<Institution> institutions = affiliationByPmid.getAffiliations() != null ? affiliationByPmid.getAffiliations() : new ArrayList<>();
                    try {
                        for (int i = 0; i < institutions.size(); i++) {
                            Institution institution = institutions.get(i);
                            if (institution.getLat() == null || institution.getLon() == null)
                                continue;
                            String sourceName = institution.getName();
                            String sourceId = "";
                            sourceId = getNodeId(institution.getLat(), institution.getLon());
                            if (!networkNodeHashMap.containsKey(sourceId)) {
                                NetworkNode networkNode = new NetworkNode(sourceId, sourceName, 0, institution.getLat(), institution.getLon());
                                networkNodeHashMap.put(sourceId, networkNode);
                            }
                            int count = networkNodeHashMap.get(sourceId).getCount();
                            count++;
                            networkNodeHashMap.get(sourceId).setCount(count);

                            for (int j = i; j < institutions.size(); j++) {
                                Institution targetInst = institutions.get(j);
                                String targetId = getNodeId(targetInst.getLat(), targetInst.getLon());
                                if (!targetId.equals(sourceId)) {
                                    links.add(new NetworkLink(sourceId, targetId));
                                }
                            }
                        }
                    } catch (NoSuchAlgorithmException e) {
                        e.printStackTrace();
                    }
                }
        );
        network.put("nodes", networkNodeHashMap.values());
        network.put("links", links);
        return network;
    }

    @CrossOrigin
    @PostMapping("/admin/configuration")
    @ResponseBody
    public Configuration updateConfiguration(@RequestBody Configuration configuration) {
        configuration.setCreationDate(new Date());
        return this.configurationRepository.insert(configuration);
    }

    private String removePrefix(String name) {
        return name.replace("FROMPMC: ", "").replace("FROMNIH: ", "").replace("FROMPAT: ", "");
    }

    private String getNodeId(Double lat, Double lon) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        String nodeId = lat + "_" + lon;
        md.update(nodeId.getBytes());
        byte[] digest = md.digest();
        String nodeIdHash = DatatypeConverter
                .printHexBinary(digest).toUpperCase();
        return nodeIdHash;
    }
}
