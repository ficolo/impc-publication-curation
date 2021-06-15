package org.impc.publications.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Institution {
    private String name;
    private String altName;
    private String city;
    private String country;
    private Double lat;
    @Field("long")
    private Double lon;
}
