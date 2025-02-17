package org.impc.publications.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "configurations")
public class Configuration {
    private ObjectId id;
    private Date creationDate;
    private int startYear;
    private int endYear;
    private ArrayList<String> searchTerms;
    private ArrayList<String> textKeywords;
    private ArrayList<String> tags;
}
