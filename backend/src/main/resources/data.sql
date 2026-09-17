INSERT INTO products (name, description, price, quantity_in_stock, category, created_at, updated_at)
SELECT * FROM (VALUES
                   ('Лаптоп Lenovo ThinkPad', 'Лаптоп со 16GB RAM', 45000.00, 8, 'Електроника', NOW(), NOW()),
                   ('Безжични слушалки', NULL, 3999.00, 10, 'Електроника', NOW(), NOW()),
                   ('Канцелариски стол', 'Удобен канцелариски стол со 1 година гаранција', 12999.00, 3, 'Мебел', NOW(), NOW()),
                   ('Косилка за трева', NULL, 18000.00, 23, 'Градина', NOW(), NOW()),
                   ('Керамичка саксија', 'Керамичка саксија со димензии 40x50', 1199.00, 34, 'Градина', NOW(), NOW()),
                   ('Samsung машина за перење садови', 'Samsung машина за садови, 3 години гаранција', 52000.00, 15, 'Куќни апарати', NOW(), NOW())
              ) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products);