package com.interway.inventory.service;

import com.interway.inventory.dto.ProductRequest;
import com.interway.inventory.dto.ProductResponse;
import com.interway.inventory.exception.ProductNotFoundException;
import com.interway.inventory.model.Product;
import com.interway.inventory.repository.ProductRepository;
import com.interway.inventory.repository.ProductSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductService {
    private final ProductRepository repository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository repository, FileStorageService fileStorageService) {
        this.repository = repository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(String search, String category,
                                         BigDecimal minPrice, BigDecimal maxPrice,
                                         Pageable pageable) {
        Specification<Product> spec = Specification.unrestricted();

        if (search != null && !search.isBlank()) {
            spec = spec.and(ProductSpecifications.nameContains(search));
        }
        if (category != null && !category.isBlank()) {
            spec = spec.and(ProductSpecifications.categoryEquals(category));
        }
        if (minPrice != null) {
            spec = spec.and(ProductSpecifications.priceAtLeast(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(ProductSpecifications.priceAtMost(maxPrice));
        }

        return repository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id){
        Product product = repository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
        return toResponse(product);
    }

    public ProductResponse create(ProductRequest request){
        Product product = new Product();
        applyRequest(product, request);
        return toResponse(repository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request){
        Product product = repository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
        applyRequest(product, request);
        return toResponse(repository.save(product));
    }

    public void delete(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        String image = product.getImageUrl();
        repository.deleteById(id);
        fileStorageService.delete(image);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(normalize(request.getDescription()));
        product.setPrice(request.getPrice());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setCategory(normalize(request.getCategory()));
    }

    private String normalize(String value) {
        return (value == null || value.isBlank() ? null : value.trim());
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantityInStock(product.getQuantityInStock());
        response.setCategory(product.getCategory());
        response.setImageUrl(product.getImageUrl());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    @Transactional(readOnly = true)
    public List<String> findAllCategories(){
        return repository.findDistinctCategories();
    }

    public ProductResponse uploadImage(Long id, MultipartFile file) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        String oldImage = product.getImageUrl();
        String filename = fileStorageService.store(file);
        product.setImageUrl(filename);

        Product saved = repository.save(product);
        fileStorageService.delete(oldImage);

        return toResponse(saved);
    }

    public ProductResponse deleteImage(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        String filename = product.getImageUrl();
        product.setImageUrl(null);
        Product saved = repository.save(product);
        fileStorageService.delete(filename);

        return toResponse(saved);
    }

}
