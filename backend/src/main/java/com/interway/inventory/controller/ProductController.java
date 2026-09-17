package com.interway.inventory.controller;

import com.interway.inventory.dto.ProductRequest;
import com.interway.inventory.dto.ProductResponse;
import com.interway.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/categories")
    public List<String> getCategories(){
        return service.findAllCategories();
    }

    @GetMapping
    public Page<ProductResponse> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.findAll(search, category, minPrice, maxPrice, pageable);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id){
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request){
        ProductResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ProductResponse uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file){
        return service.uploadImage(id, file);
    }

    @DeleteMapping("/{id}/image")
    public ProductResponse deleteImage(@PathVariable Long id) {
        return service.deleteImage(id);
    }

}
