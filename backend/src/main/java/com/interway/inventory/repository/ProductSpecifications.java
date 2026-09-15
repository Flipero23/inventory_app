package com.interway.inventory.repository;

import com.interway.inventory.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecifications {
    public static Specification<Product> nameContains(String search){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    public static Specification<Product> categoryEquals(String category){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Product> priceAtLeast(BigDecimal min) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> priceAtMost(BigDecimal max) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), max);
    }
}
