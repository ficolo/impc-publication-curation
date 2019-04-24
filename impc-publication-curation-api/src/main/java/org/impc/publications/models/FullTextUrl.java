package org.impc.publications.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FullTextUrl {
    private String availabilty;
    private String documentStyle;
    private String site;
    private String url;
}
