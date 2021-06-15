package org.impc.publications.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicationGroup {
    @Id
    String value;
    HashSet<Publication> publications;
    Integer count;
}
